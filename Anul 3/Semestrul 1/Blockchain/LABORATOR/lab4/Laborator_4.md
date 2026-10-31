# Smart contracts in Solidity: contract interaction, errors, events and gas costs

## Solidity basics

This laboratory continues the fidelity points platform of Laboratory 3. The starting point is the pair of contracts that solve the exercises of Laboratory 3, `FidelityPointsFinal.sol` and `CatalogFinal.sol`, which are renamed in Step 1 to `FidelityPoints` and `Catalog`. The two contracts are first connected, so that a client can **use their points to buy products from the catalog**, and then extended with events, finer error handling and gas optimisations.

### Function modifiers

A **modifier** changes the behaviour of a function in a declarative way, most often by checking a condition before the body of the function is executed [1]. The `onlyAdmin` modifier of Laboratory 3 is a typical example:

```solidity
modifier onlyAdmin() {
    if (msg.sender != admin) revert NotAdmin(msg.sender);
    _;
}
```

- The special statement **`_;`** marks the place where the body of the modified function is inserted. Code placed before `_;` is executed before the function, and code placed after it is executed after the function.
- A modifier may take **arguments**, which can be arbitrary expressions involving the parameters of the function, for example `function spendPoints(uint _points) external validAmount(_points)`.
- Several modifiers are applied to a function by listing them separated by spaces, for example `function addPoints(...) public onlyAdmin whenNotPaused`. They are evaluated **in the order in which they are listed**; the first condition that fails determines the error received by the caller.
- The code of a modifier is **copied** into every function that uses it. A modifier with a long body that is applied to many functions therefore increases the size of the bytecode, and thus the deployment cost. The usual solution is to move the body of the modifier into an `internal` function and to call this function from the modifier.

### Errors and reverts

When an error occurs, the EVM **reverts** the current call: all changes made to the state by the call are undone, and error data is returned to the caller [2]. Solidity offers the following constructs:

- **`require(condition, "message")`** reverts with an error of type `Error(string)` if the condition is false. Since version 0.8.26, a custom error can be given instead of the message: `require(condition, CustomError(args))`. `require` is used to validate inputs, the state of the contract, and the results of calls to other contracts.
- **`revert CustomError(args)`** and **`revert("message")`** revert unconditionally; they are usually placed inside an `if`.
- **`assert(condition)`** reverts with an error of type `Panic(uint256)` with code `0x01`. It is meant for **invariants**, conditions that must hold if the code is correct (for example, the total number of points is never smaller than the points of a single client). A failed `assert` indicates a bug, not an invalid input.
- **Custom errors** are declared with `error Name(parameters);`, inside or outside a contract. They are cheaper than string messages, both at deployment and at run time, because the error data contains only a 4-byte **selector** (the first four bytes of the Keccak-256 hash of the signature, e.g. `NotAdmin(address)`) followed by the ABI-encoded arguments, instead of a whole string.

The compiler generates `Panic` errors automatically in certain situations, identified by their code: `0x01` for a failed `assert`, `0x11` for an arithmetic overflow or underflow (for example, `p.stock -= amount` with `amount > p.stock`), `0x12` for a division by zero, and `0x32` for an array index out of bounds.

If a contract calls a function of another contract and that function reverts, the error **bubbles up**: the calling function reverts as well, with the same error data, unless the error is caught with `try`/`catch`.

### `try`/`catch`

A failed external call can be caught with a `try`/`catch` statement [3]:

```solidity
try catalog.decreaseStock(code, quantity) {
    // executed if the call succeeded
} catch Error(string memory reason) {
    // revert("...") or require(false, "...") in the called contract
} catch Panic(uint errorCode) {
    // assert, overflow, division by zero, index out of bounds
} catch (bytes memory lowLevelData) {
    // any other error, including custom errors
}
```

If the function returns values, they are declared after the keyword `returns`, for example `try catalog.getPrice(code) returns (uint price) { ... }`. Custom errors have no dedicated clause: they reach the generic clause `catch (bytes memory lowLevelData)`, and can be recognised by comparing their first four bytes with the selector of the error, e.g. `bytes4(lowLevelData) == Catalog.ProductNotFound.selector`.

`try` can be used only with **external** function calls and with contract creation (`new`). Errors that occur in the calling contract itself, for example when the arguments are computed or when the returned data cannot be decoded, are not caught. Note also that if the caller reverts anyway after the `catch` clause, all the changes it made, including those in the `catch` clause, are undone.

### Events

**Events** record information in the **logs** of a transaction [4]. An event is declared with `event` and emitted with `emit`:

```solidity
event PointsAdded(address indexed client, uint amount);

emit PointsAdded(client, _points);
```

Each log entry contains the address of the contract that emitted it, a list of at most four **topics**, and a **data** field [5]:

- the first topic is the Keccak-256 hash of the signature of the event, e.g. `keccak256("PointsAdded(address,uint256)")`, which can be computed with `cast sig-event`;
- each parameter marked as **`indexed`** becomes a topic (at most three indexed parameters per event); for reference types, such as `string`, the topic is the hash of the value, not the value itself;
- the remaining parameters are ABI-encoded in the data field.

Applications filter logs by contract address and by topics, for example all the `PointsAdded` events of a given client, and can subscribe to them in order to react to new transactions. Logs are much cheaper than storage (see the gas costs below), but they **cannot be read by contracts**: they are intended only for off-chain applications. Data that a contract must use later has to be kept in storage.

### Contract interaction

A contract can call the functions of another contract if it knows its address and its interface [6, 7]. The interface is usually declared with the keyword `interface`, which contains only the declarations of the functions that are needed:

```solidity
interface ICatalog {
    function getPrice(bytes32 code) external view returns (uint);
    function decreaseStock(bytes32 code, uint amount) external;
}
```

An address is converted to the interface type, `ICatalog catalog = ICatalog(catalogAddress)`, and the functions are then called like the methods of an object: `catalog.getPrice(code)`. The compiler encodes the call (selector and arguments), executes the EVM instruction `CALL` (or `STATICCALL` for `view` and `pure` functions), checks the result and decodes the returned values. The source code of `Catalog` is not needed; only the interface must match its ABI.

Important properties of external calls:

- In the called contract, **`msg.sender` is the address of the calling contract**, not the address of the client who sent the transaction. The original sender is available as `tx.origin`, but it must not be used for authorisation, since any contract called by the client could then act on the client's behalf.
- The called contract may be malicious or may call back the caller before the first call has finished (**reentrancy**). The recommended order of the operations in a function is therefore **checks–effects–interactions**: first check the conditions, then update the state of the contract, and only at the end call other contracts [8].
- An external call costs considerably more than an internal one: the address of the called contract must be accessed (2,600 gas the first time in a transaction), and the arguments and the results are encoded and decoded. A call of the form `this.f()` is also an external call, even though the function belongs to the same contract.
- A `view` function costs nothing when it is invoked with `eth_call` (`cast call`), but it **does** cost gas when it is called from a transaction, for example when `redeem` calls `catalog.getPrice`.

### Storage layout

The storage of a contract consists of 2²⁵⁶ **slots** of 32 bytes, all initially zero. The compiler assigns slots to the state variables in the order in which they are declared, according to the following rules [9]:

- Value types use only as many bytes as they need, and consecutive variables are **packed** into the same slot if they fit. For example, `address admin` (20 bytes), `bool paused` (1 byte) and `uint64 lastUpdate` (8 bytes), declared consecutively, share a single slot. A `uint` (`uint256`) always occupies a whole slot.
- Structs and arrays always start in a new slot, and the variable that follows them also starts in a new slot. The members of a struct are packed according to the same rules. In `Catalog`, a `Product` occupies 5 slots (`code`, `description`, `price`, `inStock`, `stock`), and a `Promo` occupies 4 slots, although `state` needs a single byte.
- `constant` and `immutable` variables are not stored in storage: their values are embedded in the bytecode.

Reference types have the following layout, where `p` is the slot assigned to the variable:

- **Dynamic arrays:** slot `p` contains the length of the array; the elements are stored contiguously starting from slot `keccak256(p)`. Element `i` of an array of structs that occupy `n` slots each begins at slot `keccak256(p) + i * n`. Elements of at most 16 bytes are packed several per slot.
- **Mappings:** slot `p` remains empty; the value for key `k` is stored at slot `keccak256(h(k) . p)`, where `h(k)` is the key padded to 32 bytes and `.` denotes concatenation. If the value is a struct, its members occupy the slots that follow this one. This is why a mapping cannot be iterated and cannot be deleted as a whole: the contract does not know which keys have been used.
- **`string` and `bytes`:** a value of at most 31 bytes is stored in slot `p` itself, with the data in the high-order bytes and `2 * length` in the lowest byte. A longer value stores `2 * length + 1` in slot `p` and the data starting from slot `keccak256(p)`.

The layout chosen by the compiler is displayed by `forge inspect <Contract> storageLayout`. Since the layout depends on the order of the declarations, reordering or inserting state variables changes the slots of the variables that follow, which matters for contracts whose storage is read directly (Step 2) or for upgradeable contracts.

### Storage of the integrated contracts

After Exercise 1, `FidelityPoints` holds a reference to the catalog (`ICatalog public catalog`), and `Catalog` holds the address of the fidelity program (`address fidelityProgram`). If the new variables are declared after the existing ones, the storage of the two contracts is the following:

| `FidelityPoints` slot | Variable | Content |
|---|---|---|
| 0 | `admin` | address of the administrator (20 bytes) |
| 1 | `pointValue` | `uint256` |
| 2 | `points` | empty; `points[client]` is at `keccak256(client . 2)` |
| 3 | `totalPoints` | `uint256` |
| 4 | `catalog` | address of the `Catalog` contract (20 bytes) |

| `Catalog` slot | Variable | Content |
|---|---|---|
| 0 | `products` | length of the array; the elements start at `keccak256(0)`, 5 slots per `Product` |
| 1–4 | `generalPromo` | `state`, `start`, `end`, `percent` |
| 5 | `admin` | address of the administrator (20 bytes) |
| 6 | `productPromos` | empty; the `Promo` for `code` starts at `keccak256(code . 6)` |
| 7 | `fidelityProgram` | address of the `FidelityPoints` contract (20 bytes) |

The following points are important:

- **Each contract has its own, separate storage.** Slot 0 of `FidelityPoints` and slot 0 of `Catalog` are different slots, belonging to different accounts. A contract can never read or write the storage of another contract directly: `FidelityPoints` learns the price of a product only by **calling** `getPrice`, and the stock is modified only by the code of `Catalog`, when `FidelityPoints` calls `decreaseStock`. During that call, the code of `Catalog` runs in the context of `Catalog`: it reads and writes the storage of `Catalog`, and sees `FidelityPoints` as `msg.sender`.
- **The interface occupies no storage.** `interface ICatalog` only describes the functions that can be called; it generates neither code nor state. A variable of type `ICatalog` is stored exactly like an `address`: 20 bytes, here in slot 4. The type only allows the compiler to check and encode the calls.
- **The link between the contracts consists of two addresses.** The two contracts are connected only through slot 4 of `FidelityPoints` and slot 7 of `Catalog`, which are set by `setCatalog` and `setFidelityProgram`. Both can be checked with `cast storage $FP 4` and `cast storage $CAT 7`; each slot contains the address of the other contract, padded with zeros to 32 bytes.
- **Packing depends on the order of the declarations.** `catalog` (20 bytes) follows `totalPoints`, which fills a whole slot, so it starts a new slot; it could not be packed with `admin` either, since 20 + 20 bytes exceed 32. A small variable such as `bool paused` (Exercise 3), declared immediately after `admin`, would instead share slot 0 with it, and the slots of all the following variables would move up by one.
- **A redemption touches the storage of both contracts.** `redeem` reads `catalog`, `pointValue`, `points[client]` and `totalPoints` in `FidelityPoints`, and writes the last two. Through `getPrice` and `decreaseStock`, it also reads, in `Catalog`, the length of `products`, the code of each product examined by `findProduct`, the price, both promotions, `admin` and `fidelityProgram`, and writes `stock` and `inStock`. Each of these slots is cold the first time it is accessed, so the cost of a redemption is determined mostly by the number of distinct slots it touches, as shown in the next section.

### Gas costs

