# Smart contracts in Solidity: a fidelity points platform

## Solidity basics

A Solidity **contract** is a collection of code (functions) and data (state) that resides at a specific address on the blockchain [4]. The contract is compiled to EVM bytecode, deployed by a transaction, and afterwards executed by every node whenever a transaction or a call invokes one of its functions. The examples below refer to the contracts of this laboratory: `FidelityPoints.sol` and `Catalog.sol`.

### Contract structure

A contract may contain the following elements [5]:

- **state variables**, whose values are stored permanently in the contract's storage (e.g. `admin`, `pointValue`, `points`);
- a **constructor**, executed only once, when the contract is deployed (e.g. it sets `admin = msg.sender`);
- **functions**, the executable units of the contract;
- **function modifiers**, declared with the keyword `modifier`, which add reusable checks to functions (e.g. an `onlyAdmin` modifier that reverts if `msg.sender != admin`);
- **events**, declared with `event` and emitted with `emit`, which write entries to the transaction logs that off-chain applications can monitor;
- **errors**, declared with `error` and raised with `revert`, which describe the reason for which a call failed;
- **struct** and **enum** type definitions (e.g. `Product`, `Promo`, `State`).

Two global variables appear in the contracts of this laboratory: `msg.sender`, the address of the account or contract that made the current call, and `block.timestamp`, the timestamp of the current block, in seconds since the Unix epoch [6].

### Value types

Solidity is statically typed: the type of each variable must be known at compile time. Variables that are not initialised hold the **default value** of their type, whose byte representation is zero: `0`, `false`, `address(0)`, the first member of an enum, or an empty string [7]. Value types are always copied when they are assigned or passed as arguments [8].

- **Integers:** `int8` … `int256` and `uint8` … `uint256`, in steps of 8 bits; `int` and `uint` are aliases for `int256` and `uint256`. Since Solidity 0.8.0, arithmetic is **checked**: an operation whose result does not fit in the type (for example `points[msg.sender] -= _points` with a value larger than the balance) reverts the transaction with an error of type `Panic(0x11)`. Unchecked, wrapping arithmetic must be requested explicitly with an `unchecked { ... }` block.
- **Fixed-point numbers:** the types `fixed` and `ufixed` are defined by the language but not yet fully supported; they can be declared, but cannot be assigned to or from. Fractional quantities are therefore represented with scaled integers, as ether is represented in wei.
- **Booleans:** `bool`, with the values `true` and `false`.
- **Addresses:** `address` holds a 20-byte Ethereum address and has, among others, the members `balance`, `code`, and the low-level functions `call`, `delegatecall` and `staticcall`. The type `address payable` has, in addition, the members `transfer` and `send`, and a plain address is converted to it with `payable(addr)`. Note that `transfer` and `send` forward a fixed stipend of 2,300 gas, have been **deprecated in Solidity 0.8.31** and are scheduled for removal in version 0.9.0; ether should instead be sent with `addr.call{value: amount}("")` and the result checked [9].
- **Fixed-size byte arrays:** `bytes1` … `bytes32`. A `bytes32` value occupies exactly one 32-byte word of the EVM, so it is cheaper to store and to compare than a `string`, which has a variable length. This is why products are identified by a `bytes32` code. Text can be converted to `bytes32` with `cast format-bytes32-string "P001"`.
- **Enums:** user-defined types with at least one and at most 256 members, represented internally as `uint8`. The members correspond to the integers 0, 1, 2, …, and can be converted explicitly to and from integers (e.g. `State.Active` is 0 and `State.Expired` is 1).

Solidity also provides contract types, function types and user-defined value types, which are not used in this laboratory.

### Reference types

A variable of a reference type does not hold the value itself, but refers to a location where the value is stored. Two variables can therefore refer to the same data, and modifying one of them may modify the other [10].

