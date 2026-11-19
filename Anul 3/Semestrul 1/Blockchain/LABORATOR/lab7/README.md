# Shop dApp: reading state, sending transactions and subscribing to events

A single page web application for the `FidelityPoints` contract of Laboratories 3 and 4, made of a Foundry project (`contracts/`) and a React application (Vite, ethers.js v6, in the root directory), which:

- displays the number of points of the account connected through MetaMask;
- refreshes the number automatically when the administrator grants new points, by **subscribing to an event** of the contract;
- if the connected account is the administrator, also displays a field for a customer address and a button **Add 100 points**.

Only `FidelityPoints` is used; `Catalog` is not needed by this page.

## Background

### From a contract to a web page

A web page interacts with a contract through a **provider**, an object that sends JSON-RPC requests to a node [1]. In the browser the provider is MetaMask, which injects the object `window.ethereum` into the page. ethers.js wraps it:

```js
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();          // the account selected in MetaMask
const contract = new ethers.Contract(address, abi, provider);
```

To build a `Contract` object, ethers needs two things: the **address** of the deployed contract and its **ABI** (Application Binary Interface), the JSON description of its functions, events and errors. Both are produced by the deployment script and copied to `src/contracts/` (see *Project structure*). From the ABI, ethers generates one JavaScript method per function of the contract.

There are two kinds of interaction, which differ in who pays and how long they take:

| | Read (`view` function) | Transaction |
|---|---|---|
| Example | `contract.points(account)` | `contract.connect(signer).addPoints(client, 100)` |
| JSON-RPC method | `eth_call` | `eth_sendRawTransaction` (signed by MetaMask) |
| Runner of the contract | provider | **signer** |
| Changes the state | no | yes |
| Cost | free | gas, paid by the sender |
| Result | the returned value, immediately | a transaction; the result is known only after it is **mined** (`await tx.wait()`) |

A public state variable such as `mapping(address => uint) public points` has an automatically generated getter, so the page reads the balance with `contract.points(account)`, exactly like `cast call $FP "points(address)(uint256)" $CLIENT`.

### Adding the events

The contract of this project is `FidelityPointsFinal.sol` from Laboratory 3, extended with the events of Laboratory 4. Every function that changes the state emits an event, so a web page can find out when a balance or the point value changes, without reading `points(account)` again and again:

```solidity
event PointsAdded(address indexed client, uint amount);
event PointsSpent(address indexed client, uint amount);
event PointValueChanged(uint oldValue, uint newValue);

function addPoints(address client, uint _points) public onlyAdmin {
    points[client] += _points;
    updateTotalPoints(_points, true);
    emit PointsAdded(client, _points);
}
```

Recall from Laboratory 4 that the log of `PointsAdded` has two topics: the hash of the signature `PointsAdded(address,uint256)` and, because `client` is `indexed`, the address of the client, padded to 32 bytes. The amount is in the data field. The application uses the second topic to receive **only the events of the connected account**. `PointsSpent` is also used, so that the balance stays correct when a client spends points.

### Subscribing to events

ethers creates a filter from the ABI. Arguments given to `filters.PointsAdded(...)` constrain the indexed parameters, in order:

```js
const filter = contract.filters.PointsAdded(account);   // topics: [hash of the signature, account]
contract.on(filter, (payload) => {
    console.log("new points in block", payload.log.blockNumber);
});
// later: contract.off(filter, listener)
```

How does a page "receive" an event? A node does not push data to an HTTP client, so the provider **polls**: every few seconds (4 s by default for `BrowserProvider`), it asks the node for the new logs that match the filter, since the last block it has seen [2]. The filtering by topic is done by the node, not by the page. Consequences:

- the update appears a few seconds after the transaction is mined, not instantly;
- events emitted **before** the subscription are not delivered; the past ones can be retrieved with `contract.queryFilter(filter, fromBlock)`, the equivalent of `cast logs`;
- the listener must be removed with `off` when the page no longer needs it, otherwise the polling continues.

When an event arrives, the application does not add `amount` to the value on the screen: it reads `points(account)` again, **at the block of the event** (`{blockTag: blockNumber}`). The state of the contract stays the single source of truth, and a duplicated or late event cannot produce a wrong total.

### The administrator role in the interface

The page reads `admin()` and compares it with the connected account to decide whether to show the form. This check exists only for convenience. Anyone can call `addPoints` directly, for example with `cast send`, so the protection is the `onlyAdmin` modifier of the contract. When a call reverts with `NotAdmin(address)`, the error data begins with the selector of the error, and the page decodes it with `interface.parseError(data)` to display a readable message.

## Project structure