Every instruction executed by the EVM consumes **gas**. The fee of a transaction is `gasUsed × effectiveGasPrice`, where the price per unit of gas consists of the base fee of the block, which is burned, and a priority fee for the validator [10]. The gas limit of a transaction is an upper bound set by the sender; if it is exceeded, the transaction reverts, and the gas consumed until then is still paid.

The table summarises the costs of the operations that dominate the gas consumed by contracts like those of this laboratory [11, 12, 13]. A slot or an address is **cold** the first time it is accessed in a transaction and **warm** afterwards.

| Operation | Gas | Notes |
|---|---|---|
| base cost of a transaction | 21,000 | Paid by every transaction before any code is executed; it covers the verification of the signature and the update of the sender's nonce and balance. It is the only cost of a simple ether transfer, and the reason why grouping several operations in one transaction is cheaper. |
| calldata | 4 per zero byte, 16 per non-zero byte | The arguments of the call (`msg.data`), sent with the transaction and stored permanently in the blockchain history. Zero bytes are cheaper because they compress well; this is why a `bytes32` code padded with zeros costs less than its 32 bytes suggest. Since the Pectra upgrade (EIP-7623), transactions that consist mostly of data pay a higher minimum price per byte. |
| `SLOAD`: reading a storage slot | 2,100 cold, 100 warm | Reads one 32-byte slot of the contract's storage, e.g. `pointValue` or `points[client]`. The cold cost reflects the access to the state database of the node; after the first access, the slot is cached for the rest of the transaction. |
| `SSTORE`: zero → non-zero | 20,000 (+ 2,100 if cold) | Creates a new entry in the state that every node must keep permanently, e.g. the first points of a new client or a new product. This is the most expensive common operation. |
| `SSTORE`: non-zero → another non-zero value | 2,900 (+ 2,100 if cold) | Updates an existing entry, e.g. adding points to an existing client; the size of the state does not change. |
| `SSTORE`: non-zero → zero | 2,900 (+ 2,100 if cold), 4,800 refunded | Clears an entry, e.g. `delete` or spending all the points of a client. The refund rewards freeing the state; it is credited at the end of the transaction and may cover at most one fifth of the gas used. |
| `SSTORE`: slot already written in the same transaction | 100 | The slot is already modified in this transaction, so only the cached value changes; this is why packed fields written together, or a counter incremented several times, are cheap. |
| reading a `constant` or `immutable` variable | 3 | The value is part of the bytecode and is placed on the stack with a `PUSH` instruction; no storage is accessed (see below). |
| external call (`CALL`, `STATICCALL`, `DELEGATECALL`) | 2,600 cold address, 100 warm, plus the code executed | Executes code of another contract, e.g. `catalog.getPrice(code)` (`STATICCALL`, since the function is `view`) or `catalog.decreaseStock(code, quantity)` (`CALL`). Sending ether with a `CALL` costs 9,000 more. The arguments and results are also copied through memory. `DELEGATECALL` has the same cost but different semantics (see below). |
| `LOG`: emitting an event | 375 + 375 per topic + 8 per byte of data | Writes an entry in the logs of the transaction, e.g. `PointsRedeemed`. Logs are kept in the receipts, not in the state, and are not readable by contracts, which is why they are much cheaper than storage. |
| memory | 3 per 32-byte word, plus a quadratic term for large areas | Temporary area for local variables of reference types, arguments of external calls and returned values, e.g. the array built by `getProducts`. It is released at the end of the call; the quadratic term (`words² / 512`) makes very large arrays in memory prohibitively expensive. |
| contract creation | 32,000 + 200 per byte of deployed code | Paid once, when the contract is deployed; the cost per byte is the reason why the size of the bytecode (modifiers copied into functions, string messages of errors) matters. The size of the deployed code is limited to 24,576 bytes (EIP-170). |

**`constant` and `immutable`.** Both kinds of variables are read for 3 gas, because neither is kept in storage, and neither can be modified after deployment [15]. They differ in **when** their value is known:

- A **`constant`** must be assigned in its declaration, with an expression that the compiler can evaluate, e.g. `uint constant SECONDS_PER_DAY = 24 * 60 * 60;`. The compiler replaces every use of the variable by its value; the value is the same for every deployment of the contract. Constants can be of value types or `string`.
- An **`immutable`** is assigned **once, in the constructor**, and may therefore depend on the arguments of the constructor or on the context of the deployment, e.g. `address immutable admin;` followed by `admin = msg.sender;` in the constructor. The compiler reserves 32 bytes in the runtime bytecode for each place where the variable is read, and the constructor writes the value there before the code is stored on the blockchain. Each deployment can thus have a different value. Immutables can only be of value types.

In `FidelityPoints`, `admin` could be `immutable` (Exercise 7.1), since it is set by the constructor and never changes, but not `constant`, since it is not known at compile time; `pointValue` must remain a storage variable, because `setPointValue` changes it.

**`DELEGATECALL`.** is priced like `CALL`. With `DELEGATECALL`, the code of the called contract is executed **in the context of the caller**: it reads and writes the storage of the caller, and `msg.sender` and `msg.value` remain those of the original call. If `FidelityPoints` called `decreaseStock` with `DELEGATECALL`, the code of `Catalog` would interpret the storage of `FidelityPoints` according to the layout of `Catalog`: slot 0, which holds `admin`, would be read as the length of `products`, the products would be searched in slots of `FidelityPoints` that are empty, and any write would modify the storage of `FidelityPoints` instead of the catalog. `DELEGATECALL` is used deliberately by proxy contracts, which keep the state and delegate the logic to an implementation contract that can be replaced, and by libraries with `external` functions; in both cases the two contracts must use **compatible storage layouts**.

A few consequences follow directly from the table:

- **Writing storage dominates everything else.** Adding a product to the catalog writes at least five new slots, i.e. more than 100,000 gas, whereas adding two numbers costs 3 gas.
- **Setting a slot to zero is rewarded**, through the refund, which may cover at most one fifth of the gas used by the transaction. Deleting data that is no longer needed (with `delete` or by assigning zero) is therefore cheaper than leaving it in place.
- **Loops over storage arrays are expensive and unbounded.** The function `findProduct` of `Catalog` reads one cold slot (2,100 gas) for every product it examines; the cost of `decreaseStock` thus grows linearly with the number of products. Since the Fusaka upgrade (December 2025), a transaction may consume at most 2²⁴ = 16,777,216 gas (EIP-7825) [14]; a function whose cost grows with the size of an array may therefore become impossible to execute once the array is large enough.
- **Copying is not free.** `Product memory p = products[i]` reads all the slots of the struct, including the description; `Product storage p = products[i]` followed by `p.stock` reads a single slot.
- **Events cost far less than storage.** Recording a redemption in an event with three topics and 64 bytes of data costs approximately 2,000 gas; storing the same information as a new struct in an array costs more than 80,000 gas.

