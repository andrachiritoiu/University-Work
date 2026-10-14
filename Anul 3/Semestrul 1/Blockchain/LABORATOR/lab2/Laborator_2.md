# Smart contracts in Solidity: a fidelity points platform

## Prerequisites

This laboratory uses [Foundry](https://getfoundry.sh/) for compiling, testing and deploying smart contracts, [MetaMask](https://metamask.io/) as a wallet, and [Infura](https://developer.metamask.io/) as an RPC provider for the Sepolia test network. The instructions below are for **Linux**; Windows users must work inside **WSL**, as described in Laboratory 1.

### Foundry

Foundry must be installed and working, as described in the *Prerequisites* section of Laboratory 1. Update it to the latest version and check that the tools respond:

```bash
foundryup
forge --version
cast --version
anvil --version
```

`forge init` (Step 1) creates a Git repository and downloads the testing library `forge-std` with Git, so **Git** must also be installed (`git --version`).

### MetaMask

MetaMask is a browser wallet: it generates and stores private keys on the user's device, signs transactions and sends them to a network through an RPC provider [1].

1. Install the MetaMask extension **only** from the official site, [metamask.io/download](https://metamask.io/download/). Fake wallet extensions that steal keys are common in browser extension stores.
2. Create a new wallet and choose a password. The password encrypts the keys on the local device only; it cannot be used to recover the wallet on another device.
3. Write down the **Secret Recovery Phrase** on paper and keep it offline. Anyone who knows the phrase controls every account derived from it. It must never be typed into a website, sent in a message or stored in a file in a repository.
4. Enable the test networks (*Settings → Advanced → Show test networks*, or the network selector, depending on the version of MetaMask) and select **Sepolia**.

> **Security notice.** The wallet used for this course must be a **dedicated development wallet**, used only on test networks. It must never hold ether with real value. In the next step its private key is copied into Foundry, which is acceptable only because the account holds test funds exclusively.

5. Import the private key of the MetaMask account into an encrypted Foundry keystore, so that the same account can be used from the command line. In MetaMask, open the account details and reveal the private key of the account (the menu location differs between versions; MetaMask asks for the wallet password). Then run:

   ```bash
   cast wallet import sepolia-dev --interactive
   cast wallet address --account sepolia-dev
   clear
   ```

   The address printed by `cast` must be identical to the one shown in MetaMask. Close the MetaMask window that displays the private key.

### Infura

Infura provides RPC nodes for Ethereum mainnet and test networks. It is operated by Consensys and is accessed through the **MetaMask Developer** dashboard [2].

1. Create an account at [developer.metamask.io](https://developer.metamask.io/). An API key is created automatically after registration.
2. In the settings of the API key, check that **Ethereum Sepolia** is among the enabled networks.
3. Copy the Sepolia endpoint. It has the form:

   ```
   https://sepolia.infura.io/v3/<API_KEY>
   ```

The API key identifies the account to the provider and counts the requests against the free quota. It is not as sensitive as a private key, because it cannot sign transactions, but it must not be published either: it is stored in a `.env` file that is excluded from Git (Step 4).

### Remix IDE
The contracts can also be compiled, deployed and called from the browser, in [Remix IDE](https://remix.ethereum.org/). In the *Deploy & run transactions* tab, the environment *Remix VM* runs a local network inside the browser, and the environment *Injected Provider – MetaMask* deploys through MetaMask on the network selected in the wallet (Sepolia). Remix is convenient for quick experiments; Foundry is used in this course because it allows automated tests and reproducible deployments.

### Sepolia test ether

Deploying a contract on Sepolia requires test ether to pay the transaction fees; approximately 0.05 SepoliaETH is sufficient for this laboratory. Test ether is distributed free of charge by **faucets**, for example:

- the MetaMask Developer faucet, [developer.metamask.io/faucet](https://developer.metamask.io/faucet), which requires a MetaMask Developer account [3];
- the Google Cloud Web3 faucet, [cloud.google.com/application/web3/faucet/ethereum/sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia), which requires a Google account;
- the proof-of-work faucet [sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de/), which requires running a mining script in the browser for some time.

Faucets limit the amount that can be requested per day, and some of them require the address to have activity or a minimum balance on Ethereum **mainnet**. Since these conditions change frequently, the instructor will indicate the faucet to be used, or distribute test ether, if none of the above is available. Check the balance with:

```bash
cast balance $(cast wallet address --account sepolia-dev) --ether \
  --rpc-url https://sepolia.infura.io/v3/<API_KEY>
```