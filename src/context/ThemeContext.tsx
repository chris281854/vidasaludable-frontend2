// ThemeContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface ThemeContextType {
    modoOscuro: boolean;
    toggleModoOscuro: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modoOscuro, setModoOscuro] = useState(false);

    const toggleModoOscuro = () => {
        setModoOscuro((prev) => !prev);
    };

    const theme = createTheme({
        palette: {
            mode: modoOscuro ? 'dark' : 'light',
        },
    });

    return (
        <ThemeContext.Provider value={{ modoOscuro, toggleModoOscuro }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProviderWrapper');
    }
    return context;
};