### Optimising gas costs

The following techniques are commonly used to reduce the gas consumed by a contract. Each of them should be **measured** (Step 5), since the effect of a change is not always the expected one, and weighed against the readability and the safety of the code.

- **Read each storage variable at most once.** Copy a value that is used repeatedly into a local variable (e.g. `uint balance = points[msg.sender];`) and write it back once at the end. In a loop, cache `products.length` before the loop.
- **Pack related variables.** Use smaller types (`uint128`, `uint64`, `uint40`, `uint8`) for values that are read and written together, and declare them consecutively, so that they share a slot. Note that an explicit conversion to a smaller type, such as `uint128(price)`, **silently truncates** the value [22]; the range must be checked.
- **Use `constant` and `immutable`** for values that never change after deployment: a `constant` is fixed at compile time, an `immutable` is set in the constructor [15]. Reading them costs 3 gas instead of 2,100.
- **Do not store what can be computed or logged.** A field such as `inStock` can be derived from `stock > 0`; a history of operations can be recorded in events.
- **Prefer mappings for lookups.** Finding an element by key in an array costs O(n) reads; a mapping costs one read. When the elements must also be enumerated, an array and a mapping from the key to the index can be kept together.
- **Group operations in a single transaction.** Each transaction pays 21,000 gas before executing any code, and each storage slot is cold only the first time it is accessed in a transaction. A batch function (e.g. `addPointsBatch`) that updates a shared variable such as `totalPoints` once, after the loop, saves both costs.
- **Use `calldata` for read-only array and string parameters of external functions**, custom errors instead of string messages, and `unchecked { ... }` blocks for arithmetic that provably cannot overflow (for example, a subtraction preceded by an explicit check). Since Solidity 0.8.22, the compiler omits the overflow check of the counter of simple `for` loops automatically.
- **Enable the optimizer.** The Solidity optimizer is configured in `foundry.toml` with `optimizer = true` and `optimizer_runs = <n>` [16]. The parameter `runs` estimates how many times each function will be executed: a small value favours a small bytecode (cheap deployment), a large value favours cheap execution.


## Practical work

### Step 1: Setting up the project

Create a new Foundry project and copy into it the solutions of Laboratory 3, renaming the files and the contracts:

```bash
forge init fidelity-shop
cd fidelity-shop
rm src/Counter.sol test/Counter.t.sol script/Counter.s.sol
cp <path to lab4>/src/FidelityPointsFinal.sol src/FidelityPoints.sol
cp <path to lab4>/src/CatalogFinal.sol src/Catalog.sol
sed -i 's/contract FidelityPointsFinal/contract FidelityPoints/' src/FidelityPoints.sol
sed -i 's/contract CatalogFinal/contract Catalog/' src/Catalog.sol
forge build
```

Read both contracts and identify the elements that solve each exercise of Laboratory 3: the `onlyAdmin` modifier and the `NotAdmin` error, `totalPoints` and its `internal` update function, the field `stock` and the functions that modify it, the mapping `productPromos`, the function `getProducts`, and the `pure` function `discountedPrice`. The function `getPrice` returns the price of a product after the best promotion that is currently active; it is used in Exercise 1.

In the first terminal, start `anvil`; in the second, set the same variables as in Laboratory 3:

```bash
export ETH_RPC_URL=http://127.0.0.1:8545
ANVIL_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80   # anvil account 0
CLIENT=0x70997970C51812dc3A010C7d01b50e0d17dc79C8                              # anvil account 1
CLIENT_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

### Step 2: Inspecting the storage layout

Display the storage layout of the catalog [17]:

```bash
forge inspect Catalog storageLayout
```

| Name | Type | Slot |
|---|---|---|
| `products` | `struct Catalog.Product[]` | 0 |
| `generalPromo` | `struct Catalog.Promo` | 1 |
| `admin` | `address` | 5 |
| `productPromos` | `mapping(bytes32 => struct Catalog.Promo)` | 6 |

`generalPromo` occupies slots 1 to 4, since a `Promo` has four members that each need a whole slot; `admin` therefore starts at slot 5.

Deploy the catalog and add two products:

```bash
forge create src/Catalog.sol:Catalog --private-key $ANVIL_KEY --broadcast
CAT=<deployed contract address>
cast send $CAT "addProduct(bytes32,string,uint256,uint256)" \
  $(cast format-bytes32-string "P001") "Coffee mug" 50 10 --private-key $ANVIL_KEY
cast send $CAT "addProduct(bytes32,string,uint256,uint256)" \
  $(cast format-bytes32-string "P002") "T-shirt" 100 5 --private-key $ANVIL_KEY
```

Slot 0 contains the length of the array. The elements start at slot `keccak256(0)`, and each `Product` occupies 5 slots. Since slot numbers are 256-bit integers, the additions are done with a small helper function written in Python:

```bash
cast storage $CAT 0                                   # length of products: 2
BASE=$(cast keccak $(cast to-uint256 0))              # first slot of products[0]
slot() { python3 -c "print(hex(int('$1', 16) + $2))"; }
cast storage $CAT $BASE                               # products[0].code
cast storage $CAT $(slot $BASE 1)                     # products[0].description
cast --to-dec $(cast storage $CAT $(slot $BASE 7))    # products[1].price = BASE + 5*1 + 2
```

The description `"Coffee mug"` has 10 bytes, so it is stored in the slot of the field itself: the text occupies the high-order bytes and the last byte is `0x14` = 2 × 10.

Start a promotion for `P001` and locate it in the mapping `productPromos` (slot 6). The struct begins at the slot computed by `cast index`, and its member `percent` is the fourth one:

```bash
cast send $CAT "startProductPromo(bytes32,uint256,uint256)" \
  $(cast format-bytes32-string "P001") 7 20 --private-key $ANVIL_KEY
