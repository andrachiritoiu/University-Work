# Smart contracts in Solidity: receiving and sending ether, `receive`, `fallback` and the withdrawal pattern

## Solidity basics

This laboratory is the first of a series dedicated to **design patterns** for smart contracts, which ends with the **proxy pattern** for upgradeable contracts. Before contracts that delegate their logic to other contracts can be studied, it must be clear how a contract **receives and sends ether**, which code is executed when a call does not match any function, and what can go wrong when ether is sent to an address whose code is unknown. The laboratory uses an auction contract to show the **re-entrancy attack**, and the **withdrawal pattern** (*pull over push*) together with the **checks–effects–interactions** order as the defence against it.

### The balance of a contract

Every account, whether it is controlled by a private key or by code, has a **balance** in wei (1 ether = 10⁹ gwei = 10¹⁸ wei) [1]. A contract reads its own balance with `address(this).balance` and the balance of any other account with `addr.balance`. The units `wei`, `gwei` and `ether` can be used as suffixes of numeric literals, e.g. `require(msg.value >= 1 ether)`.

- **`msg.value`** is the amount of wei sent with the current call. It is not a separate transfer: the ether is added to the balance of the called contract **before** its code is executed, and it is returned to the caller if the call reverts.
- An address that can receive ether through `transfer` and `send` has the type **`address payable`**. An `address` is converted with `payable(addr)`; `msg.sender` is of type `address` and must also be converted, e.g. `payable(msg.sender).transfer(amount)`. The low-level `call` is available on both types.
- The balance of a contract can change **without any of its code being executed**: ether can be forced into a contract by `selfdestruct(payable(target))` (which, since the Cancun upgrade, EIP-6780, still transfers the balance, although it no longer deletes the contract unless it is called in the transaction that created it) and by the fees of a block that name the contract as their recipient [2]. A contract must therefore never assume that `address(this).balance` equals the sum of the deposits it has recorded.

### Payable functions and constructors

A function or a constructor accepts ether only if it is marked **`payable`** [3]:

```solidity
constructor() payable {}                      // accepts ether at deployment

function deposit() external payable {         // accepts ether with the call
    emit ViaDeposit(msg.sender, msg.value);
}

function ping() external pure returns (string memory) {   // rejects ether
    return "pong";
}
```

- For a function that is **not** `payable`, the compiler inserts a check at the beginning of the function: if `msg.value > 0`, the call reverts without error data. This is why a non-payable function costs a few gas more than a payable one with the same body.
- `view` and `pure` functions cannot be `payable`, and `msg.value` cannot be read in a non-payable `public` or `external` function (compilation error).
- A `payable` function can still be called without ether; `msg.value` is then zero.

### The special functions `receive` and `fallback`

A contract can declare at most one **`receive`** function and at most one **`fallback`** function. They have no name, no `function` keyword, and must be `external` [4]:

```solidity
receive() external payable { ... }

fallback() external [payable] { ... }
// or, with access to the calldata and with a return value:
fallback(bytes calldata input) external [payable] returns (bytes memory output) { ... }
```

- **`receive`** is executed for a call with **empty calldata**, i.e. a plain ether transfer (`cast send $ADDR --value 1ether`, `addr.transfer(x)`, `addr.call{value: x}("")`). It takes no arguments, returns nothing and **must** be `payable`.
- **`fallback`** is executed when the first four bytes of the calldata do **not match the selector of any function**, or when the calldata is empty and there is **no `receive`** function. It may be `payable` or not. The full calldata is available in `msg.data` (or in the parameter `input`), and the second form can return arbitrary bytes to the caller, which are **not** ABI-encoded by the compiler.

The decision made by the code that the compiler places at the beginning of every contract (the **dispatcher**) is the following:

```
                     calldata empty?
             ┌──────── yes ───────┴──────── no ──────────┐
   receive() exists?                         selector matches a function?
   ├─ yes → receive()                        ├─ yes → that function
   └─ no → fallback() exists?                │        (reverts if msg.value > 0 and it is not payable)
           ├─ yes → fallback()               └─ no → fallback() exists?
           └─ no → revert                             ├─ yes → fallback()
                                                      └─ no → revert
   fallback() reverts if msg.value > 0 and it is not payable
```

