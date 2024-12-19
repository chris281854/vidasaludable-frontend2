 'use client';
 
 // pages/calendario.js
import React, { useEffect } from 'react';
import MyCalendar from './components/MyCalendar';
import HeaderUser from '@/components/headeruser';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Box } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AjustesLayout from '../ajustes/AjustesLayout';

const Calendario = () => {
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
                <div style={{ padding: '16px'}}>
                    <HeaderUser title='Gestion de eventos ~ Calendario de Citas' />
                </div>    
                
                    <div className="mt-20 p-4">
                        <MyCalendar />
                    
                </div>
            </AjustesLayout>
        </ProtectedRoute>
    );
};

export default Calendario;