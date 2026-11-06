# Token standards with OpenZeppelin: ERC-20 and ERC-721

## Prerequisites

This laboratory uses the same tools as Laboratory 1-4: **Foundry**, **Git**, a **MetaMask** development wallet, an **Infura** endpoint for Sepolia and the encrypted Foundry keystore `sepolia-dev`. The instructions are for **Linux**; Windows users must work inside **WSL**. Check that the tools respond and that the development account still holds some test ether:

```bash
foundryup
forge --version
cast wallet address --account sepolia-dev
```

The smart contracts of this laboratory are not written from scratch: they are built on **OpenZeppelin Contracts**, a library of audited implementations of the Ethereum standards [1]. The library is downloaded from GitHub by `forge install` (Step 1), so the computer must have network access to `github.com`.

## Tokens on Ethereum

In Laboratory 2, fidelity points were stored in a mapping `points` of the contract `FidelityPoints`. The points existed only inside that contract: a client could not send them to another client, and a wallet or an exchange could not display them, because each contract defines its own functions with its own names.

A **token standard** solves this problem by fixing an interface, that is, a set of function signatures, events and expected behaviours. Any contract that implements the interface can be used by any application written for the standard, without knowing the source code of the contract. On Ethereum, standards are published as **Ethereum Improvement Proposals** (EIPs); application-level standards are called **ERCs** (Ethereum Requests for Comments) [2].

Two kinds of tokens are distinguished:

- **fungible** tokens, whose units are interchangeable, like coins or fidelity points: only the **amount** held by each account matters. The standard is **ERC-20** [3].
- **non-fungible** tokens (**NFTs**), each of which has a unique identifier and may have its own properties, like a ticket for a given seat or a membership badge. The standard is **ERC-721** [4].

A token is not stored in the wallet of its holder. The balances are stored in the **storage of the token contract**, and a transfer is a transaction that calls the token contract and modifies its storage. The wallet only reads the balances from the contract and signs the transactions that call it.

### ERC-20

The ERC-20 interface contains six functions and two events [3]:

| Function / event | Description |
|---|---|
| `totalSupply()` | the total number of units in existence |
| `balanceOf(address account)` | the number of units held by `account` |
| `transfer(address to, uint256 value)` | moves `value` units from `msg.sender` to `to` |
| `approve(address spender, uint256 value)` | allows `spender` to move up to `value` units of `msg.sender` |
| `allowance(address owner, address spender)` | the amount that `spender` may still move on behalf of `owner` |
| `transferFrom(address from, address to, uint256 value)` | moves `value` units from `from` to `to`, consuming the allowance of `msg.sender` |
| `event Transfer(from, to, value)` | emitted on every transfer; `from = address(0)` for minting, `to = address(0)` for burning |
| `event Approval(owner, spender, value)` | emitted on every call to `approve` |

The functions `name()`, `symbol()` and `decimals()` are optional, but almost always implemented.

**Decimals.** The EVM has no fractional numbers (see *Fixed-point numbers* in Laboratory 2), so balances are stored as integers in the smallest unit of the token. `decimals()` only tells applications where to place the decimal point when they display an amount. With `decimals() = 18`, the convention of ether, the amount 1.5 FPT is stored as `1500000000000000000` (1.5 × 10¹⁸). In Solidity, the suffix `ether` performs the same scaling: `1.5 ether == 1.5e18`. On the command line, the conversion is done with `cast --to-wei 1.5` and `cast --from-wei 1500000000000000000`.

**Allowances.** A contract cannot take tokens from an account on its own initiative, and it is not notified when it receives tokens through `transfer`. The standard pattern for paying a contract with tokens therefore takes **two transactions**:

1. the holder calls `token.approve(shop, amount)`, which records an allowance in the token contract;
2. the holder calls a function of the shop, which in turn calls `token.transferFrom(holder, shop, amount)`; the token contract checks and decreases the allowance.

The allowance is a mapping of mappings, `allowance[owner][spender]`. Approving the maximum value `type(uint256).max` is called an **infinite approval**: in the OpenZeppelin implementation it is not decreased by `transferFrom`. Infinite approvals save one transaction per payment, but if the approved contract is malicious or vulnerable, all the tokens of the holder can be taken. Revoking an approval means calling `approve(spender, 0)`.

### ERC-721

In ERC-721, each token is identified by a pair (contract address, `uint256 tokenId`). The main elements of the interface are [4]:

| Function / event | Description |
|---|---|
| `balanceOf(address owner)` | the **number** of tokens held by `owner` |
| `ownerOf(uint256 tokenId)` | the owner of the token `tokenId`; reverts if the token does not exist |
| `transferFrom(from, to, tokenId)` | moves the token, without any check of the recipient |
| `safeTransferFrom(from, to, tokenId)` | moves the token and, if `to` is a contract, requires it to accept the token |
| `approve(address to, uint256 tokenId)` | allows `to` to transfer **one** token; the approval is cleared on transfer |
| `setApprovalForAll(address operator, bool approved)` | allows `operator` to transfer **all** the tokens of `msg.sender` (e.g. an NFT marketplace) |
| `event Transfer(from, to, tokenId)` | the same signature as the ERC-20 event, but `tokenId` is **indexed** |

**Safe transfers.** A token sent to a contract that has no function to transfer it again is lost forever. `safeTransferFrom` and `_safeMint` therefore call the function `onERC721Received` on a recipient that has code, and revert unless it returns its own selector, `0x150b7a02`. A contract signals in this way that it was designed to hold NFTs. `transferFrom` performs no such check.

**Metadata.** Storing images on the blockchain is very expensive (see *Data locations* in Laboratory 2). The optional metadata extension defines `tokenURI(tokenId)`, which returns a URI pointing to a JSON document stored off-chain, typically on IPFS, of the form:

```json
{
  "name": "Gold member",
  "description": "Awarded after redeeming 50 fidelity points",
  "image": "ipfs://<CID>/gold.png",
  "attributes": [{ "trait_type": "Level", "value": "Gold" }]
}
```

The blockchain guarantees only who owns `tokenId`; it does not guarantee that the document at the URI exists or remains unchanged. A content-addressed URI (`ipfs://<CID>`) is preferable to an `https://` URI, because the CID is the hash of the content.

**Interface detection.** ERC-721 contracts must implement **ERC-165** [5], the function `supportsInterface(bytes4 interfaceId)`, which lets other contracts and applications check which interfaces are implemented. An interface identifier is the XOR of the selectors of its functions; for ERC-721 it is `0x80ac58cd`.

### OpenZeppelin Contracts

OpenZeppelin Contracts implements each standard as an **abstract or base contract** from which the user contract inherits, plus optional **extensions** that add behaviour [1]. Version 5 of the library, used here, has the following conventions:

- **Inheritance.** `contract FidelityToken is ERC20, ERC20Burnable, ERC20Capped, Ownable` inherits all the functions of the four contracts. The constructors of the base contracts are called in the header of the constructor, e.g. `ERC20("Fidelity Points", "FPT")`.
- **Internal hooks.** The public functions are implemented with `internal` functions that a derived contract can call or override. In ERC-20, `_mint`, `_burn` and `_transfer` all call a single function, `_update(from, to, value)`; in ERC-721, all the movements of tokens go through `_update(to, tokenId, auth)`. To add a rule that applies to every movement of tokens, it is enough to override `_update`.
- **`override`.** When several base contracts define the same function, Solidity requires the derived contract to override it and list the bases explicitly: `function _update(...) internal override(ERC20, ERC20Capped)`. The call `super._update(...)` executes the implementations in the order given by the **C3 linearisation** of the inheritance graph [6], here `ERC20Capped` and then `ERC20`.
- **Access control.** `Ownable` stores an owner, set in the constructor, and provides the modifier `onlyOwner`, the function `transferOwnership` and the function `renounceOwnership` [7]. It replaces the `admin` variable and the `onlyAdmin` modifier written by hand in Laboratory 2.
- **Custom errors.** The errors of the token contracts are standardised by ERC-6093 [8], e.g. `ERC20InsufficientBalance(sender, balance, needed)` or `ERC721NonexistentToken(tokenId)`. They are declared in the interfaces `IERC20Errors` and `IERC721Errors`, and `cast` decodes them automatically.

The **OpenZeppelin Contracts Wizard** [9] generates a token contract from a set of options selected in the browser, and is a convenient way to explore the extensions available.


## Practical work

The project contains three contracts:

| Contract | Standard | Role |
|---|---|---|
| `FidelityToken` | ERC-20 | fidelity points (FPT), minted by the shop administrator, burnable, with a maximum supply |
| `LoyaltyBadge` | ERC-721 | loyalty badges (BADGE), each with its own metadata URI |
| `BadgeShop` | — | burns FPT from a client and mints a badge in exchange |

### Step 1: Creating the project and installing OpenZeppelin

Create a Foundry project, remove the example files and install OpenZeppelin Contracts as a dependency [10]:

```bash
forge init tokens-lab
cd tokens-lab
rm src/Counter.sol test/Counter.t.sol script/Counter.s.sol
forge install OpenZeppelin/openzeppelin-contracts@v5.7.0
```

