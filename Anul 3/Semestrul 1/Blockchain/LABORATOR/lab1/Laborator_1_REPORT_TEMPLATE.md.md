# Laboratory 1 – Report: Signer and publisher

## Team

| Name | Role in the first half | Role in the second half | Address (`lab1` account) |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

Date:

---

## Round 0: Preparing the networks and funding the signer

| | Network 1 | Network 2 |
|---|---|---|
| RPC address |  |  |
| Chain ID |  |  |
| Signer's balance after funding |  |  |
| Signer's nonce after funding |  |  |

**Why does the signer need the chain ID to sign a transaction?**

> 

**Why does the signer need the current nonce to sign a transaction?**

> 

---

## Round 1: The lifecycle of a transaction

Transaction hash (`TX1`):

| Check | Before `evm_mine` | After `evm_mine` |
|---|---|---|
| `cast tx $TX1` (block number) |  |  |
| `cast receipt $TX1 --async` |  |  |
| `cast rpc txpool_inspect` |  |  |

**States observed, in order, and the command that showed each state:**

1. 
2. 
3. 

---

## Round 2: Publishing the same transaction twice

**Prediction:** will anvil account 1 receive the 0.01 ETH a second time? Why?

> 

**Result** (output or error message of `cast publish`):

```
```

**Explanation** (which field of the transaction prevents the replay?):

> 

---

## Round 3: The mystery pair

### Signer's sheet

*Filled in by the signer **before** sending the transactions. Do not show it to the publisher until the publisher has written a diagnosis.*

| Repetition | Signer | Scenario chosen (S1–S4) | Nonce(s) and chain ID(s) used |
|---|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |
| 4 |  |  |  |

### Publisher's observations

*One block per repetition, filled in by the publisher(s).*

#### Repetition 1

| Observation | TX-A | TX-B |
|---|---|---|
| Result of `cast publish` to Network 1 (hash or error) |  |  |
| Section in `txpool_inspect` before mining (pending / queued / absent) |  |  |
| Receipt after one `evm_mine` (status, block number, or none) |  |  |
| Further actions (more blocks, Network 2) and their result |  |  |

Signer's nonce on Network 1: before ____ , after ____

**Diagnosis** (scenario): ____

**Evidence:**

> 

**Revealed scenario:** ____ **Correct?** yes / no

**Confirmation with `cast decode-transaction`** (`nonce` and `chainId` of TX-A and TX-B):

> 

#### Repetition 2

| Observation | TX-A | TX-B |
|---|---|---|
| Result of `cast publish` to Network 1 (hash or error) |  |  |
| Section in `txpool_inspect` before mining (pending / queued / absent) |  |  |
| Receipt after one `evm_mine` (status, block number, or none) |  |  |
| Further actions (more blocks, Network 2) and their result |  |  |

Signer's nonce on Network 1: before ____ , after ____

**Diagnosis** (scenario): ____

**Evidence:**

> 

**Revealed scenario:** ____ **Correct?** yes / no

**Confirmation with `cast decode-transaction`:**

> 

#### Repetition 3

| Observation | TX-A | TX-B |
|---|---|---|
| Result of `cast publish` to Network 1 (hash or error) |  |  |
| Section in `txpool_inspect` before mining (pending / queued / absent) |  |  |
| Receipt after one `evm_mine` (status, block number, or none) |  |  |
| Further actions (more blocks, Network 2) and their result |  |  |

Signer's nonce on Network 1: before ____ , after ____

**Diagnosis** (scenario): ____

**Evidence:**

> 

**Revealed scenario:** ____ **Correct?** yes / no

**Confirmation with `cast decode-transaction`:**

> 

#### Repetition 4

| Observation | TX-A | TX-B |
|---|---|---|
| Result of `cast publish` to Network 1 (hash or error) |  |  |
| Section in `txpool_inspect` before mining (pending / queued / absent) |  |  |
| Receipt after one `evm_mine` (status, block number, or none) |  |  |
| Further actions (more blocks, Network 2) and their result |  |  |

Signer's nonce on Network 1: before ____ , after ____

**Diagnosis** (scenario): ____

**Evidence:**

> 

**Revealed scenario:** ____ **Correct?** yes / no

**Confirmation with `cast decode-transaction`:**

> 

### Error messages

Copy exactly every error message returned by the node in Round 3 (messages referring to fees or gas price are explained in the laboratory on gas and fees):

```
```

### Questions

**Why can at most one of two transactions with the same nonce be included in the blockchain?**

> 

**Which scenarios cannot be told apart before a block is mined, and which command distinguishes them?**

> 

**In scenario S2, why does the node keep TX-A but not include it in a block?**

> 

---

## Round 4: Two networks with the same chain ID

**Prediction:** will the Round 1 transaction be accepted on the new Network 2? Why?

> 

**Result** (output of `cast publish` and receipt after mining):

```
```

**Explanation:** why does the chain ID protect against replay only if every network uses a different value?

> 

**Further research:** what happened to Ethereum and Ethereum Classic after the 2016 split, with respect to transaction replay? (Include at least one source.)

> 

---

## Summary

| Round | Prediction | What happened | Command or output that showed it | Explanation (1–2 sentences) |
|---|---|---|---|---|
| 0 |  |  |  |  |
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |
| 4 |  |  |  |  |

## Sources

1. 
