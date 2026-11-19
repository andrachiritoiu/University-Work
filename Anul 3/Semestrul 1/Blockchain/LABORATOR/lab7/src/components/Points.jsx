import {useEffect, useRef, useState} from 'react';
import {useWallet} from '../utils/WalletContext.js';
import {
    connectWalletMetamask,
    getSignerFor,
    setupMetaMaskListeners,
    getErrorMessage,
    getProvider,
    getAdmin,
    getPoints,
    getPointsHistory,
    getTotalValue,
    //ex 3
    spendPoints,
    subscribeToPointsChanges,
    subscribeToPointValueChanges,
    subscribeToPointsAdded,
    FIDELITY_POINTS_ADDRESS
} from '../utils/EthersUtils.js';
import {AdminPanel} from './AdminPanel.jsx';
import '../styles/Points.css';
import '../styles/Common.css';

const formatAddress = (address) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

//ex2
const mergeHistory = (current, incoming) => {
    const events = new Map();

    for (const event of [...current, ...incoming]) {
        events.set(event.id, event);
    }

    return [...events.values()].sort(
        (a, b) => a.blockNumber - b.blockNumber || a.index - b.index
    );
};

/** Single page of the application: connect button, or the points of the connected account. */
export const Points = () => {
    const {wallet, initializeWallet} = useWallet();
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState(null);

    // When the user selects another account in MetaMask, switch to it;
    // when the network changes, ask the user to connect again.
    useEffect(() => {
        const handleAccountChanged = (account) => {
            if (!account) {
                initializeWallet(null);
                return;
            }
            getSignerFor(account).then(initializeWallet).catch(() => initializeWallet(null));
        };
        return setupMetaMaskListeners(handleAccountChanged, () => initializeWallet(null));
    }, [initializeWallet]);

    const handleConnect = async () => {
        setError(null);
        setConnecting(true);
        try {
            initializeWallet(await connectWalletMetamask());
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            setError(getErrorMessage(err));
        } finally {
            setConnecting(false);
        }
    };

    if (!wallet) {
        return (
            <div className="points-container">
                <div className="points-card">
                    <h1>Fidelity Points</h1>
                    <p className="points-subtitle">Connect your wallet to see your fidelity points</p>
                    <button className="primary-button" onClick={handleConnect} disabled={connecting}>
                        {connecting ? 'Connecting...' : 'Connect With MetaMask'}
                    </button>
                    {error && <div className="error-box">{error}</div>}
                </div>
            </div>
        );
    }

    // The key recreates the dashboard, with fresh state, when the account changes.
    return <Dashboard key={wallet.address} signer={wallet}/>;
};

const Dashboard = ({signer}) => {
    const account = signer.address;
    const [points, setPoints] = useState(null);
    const [totalValue, setTotalValue] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    //ex 3
    const [spendAmount, setSpendAmount] = useState('');
    const [spending, setSpending] = useState(false);
    const [spendMessage, setSpendMessage] = useState(null);
    const [spendError, setSpendError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Block number of the value currently displayed. A read made at an older
    // block (for example, a slow initial read) must not overwrite a newer value.
    const shownBlock = useRef(-1);

    useEffect(() => {
        let active = true;

        const refresh = async (blockNumber) => {
            try {
                const [pointsValue, total] = await Promise.all([
                    getPoints(account, blockNumber),
                    getTotalValue(account, blockNumber)
                ]);

                if (active && blockNumber >= shownBlock.current) {
                    shownBlock.current = blockNumber;
                    setPoints(pointsValue);
                    setTotalValue(total);
                    setLastUpdate(blockNumber);
                }
            } catch (err) {
                if (active) setError(getErrorMessage(err));
            }
        };

        // Initial read of the balance and of the admin address.
        (async () => {
            try {
                const [blockNumber, admin] = await Promise.all([
                    getProvider().getBlockNumber(),
                    getAdmin()
                ]);
                if (!active) return;
                setIsAdmin(admin.toLowerCase() === account.toLowerCase());
                await refresh(blockNumber);
            } catch (err) {
                if (active) setError(getErrorMessage(err));
            }
        })();

        // Live updates: every PointsAdded / PointsSpent event of this account
        // triggers a new read of the balance at the block of the event.
        const unsubscribe = subscribeToPointsChanges(account, refresh);

        // Live updates: every PointValueChanged event triggers a new read of the total value.
        const unsubscribeValue = subscribeToPointValueChanges(refresh);

        return () => {
            active = false;
            unsubscribe();
            unsubscribeValue();
        };
    }, [account]);

    useEffect(() => {
        let active = true;
        const unsubscribe = subscribeToPointsAdded(account, (event) => {
            if (active) {
                setHistory(prev => mergeHistory(prev, [event]));
            }
        });

        const loadHistory = async () => {
            try {
                const events = await getPointsHistory(account);
                if (active) {
                    setHistory(prev => mergeHistory(prev, events));
                }
            } catch (err) {
                if (active) {
                    setError(getErrorMessage(err));
                }
            } finally {
                if (active) {
                    setHistoryLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            active = false;
            unsubscribe();
        };
    }, [account]);

    //ex 3
    const handleSpendPoints = async (event) => {
        event.preventDefault();
        setSpendMessage(null);
        setSpendError(null);

        const amount = Number(spendAmount);
        setSpending(true);
        try {
            const receipt = await spendPoints(signer, amount);
            setSpendMessage(`${amount} points spent (block ${receipt.blockNumber}).`);
            setSpendAmount('');
        } catch (err) {
            console.error("spendPoints failed:", err);
            setSpendError(getErrorMessage(err));
        } finally {
            setSpending(false);
        }
    };

    return (
        <div className="points-container">
            <div className="points-card">
                <h1>Fidelity Points</h1>
                <p className="points-account">
                    Connected as <code title={account}>{formatAddress(account)}</code>
                    {isAdmin && <span className="admin-badge">Admin</span>}
                </p>

                <div className="points-balance">
                    <span className="points-value">{points === null ? '…' : points}</span>
                    <span className="points-label">points</span>
                </div>
                <p className="points-total">
                    Total value: {totalValue === null ? '…' : totalValue}
                </p>
                <p className="points-note">
                    Updated automatically when points are added
                    {lastUpdate !== null && <> · block {lastUpdate}</>}
                </p>

                <div className="points-history">
                    <h2>Points received history</h2>

                    {historyLoading && <p>Loading history...</p>}

                    {!historyLoading && history.length === 0 && (
                        <p>No points received yet.</p>
                    )}

                    <ul>
                        {history.map(event => (
                            <li key={event.id}>
                                +{event.amount} points — Block {event.blockNumber}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ex 3 */}
                <form className="spend-panel" onSubmit={handleSpendPoints}>
                    <h2>Spend points</h2>
                    <label htmlFor="spendAmount">Number of points</label>
                    <input
                        id="spendAmount"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="100"
                        value={spendAmount}
                        onChange={(event) => setSpendAmount(event.target.value)}
                    />
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={spending || !spendAmount}
                    >
                        {spending ? 'Spending...' : 'Spend points'}
                    </button>
                    {spendMessage && <div className="success-box">{spendMessage}</div>}
                    {spendError && <div className="error-box">{spendError}</div>}
                </form>

                {error && <div className="error-box">{error}</div>}

                {isAdmin && <AdminPanel signer={signer}/>}

                <p className="points-contract">
                    Contract <code>{FIDELITY_POINTS_ADDRESS}</code>
                </p>
            </div>
        </div>
    );
};