For the contract `Receiver` of this laboratory, which has a payable function `deposit`, a non-payable function `ping`, a `receive` and a payable `fallback`, the possible calls are:

| Calldata | `msg.value` | Function executed |
|---|---|---|
| empty | 1 ether | `receive` |
| empty | 0 | `receive` |
| `deposit()` | 1 ether | `deposit` |
| `ping()` | 0 | `ping` |
| `ping()` | 1 wei | none, the call reverts |
| `doesNotExist()` or `0x12345678` | any | `fallback` |
| fewer than 4 bytes, e.g. `0x12` | any | `fallback` |

The following points are important:

- A contract **without** `receive` and **without** a payable `fallback` cannot receive plain transfers: they revert. It can still receive ether through its payable functions, and through `selfdestruct` or block fees, which cannot be refused.
- A contract with only a payable `fallback` receives plain transfers in the `fallback`. The compiler then emits warning 3628, *"This contract has a payable fallback function, but no receive ether function"*, since it is recommended to separate transfers (`receive`) from calls with unknown data (`fallback`).
- `receive` and `fallback` are ordinary code: they can read and write storage, emit events and **call other contracts**, provided they receive enough gas. This last property is the basis of the re-entrancy attack described below.
- `fallback` is also the mechanism by which a contract can accept calls to functions it does not declare and **forward** them to another contract. A **proxy** consists essentially of a `fallback` that forwards every call with `delegatecall` to an implementation contract; this is the subject of the next laboratories.

### Sending ether: `transfer`, `send` and `call`

A contract sends ether with one of three members of `address` [1, 5]:

| Construction | Gas available to the recipient | On failure |
|---|---|---|
| `payable(to).transfer(amount)` | 2,300 (stipend) | reverts the caller |
| `payable(to).send(amount)` | 2,300 (stipend) | returns `false` |
| `(bool ok, bytes memory data) = to.call{value: amount}("")` | all remaining gas (at most 63/64), or the value given with `{gas: g}` | returns `false` |

- The **stipend of 2,300 gas** is enough for a `receive` that emits a simple event, but not for one that writes to storage: `SSTORE` fails if less than 2,301 gas remains (EIP-2200), so a `receive` such as `totalReceived += msg.value` runs out of gas. `transfer` and `send` were introduced precisely to prevent the recipient from executing significant code, and thus from calling back the sender.
- Relying on a fixed amount of gas is however fragile: the gas costs of opcodes change with the upgrades of the network (EIP-1884 [10], in 2019, made `SLOAD` more expensive and broke contracts whose `receive` worked within 2,300 gas), and recipients such as multisig wallets need more gas. The current recommendation is to send ether with **`call`** and to protect the contract against re-entrancy explicitly, with the order checks–effects–interactions or with a lock [6].
- The result of `send` and `call` **must be checked**. If it is ignored, the contract continues as if the payment had been made, while the ether stays in the contract.
- A `call` to an address **without code** (an externally owned account, or an address where no contract has been deployed) always succeeds. A `call` to a contract executes `receive` or `fallback` if the calldata is empty, and the function selected by the calldata otherwise, e.g. `to.call{value: x}(abi.encodeWithSignature("placeBid()"))`.

### Re-entrancy

When a contract sends ether with `call`, or calls any function of another contract, it **hands control** to the code of the recipient until the call returns. If the recipient is a contract, its `receive` or `fallback` can call back the sender **before the first call has finished**: the sender is *re-entered* while it is in an intermediate state [6, 7].

The function `withdraw` of `VulnerableAuction` sends the refund **before** it sets the bid of the caller to zero:

```solidity
function withdraw() external {
    require(auctionEnded, "Auction not ended yet");
    require(msg.sender != highestBidder, "Winner cannot withdraw");

    uint256 refundAmount = bids[msg.sender];
    require(refundAmount > 0, "No funds to withdraw");

    (bool success,) = msg.sender.call{value: refundAmount}("");   // interaction
    bids[msg.sender] = 0;                                          // effect, too late
    require(success, "Withdrawal failed");

    emit Withdrawal(msg.sender, refundAmount);
}
```

The contract `Attacker` places a small bid and, after the auction has ended, calls `withdraw`. The refund is sent with empty calldata; since `Attacker` has no `receive`, it arrives in its payable `fallback`, which calls `withdraw` again:

```solidity
fallback() external payable {
    if (msg.value > 0) {
        uint256 bidInfo = auction.bidInfo(address(this));
        uint256 getBackValue = bidInfo / 5;
        if (address(auction).balance >= getBackValue) {
            (bool success,) = address(auction).call(abi.encodeWithSignature("withdraw()"));
            require(success);
        }
    }
}
```

1. `Attacker.attack()` calls `withdraw()`; all the checks pass and the auction sends `bids[attacker]` to the attacker.
2. The transfer executes `Attacker.fallback()`, which calls `withdraw()` again. `bids[attacker]` has not been set to zero yet, so the checks pass again and the same amount is sent a second time.
3. The recursion continues while the auction still has funds; the bids of the other participants are paid to the attacker.
4. When the condition of the `fallback` becomes false, the calls return one after the other; each of them sets `bids[attacker] = 0` (which is already zero) and emits `Withdrawal`. The transaction succeeds.

The defences against re-entrancy are:

- **Checks–effects–interactions** (CEI) [6]: check the conditions, then update the state, and only at the end call other contracts. In `SecureAuction`, `bids[msg.sender] = 0` is executed before the `call`; a re-entrant call to `withdraw` fails at `require(refundAmount > 0)`, and the failure propagates back and reverts the whole attack.
- **A re-entrancy lock** (*mutex*): a modifier sets a flag at the beginning of the function and clears it at the end; a re-entrant call finds the flag set and reverts. OpenZeppelin provides it as `ReentrancyGuard` and, using the cheaper **transient storage** introduced by EIP-1153 [11], as `ReentrancyGuardTransient` [8]. In Solidity ≥ 0.8.28, a state variable declared `bool transient locked;` is stored in transient storage, which is cleared at the end of every transaction.
- Re-entrancy is not limited to the same function: a re-entrant call can enter **another** function that relies on state not yet updated (*cross-function re-entrancy*), e.g. `claimPrize`, which in `VulnerableAuction` also sets `highestBid = 0` after the transfer. A `view` function called during the re-entrancy can also return inconsistent values (*read-only re-entrancy*).

The best-known re-entrancy attack drained approximately 3.6 million ether from *The DAO* in 2016 and led to the hard fork that separated Ethereum from Ethereum Classic [7].

### The withdrawal pattern (pull over push)

A contract that **pushes** ether to several recipients, for example by refunding all the losing bidders in a loop at the end of an auction, or by refunding the previous highest bidder as soon as a higher bid arrives, depends on the cooperation of every recipient [9]:

- a recipient whose `receive` reverts (or which has neither `receive` nor `fallback`) makes the whole transaction revert, so that nobody is paid and the auction can never be ended or outbid: a **denial of service**;
- a loop over an unbounded list of recipients may exceed the gas limit of a transaction;
- every external call is a potential point of re-entrancy.

In the **withdrawal pattern**, the contract only **records** the amount owed to each participant (e.g. in a mapping `pendingReturns`), and each participant calls a function `withdraw` to **pull** their own funds. A failing recipient then harms only itself, each transaction makes a single external call, and the function `withdraw` is written once, following checks–effects–interactions. `SecureAuction` applies the pattern: the losing bidders recover their bids with `withdraw`, and the winner calls `claimPrize`.


## Practical work

### Step 1: Setting up the project

Create a new Foundry project and copy into it the contracts and the tests of the laboratory:

```bash
forge init lab6
cd lab6
rm src/Counter.sol test/Counter.t.sol script/Counter.s.sol
cp <path to lab6>/src/EtherReceiver.sol <path to lab6>/src/Auction.sol src/
cp <path to lab6>/test/EtherReceiver.t.sol <path to lab6>/test/Reentrancy.t.sol test/
forge build
```

The file `EtherReceiver.sol` contains the contracts used to study `payable`, `receive` and `fallback`: `Receiver`, `OnlyFallback`, `NoReceive`, `CountingReceiver` and `Sender`. The file `Auction.sol` contains `VulnerableAuction`, `SecureAuction` and `Attacker`. Read the compiler warnings: which contracts produce warning 3628, and why?

In the first terminal, start `anvil`; in the second, set the following variables:

```bash
export ETH_RPC_URL=http://127.0.0.1:8545
ANVIL_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80   # anvil account 0
MALLORY_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d  # anvil account 1
ALICE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a    # anvil account 2
BOB_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6      # anvil account 3
```

### Step 2: `payable`, `receive` and `fallback`

Deploy `Receiver` with 1 ether, using its payable constructor, and check its balance:

```bash
forge create src/EtherReceiver.sol:Receiver --private-key $ANVIL_KEY --broadcast --value 1ether
R=<deployed contract address>
cast balance $R --ether                                              # 1.0
```

Send ether to the contract in each of the ways of the table in the section *The special functions `receive` and `fallback`*:

```bash
cast send $R --value 1ether --private-key $ANVIL_KEY                 # empty calldata  → receive
cast send $R 0x12345678 --value 1ether --private-key $ANVIL_KEY      # unknown selector → fallback
cast send $R "deposit()" --value 1ether --private-key $ANVIL_KEY     # payable function
cast send $R "ping()" --value 1 --private-key $ANVIL_KEY             # non-payable: reverts
cast call $R "ping()(string)"                                        # without ether: "pong"
cast balance $R --ether                                              # 4.0
```

The call of `ping` with 1 wei fails during the estimation of the gas with `execution reverted, data: "0x"`: the check inserted by the compiler reverts **without error data**. The plain transfer consumes 22,647 gas, i.e. 21,000 for the transaction and the rest for the dispatcher and the event of `receive`.

Retrieve the events and identify the function that was executed for each transaction:

```bash
cast logs --from-block 0 --address $R "ViaReceive(address,uint256)"
cast logs --from-block 0 --address $R "ViaFallback(address,uint256,bytes)"
cast logs --from-block 0 --address $R "ViaDeposit(address,uint256)"
```

In the `data` field of the `ViaFallback` log, find the ABI encoding of the sender, of the value (`0x0de0b6b3a7640000` = 10¹⁸) and of the bytes `0x12345678` received in `msg.data`.

The same cases are verified by the tests of `test/EtherReceiver.t.sol`, which also cover `OnlyFallback` (a plain transfer reaches the `fallback`) and `NoReceive` (a plain transfer reverts):

```bash
forge test --match-contract EtherReceiverTest -vv
```

### Step 3: `transfer`, `send` and `call`

The contract `Sender` sends ether with each of the three mechanisms. `CountingReceiver` has a `receive` that writes to storage:

```solidity
contract CountingReceiver {
    uint256 public totalReceived;

    receive() external payable {
        totalReceived += msg.value;
    }
}
```

Run the test that sends ether to `CountingReceiver` with each mechanism, and display its trace:

```bash
forge test --match-test test_TransferFailsWhenReceiveWritesStorage -vvvv
```

The trace shows that `transfer` gives the recipient exactly 2,300 gas, which is not enough for `SSTORE`:

```
├─ [33951] Sender::viaTransfer(CountingReceiver: [...], 1000000000000000000 [1e18])
│   ├─ [2300] CountingReceiver::receive{value: 1000000000000000000}()
│   │   └─ ← [OutOfGas] EvmError: OutOfGas
│   └─ ← [Revert] EvmError: Revert
```

