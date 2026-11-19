import {createContext, useContext} from 'react';

export const WalletContext = createContext(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