```
shop-dapp/
├── contracts/                          Foundry project
│   ├── src/FidelityPoints.sol          contract with events
│   ├── script/DeployFidelityPoints.s.sol
│   └── test/FidelityPoints.t.sol
├── src/
│   ├── contracts/                      written by the deployment script
│   │   ├── addresses.json              address, admin, chain ID
│   │   └── FidelityPoints.json         compiler output, contains the ABI
│   ├── utils/EthersUtils.js            all the calls to ethers.js
│   ├── utils/Context.jsx, WalletContext.js   the signer, shared by the components
│   ├── components/Points.jsx           the page: connect button, balance, subscription
│   ├── components/AdminPanel.jsx       form "Add 100 points"
│   ├── routes/                         a single route, "/"
│   └── styles/
└── index.html, package.json, vite.config.js
```

The components never call ethers.js directly: every interaction with the contract is a function of `EthersUtils.js` (`getPoints`, `getAdmin`, `addPoints`, `subscribeToPointsChanges`).

## Prerequisites

- [Foundry](https://getfoundry.sh/) (`foundryup`). Windows users run Foundry inside **WSL**.
- [Node.js](https://nodejs.org/) 20.19 or later.
- The [MetaMask](https://metamask.io/download/) browser extension.

## Steps

### Step 1: Build and test the contract

```bash
cd contracts
forge build
forge test
```

The tests check, with `vm.expectEmit`, that each function emits its event. If `lib/forge-std` is missing, install it first with `forge install foundry-rs/forge-std --no-git`.

### Step 2: Start a local network

In a separate terminal:

```bash
anvil
```

Keep it running. `anvil` prints 10 accounts with their private keys, each funded with 10,000 ETH. These keys are public: use them only on the local network.

### Step 3: Deploy the contract

In `contracts/`:

```bash
forge script script/DeployFidelityPoints.s.sol --rpc-url  http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

The script deploys `FidelityPoints` from anvil account 0, which becomes the administrator, with a point value of 10 (change it with `POINT_VALUE=20 forge script ...`). It then writes the address and the ABI to `src/contracts/`, where the web application reads them.

### Step 4: Configure MetaMask

1. Add a network manually: name `Anvil`, RPC URL `http://127.0.0.1:8545`, chain ID `31337`, currency `ETH`. (The application also offers to add it when you connect.)
2. Import anvil account 0 (the administrator) and anvil account 1 (a client):

   | Account | Address | Private key |
   |---|---|---|
   | 0, admin | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
   | 1, client | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |

### Step 5: Run the web application

In the root directory (`shop-dapp/`):

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and connect with MetaMask.

### Step 6: Observe the event subscription

1. Connect with the **client** account. The balance is 0 and there is no form.
2. Open a second browser window (or a second browser profile with MetaMask), connect with the **admin** account, enter the address of the client and press **Add 100 points**. Confirm the transaction in MetaMask.
3. Within a few seconds, the balance in the client's window becomes 100, without reloading the page.
4. Grant points from the terminal instead of the page. The client's window is updated in the same way, since it reacts to the event, not to the button:

   ```bash
   cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "addPoints(address,uint256)" \
     0x70997970C51812dc3A010C7d01b50e0d17dc79C8 50 \
     --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://127.0.0.1:8545
   ```

5. Grant points to a third address. The client's balance does not change and no request for its balance is made, because the node filters the logs by the second topic.
6. Try to call `addPoints` with the client's key in `cast send`. The transaction reverts with `NotAdmin`; the form being hidden is not what protects the contract.

When you select another account in MetaMask, the page switches to it; when you change the network, you are asked to connect again.

## After restarting anvil

`anvil` keeps its state only in memory. After a restart:

1. Run the deployment script again (Step 3).
2. In MetaMask, clear the activity and nonce data of the imported accounts (*Settings → Advanced → Clear activity tab data*). Otherwise transactions fail with *nonce too high*.

## Exercises

1. Display, below the number of points, their value in the unit of the catalog prices, with `getTotalValue(account)`. Make it refresh also when the administrator calls `setPointValue`, using the event `PointValueChanged`.
2. Add a history of the points received by the connected account: when the page loads, retrieve the past `PointsAdded` events with `contract.queryFilter(filter, fromBlock)` (use `fromBlock` from `addresses.json`), then append the new ones from the subscription.
3. Add a field and a button that let the client call `spendPoints`. Verify that the balance is updated by the `PointsSpent` event. What happens if the client tries to spend more points than they have?
4. Remove the call to `contract.off` in `subscribeToPointsChanges` and switch accounts several times in MetaMask. Observe the requests in the *Network* tab of the developer tools and explain the result.

## References

1. ethers.js v6 documentation, *Getting Started*. https://docs.ethers.org/v6/getting-started/
2. ethers.js v6 documentation, *Contract events*. https://docs.ethers.org/v6/api/contract/#ContractEvent
3. Ethereum JSON-RPC API, `eth_getLogs`. https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs
4. Solidity documentation, *Events*. https://docs.soliditylang.org/en/latest/contracts.html#events
5. MetaMask documentation, *Ethereum provider API*. https://docs.metamask.io/wallet/reference/provider-api/