- **Arrays** may have a size fixed at compile time (`uint[5]`) or a dynamic size (`uint[]`). Indices start at 0, the member `length` gives the number of elements, and the members `push` and `pop` add or remove an element at the end. `push` and `pop` are available only for dynamic arrays in **storage**: an array in **memory** has a fixed length once it has been created with `new`. For this reason, `getProducts` must first count the matching products and only then allocate the result array.
- **`bytes`** and **`string`** are special dynamic arrays. `bytes` holds arbitrary raw data, and `string` holds UTF-8 text. A `string` has no `length` member and cannot be indexed; it must first be converted to `bytes`.
- **Structs** are user-defined types that group several variables, possibly of different types (e.g. `Product`, `Promo`).
- **Mappings** are declared with the syntax `mapping(KeyType KeyName? => ValueType ValueName?)`, where the names are optional [11]. `KeyType` may be any built-in value type, `bytes`, `string`, a contract or enum type, or a user-defined value type; `ValueType` may be any type, including another mapping, an array or a struct. A mapping may be imagined as a hash table in which every possible key exists and is initially mapped to the default value of `ValueType`. The keys themselves are **not stored**: the storage location of the value associated with key `k` is computed as the Keccak-256 hash of `k` concatenated with the slot of the mapping [12]. Consequently, a mapping has no length and its keys cannot be enumerated; if enumeration is needed, the keys must also be stored separately, for example in an array. Mappings may only be declared in storage.

### Data locations

Every variable of a reference type has a **data location**, which determines where it is stored and how long it exists [13]:

- **`storage`**: the persistent storage of the contract, where all state variables reside, and which exists as long as the contract exists. Writing to storage is the most expensive operation of the EVM (setting a slot from zero to a non-zero value costs 20,000 gas). Reading storage inside a transaction also costs gas; however, a `view` function can be invoked through an RPC node with `eth_call` (for example with `cast call`), which executes it locally on the node, without a transaction, and therefore without a fee.
- **`memory`**: a temporary area that exists only during the execution of the current external call. It is used for local variables and for the parameters and return values of functions.
- **`calldata`**: a read-only, non-persistent area that contains the arguments of the call (`msg.data`). Since data in `calldata` is not copied, it is the cheapest location for parameters that are not modified, especially for `external` functions.

For parameters, return variables and local variables of a **reference type**, the data location must be specified explicitly; for example, `string memory description` in `addProduct`. Value types, including `bytes32`, do not take a data location: the declaration `bytes32 memory code` is rejected by the compiler. Parameters in `storage` are allowed only in `internal` and `private` functions.

The location also determines what an assignment does: an assignment between `storage` and `memory` creates an independent **copy**, whereas a local variable declared as `storage` is a **reference** to the state. In `CatalogFinal`, the declaration `Product storage p = products[index]` allows `p.stock += amount` to modify the product in the state; with `Product memory p`, only a copy would be modified, and the change would be lost when the function returns.

Since version 0.8.24, Solidity also supports **transient storage**, which is kept only for the duration of a transaction; it is not used in this laboratory.

### Visibility

Functions and state variables have one of four **visibility** specifiers, which determine who may access them [14]:

- **`external`**: the function is part of the contract's interface and can be called by externally owned accounts (through transactions) and by other contracts. Within the same contract, it can only be called as `this.f()`, which performs an external call. Not allowed for state variables.
- **`public`**: the function can be called externally and from within the contract. For a `public` state variable, the compiler generates a getter function with the same name. The getter of an array takes an index as parameter (e.g. `products(0)`), and the getter of a mapping takes a key (e.g. `points(addr)`).
- **`internal`**: accessible only from within the contract and from the contracts that derive from it. This is the **default** visibility of state variables: a variable declared without a specifier, such as `uint totalPoints;` in Exercise 1, is `internal`.
- **`private`**: accessible only from within the contract in which it is defined, not from derived contracts.

Functions must declare their visibility explicitly. Visibility restricts only which **contracts** may read or call an element; it does not make any data secret. The entire state of a contract, including `internal` and `private` variables, is public and can be read directly from storage, for example with `cast storage` (see Step 2.4).

### State mutability

The **state mutability** of a function states whether it reads or modifies the state [15]:

- **`view`**: the function may read the state but not modify it. Modifying the state includes writing state variables, emitting events, creating other contracts, sending ether, calling functions that are not `view` or `pure`, and using low-level calls.
- **`pure`**: the function neither reads nor modifies the state; it may use only its parameters, local variables and constants. It cannot read `address(this).balance`, `block`, `tx` or `msg` (except `msg.sig` and `msg.data`). Typical examples are mathematical or formatting functions.
- **`payable`**: the function can receive ether together with the call.
- Functions without a specifier (*non-payable*) may modify the state, but reject calls that send ether.

Note that, in Solidity terminology, `view`, `pure` and the visibility keywords are **specifiers**; the term **modifier** denotes the constructs declared with the keyword `modifier`.

### Failed calls

When a condition is not satisfied, a function **reverts**: all changes made by the call are undone and an error is returned to the caller. A transaction that reverts is still included in a block, and its sender still pays for the gas consumed. Conditions are checked with `require(condition, "message")`, with `if (!condition) revert CustomError()`, or, since version 0.8.26, with `require(condition, CustomError())`. Custom errors are cheaper than string messages [16].


## Practical work

### Step 1: Creating a Foundry project

Foundry organises a project as a directory with a configuration file and a fixed structure [17]. Create a new project and remove the example files generated by `forge init`:

```bash
forge init fidelity-points
cd fidelity-points
rm src/Counter.sol test/Counter.t.sol script/Counter.s.sol
```

The project contains:

| Path | Content |
|---|---|
| `foundry.toml` | project configuration |
| `src/` | the contracts |
| `test/` | the tests, written in Solidity (files `*.t.sol`) |
| `script/` | deployment scripts (files `*.s.sol`) |
| `lib/` | dependencies, including the testing library `forge-std` |
| `out/` | compilation output (bytecode and ABI), created by `forge build` |

Copy `FidelityPoints.sol` and `Catalog.sol` into `src/` and compile them:

```bash
forge build
```

Foundry downloads the Solidity compiler required by the `pragma` line automatically. Examine the compilation output of `FidelityPoints` in `out/FidelityPoints.sol/FidelityPoints.json`: the field `abi` describes the interface of the contract (functions, parameters and return types), and the field `bytecode` contains the code that is sent in the deployment transaction. The interface can also be displayed with:

```bash
forge inspect FidelityPoints abi
```

### Step 2: Deploying and interacting on a local network

As in Laboratory 1, this step requires two terminals. In the first, start a local node:

```bash
anvil
```

In the second terminal, inside the project directory, set the RPC address and the keys of the first two `anvil` accounts. These keys are public and may be used only on a local network (see the security notice in Laboratory 1):

```bash
export ETH_RPC_URL=http://127.0.0.1:8545
ANVIL_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80   # anvil account 0
CLIENT=0x70997970C51812dc3A010C7d01b50e0d17dc79C8                              # anvil account 1
CLIENT_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

#### 2.1 Deploying the contract

Deploy `FidelityPoints` with a point value of 10. The arguments of the constructor are given after `--constructor-args`, which must be the **last** option of the command. The option `--broadcast` is required: without it, `forge create` only simulates the deployment [18]:

```bash
forge create src/FidelityPoints.sol:FidelityPoints \
  --private-key $ANVIL_KEY --broadcast \
  --constructor-args 10