PROMO=$(cast index bytes32 $(cast format-bytes32-string "P001") 6)
cast --to-dec $(cast storage $CAT $(slot $PROMO 3))   # percent: 20
```

### Step 3: Measuring the gas consumed by transactions

Deploy `FidelityPoints` and award points three times: twice to the same client, and once to a new client. After each transaction, display the gas used:

```bash
forge create src/FidelityPoints.sol:FidelityPoints \
  --private-key $ANVIL_KEY --broadcast --constructor-args 10
FP=<deployed contract address>
CLIENT2=0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC                              # anvil account 2

cast send $FP "addPoints(address,uint256)" $CLIENT 100 --private-key $ANVIL_KEY | grep gasUsed
cast send $FP "addPoints(address,uint256)" $CLIENT 100 --private-key $ANVIL_KEY | grep gasUsed
cast send $FP "addPoints(address,uint256)" $CLIENT2 100 --private-key $ANVIL_KEY | grep gasUsed
```

The results are approximately:

| Transaction | Gas used | `points[client]` | `totalPoints` |
|---|---|---|---|
| first `addPoints` to `CLIENT` | 69,201 | 0 → 100 | 0 → 100 |
| second `addPoints` to `CLIENT` | 35,001 | 100 → 200 | 100 → 200 |
| first `addPoints` to `CLIENT2` | 52,089 | 0 → 100 | 200 → 300 |

The same function, with the same code, consumes very different amounts of gas. The difference between the first two transactions, 34,200 gas, equals 2 × (20,000 − 2,900): in the first transaction both slots change from zero to a non-zero value. In the third transaction, only the slot of the new client changes from zero.

Using the table of gas costs, explain why spending **all** the points of a client costs approximately 4,800 gas less than spending only part of them. Verify by sending, from the account of `CLIENT`, two transactions `spendPoints(100)`.

The gas of a transaction can also be estimated before it is sent, with `cast estimate`, which takes the same arguments as `cast send`:

```bash
cast estimate $FP "addPoints(address,uint256)" $CLIENT 100 --from $(cast wallet address --private-key $ANVIL_KEY)
```

### Step 4: Failed transactions and error data

Call `addPoints` from the client's account:

```bash
cast send $FP "addPoints(address,uint256)" $CLIENT 1 --private-key $CLIENT_KEY
```

`cast` first estimates the gas of the transaction; since the estimation reverts, the transaction is not sent, and `cast` displays the error data. The first four bytes, `0x17a84242`, are the selector of the error, followed by the address of the caller:

```bash
cast sig "NotAdmin(address)"
cast decode-error <error data> --sig "NotAdmin(address)"
```

Now force the transaction to be sent, by specifying the gas limit explicitly, so that no estimation is made:

```bash
cast send $FP "addPoints(address,uint256)" $CLIENT 1 --private-key $CLIENT_KEY --gas-limit 100000
```

The receipt shows `status 0 (failed)`: the transaction was included in a block and the client paid for the gas consumed (approximately 24,700), although the state did not change.

### Step 5: Measuring gas in tests

Forge offers several tools for measuring gas [18, 19]:

```bash
forge test --gas-report              # gas per function: min, average, median, max
forge snapshot                       # writes the gas of each test to .gas-snapshot
forge snapshot --diff                # compares the current gas with .gas-snapshot
forge build --sizes                  # size of the bytecode of each contract
```

The typical workflow for an optimisation is: run `forge snapshot` before the change, modify the code, and run `forge snapshot --diff` to see the effect of the change on each test.

Within a test, all calls are executed in a single transaction, so slots accessed by `setUp` or by previous calls are already warm, and the gas reported is smaller than on a real network. The option `--isolate` executes each top-level call as a separate transaction, which gives values closer to those observed in Step 3. A specific call can be measured with the cheatcodes `vm.startSnapshotGas` and `vm.stopSnapshotGas`:

```solidity
function test_GasAddPoints() public {
    vm.startSnapshotGas("addPoints");
    fp.addPoints(client, 100);
    uint gasUsed = vm.stopSnapshotGas();
    emit log_named_uint("addPoints gas", gasUsed);
}
```

Run `forge test --match-test test_GasAddPoints -vv --isolate` and compare the result with Step 3. The value excludes the base cost of 21,000 gas and the cost of the calldata, which are paid by every transaction.

### Step 6: Contract interaction and error propagation

This step shows what happens to the state of two contracts when the called contract reverts, first without and then with `try`/`catch` [2, 3]. Contract `A` holds a state variable `int a`, and contract `B` holds a state variable `int b` and calls `A`. Both contracts are defined in the file `ContractInteraction.sol`; copy it into the project:

```bash
cp <path to lab4>/src/ContractInteraction.sol src/
```

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.36;

contract A {
    int public a;

    error NegativeValue(int value);

    function setA(int value) external returns (int) {
        a = value;                                     // modified before the checks
        if (value < 0) revert NegativeValue(value);    // custom error
        require(value != 13, "Unlucky value");         // Error(string)
        return 100 / (value - 10);                     // Panic(0x12) if value == 10
    }
}

contract B {
    A public contractA;
    int public b;

    uint public nbCalls;
    uint public nbCallsError;
    uint public nbCallsPanic;
    uint public nbCallsRevert;

    constructor(A _contractA) {
        contractA = _contractA;
    }

    function setDirect(int value) external {
        b = value;
        contractA.setA(value);                         // an error in A bubbles up
    }

    function setWithTry(int value) external {
        b = value;
        nbCalls += 1;
        try contractA.setA(value) returns (int result) {
            b = result;
        } catch Error(string memory) {
            nbCallsError += 1;
        } catch Panic(uint) {
            nbCallsPanic += 1;
        } catch (bytes memory) {
            nbCallsRevert += 1;
        }
    }
}
```

`A.setA` modifies `a` **before** checking its argument, so that it can be observed whether this modification survives a revert. It fails in three different ways: with the custom error `NegativeValue` for a negative value, with `Error(string)` for 13, and with `Panic(0x12)`, a division by zero, for 10.

Deploy `A`, then `B` with the address of `A` as the argument of the constructor, and define a function that displays the state of both contracts:

```bash
forge create src/ContractInteraction.sol:A --private-key $ANVIL_KEY --broadcast
A=<deployed contract address>
forge create src/ContractInteraction.sol:B --private-key $ANVIL_KEY --broadcast --constructor-args $A
B=<deployed contract address>
state() {
  echo "a=$(cast call $A 'a()(int256)') b=$(cast call $B 'b()(int256)')" \
       "error=$(cast call $B 'nbCallsError()(uint256)') panic=$(cast call $B 'nbCallsPanic()(uint256)')" \
       "revert=$(cast call $B 'nbCallsRevert()(uint256)')"
}
cast send $B "setDirect(int256)" 5 --private-key $ANVIL_KEY
state                                                   # a=5 b=5
```

**Scenario 1: `B` calls `A` directly and `A` reverts.** Call `setDirect` with a negative value. A negative number would be taken by `cast` for an option, so the options are given first and the arguments after `--`:

```bash
cast send --private-key $ANVIL_KEY $B "setDirect(int256)" -- -7
cast send --private-key $ANVIL_KEY $B "setDirect(int256)" 13
state                                                   # a=5 b=5
```

Both calls fail, and the error displayed by `cast` is the one raised in `A` (`NegativeValue(-7)`, respectively `Error("Unlucky value")`), although the transaction was sent to `B`: the error has **bubbled up** from `A` through `B`. Both `a` and `b` keep the value 5. The assignment `b = value` in `B` and the assignment `a = value` in `A` were both executed, but the revert undid every change made by the transaction, in both contracts. To see this on the blockchain, and not only in the gas estimation, repeat the first call with `--gas-limit 200000`: the transaction is included in a block with `status 0 (failed)`, and the state is still unchanged.

**Scenario 2: `B` calls `A` inside `try`/`catch` and `A` reverts.** Call `setWithTry` with each of the values that make `A` fail, and finally with a valid value:

```bash
cast send --private-key $ANVIL_KEY $B "setWithTry(int256)" -- -7
state                                                   # a=5 b=-7  revert=1
cast send --private-key $ANVIL_KEY $B "setWithTry(int256)" 13
state                                                   # a=5 b=13  error=1
cast send --private-key $ANVIL_KEY $B "setWithTry(int256)" 10
state                                                   # a=5 b=10  panic=1
cast send --private-key $ANVIL_KEY $B "setWithTry(int256)" 20
state                                                   # a=20 b=10
```

This time the transactions succeed. When `A` reverts, only the changes made **inside the call to `A`** are undone, so `a` keeps its value. `B` catches the error and continues, so its own changes are kept: `b` takes the new value, and the counter of the corresponding `catch` clause is incremented. The custom error `NegativeValue` reaches the generic clause `catch (bytes memory)`, because Solidity has no clause for a specific custom error. In the last call, `A` succeeds and returns 100 / (20 − 10) = 10, which `B` stores in `b`.

The execution trace of a transaction shows the internal call and the place where it reverted:

```bash
cast run <transactionHash>
```

For the call with the value 10, the trace shows the call to `setA(10)` ending in `[Revert] panic: division or modulo by zero (0x12)`, while the transaction itself ends normally.

The table summarises the two scenarios:

| `A` reverts and… | `a` | `b` | Transaction | Error received by the sender |
|---|---|---|---|---|
| `B` calls `A` directly | unchanged | unchanged | failed | the error raised by `A` |
| `B` calls `A` in `try`/`catch` | unchanged | updated | successful | none; `B` handles the error |

Note that in Scenario 2 the gas consumed by `A` before it reverted is still paid, as part of the successful transaction. The same mechanism is used in Exercise 1.6: `redeem` catches a failure of `Catalog.decreaseStock`, restores the points of the client, and records the failure, instead of reverting the whole redemption.

## Exercises

### Exercise 1: Redeeming points in the catalog

The two contracts are integrated so that a client can buy products with their points. The price of a product is expressed in the same unit as the value of the points: a client with `n` points can buy products worth at most `n * pointValue`.

1. In `FidelityPoints.sol`, declare the interface `ICatalog` from the *Contract interaction* section, a state variable `ICatalog public catalog`, and a function `setCatalog(address)` restricted to the administrator.
2. Add the function `redeem(bytes32 code, uint quantity)`, which:
   - obtains the current price of the product from the catalog, with `getPrice`, and computes the number of points required, **rounded up** (`(cost + pointValue - 1) / pointValue`), so that the shop never loses value through rounding;
   - reverts with `error InsufficientPoints(uint required, uint available)` if the client does not have enough points, and with a custom error if the catalog has not been set or if `quantity` is zero;
   - deducts the points from the client and from `totalPoints`, and then calls `decreaseStock` on the catalog, respecting the order **checks–effects–interactions**.
3. In `Catalog.sol`, `decreaseStock` can currently be called by anyone. Add a state variable `fidelityProgram`, set by the administrator with `setFidelityProgram(address)`, and a modifier that allows `decreaseStock` to be called only by the administrator or by the fidelity program. Which address does `Catalog` see as `msg.sender` when the client calls `redeem`? Why must `tx.origin` not be used here?
4. Deploy both contracts on `anvil`, link them in both directions, add a product, award points to the client, and redeem the product from the client's account:

   ```bash
   cast send $FP "setCatalog(address)" $CAT --private-key $ANVIL_KEY
   cast send $CAT "setFidelityProgram(address)" $FP --private-key $ANVIL_KEY
   cast send $FP "redeem(bytes32,uint256)" $(cast format-bytes32-string "P001") 2 --private-key $CLIENT_KEY
   ```

   Check the points of the client, `getTotalPoints()` and the stock of the product. Start a promotion for the product and verify that the next redemption costs fewer points.
5. Call `redeem` for a product code that does not exist. The error `ProductNotFound` is raised in `Catalog`; which error does the client receive, and why?
6. Modify `redeem` so that a failure of `decreaseStock` does **not** revert the transaction: wrap the call in `try`/`catch`, restore the client's points and `totalPoints`, return `false`, and count the failures in three public counters, one for each clause: `Error(string)`, `Panic(uint)` and the generic `bytes` clause. Provoke a failure of each kind (hints: a call before `setFidelityProgram`, if your modifier uses `require` with a message; a quantity larger than the stock; a custom error in the modifier) and verify the counters. Explain why the counters would remain zero if `redeem` reverted after the `catch` clause.