`forge install` clones the repository of the library into `lib/openzeppelin-contracts` as a Git submodule, at the given tag. Pinning a version ensures that the code compiled today is the same as the code compiled in a month. Display the import remappings detected by Foundry:

```bash
forge remappings
```

The line `@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/` means that the import

```solidity
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
```

is resolved to the file `lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol`. Save the remappings in a file, so that editors (e.g. VS Code with a Solidity extension) resolve them too:

```bash
forge remappings > remappings.txt
```

Copy `FidelityToken.sol`, `LoyaltyBadge.sol` and `BadgeShop.sol` into `src/` and compile:

```bash
forge build
```

Open `lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol` and find the functions `transfer`, `_transfer` and `_update`. Note that `transfer` returns `true`: the original standard required the return value, and some old tokens do not respect it, which is why contracts that interact with arbitrary tokens use the library `SafeERC20`.

### Step 2: The contracts

#### 2.1 `FidelityToken` (ERC-20)

```solidity
contract FidelityToken is ERC20, ERC20Burnable, ERC20Capped, Ownable {
    constructor(address initialOwner, uint256 cap_)
        ERC20("Fidelity Points", "FPT")
        ERC20Capped(cap_)
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal virtual override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
```

- `ERC20` provides the six functions of the standard, plus `name`, `symbol` and `decimals` (18 by default).
- `ERC20Burnable` adds `burn(value)`, which destroys tokens of `msg.sender`, and `burnFrom(account, value)`, which destroys tokens of `account` and consumes the allowance of `msg.sender`.
- `ERC20Capped` overrides `_update` to revert with `ERC20ExceededCap` when minting would exceed the cap. The cap is stored in an `immutable` variable: it is written into the bytecode at deployment and does not occupy a storage slot.
- `mint` is the only function written by hand. `ERC20` has no public mint function: who may create new tokens is a decision of each project.

#### 2.2 `LoyaltyBadge` (ERC-721)

```solidity
contract LoyaltyBadge is ERC721, ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    function safeMint(address to, string calldata uri) external onlyOwner returns (uint256 tokenId) {
        tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    // overrides of tokenURI and supportsInterface
}
```

`ERC721URIStorage` stores a separate URI for each token in a mapping. The identifiers are allocated sequentially by `nextTokenId++`, which returns the old value and then increments the variable.

#### 2.3 `BadgeShop`

```solidity
function redeem(string calldata uri) external returns (uint256 tokenId) {
    token.burnFrom(msg.sender, price);
    tokenId = badge.safeMint(msg.sender, uri);
    emit BadgeRedeemed(msg.sender, tokenId, price);
}
```

`BadgeShop` calls two other contracts. For `burnFrom` to succeed, the client must first have approved the shop with `token.approve(shop, price)`. For `safeMint` to succeed, the shop must be the **owner** of `LoyaltyBadge`, which is achieved by calling `badge.transferOwnership(shop)` after deployment. Inside `LoyaltyBadge`, `msg.sender` is the shop, not the client: `msg.sender` is always the **immediate** caller.

### Step 3: Testing

The project contains three test files, with 34 tests in total. Run them:

```bash
forge test
forge test --match-contract BadgeShopTest -vvvv
forge test --gas-report
```

The tests use the cheatcodes introduced in Laboratory 2 (`vm.prank`, `vm.expectRevert`) and three new ones [11]:

- `vm.startPrank(addr)` / `vm.stopPrank()`: all the calls between them have `msg.sender == addr`, not only the next one;
- `vm.expectEmit(checkTopic1, checkTopic2, checkTopic3, checkData, emitter)`, followed by an `emit` of the expected event: the test fails unless the next call emits an identical event. The booleans select which parts of the log are compared;
- `bound(x, min, max)`: restricts a random value to an interval.

The expected errors are built from the selectors of the OpenZeppelin errors, with their arguments:

```solidity
vm.expectRevert(
    abi.encodeWithSelector(IERC20Errors.ERC20InsufficientBalance.selector, alice, 100 ether, 101 ether)
);
fpt.transfer(bob, 101 ether);
```

**Fuzz testing.** A test function with parameters is a **fuzz test**: Forge calls it with many values generated at random (256 runs by default) and reports the first counter-example that makes it fail [12]. `testFuzz_TransferPreservesSupply` checks a property, not an example: for any amount that Alice can afford, a transfer does not change the total supply.

```solidity
function testFuzz_TransferPreservesSupply(uint256 amount) public {
    amount = bound(amount, 0, 100 ether);
    vm.prank(alice);
    assertTrue(fpt.transfer(bob, amount));
    assertEq(fpt.balanceOf(alice) + fpt.balanceOf(bob), 100 ether);
    assertEq(fpt.totalSupply(), 100 ether);
}
```

