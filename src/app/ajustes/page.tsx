'use client'

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Asegúrate de importar useSession
import { useRouter } from 'next/navigation'; // Importa useRouter
import ProtectedRoute from '@/components/ProtectedRoute';
import { ThemeProviderWrapper, useTheme } from '@/context/ThemeContext';
import AjustesLayout from './AjustesLayout';
import ModuloAjustes from './Ajustes';
import HeaderUser from '@/components/headeruser';
import { Box } from '@mui/material';

const ModuloAjustesApp: React.FC = () => {
    const { data: session, status } = useSession(); // Obtén la sesión y su estado
    const router = useRouter();

    // Efecto para redirigir si no hay sesión
    useEffect(() => {
        if (status === 'loading') return; // Espera a que se cargue la sesión
        if (!session) {
            router.push('/login'); // Redirige a la página de inicio de sesión si no hay sesión
        }
    }, [session, status, router]);

    return (
        <ProtectedRoute>
            <AjustesLayout>
                <Box sx={{ p: 4 }}>
                    <HeaderUser title='Ajustes de usuario' />
                    <div className="p-4">
                        <ModuloAjustes />
                    </div>
                </Box>
            </AjustesLayout>
        </ProtectedRoute>
    );
};

export default ModuloAjustesApp;