`send` fails in the same way, but returns `false` instead of reverting; `call` forwards all the remaining gas and succeeds. In contrast, `test_TransferToSimpleReceiver` shows that `transfer` to `Receiver` succeeds, since its `receive` only emits an event. Using the gas costs of Laboratory 4, explain why the event fits within 2,300 gas and the storage write does not.

### Step 4: The re-entrancy attack on `anvil`

Deploy `VulnerableAuction`, place a bid of 5 ether from Alice and a bid of 2 ether from Bob:

```bash
forge create src/Auction.sol:VulnerableAuction --private-key $ANVIL_KEY --broadcast
AUCTION=<deployed contract address>
cast send $AUCTION "placeBid()" --value 5ether --private-key $ALICE_KEY
cast send $AUCTION "placeBid()" --value 2ether --private-key $BOB_KEY
```

Mallory deploys the attacker contract and places a bid of 1 ether through it. The auction is then ended; Alice is the winner:

```bash
forge create src/Auction.sol:Attacker --private-key $MALLORY_KEY --broadcast --constructor-args $AUCTION
ATTACKER=<deployed contract address>
cast send $ATTACKER "bid()" --value 1ether --private-key $MALLORY_KEY
cast send $AUCTION "endAuction()" --private-key $ANVIL_KEY
cast balance $AUCTION --ether                                        # 8.0
cast call $AUCTION "bidInfo(address)(uint256)" $ATTACKER             # 1 ether
```

Launch the attack and check the balances:

```bash
cast send $ATTACKER "attack()" --private-key $MALLORY_KEY
cast balance $AUCTION --ether                                        # 0.0
cast balance $ATTACKER --ether                                       # 8.0
cast call $AUCTION "bidInfo(address)(uint256)" $ATTACKER             # 0
```

With a bid of 1 ether, the attacker has recovered 8 ether, i.e. also the bid of Bob and the bid of the winner, Alice. Display the execution trace of the attack:

```bash
cast run <transactionHash>
```

The beginning of the trace is the following (the addresses have been replaced by the names of the contracts):

```
[113921] Attacker::attack()
  ├─ [108544] VulnerableAuction::withdraw()
  │   ├─ Attacker::receive{value: 1000000000000000000}()
  │   │   ├─ VulnerableAuction::bidInfo(Attacker)  → 1000000000000000000
  │   │   ├─ VulnerableAuction::withdraw()
  │   │   │   ├─ Attacker::receive{value: 1000000000000000000}()
  │   │   │   │   ├─ ...
```

The trace labels a call with empty calldata as `receive`; since `Attacker` has no `receive` function, the code that is actually executed is its `fallback`. Count the nested calls of `withdraw` and the `Withdrawal` events: there are eight of each, although the attacker had a single bid. Note that the transaction is **successful**: nothing in the logs of the auction distinguishes the attack from eight legitimate withdrawals.

### Step 5: The attack in tests, against both auctions

The test file `test/Reentrancy.t.sol` reproduces the scenario of Step 4 with the cheatcodes `makeAddr`, `vm.deal` and `vm.prank` [12], first against `VulnerableAuction` and then against `SecureAuction`:

```solidity
function test_AttackFailsOnSecureAuction() public {
    SecureAuction auction = new SecureAuction();
    Attacker attacker = _prepare(address(auction));

    vm.prank(mallory);
    vm.expectRevert(bytes("Attack failed"));
    attacker.attack();

    assertEq(address(auction).balance, 8 ether);
}
```

Run the tests, and then the attack against `SecureAuction` with the full trace:

```bash
forge test --match-contract ReentrancyTest -vv
forge test --match-test test_AttackFailsOnSecureAuction -vvvv
```

In `SecureAuction`, `bids[msg.sender]` is set to zero **before** the ether is sent. Follow in the trace how the error propagates: the re-entrant `withdraw` reverts with `"No funds to withdraw"`, the `require(success)` of the `fallback` reverts, the `call` of the first `withdraw` returns `false` and `"Withdrawal failed"` is raised, and finally `attack` reverts with `"Attack failed"`. Since the whole transaction is reverted, the attacker does not even keep the first, legitimate refund; it can recover its bid with a contract that does not re-enter. The two versions of `withdraw` differ **only in the order of two lines**.

