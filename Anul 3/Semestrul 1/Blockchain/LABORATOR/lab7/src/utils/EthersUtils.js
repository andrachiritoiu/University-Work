import deployedAddresses from "../contracts/addresses.json";
import FidelityPointsArtifact from "../contracts/FidelityPoints.json";
import {ethers} from 'ethers';

const FIDELITY_POINTS_ADDRESS = deployedAddresses.fidelityPoints;
const FIDELITY_POINTS_ABI = FidelityPointsArtifact.abi;
const EXPECTED_CHAIN_ID = BigInt(deployedAddresses.chainId);

const KNOWN_NETWORKS = {
    31337: {
        chainId: '0x7a69',
        chainName: 'Anvil',
        rpcUrls: ['http://127.0.0.1:8545'],
        nativeCurrency: {name: 'Ether', symbol: 'ETH', decimals: 18}
    }
};

const fidelityInterface = new ethers.Interface(FIDELITY_POINTS_ABI);

let browserProvider = null;

const getProvider = () => {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to use this application.");
    }
    if (!browserProvider) {
        browserProvider = new ethers.BrowserProvider(window.ethereum);
    }
    return browserProvider;
};

// Without a signer, the contract can only be read (view functions, events).
// With a signer, it can also send transactions.
const getContract = (runner = getProvider()) =>
    new ethers.Contract(FIDELITY_POINTS_ADDRESS, FIDELITY_POINTS_ABI, runner);

// ---------------------------------------------------------------------------
// Wallet and network
// ---------------------------------------------------------------------------

const ensureCorrectNetwork = async () => {
    const currentChainId = BigInt(await window.ethereum.request({method: 'eth_chainId'}));
    if (currentChainId === EXPECTED_CHAIN_ID) {
        return;
    }

    const chainIdHex = ethers.toQuantity(EXPECTED_CHAIN_ID);
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: chainIdHex}]
        });
    } catch (error) {
        const code = error?.code ?? error?.data?.originalError?.code;
        const network = KNOWN_NETWORKS[Number(EXPECTED_CHAIN_ID)];
        if (code === 4902 && network) {
            await window.ethereum.request({method: 'wallet_addEthereumChain', params: [network]});
        } else if (code === 4001) {
            throw new Error(`Please switch MetaMask to the network with chain ID ${EXPECTED_CHAIN_ID}.`);
        } else {
            throw error;
        }
    }
    browserProvider = null;
};

const assertContractDeployed = async () => {
    const code = await getProvider().getCode(FIDELITY_POINTS_ADDRESS);
    if (code === '0x') {
        throw new Error(
            `No FidelityPoints contract found at ${FIDELITY_POINTS_ADDRESS} on chain ${EXPECTED_CHAIN_ID}. ` +
            `Deploy the contract and reload the page.`
        );
    }
};

const connectWalletMetamask = async () => {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install MetaMask to use this application.");
    }
    await window.ethereum.request({method: 'eth_requestAccounts'});
    await ensureCorrectNetwork();
    await assertContractDeployed();
    return getProvider().getSigner();
};

const getSignerFor = (address) => getProvider().getSigner(address);

