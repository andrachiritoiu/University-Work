import {useMemo, useState} from 'react';
import {WalletContext} from './WalletContext.js';

export const WalletProvider = ({children}) => {
    const [wallet, setWallet] = useState(null);

    const value = useMemo(() => ({wallet, initializeWallet: setWallet}), [wallet]);

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};