```

Copy the address printed after `Deployed to:` and save it in a variable:

```bash
FP=<deployed contract address>
cast code $FP
```

`cast code` displays the runtime bytecode stored at the address. A contract account is distinguished from an externally owned account by the fact that it has code.

#### 2.2 Reading the state: calls

A **call** executes a function on the node without creating a transaction: it does not change the state, it is not signed and it costs no fee. It is used for `view` and `pure` functions and for public getters [19]. The function is specified by its signature, followed by its return types in parentheses:

```bash
cast call $FP "pointValue()(uint256)"
cast call $FP "admin()(address)"
cast call $FP "points(address)(uint256)" $CLIENT
```

The functions `pointValue()`, `admin()` and `points(address)` are not defined in the source code; they are the getters generated for the `public` state variables.

#### 2.3 Modifying the state: transactions

A function that modifies the state must be invoked through a signed **transaction**, with `cast send`. Award 100 points to the client, from account 0, then check the result:

```bash
cast send $FP "addPoints(address,uint256)" $CLIENT 100 --private-key $ANVIL_KEY
cast call $FP "points(address)(uint256)" $CLIENT
cast call $FP "getTotalValue(address)(uint256)" $CLIENT
```

Examine the receipt of the transaction with `cast receipt <transactionHash>`, as in Laboratory 1, and compare its `gasUsed` with the 21,000 gas of a simple ether transfer.

Now change the value of a point **from the client's account**:

```bash
cast send $FP "setPointValue(uint256)" 1000 --private-key $CLIENT_KEY
cast call $FP "getTotalValue(address)(uint256)" $CLIENT
```

The transaction succeeds, although the client is not the administrator: the contract stores `admin`, but never checks it. This problem is addressed in Exercise 1.

#### 2.4 Reading storage directly

The state of a contract is stored in 32-byte **slots**, numbered from 0 in the order in which the state variables are declared [12]. In `FidelityPoints` as provided (`admin`, `pointValue`, `points`), `admin` occupies slot 0 and `pointValue` slot 1:

```bash
cast storage $FP 0
cast storage $FP 1
cast --to-dec $(cast storage $FP 1)
```

The mapping `points` occupies slot 2, but this slot remains empty: the value for a key is stored at the slot obtained by hashing the key together with the slot number of the mapping. `cast index` computes this slot:

```bash
SLOT=$(cast index address $CLIENT 2)
cast --to-dec $(cast storage $FP $SLOT)
```

The result must be equal to the number of points of the client. In the same way, any `internal` or `private` variable can be read, which confirms that visibility does not provide confidentiality.

### Step 3: Testing with Forge

In Foundry, tests are written in Solidity [20]. A test contract inherits from `Test` (from `forge-std`); the function `setUp` is executed before each test, and every function whose name begins with `test` is a test. Special functions called **cheatcodes**, available through the object `vm`, allow a test to manipulate the environment, for example to change `msg.sender` (`vm.prank`) or to state that the next call must revert (`vm.expectRevert`) [21].

Create the file `test/FidelityPoints.t.sol`:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {FidelityPoints} from "../src/FidelityPoints.sol";

contract FidelityPointsTest is Test {
    FidelityPoints internal fp;
    address internal client = makeAddr("client");

    function setUp() public {
        fp = new FidelityPoints(10);   // the test contract is the deployer, hence the admin
    }

    function test_AddPoints() public {
        fp.addPoints(client, 100);
        assertEq(fp.points(client), 100);
        assertEq(fp.getTotalValue(client), 1000);
    }

    function test_SetPointValue() public {
        fp.setPointValue(20);
        assertEq(fp.pointValue(), 20);
    }
}
```

Run the tests. The option `-vvvv` displays, for failed tests, the trace of all the calls:

```bash
forge test
forge test -vvvv
forge test --match-test test_AddPoints
forge test --gas-report
```

The option `--gas-report` displays the gas consumed by each function of the contract.

### Step 4: Deploying on Sepolia

#### 4.1 Configuring the RPC endpoint

Create the file `.env` in the root directory of the project, with the Infura endpoint obtained in the *Prerequisites*:

```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<API_KEY>
```

Check that `.env` is excluded from Git (the `.gitignore` file created by `forge init` contains it), so that it is not committed by mistake:

```bash
grep -x ".env" .gitignore
```

Add an alias for the endpoint at the end of `foundry.toml`. Foundry reads the `.env` file automatically and substitutes the variable [22]:

```toml
[rpc_endpoints]
sepolia = "${SEPOLIA_RPC_URL}"
```

From the project directory, the alias `sepolia` can now be used in place of the URL. Check the connection and the balance of the development account:

```bash
unset ETH_RPC_URL
cast chain-id --rpc-url sepolia
cast balance $(cast wallet address --account sepolia-dev) --ether --rpc-url sepolia
```

The chain ID must be `11155111`.

> **Note.** The private key is **not** stored in `.env`. The deployment transaction is signed with the encrypted keystore `sepolia-dev`, and Foundry asks for its password.