### Exercise 2: Events

1. Add events to `FidelityPoints` and emit them in the corresponding functions:
   - `PointsAdded(address indexed client, uint amount)`
   - `PointsSpent(address indexed client, uint amount)`
   - `PointValueChanged(uint oldValue, uint newValue)`
   - `PointsRedeemed(address indexed client, bytes32 indexed code, uint quantity, uint pointsSpent)`
   - `RedemptionFailed(address indexed client, bytes32 indexed code, bytes reason)`
2. Add to `Catalog` the events `ProductAdded(bytes32 indexed code, uint price, uint stock)`, `StockChanged(bytes32 indexed code, uint newStock)` and `PromoStarted(bytes32 indexed code, uint end, uint percent)`. For the general promotion, use the code `bytes32(0)`.
3. Repeat the scenario of Exercise 1.4 and retrieve the events with `cast logs` [21]. Filter the events `PointsRedeemed` of a single client, and compare the first topic of a log with the output of `cast sig-event`:

   ```bash
   cast logs --from-block 0 --address $FP "PointsAdded(address indexed client, uint256 amount)"
   cast logs --from-block 0 --address $FP "PointsRedeemed(address indexed, bytes32 indexed, uint256, uint256)" $CLIENT
   cast sig-event "PointsRedeemed(address,bytes32,uint256,uint256)"
   ```

   In the receipt of a `redeem` transaction (`cast receipt`), identify the logs emitted by each of the two contracts.
4. The shop wants to keep the history of all redemptions. Compare two solutions: an array `Redemption[]` in storage, where `Redemption` contains the client, the code, the quantity and the points, and the event `PointsRedeemed`. Estimate the gas of each solution with the table of gas costs, and verify the estimate with `forge test --gas-report`. In which case is the storage solution necessary?

### Exercise 3: Modifiers and errors

1. Add to `FidelityPoints` a state variable `bool public paused` and the functions `pause()` and `unpause()`, restricted to the administrator. Write the modifiers `whenNotPaused` and `whenPaused`, or a single modifier `whenPaused(bool expected)` with an argument. While the program is paused, points can be neither added, spent nor redeemed; the value of a point may be changed **only** while the program is paused.
2. Write a modifier with an argument, `validAmount(uint amount)`, which reverts with a custom error if the amount is zero, and apply it to `addPoints`, `spendPoints` and `redeem`.
3. Apply several modifiers to `addPoints`, for example `onlyAdmin whenNotPaused validAmount(_points)`. Which error does a client receive if they call `addPoints` while the program is paused? Change the order of the modifiers and repeat the call. Which order is preferable, and why?
4. In `spendPoints` and `redeem`, check with `assert` that `totalPoints` is not smaller than the points of the client after the update. Why is `assert` appropriate here, while `require` is appropriate for checking the client's balance? Which error data would a failed `assert` return?
5. Run `forge build --sizes`. Move the body of `onlyAdmin` into an internal function `_checkAdmin()`, called from the modifier, and compare the size of the bytecode. Explain the difference.

### Exercise 4: Testing

Create the file `test/Redeem.t.sol`, whose `setUp` deploys both contracts, links them, adds products and awards points to a client:

```solidity
function setUp() public {
    cat = new Catalog();
    fp = new FidelityPoints(10);
    fp.setCatalog(address(cat));
    cat.setFidelityProgram(address(fp));
    cat.addProduct("P001", "Coffee mug", 55, 3);
    fp.addPoints(client, 100);
}
```

Write tests that verify:

1. that a successful redemption updates the client's points, `totalPoints` and the stock, and emits `PointsRedeemed`. Hint [20]: `vm.expectEmit(true, true, false, true, address(fp))`, followed by `emit FidelityPoints.PointsRedeemed(client, "P001", 1, 6)`, before the call;
2. that the number of points is rounded up (with a price of 55 and a point value of 10, one product costs 6 points), and that an active promotion reduces it;
3. that a redemption with insufficient points reverts with `InsufficientPoints(required, available)`, with the correct values;
4. that a client cannot call `decreaseStock` directly on the catalog;
5. that a redemption of a quantity larger than the stock returns `false`, restores the points and increments the `Panic` counter;
6. that `addPoints`, `spendPoints` and `redeem` revert while the program is paused.

Run `forge test --gas-report --isolate` and record the gas consumed by `redeem`. How much of it is due to the external calls to the catalog?

### Exercise 5: Storage layout and packing

1. Using the method of Step 2, read directly from storage the stock of the second product and the end date of the general promotion. Determine the slots from the output of `forge inspect`.
2. Run `forge snapshot` with the tests of Exercise 4. Then pack the structs of `Catalog`:
   - `Promo`: `State state; uint40 start; uint40 end; uint8 percent;`
   - `Product`: `bytes32 code; string description; uint128 price; uint64 stock; bool inStock;`

   Run `forge inspect Catalog storageLayout` again. How many slots does each struct occupy now? Which state variables have changed their slot?
3. Run `forge snapshot --diff` and explain the differences for `addProduct`, `startProductPromo`, `decreaseStock` and `redeem`. Why does `decreaseStock` become cheaper, although it modifies the same two fields?
4. The parameters of `addProduct` and `increaseStock` remain `uint`. What happens if a value larger than `type(uint128).max` is converted with `uint128(price)`? Add the necessary checks, and a test that demonstrates them.
5. Why is a `uint40` sufficient for a timestamp?
6. The field `inStock` is redundant, since it can be computed as `stock > 0`. Remove it from the struct and measure the gas of `decreaseStock` and `getProducts` again. Which functions and tests must be changed?

### Exercise 6: Arrays and mappings

