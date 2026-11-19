import {useState} from 'react';
import {addPoints, getErrorMessage} from '../utils/EthersUtils.js';

const POINTS_PER_CLICK = 100;

/** Shown only to the admin. The contract checks the role again (onlyAdmin). */
export const AdminPanel = ({signer}) => {
    const [customer, setCustomer] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(null);
        setError(null);
        setSending(true);
        try {
            const receipt = await addPoints(signer, customer.trim(), POINTS_PER_CLICK);
            setMessage(`${POINTS_PER_CLICK} points added to ${customer.trim()} (block ${receipt.blockNumber}).`);
            setCustomer('');
        } catch (err) {
            console.error("addPoints failed:", err);
            setError(getErrorMessage(err));
        } finally {
            setSending(false);
        }
    };

    return (
        <form className="admin-panel" onSubmit={handleSubmit}>
            <h2>Grant points</h2>
            <label htmlFor="customer">Customer address</label>
            <input
                id="customer"
                type="text"
                placeholder="0x..."
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                spellCheck={false}
                autoComplete="off"
            />
            <button type="submit" className="primary-button" disabled={sending || !customer.trim()}>
                {sending ? 'Sending...' : `Add ${POINTS_PER_CLICK} points`}
            </button>
            {message && <div className="success-box">{message}</div>}
            {error && <div className="error-box">{error}</div>}
        </form>
    );
};