The third test, `test_HonestWithdrawFromSecureAuction`, checks that an honest losing bidder recovers their bid exactly once.


## Exercises

### Exercise 1: `receive` and `fallback`

1. Fill in a table with one row for each of the contracts `Receiver`, `OnlyFallback` and `NoReceive`, and with the columns *empty calldata, 0 wei*, *empty calldata, 1 ether*, *unknown selector, 0 wei*, *unknown selector, 1 ether*. In each cell, write the function that is executed, or *revert*. Then make two copies of `Receiver`: one without `receive`, and one in which `fallback` is not `payable`, and add the corresponding rows. Verify every cell with a test.
2. Add to a new contract `Echo` a function `fallback(bytes calldata input) external returns (bytes memory)` that returns `input` unchanged. Call `Echo` with `cast call $ECHO 0x12345678` and with the calldata of an existing function of another contract, e.g. `$(cast calldata "deposit()")`. What is returned, and why is the result not ABI-encoded?
3. `NoReceive` rejects ether. Write a contract `ForceSend` whose payable constructor executes `selfdestruct(payable(target))`, and use it in a test to send 1 ether to `NoReceive`. Check the balance of `NoReceive` and explain why a contract must not rely on an invariant such as `address(this).balance == totalDeposits`. Which warning does the compiler give for `selfdestruct`?
4. Run `forge build` and explain warning 3628 for `OnlyFallback` and `Attacker`. Add a `receive` function to `Attacker` that does nothing. Does the attack of Step 5 still work? Why?


### Exercise 2: Sending ether

1. Make a copy of `VulnerableAuction`, `TransferAuction`, in which `withdraw` uses `payable(msg.sender).transfer(refundAmount)` instead of `call` (and keeps the wrong order of the two lines). Write a test that runs the attack against it. Does it succeed? Explain, using the trace of the test, at which point the attack fails.
2. In the same test file, show that `TransferAuction` is nevertheless not a good solution: a bidder that is a contract such as `CountingReceiver` (add a function that places a bid) can never recover its bid. Why is this situation worse than with `SecureAuction`?
3. Write a contract `CarelessBank` with a mapping of balances, a payable `deposit` and a function `withdraw(uint amount)` that decreases the balance and sends the ether with `send`, **without checking** its result. Write a test in which a client whose `receive` reverts withdraws: what is the state of the balance in the mapping, and where is the ether? Fix the function.
4. Write a test that sends 1 ether with `call` to an address that has no code, e.g. `makeAddr("nobody")`. Is the result `true` or `false`? What does this imply for a contract that calls a function of another contract with a low-level `call` and an address that may be wrong?

### Exercise 3: Re-entrancy

1. The `fallback` of `Attacker` re-enters while `address(auction).balance >= bidInfo / 5`. Change the scenario of the test so that Bob bids 2.5 ether instead of 2 ether. Does the attack still work? Explain the result, following the trace, and modify the condition of the `fallback` so that the attacker takes as much as possible without making the whole transaction revert.
2. `claimPrize` of `VulnerableAuction` also sends ether before updating the state. Write a contract `PrizeAttacker` that becomes the highest bidder and, in its `fallback`, re-enters `claimPrize`. Write a test in which honest bidders and `PrizeAttacker` bid, and show how much the attacker can take. Is `SecureAuction.claimPrize` vulnerable?
3. Without changing the order of the lines in `VulnerableAuction`, protect `withdraw` and `claimPrize` with a modifier `nonReentrant` that uses a state variable `bool transient locked`, and reverts with a custom error `ReentrantCall()`. Run the attacks again. Can `Attacker` re-enter `claimPrize` from `withdraw`, if both functions use the same modifier? Measure the gas of `withdraw` with `forge test --gas-report` with a `transient` and with an ordinary storage variable, and explain the difference.
4. Why is it not sufficient to check `require(tx.origin == msg.sender)` in `withdraw` to stop the attack? Which honest users would be excluded by this check?