Read `test/LoyaltyBadge.t.sol` and identify the two helper contracts `NotAReceiver` and `GoodReceiver`. Explain why `test_RevertWhen_SafeTransferToNonReceiverContract` reverts while `test_TransferFrom_ToNonReceiverContractSucceeds` succeeds, and what happens to the badge in the second case.

### Step 4: Deploying with a script on a local network

In Laboratory 2, each contract was deployed with a separate `forge create` command. A deployment that involves several contracts and configuration transactions is written instead as a **Solidity script** [13], `script/Deploy.s.sol`:

```solidity
function run() external returns (FidelityToken fpt, LoyaltyBadge badge, BadgeShop shop) {
    vm.startBroadcast();
    fpt = new FidelityToken(msg.sender, CAP);
    badge = new LoyaltyBadge(msg.sender);
    shop = new BadgeShop(fpt, badge, PRICE);
    badge.transferOwnership(address(shop));
    fpt.mint(msg.sender, 1_000 ether);
    vm.stopBroadcast();
}
```

`forge script` first executes `run` locally, and then sends each call made between `vm.startBroadcast()` and `vm.stopBroadcast()` as a separate signed transaction. Without `--broadcast`, it only simulates them.

Start `anvil` in a first terminal. In a second terminal, set the variables used in Laboratory 2 and run the script:

```bash
export ETH_RPC_URL=http://127.0.0.1:8545
ANVIL_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80   # anvil account 0
ADMIN=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266                               # anvil account 0
CLIENT=0x70997970C51812dc3A010C7d01b50e0d17dc79C8                              # anvil account 1
CLIENT_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

forge script script/Deploy.s.sol --rpc-url $ETH_RPC_URL --private-key $ANVIL_KEY --broadcast
```

The script prints the three addresses and records all the transactions in `broadcast/Deploy.s.sol/31337/run-latest.json`. Save the addresses:

```bash
FPT=<FidelityToken address>
BADGE=<LoyaltyBadge address>
SHOP=<BadgeShop address>
```

#### 4.1 Using the ERC-20 token

```bash
cast call $FPT "name()(string)"
cast call $FPT "decimals()(uint8)"
cast call $FPT "balanceOf(address)(uint256)" $ADMIN
cast send $FPT "transfer(address,uint256)" $CLIENT $(cast --to-wei 120) --private-key $ANVIL_KEY
cast call $FPT "balanceOf(address)(uint256)" $CLIENT
```

The balance of the client is displayed as `120000000000000000000`; check it with `cast --from-wei`.

#### 4.2 Redeeming a badge: the approve pattern

Ask the shop for a badge directly, from the client's account:

```bash
cast send $SHOP "redeem(string)" "ipfs://bafy-example/gold.json" --private-key $CLIENT_KEY
```

The transaction is rejected during gas estimation, and `cast` decodes the error as `ERC20InsufficientAllowance(<shop address>, 0, 50000000000000000000)`: the shop is not allowed to spend any of the client's tokens. Approve the shop and try again:

```bash
cast send $FPT "approve(address,uint256)" $SHOP $(cast --to-wei 50) --private-key $CLIENT_KEY
cast call $FPT "allowance(address,address)(uint256)" $CLIENT $SHOP
cast send $SHOP "redeem(string)" "ipfs://bafy-example/gold.json" --private-key $CLIENT_KEY
```

Check the result:

```bash
cast call $BADGE "ownerOf(uint256)(address)" 0
cast call $BADGE "tokenURI(uint256)(string)" 0
cast call $FPT "balanceOf(address)(uint256)" $CLIENT
cast call $FPT "totalSupply()(uint256)"
```

The client owns badge 0, holds 70 FPT, and the total supply has decreased by 50 FPT, because the points were burned.

#### 4.3 Events and storage

Every movement of tokens emitted a `Transfer` event. The first topic of a log is the Keccak-256 hash of the event signature, and the indexed parameters are the following topics:

```bash
cast sig-event "Transfer(address,address,uint256)"
cast logs --from-block 0 --address $BADGE "Transfer(address,address,uint256)"
```

In the log of the badge, the second topic is zero (`from = address(0)`, a mint), the third is the client, and the fourth is the `tokenId`. Compare it with a `Transfer` log of `$FPT`, in which the amount is in `data`, because it is not indexed in ERC-20.

Display the storage layout of the token, determined by OpenZeppelin's declarations:

```bash
forge inspect FidelityToken storageLayout
```

