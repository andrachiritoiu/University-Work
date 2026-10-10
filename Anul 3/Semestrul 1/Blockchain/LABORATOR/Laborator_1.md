# Ethereum addresses, Wallets and RPC providers

## Prerequisites

This lab uses [Foundry](https://getfoundry.sh/), a toolkit for Ethereum development. The instructions below are for **Linux**.

> **Windows users:** Foundry must be installed and run inside **WSL** (Windows Subsystem for Linux). To install WSL, open PowerShell as Administrator and run `wsl --install`. Restart the computer, then run all the commands below in the WSL (Ubuntu) terminal.

### Installing Foundry

1. Install `foundryup`, the Foundry installer:

   ```bash
   curl -L https://getfoundry.sh/install | bash
   ```

2. Reload your shell so that `foundryup` is on your `PATH`:

   ```bash
   source ~/.bashrc
   ```

3. Install the Foundry tools (`forge`, `cast`, `anvil`, `chisel`):

   ```bash
   foundryup
   ```

### Verifying the installation

Check that each tool is installed by printing its version:

```bash
forge --version
cast --version
anvil --version
chisel --version
```

Each command should print a version number. If you get `command not found`, open a new terminal or run `source ~/.bashrc`, then try again.


## Ethereum addresses

An Ethereum account (an *externally owned account*) is defined by a pair of cryptographic keys on the **secp256k1** elliptic curve [1]:

1. **Private key:** a randomly chosen 256-bit (32-byte) number. It must be kept secret, since anyone who knows it controls the account.
2. **Public key:** a point on the curve computed from the private key by elliptic-curve multiplication. It is 64 bytes long (the *x* and *y* coordinates). This step is one-way: the private key cannot be recovered from the public key.
3. **Address:** the last 20 bytes of the **Keccak-256** hash of the public key, written in hexadecimal with the `0x` prefix, for example `0x5e97870f263700f46aa00d967821199b9bc5a120` [1][2].
4. **Balance:** the amount of ether held by the account. The balance is not stored in the wallet or derived from the keys; it is part of the **blockchain state**, which records, for every address, its balance and its nonce (and, for smart contracts, their code and storage). A transaction is a request to change this state: when it is included in a block, the balances of the sender and the recipient are updated [1][6].

The derivation therefore follows the chain *private key → public key → address*, and each step is one-way. Addresses are often written in mixed case (e.g. `0x5E97870f...`). The pattern of upper- and lower-case letters is a checksum defined in EIP-55, which allows wallets to detect typing errors [3].

Smaller denominations of Ether easier to use in transactions since transactions usually involve less than 1 eth:
- 1 Ether = 10<sup>3</sup> Finney
- 1 Ether = 10<sup>9</sup> Gwei
- 1 Ether = 10<sup>18</sup> Wei

[Ethereum unit converter](https://info.etherscan.com/ethereum-unit-converter/)

## Ethereum networks

The same address can be used on several Ethereum networks, but each network has its own, independent state, so an account can hold funds on one network and none on another [8]:

1. **Network:** an independent blockchain with its own nodes, blocks and state. Examples are **Ethereum mainnet** (real ether, with real monetary value), public **testnets** such as **Sepolia** (test ether, without value), and **local networks** such as the one started by `anvil`, which run on a single computer.
2. **Chain ID:** a number that identifies the network, for example `1` for mainnet, `11155111` for Sepolia and `31337` for `anvil`. Since EIP-155, the chain ID is part of every signed transaction, so a transaction signed for one network is rejected by all others. This prevents *cross-chain replay*, where a transaction from a testnet is resubmitted on mainnet [9]. (The older *network ID* is used only between nodes at the peer-to-peer level; on most networks it has the same value as the chain ID.)
3. **Nonce:** a counter, stored in the state for each account, equal to the number of transactions the account has sent. Every transaction includes the sender's current nonce, and the network accepts it only if this value is the next one expected. A transaction that has already been executed therefore cannot be submitted a second time on the same network, which prevents *replay* within the network. The nonce also fixes the order in which an account's transactions are executed [6].
4. **RPC address:** the URL of a node through which applications read the state and submit transactions, using the **JSON-RPC** protocol over HTTP or WebSocket [10]. For a local `anvil` node, the address is `http://127.0.0.1:8545`. For public networks, it is either a node run by the user or a node offered by an **RPC provider** (e.g. Infura, Alchemy). The RPC node only relays requests: transactions are signed locally, with the private key, before being sent to it.



## Practical work

### Step 1: Creating an account

> **Security notice.** The pre-funded default accounts provided by `anvil` (the local Foundry node) are derived from a publicly known mnemonic, so their private keys are available to everyone. They must be used **exclusively** on local test networks. Any funds sent to these addresses on a public network (mainnet or a public testnet) are taken almost immediately by automated bots that monitor them.

For this laboratory, we will generate a new key pair and store it in an encrypted keystore [4]. Private keys must **not** be stored in plaintext, for example in a `.env` file, because such files are easily committed to a repository or otherwise exposed by mistake.

1. Generate a new random key pair:

   ```bash
   cast wallet new
   ```

   The command prints the address and the private key of the new account.

2. Import the private key into an encrypted keystore named `lab1`:

   ```bash
   cast wallet import lab1 --interactive
   ```

   You will be asked to paste the private key and then to choose a password that encrypts it. The keystore is saved in `~/.foundry/keystores/lab1`. After the import, clear the terminal (`clear`) so the private key no longer appears on screen.

3. Verify that the keystore was created and display its address:

   ```bash
   cast wallet list
   cast wallet address --account lab1
   ```

In the following steps, the account is referred to with `--account lab1`. Foundry asks for the keystore password whenever the key is needed to sign a transaction.

#### Alternative methods of generating keys

- **Mnemonic phrase:** `cast wallet new-mnemonic` generates a seed phrase (12 or 24 words) from which multiple accounts can be derived. This is the method used by most wallet applications. A mnemonic phrase (recovery phrase) is used to back up and restore a cryptocurrency wallet. The phrase is a human-readable representation of the wallet's private keys, allowing users to regain access to their funds if their device is lost, stolen, or damaged.
- **Programming libraries:** key pairs can also be generated in code, for example:
  - JavaScript, with [ethers.js](https://docs.ethers.org/v6/): `ethers.Wallet.createRandom()`
  - TypeScript/JavaScript, with [viem](https://viem.sh/): `privateKeyToAccount(generatePrivateKey())`
  - Python, with [eth-account](https://eth-account.readthedocs.io/): `Account.create()`
- **Wallet applications:** browser wallets such as MetaMask generate and store the keys for the user. Private keys should be kept on users’ device and never stored on server-side. In Metamask keys are stored in browser’s files and may be recovered with a [mnemonic phrase](
https://support.metamask.io/privacy-and-security/what-is-a-secret-recovery-phrase-and-how-to-keep-your-crypto-wallet-secure/).
- **Hardware wallets:** devices such as Ledger or Trezor generate the private key and keep it on the device, so it never reaches the computer. This is the recommended option for accounts that hold real funds.

### Step 2: Working with a local network

`anvil` is a local Ethereum node included in Foundry [5]. It simulates a blockchain on your own computer, so transactions can be sent without real funds and without waiting for a public network. This step requires **two terminals**: one in which `anvil` runs, and one for the `cast` commands.

#### 2.1 Starting the local node

In the first terminal, start the node:

```bash
anvil
```

Examine the output. It contains:

- **10 pre-funded accounts**, each holding 10,000 ETH, together with their private keys. They are derived from the public mnemonic `test test test test test test test test test test test junk` (see the security notice in Step 1).
- **Chain ID `31337`**, the identifier of the local network. The chain ID is included in every signed transaction, so a transaction signed for one network cannot be replayed on another.
- **The RPC address** `http://127.0.0.1:8545`, through which clients such as `cast` communicate with the node.

By default, `anvil` uses **instant mining** (*automine*): each transaction is included in a new block as soon as it is received.

In the second terminal, set the RPC address so that `cast` uses the local node, and check the chain ID:

```bash
export ETH_RPC_URL=http://127.0.0.1:8545
cast chain-id
cast block-number
```

#### 2.2 Querying account state

Set two variables: `ACC0`, the first account printed by `anvil`, and `LAB1`, the address of the account created in Step 1:

```bash
ACC0=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
LAB1=$(cast wallet address --account lab1)
```

Query the balance and the nonce of each account:

```bash
cast balance $ACC0 --ether
cast nonce $ACC0
cast balance $LAB1 --ether
cast nonce $LAB1
```

- The **balance** is the amount of ether held by the account. Without `--ether`, it is shown in wei (1 ether = 10<sup>18</sup> wei).
- The **nonce** is the number of transactions the account has sent. Each new transaction must use the next nonce, which fixes the order of the transactions and prevents the same transaction from being executed twice [6].

#### 2.3 Sending a transaction

The `lab1` account has no funds on the local network. First, transfer 1 ETH to it from the first `anvil` account. Its private key is public and is used here only because the network is local:

```bash
cast send $LAB1 --value 1ether \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Next, send 0.1 ETH from `lab1` to the second `anvil` account. The transaction is signed with the encrypted keystore, and `cast` asks for its password:

```bash
cast send 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --value 0.1ether --account lab1
```

`cast send` waits until the transaction is mined and prints its receipt. Copy the value of `transactionHash` from the output, then examine the transaction:

```bash
TX=<transactionHash>
cast tx $TX
cast receipt $TX
```

The two commands show different information [6][7]:

- `cast tx` shows the **transaction** as it was signed and sent: `from`, `to`, `value`, `nonce`, the gas limit and gas price fields, `input` (empty for a simple transfer) and the signature (`r`, `s`, `v`).
- `cast receipt` shows the **result of its execution**: `status` (`1` for success), `blockNumber`, `gasUsed` (21,000 for a simple ETH transfer) and `effectiveGasPrice`.

Repeat the queries from 2.2 and observe the changes: the nonce of `lab1` has increased by 1, and its balance has decreased by 0.1 ETH **plus the transaction fee** (`gasUsed × effectiveGasPrice`).

#### 2.4 Observing pending transactions

With instant mining, a transaction is mined as soon as it is sent, so its *pending* state cannot be observed. To simulate the behaviour of a real network, stop `anvil` (`Ctrl+C`) and start it again with a block produced every 12 seconds, the block interval of Ethereum mainnet:

```bash
anvil --block-time 12
```

> **Note.** `anvil` keeps its state only in memory. After a restart, all previous transactions are lost and the `lab1` account must be funded again (repeat the first command in 2.3).

In the second terminal, send a transaction with `--async`, which prints the transaction hash and exits without waiting for the transaction to be mined:

```bash
TX=$(cast send 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --value 0.1ether  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --async)
cast tx $TX
cast tx $TX --raw
cast decode-transaction <transaction>
```

If `cast tx` is run before the next block is produced, the transaction is still **pending**: the node has received it, but it is not yet part of a block, so it has no `blockNumber`. Now run:

```bash
cast receipt $TX
```

The command waits until the transaction is included in a block and then prints the receipt. The same applies to public networks: a transaction is only final after it has been included in a block, and until then it can still be delayed or replaced.

## Exercises

### Exercise 1: Signer and publisher (team exercise)

*Teams of two or three students.*

In Step 2, a single command (`cast send`) signed a transaction **and** sent it to the node. In this exercise, the two operations are separated and performed by different people:

- the **signer** holds the private key and creates signed transactions, but has **no access** to any network;
- the **publisher** runs the network, but has **no access** to the signer's key.

The two roles may exchange only **addresses** and **raw signed transactions** (hexadecimal strings), for example through a chat message. By observing how the network reacts to the transactions it receives, the team investigates the role of the **chain ID** and of the **nonce** described in the section *Ethereum networks*.

#### Roles and rules

| Role | Team of two | Team of three | Allowed commands |
|---|---|---|---|
| **Signer** | 1 student | 1 student | `cast wallet`, `cast mktx`. **No** `--rpc-url`, no running node. |
| **Publisher** | 1 student | 2 students (Publisher 1 and Publisher 2), working on the **same computer**, in separate terminals | `anvil`, `cast publish`, `cast tx`, `cast receipt`, `cast rpc`, `cast nonce`, `cast balance`, `cast decode-transaction` |

Rules:

1. The private key never leaves the signer's computer. Only addresses and raw transactions are exchanged.
2. Everything the signer needs to know about a network (chain ID, nonce, balance) must be **asked** from the publisher.
3. Every transaction uses the fixed values `--legacy --gas-limit 21000 --gas-price 2gwei`, except in the variant with a tip in Round 1. Gas and fees are studied in a separate laboratory; for now, these values should simply be copied.
4. Before each experiment, every team member writes down a **prediction** in the report. The observed result is recorded afterwards.
5. Halfway through the exercise (see Round 3), the roles are swapped, so each student acts both as signer and as publisher.

The observations are recorded in the report, using the template in [`REPORT_TEMPLATE.md`](REPORT_TEMPLATE.md).

#### Round 0: Preparing the networks and funding the signer

**Publisher.** Start two independent local networks, each in its own terminal. The option `--no-mining` disables automatic mining, so blocks are produced only when the publisher requests them:

```bash
# Terminal 1: Network 1 (chain ID 31337, port 8545)
anvil --no-mining

# Terminal 2: Network 2 (chain ID 1337, port 8546)
anvil --no-mining --port 8546 --chain-id 1337
```

In a third terminal, define the variables used in the following rounds:

```bash
export ETH_RPC_URL=http://127.0.0.1:8545     # Network 1 is used by default
NET2=http://127.0.0.1:8546                    # Network 2 is used with --rpc-url $NET2
ANVIL_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80   # anvil account 0 (public key, local use only)
```

**Signer.** Make sure that no network is configured, then send your address to the publisher:

```bash
unset ETH_RPC_URL
cast wallet address --account lab1
```

**Publisher.** Fund the signer's address with 1 ETH on **both** networks, mine one block on each, and check the balances:

```bash
SIGNER=<address received from the signer>

cast send $SIGNER --value 1ether --private-key $ANVIL_KEY --async
cast send $SIGNER --value 1ether --private-key $ANVIL_KEY --async --rpc-url $NET2

cast rpc evm_mine
cast rpc evm_mine --rpc-url $NET2

cast balance $SIGNER --ether
cast balance $SIGNER --ether --rpc-url $NET2
```

**Signer.** To sign a transaction, you need two values that only the publisher can provide. Ask the publisher for the **chain ID** and for your **current nonce** on Network 1. The publisher answers with:

```bash
cast chain-id
cast nonce $SIGNER
```

> **Report:** Explain why the signer needs each of these two values in order to sign a transaction.

#### Round 1: The lifecycle of a transaction

**Signer.** Sign a transfer of 0.01 ETH to anvil account 1, using the nonce received in Round 0. The command prints the raw signed transaction (a long hexadecimal string beginning with `0x`). Send it to the publisher:

```bash
cast mktx 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --value 0.01ether \
  --nonce <nonce> --chain 31337 \
  --legacy --gas-limit 21000 --gas-price 2gwei \
  --account lab1
```

**Variant with a tip.** Instead of a legacy transaction, the signer may sign an **EIP-1559** transaction, which specifies two values: the **maximum fee per gas** the sender accepts to pay (`--gas-price`), and a **priority fee**, or *tip* (`--priority-gas-price`), paid to the block producer as an incentive to include the transaction [11]. By default, `anvil` orders the pending transactions of different senders by the fee they offer, so a higher tip moves a transaction towards the beginning of the block:

```bash
cast mktx 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --value 0.01ether \
  --nonce <nonce> --chain 31337 \
  --gas-limit 21000 --gas-price 10gwei --priority-gas-price 1gwei \
  --account lab1
```

To observe the effect of the tip, the publisher sends, **before mining**, a competing transaction from anvil account 0 with a different tip (here, a higher one), in addition to publishing the signer's transaction as described below:

```bash
TX0=$(cast send 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC --value 0.01ether \
  --gas-price 10gwei --priority-gas-price 3gwei \
  --private-key $ANVIL_KEY --async)
```

After `cast rpc evm_mine`, compare the position of the two transactions in the block:

```bash
cast receipt $TX1 transactionIndex
cast receipt $TX0 transactionIndex
```

Repeat the experiment with the tips reversed. Note that the tip orders transactions only between **different senders**: the transactions of the same sender are always included in the order of their nonces, whatever their tips.

**Publisher.** Save the raw transaction (it is needed again in Rounds 2 and 4), publish it and record its hash:

```bash
RAW1=<raw transaction received from the signer>
TX1=$(cast publish $RAW1 --async)
echo $TX1
```

Since mining is disabled, the transaction is not yet included in a block. Run the following three checks, in this order, and record the output of each:

```bash
cast tx $TX1                  # Does the node know the transaction? Does it have a block number?
cast receipt $TX1 --async     # Is there a receipt?
cast rpc txpool_inspect       # Is the transaction in the transaction pool (mempool)?
```

Then mine a block and run the three checks again:

```bash
cast rpc evm_mine
```

> **Report:** List the states the transaction went through, and for each state, the command that showed it.

#### Round 2: Publishing the same transaction twice

**Publisher.** Without involving the signer, publish the transaction from Round 1 a second time:

```bash
cast publish $RAW1 --async
```

> **Report:** Before running the command, predict whether anvil account 1 will receive the 0.01 ETH a second time. Then record the result and the field of the transaction that explains it.

#### Round 3: The mystery pair

This round is played **at least four times**: twice with the initial roles and twice after the roles are swapped. In each repetition, the signer **secretly** chooses one of the scenarios below and signs **two** transactions, TX-A and TX-B. The publisher does not know which scenario was chosen and must identify it only from the behaviour of the networks.

| Scenario | TX-A | TX-B |
|---|---|---|
| **S1. Consecutive nonces** | nonce *n*, chain 31337 | nonce *n*+1, chain 31337 |
| **S2. Reversed order** | nonce *n*+1, chain 31337 | nonce *n*, chain 31337 |
| **S3. Same nonce** | nonce *n*, chain 31337, recipient anvil account 1 | nonce *n*, chain 31337, recipient anvil account 2 |
| **S4. Different chains** | nonce *n*, chain 31337 | nonce *m*, chain 1337 |

Here *n* is the signer's current nonce on Network 1 and *m* the current nonce on Network 2. Anvil account 1 is `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`, and anvil account 2 is `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`.

**Signer.**

1. Ask the publisher for your current nonce on **both** networks (without revealing the scenario).
2. Choose a scenario and write it down in the report, hidden from the publisher. Use each scenario at least once over the whole exercise.
3. Sign TX-A and TX-B with `cast mktx`, as in Round 1, changing only `--nonce`, `--chain` and the recipient according to the scenario. Each transaction transfers 0.01 ETH.
4. Send both raw transactions to the publisher, labelled TX-A and TX-B.

**Publisher.** Investigate the two transactions. A team of two follows the steps below. In a team of three, Publisher 1 receives TX-A and Publisher 2 receives TX-B, and they publish them **at the same time** (after a countdown), each from their own terminal (with the variables from Round 0 defined), both to Network 1.

1. Record the signer's nonce and balance on both networks:

   ```bash
   cast nonce $SIGNER;  cast nonce $SIGNER --rpc-url $NET2
   cast balance $SIGNER --ether;  cast balance $SIGNER --ether --rpc-url $NET2
   ```

2. Publish TX-A, then TX-B, **to Network 1**. Record the hash or the error message returned for each:

   ```bash
   TXA=$(cast publish <TX-A> --async)
   TXB=$(cast publish <TX-B> --async)
   ```

3. Inspect the transaction pool. Note in which section (`pending` or `queued`) each transaction appears:

   ```bash
   cast rpc txpool_inspect
   ```

4. Mine **one** block, then check the receipts, the transaction pool and the signer's nonce again:

   ```bash
   cast rpc evm_mine
   cast receipt $TXA --async
   cast receipt $TXB --async
   cast rpc txpool_inspect
   cast nonce $SIGNER
   ```

5. If a transaction was rejected or is still not included, decide what to try next: mine another block, or publish it to Network 2 (`cast publish <TX> --async --rpc-url $NET2`, followed by `cast rpc evm_mine --rpc-url $NET2`).

6. Write down a **diagnosis** (which scenario you believe was chosen) and the **evidence** that supports it. Only then may the signer reveal the scenario.

7. Verify the diagnosis by decoding both raw transactions and comparing their `nonce` and `chainId` fields:

   ```bash
   cast decode-transaction <TX-A>
   cast decode-transaction <TX-B>
   ```

> **Note.** In scenario S3, the error message returned by the node may refer to fees or to the gas price. Record the message exactly as it appears. It will be explained in the laboratory on gas and fees.

**Swapping roles.** After the second repetition, swap roles. The new publisher starts their own networks and funds the new signer (repeat Round 0), and the new signer sends one transaction as in Round 1, so that the new publisher has a `RAW1` for Round 4. Then Round 3 continues.

> **Report:** For each repetition, fill in one row of the Round 3 table. At the end, answer: why can at most one of two transactions with the same nonce be included? Which scenarios are indistinguishable before a block is mined, and which single command distinguishes them?

#### Round 4: Two networks with the same chain ID

In Round 3, transactions signed for one network were rejected by the other. This round tests what protects against that.

**Publisher.**

1. Stop Network 2 (`Ctrl+C`) and start it again with the **same** chain ID as Network 1:

   ```bash
   anvil --no-mining --port 8546 --chain-id 31337
   ```

2. Fund the signer on the new Network 2 and mine a block (as in Round 0).

3. Publish the transaction from Round 1, which was signed for Network 1, to Network 2, and mine a block:

   ```bash
   cast publish $RAW1 --async --rpc-url $NET2
   cast rpc evm_mine --rpc-url $NET2
   ```

> **Report:** Predict the result before running the commands, then record what happened. Explain why the chain ID protects against replay only if every network uses a different value. As further research, find out how this problem affected Ethereum and Ethereum Classic after the 2016 split.

## References

1. Ethereum Foundation, *Ethereum accounts*, ethereum.org. https://ethereum.org/en/developers/docs/accounts/
2. G. Wood, *Ethereum: A Secure Decentralised Generalised Transaction Ledger* (Yellow Paper), Appendix F. https://ethereum.github.io/yellowpaper/paper.pdf
3. V. Buterin, A. Van de Sande, *EIP-55: Mixed-case checksum address encoding*. https://eips.ethereum.org/EIPS/eip-55
4. Foundry Book, *cast wallet*. https://getfoundry.sh/cast/reference/wallet
5. Foundry Book, *Anvil overview*. https://getfoundry.sh/anvil/overview
6. Ethereum Foundation, *Transactions*, ethereum.org. https://ethereum.org/en/developers/docs/transactions/
7. Foundry Book, *cast send*. https://getfoundry.sh/cast/reference/send
8. Ethereum Foundation, *Networks*, ethereum.org. https://ethereum.org/en/developers/docs/networks/
9. V. Buterin, *EIP-155: Simple replay attack protection*. https://eips.ethereum.org/EIPS/eip-155
10. Ethereum Foundation, *JSON-RPC API*, ethereum.org. https://ethereum.org/en/developers/docs/apis/json-rpc/
11. Ethereum Foundation, *Gas and fees*, ethereum.org. https://ethereum.org/en/developers/docs/gas/

> **Note on the preparation of this document.** Parts of this laboratory guide and of the report template (`REPORT_TEMPLATE.md`) were drafted with the assistance of Claude (Anthropic), an AI assistant, used through Claude Code.