#### 4.2 Deploying the contract

```bash
forge create src/FidelityPoints.sol:FidelityPoints \
  --rpc-url sepolia --account sepolia-dev --broadcast \
  --constructor-args 10
```

Unlike on `anvil`, the transaction is included only in the next block, which is produced approximately every 12 seconds. Save the address of the contract and repeat a few of the calls and transactions from Step 2 on Sepolia, adding `--rpc-url sepolia` and replacing `--private-key` with `--account sepolia-dev`:

```bash
FP=<deployed contract address>
cast send $FP "addPoints(address,uint256)" $(cast wallet address --account sepolia-dev) 50 \
  --rpc-url sepolia --account sepolia-dev
cast call $FP "points(address)(uint256)" $(cast wallet address --account sepolia-dev) --rpc-url sepolia
```

#### 4.3 Inspecting the contract on a block explorer

Open `https://sepolia.etherscan.io/address/<contract address>` in a browser [23]. Identify the deployment transaction, its block, the deployer (the `sepolia-dev` address) and the fee that was paid. The transactions that called `addPoints` appear in the list of transactions, but their parameters are displayed only as raw input data, because the explorer does not know the source code of the contract.

*Optional.* To have the source code published and the transactions decoded, the contract can be **verified**. This requires a free API key from [etherscan.io](https://etherscan.io/), stored in `.env` as `ETHERSCAN_API_KEY`:

```bash
forge verify-contract <contract address> src/FidelityPoints.sol:FidelityPoints \
  --chain sepolia --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(uint256)" 10)
```

## Exercises

### Exercise 1: Extending the fidelity points contract

1. Add the function `spendPoints(uint _points)`, which allows a client to use some of their accumulated points in exchange for rewards (such as products or special promotions). A client may spend only their own points, identified by `msg.sender`.
2. Add a state variable `totalPoints`, which stores the sum of the points currently held by all clients, and an `internal` function that updates it whenever points are added or spent. Add a function that returns its value.
3. Restrict `addPoints` and `setPointValue` to the administrator, using a `modifier` named `onlyAdmin` and a custom error (e.g. `error NotAdmin(address caller)`). Repeat the transaction from Step 2.3 and observe the result.
4. Deploy the new version on `anvil` and read `totalPoints` directly from storage with `cast storage`. Determine its slot number from the order of the declarations. Has the slot of the mapping `points` changed with respect to Step 2.4? Explain why.

### Exercise 2: Testing

Extend `test/FidelityPoints.t.sol` with tests that verify:

1. that spending points decreases both the points of the client and `totalPoints`;
2. that spending more points than the client holds reverts. Hint: since the arithmetic is checked, the expected error is `stdError.arithmeticError`, imported from `forge-std/Test.sol` together with `Test`;
3. that a call to `addPoints` from an account other than the administrator reverts with `NotAdmin`. Hint: `vm.prank(client)` followed by `vm.expectRevert(abi.encodeWithSelector(FidelityPoints.NotAdmin.selector, client))`.

Run `forge test --gas-report` and record the gas consumed by `addPoints` and `spendPoints`.

### Exercise 3: Deploying on Sepolia

Deploy the final version of `FidelityPoints` on Sepolia, as in Step 4. Award points to the address of a colleague, and verify on Etherscan that the transaction was sent by your account and that the colleague can read their points with `cast call`. Record the contract address and the transaction hashes in the report.

### Exercise 4: Product stock

In `Catalog.sol`, add a field `uint stock` to `Product` and write the functions:

- `increaseStock(bytes32 code, uint amount)`
- `decreaseStock(bytes32 code, uint amount)`

The field `inStock` must remain consistent with `stock`. Both functions must locate the product by its code; if no product has the given code, the function must **revert**, rather than modify another product. Product codes can be produced with `cast format-bytes32-string`, for example:

```bash
cast send $CAT "addProduct(bytes32,string,uint256,uint256)" \
  $(cast format-bytes32-string "P001") "Coffee mug" 50 10 --private-key $ANVIL_KEY
```

### Exercise 5: Per-product promotions

Extend the contract in `Catalog.sol` so that a promotion applies only to certain products. Hint: use a mapping from the product code to a `Promo`, and the functions:

- `function startProductPromo(bytes32 code, uint ndays, uint percent) external`
- `function startPromoBatch(bytes32[] calldata codes, uint ndays, uint percent) external`

Add a `view` function that indicates whether a product currently has an active promotion.

### Exercise 6: Filtering products

Write a function that returns the products that satisfy the given filters, to practise loops and arrays in memory:

- `function getProducts(bool inStock, bool inPromo) public view returns (Product[] memory)`

Call it with `cast call`; the return type is an array of tuples, for example `"getProducts(bool,bool)((bytes32,string,uint256,bool,uint256)[])"`. Explain why this function costs no fee when it is called with `cast call`, and why a loop over all products would be a problem in a function that modifies the state.

### Exercise 7: A `puwre` function

Add a `pure` function of your choice, for example one that computes the price of a product after a discount of a given percentage, and test it with Forge.

## References

1. MetaMask, *Getting started with MetaMask*. https://support.metamask.io/start/getting-started-with-metamask/
2. MetaMask Developer, *Infura documentation*. https://docs.metamask.io/services/
3. MetaMask, *How to use the Infura testnet faucet*. https://support.metamask.io/develop/blockchain-networks/testnets/using-the-testnet-faucet/
4. Solidity documentation, *Introduction to smart contracts*. https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html
5. Solidity documentation, *Structure of a contract*. https://docs.soliditylang.org/en/latest/structure-of-a-contract.html
6. Solidity documentation, *Units and globally available variables*. https://docs.soliditylang.org/en/latest/units-and-global-variables.html
7. Solidity documentation, *Scoping and declarations: default value*. https://docs.soliditylang.org/en/latest/control-structures.html#default-value
8. Solidity documentation, *Types: value types*. https://docs.soliditylang.org/en/latest/types.html#value-types
9. Solidity Team, *Solidity 0.8.31 release announcement*, 3 December 2025. https://www.soliditylang.org/blog/2025/12/03/solidity-0.8.31-release-announcement/
10. Solidity documentation, *Types: reference types*. https://docs.soliditylang.org/en/latest/types.html#reference-types
11. Solidity documentation, *Types: mapping types*. https://docs.soliditylang.org/en/latest/types.html#mapping-types
12. Solidity documentation, *Layout of state variables in storage*. https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html
13. Solidity documentation, *Types: data location*. https://docs.soliditylang.org/en/latest/types.html#data-location
14. Solidity documentation, *Visibility and getters*. https://docs.soliditylang.org/en/latest/contracts.html#visibility-and-getters
15. Solidity documentation, *Functions: state mutability*. https://docs.soliditylang.org/en/latest/contracts.html#state-mutability
16. Solidity documentation, *Error handling: assert, require, revert and exceptions*. https://docs.soliditylang.org/en/latest/control-structures.html#error-handling-assert-require-revert-and-exceptions
17. Foundry Book, *Project layout*. https://getfoundry.sh/projects/project-layout
18. Foundry Book, *forge create*. https://getfoundry.sh/forge/reference/create
19. Foundry Book, *cast call*. https://getfoundry.sh/cast/reference/call
20. Foundry Book, *Writing tests*. https://getfoundry.sh/forge/tests/writing-tests
21. Foundry Book, *Cheatcodes reference*. https://getfoundry.sh/reference/cheatcodes/overview
22. Foundry Book, *Configuration: rpc_endpoints*. https://getfoundry.sh/config/reference/testing
23. Etherscan, *Sepolia Testnet Explorer*. https://sepolia.etherscan.io/

Additional resources:

- [Solidity documentation](https://docs.soliditylang.org/en/latest/) and its [PDF version](https://docs.soliditylang.org/_/downloads/en/latest/pdf/)
- [Remix IDE](https://remix.ethereum.org/)
- [bytes32 converter](https://web3-type-converter.onbrn.com/)

> **Note on the preparation of this document.** Parts of this laboratory guide were drafted with the assistance of Claude (Anthropic), an AI assistant.
