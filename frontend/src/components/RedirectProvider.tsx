import React, { createContext, ReactNode, useContext, useState } from 'react';
import { RedirectContextProps } from '../types/Types';

const RedirectContext = createContext<RedirectContextProps | undefined>(undefined)

export const RedirectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isRedirected, setIsRedirected] = useState(false);

    return (
        <RedirectContext.Provider value={{ isRedirected, setIsRedirected }}>
            {children}
        </RedirectContext.Provider>
    );
};

export const useRedirect = (): RedirectContextProps => {
    const context = useContext(RedirectContext);
    if (!context) {
        throw new Error('useRedirect must be used within a RedirectProvider')
    }
    return context;
}