### Exercise 4: The withdrawal pattern

1. Write a contract `PushAuction` in which `placeBid` accepts only bids higher than `highestBid`, and **immediately** refunds the previous highest bidder with `call`, followed by `require(success)`. Write a contract `MaliciousRejecter` that places a bid through a function `bid()` and whose `receive` always reverts. Write a test in which Alice bids, then `MaliciousRejecter` bids more, then Bob tries to bid even more. What happens to Bob's bid? Who wins the auction?
2. Rewrite the contract as `PullAuction`: `placeBid` adds the previous highest bid to `pendingReturns[previousBidder]` instead of sending it, and a function `withdraw()` lets each bidder recover their `pendingReturns`, following checks–effects–interactions. Repeat the scenario of point 1 and show that Bob can now outbid `MaliciousRejecter`, and that only `MaliciousRejecter` is unable to recover its funds.
3. In `PullAuction`, add a function `endAuction()` that, instead of refunding the losers, only marks the auction as ended, and a function `claim()` for the seller (set in the constructor) that collects the highest bid. Write a test that verifies that, at the end, the balance of the contract equals the sum of the `pendingReturns` that have not been withdrawn. Why must `claim` and `withdraw` never be able to pay the same ether twice?
4. Compare the gas of a scenario with 5 bidders in `PushAuction` and in `PullAuction` (`forge test --gas-report`), counting also the 5 `withdraw` transactions of `PullAuction`. Who pays the gas of the refunds in each version? Summarise in a table the advantages and disadvantages of the two versions with respect to denial of service, re-entrancy, gas and usability.

## References

1. Solidity documentation, *Members of addresses*. https://docs.soliditylang.org/en/latest/types.html#members-of-addresses
2. G. Ballet, V. Buterin, D. Feist, *EIP-6780: SELFDESTRUCT only in same transaction*. https://eips.ethereum.org/EIPS/eip-6780
3. Solidity documentation, *Function visibility and state mutability*. https://docs.soliditylang.org/en/latest/contracts.html#state-mutability
4. Solidity documentation, *Special functions: receive Ether function and fallback function*. https://docs.soliditylang.org/en/latest/contracts.html#special-functions
5. Solidity documentation, *Sending and receiving Ether*. https://docs.soliditylang.org/en/latest/security-considerations.html#sending-and-receiving-ether
6. Solidity documentation, *Security considerations: re-entrancy* and *Use the checks-effects-interactions pattern*. https://docs.soliditylang.org/en/latest/security-considerations.html#reentrancy
7. Consensys Diligence, *Smart contract best practices: reentrancy*. https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/
8. OpenZeppelin, *ReentrancyGuard* and *ReentrancyGuardTransient*. https://docs.openzeppelin.com/contracts/5.x/api/utils#ReentrancyGuard
9. Solidity documentation, *Common patterns: withdrawal from contracts*. https://docs.soliditylang.org/en/latest/common-patterns.html#withdrawal-from-contracts
10. M. Swende, *EIP-1884: Repricing for trie-size-dependent opcodes*. https://eips.ethereum.org/EIPS/eip-1884
11. A. Akhunov, M. Salem, *EIP-1153: Transient storage opcodes*. https://eips.ethereum.org/EIPS/eip-1153
12. Foundry Book, *Cheatcodes reference* (`deal`, `prank`, `expectRevert`). https://getfoundry.sh/reference/cheatcodes/overview

Additional resources:

- [Solidity documentation](https://docs.soliditylang.org/en/latest/) and its [PDF version](https://docs.soliditylang.org/_/downloads/en/latest/pdf/)
- [EVM Codes: an interactive reference of EVM opcodes](https://www.evm.codes/)
- [Ethereum smart contract security](https://ethereum.org/en/developers/docs/smart-contracts/security/)

> **Note on the preparation of this document.** Parts of this laboratory guide were drafted with the assistance of Claude (Anthropic), an AI assistant.