The balances are in the mapping `_balances`, in slot 0. As in Step 2.4 of Laboratory 2, read the balance of the client directly from storage:

```bash
cast --to-dec $(cast storage $FPT $(cast index address $CLIENT 0))
```

### Step 5: Deploying on Sepolia

Configure `.env` and `foundry.toml` as in Step 4.1 of Laboratory 2. The project already contains the aliases in `foundry.toml` and a template `.env.example`:

```bash
cp .env.example .env      # then fill in SEPOLIA_RPC_URL (and ETHERSCAN_API_KEY, optionally)
unset ETH_RPC_URL
cast chain-id --rpc-url sepolia
forge script script/Deploy.s.sol --rpc-url sepolia --account sepolia-dev --broadcast
```

The script sends five transactions; their hashes are in `broadcast/Deploy.s.sol/11155111/run-latest.json`. Open the address of `FidelityToken` on `sepolia.etherscan.io`: the explorer recognises the ERC-20 interface and shows the token page with its holders and transfers.

*Optional.* Adding `--verify` to the command above publishes the source code of all the contracts on Etherscan, using `ETHERSCAN_API_KEY`.

**Viewing the tokens in MetaMask.** MetaMask displays only the tokens it knows about. In MetaMask, on Sepolia, choose *Import tokens* and enter the address of `FidelityToken`: the symbol and the decimals are read from the contract, and the balance of 1,000 FPT appears. Send a few FPT to a colleague from MetaMask, and check the transaction with `cast`. NFTs are imported in the *NFTs* tab, with the address of `LoyaltyBadge` and the `tokenId`; the image is shown only if the metadata URI points to a real JSON document.


## Exercises

### Exercise 1: Fidelity points as an ERC-20 token

Rewrite the contract `FidelityPoints` of Laboratory 2 so that it uses `FidelityToken` for the points: `addPoints` mints tokens, `spendPoints` burns them, and `totalPoints` is replaced by `totalSupply()`. Which functions of the original contract are no longer needed? Which new risk appears now that the points can be transferred between clients?

### Exercise 2: A transfer fee

Override `_update` in a new contract `FeeToken` that inherits from `FidelityToken`, so that every transfer between two clients sends 1% of the amount to the owner. Minting and burning must not pay a fee (hint: `from` or `to` is `address(0)`). Write a fuzz test which checks that the total supply does not change after a transfer, and that the recipient receives exactly `amount - amount / 100`.


## References

1. OpenZeppelin, *OpenZeppelin Contracts documentation*. https://docs.openzeppelin.com/contracts/
2. Ethereum Improvement Proposals, *EIP-1: EIP purpose and guidelines*. https://eips.ethereum.org/EIPS/eip-1
3. F. Vogelsteller, V. Buterin, *ERC-20: Token Standard*. https://eips.ethereum.org/EIPS/eip-20
4. W. Entriken, D. Shirley, J. Evans, N. Sachs, *ERC-721: Non-Fungible Token Standard*. https://eips.ethereum.org/EIPS/eip-721
5. C. Reitwießner et al., *ERC-165: Standard Interface Detection*. https://eips.ethereum.org/EIPS/eip-165
6. Solidity documentation, *Inheritance: multiple inheritance and linearization*. https://docs.soliditylang.org/en/latest/contracts.html#multiple-inheritance-and-linearization
7. OpenZeppelin, *Access control*. https://docs.openzeppelin.com/contracts/access-control
8. E. García, F. Giordano, H. Croubois, *ERC-6093: Custom errors for commonly-used tokens*. https://eips.ethereum.org/EIPS/eip-6093
9. OpenZeppelin, *Contracts Wizard*. https://wizard.openzeppelin.com/
10. Foundry Book, *Dependencies*. https://getfoundry.sh/projects/dependencies
11. Foundry Book, *Cheatcodes reference*. https://getfoundry.sh/reference/cheatcodes/overview
12. Foundry Book, *Advanced testing: fuzz testing*. https://getfoundry.sh/forge/advanced-testing
13. Foundry Book, *Scripting*. https://getfoundry.sh/forge/scripting

Additional resources:

- OpenZeppelin, *ERC-20* and *ERC-721* guides: https://docs.openzeppelin.com/contracts/erc20, https://docs.openzeppelin.com/contracts/erc721
- M. Lundfall, *ERC-2612: Permit extension for EIP-20 signed approvals*. https://eips.ethereum.org/EIPS/eip-2612
- Source code of OpenZeppelin Contracts: https://github.com/OpenZeppelin/openzeppelin-contracts

> **Note on the preparation of this document.** Parts of this laboratory guide were drafted with the assistance of Claude (Anthropic), an AI assistant.