const setupMetaMaskListeners = (onAccountChanged, onNetworkChanged) => {
    if (!window.ethereum) {
        return () => {};
    }

    const handleAccountsChanged = (accounts) => {
        onAccountChanged(accounts.length === 0 ? null : accounts[0]);
    };

    const handleChainChanged = (chainId) => {
        browserProvider = null;
        onNetworkChanged(chainId);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
};

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

const ERROR_MESSAGES = {
    NotAdmin: (args) => `Only the admin can add points (caller: ${args[0]}).`
};

const findRevertData = (error) => {
    const candidates = [
        error?.data,
        error?.info?.error?.data,
        error?.info?.error?.data?.data,
        error?.error?.data,
        error?.error?.data?.data
    ];
    return candidates.find((data) => typeof data === 'string' && data.startsWith('0x') && data.length >= 10);
};

const decodeContractError = (error) => {
    if (error?.revert?.name) {
        return error.revert;
    }
    const data = findRevertData(error);
    if (!data) return null;
    try {
        return fidelityInterface.parseError(data);
    } catch {
        return null;
    }
};

const getErrorMessage = (error) => {
    if (error?.code === 'ACTION_REJECTED') {
        return "The request was rejected in MetaMask.";
    }
    if (error?.code === 'INSUFFICIENT_FUNDS') {
        return "Insufficient funds to pay for gas.";
    }
    const decoded = decodeContractError(error);
    if (decoded && ERROR_MESSAGES[decoded.name]) {
        return ERROR_MESSAGES[decoded.name](decoded.args ?? []);
    }
    return error?.shortMessage || error?.reason || error?.message || "Unknown error";
};

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

const getAdmin = () => getContract().admin();

const getPoints = async (address, blockTag = 'latest') => {
    const points = await getContract().points(address, {blockTag});
    return Number(points);
};

//ex 2
const getPointsHistory = async (address) => {
    const contract = getContract();
    const filter = contract.filters.PointsAdded(address);
    const events = await contract.queryFilter(filter, deployedAddresses.fromBlock);

    return events.map(event => ({
        id: `${event.transactionHash}:${event.index}`,
        amount: Number(event.args.amount),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        index: event.index
    }));
};

//ex1
const getTotalValue = async (address, blockTag = 'latest') => {
    const totalValue = await getContract().getTotalValue(address, { blockTag });
    return Number(totalValue);
};

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

const addPoints = async (signer, client, amount) => {
    if (!ethers.isAddress(client)) {
        throw new Error("Please enter a valid customer address.");
    }
    const tx = await getContract(signer).addPoints(ethers.getAddress(client), amount);
    return tx.wait();
};

//ex 3
const spendPoints = async (signer, amount) => {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Please enter a positive whole number of points.");
    }
    const tx = await getContract(signer).spendPoints(amount);
    return tx.wait();
};

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

/**
 * Calls onChange(blockNumber) whenever the balance of `client` changes, i.e.
 * when the contract emits PointsAdded or PointsSpent for this client.
 * `client` is an indexed parameter, so the filtering is done by the node,
 * on the second topic of the logs. Returns a function that unsubscribes.
 */
const subscribeToPointsChanges = (client, onChange) => {
    const contract = getContract();
    const addedFilter = contract.filters.PointsAdded(client);
    const spentFilter = contract.filters.PointsSpent(client);

    // The last argument of an ethers listener is the event payload,
    // which contains the log (block number, transaction hash, ...).
    const handleEvent = (...args) => {
        const event = args[args.length - 1];
        onChange(event.log.blockNumber);
    };

    contract.on(addedFilter, handleEvent);
    contract.on(spentFilter, handleEvent);
    return () => {
        //ex 4
        // contract.off(addedFilter, handleEvent);
        // contract.off(spentFilter, handleEvent);
    };
};

const subscribeToPointValueChanges = (callback) => {
    const contract = getContract();
    const filter = contract.filters.PointValueChanged();

    const listener = (oldValue, newValue, event) => {
        callback(event.log.blockNumber);
    };

    contract.on(filter, listener);

    return () => {
        contract.off(filter, listener);
    };
};

const subscribeToPointsAdded = (address, callback) => {
    const contract = getContract();
    const filter = contract.filters.PointsAdded(address);

    const listener = (client, amount, event) => {
        callback({
            id: `${event.log.transactionHash}:${event.log.index}`,
            amount: Number(amount),
            blockNumber: event.log.blockNumber,
            transactionHash: event.log.transactionHash,
            index: event.log.index
        });
    };

    contract.on(filter, listener);

    return () => {
        contract.off(filter, listener);
    };
};

export {
    FIDELITY_POINTS_ADDRESS,
    getProvider,
    connectWalletMetamask,
    getSignerFor,
    setupMetaMaskListeners,
    getErrorMessage,
    getAdmin,
    getPoints,
    getPointsHistory,
    getTotalValue,
    addPoints,
    //ex 3
    spendPoints,
    subscribeToPointsChanges,
    subscribeToPointValueChanges,
    subscribeToPointsAdded
};