1. Write a test that adds 100 products to the catalog and measures, with `vm.startSnapshotGas` and the option `--isolate`, the gas of `decreaseStock` (or of `redeem`) for the first and for the last product. Explain the difference.
2. Add to `Catalog` a mapping `mapping(bytes32 => uint) productIndex`, which stores the position of each product **plus one**. Why is one added? Rewrite `findProduct` so that it no longer contains a loop, and make `addProduct` revert with a custom error if the code already exists. Measure the gas of the test from point 1 again. How much more does `addProduct` cost now, and after how many calls of `decreaseStock` on the last product is the additional cost recovered?
3. Add the function `removeProduct(bytes32 code)`, restricted to the administrator, which moves the last product into the position of the removed product and then calls `pop` (*swap and pop*). Keep `productIndex` consistent and delete the promotion of the removed product. Why is `delete products[i]` not sufficient? What happens to the gas of `removeProduct` because of the slots that are set to zero?
4. Estimate the gas of `getProducts(false, false)` with 100 products, with `cast estimate` or in a test. Compare it with the limit of 16,777,216 gas per transaction. What would happen if `redeem` called `getProducts`? Write a version `getProducts(uint offset, uint limit)` that returns at most `limit` products, starting from position `offset`.

### Exercise 7: Optimising the gas costs of `FidelityPoints`

Run `forge snapshot` before starting, apply the changes below one at a time, and record the effect of each with `forge snapshot --diff` in a table with the columns *Function*, *Gas before*, *Gas after*, *Technique*.

1. The address of the administrator never changes. Declare `admin` as `immutable` and measure the gas of `addPoints`. Use `forge inspect FidelityPoints storageLayout` to determine which variables have changed their slot, and explain why the commands `cast storage` from Laboratory 3 now return different values.
2. In `spendPoints` and `redeem`, read `points[msg.sender]` only once, into a local variable. Replace the checked subtraction with an explicit check that reverts with `InsufficientPoints`, followed by an `unchecked` subtraction. Explain why the subtraction cannot overflow. Is it also safe to subtract from `totalPoints` in an `unchecked` block?
3. Add a function `addPointsBatch(address[] calldata clients, uint[] calldata amounts)`, restricted to the administrator, which updates `totalPoints` only once, after the loop. Compare the gas of awarding points to 10 clients with a single batch transaction and with 10 calls of `addPoints` (add 21,000 gas for each transaction). Then declare the parameters as `memory` instead of `calldata` and measure again.
4. Replace the custom errors of `FidelityPoints` with `require(condition, "message")` in a copy of the contract, and compare the size of the bytecode and the gas consumed by a call that reverts.
5. Enable the optimizer in `foundry.toml` with `optimizer = true`, and compare the deployment cost (shown by `forge test --gas-report`) and the gas of `redeem` for `optimizer_runs = 1` and `optimizer_runs = 1000000`.

### Exercise 8: Deploying on Sepolia

Deploy the final versions of `Catalog` and `FidelityPoints` on Sepolia, as in Laboratory 3, and link them. Add a product, award points to a colleague's address, and ask the colleague to redeem the product from their own account. On Etherscan [23], open the transaction `redeem` and examine the tab *Logs*: identify the events emitted by each contract and their topics. Compare the `gasUsed` of the transaction with the value measured on `anvil`, and compute its cost in ether from the effective gas price. Record the addresses of the contracts and the transaction hashes in the report.

## References

1. Solidity documentation, *Function modifiers*. https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers
2. Solidity documentation, *Error handling: assert, require, revert and exceptions*. https://docs.soliditylang.org/en/latest/control-structures.html#error-handling-assert-require-revert-and-exceptions
3. Solidity documentation, *try/catch*. https://docs.soliditylang.org/en/latest/control-structures.html#try-catch
4. Solidity documentation, *Events*. https://docs.soliditylang.org/en/latest/contracts.html#events
5. Solidity documentation, *Contract ABI specification: events*. https://docs.soliditylang.org/en/latest/abi-spec.html#events
6. Solidity documentation, *Interfaces*. https://docs.soliditylang.org/en/latest/contracts.html#interfaces
7. Solidity documentation, *External function calls*. https://docs.soliditylang.org/en/latest/control-structures.html#external-function-calls
8. Solidity documentation, *Security considerations: use the checks-effects-interactions pattern*. https://docs.soliditylang.org/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern
9. Solidity documentation, *Layout of state variables in storage*. https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html
10. ethereum.org, *Gas and fees*. https://ethereum.org/en/developers/docs/gas/
11. V. Buterin, M. Swende, *EIP-2929: Gas cost increases for state access opcodes*. https://eips.ethereum.org/EIPS/eip-2929
12. V. Buterin, M. Swende, *EIP-3529: Reduction in refunds*. https://eips.ethereum.org/EIPS/eip-3529
13. *EVM Codes: an interactive reference of EVM opcodes and their gas costs*. https://www.evm.codes/
14. G. Ballet, T. Wahrstätter, *EIP-7825: Transaction gas limit cap*. https://eips.ethereum.org/EIPS/eip-7825
15. Solidity documentation, *Constant and immutable state variables*. https://docs.soliditylang.org/en/latest/contracts.html#constant-and-immutable-state-variables
16. Solidity documentation, *The optimizer*. https://docs.soliditylang.org/en/latest/internals/optimizer.html
17. Foundry Book, *forge inspect*. https://getfoundry.sh/forge/reference/forge-inspect
18. Foundry Book, *Gas tracking* and *Gas reports*. https://getfoundry.sh/forge/gas-tracking, https://getfoundry.sh/forge/gas-reports
19. Foundry Book, *Gas function snapshots* and *Gas section snapshots*. https://getfoundry.sh/forge/gas-function-snapshots, https://getfoundry.sh/forge/gas-section-snapshots
20. Foundry Book, *expectEmit*. https://getfoundry.sh/reference/cheatcodes/expect-emit
21. Foundry Book, *cast logs*. https://getfoundry.sh/cast/reference/logs
22. Solidity documentation, *Conversions between elementary types*. https://docs.soliditylang.org/en/latest/types.html#conversions-between-elementary-types
23. Etherscan, *Sepolia Testnet Explorer*. https://sepolia.etherscan.io/

Additional resources:

- [Solidity documentation](https://docs.soliditylang.org/en/latest/) and its [PDF version](https://docs.soliditylang.org/_/downloads/en/latest/pdf/)
- [Remix IDE](https://remix.ethereum.org/)
- [bytes32 converter](https://web3-type-converter.onbrn.com/)

> **Note on the preparation of this document.** Parts of this laboratory guide were drafted with the assistance of Claude (Anthropic), an AI assistant.
