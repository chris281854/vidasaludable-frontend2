// src/components/ContabilidadFinanzas.tsx
'use client';
import React from 'react';
import Dashboard from './components/Dashboard';
import ResumenCuentas from './components/ResumenCuentas';
import GraficoFinanciero from './components/GraficoFinanciero';
import TablaTransacciones from './components/TablaTransacciones';
import FiltroTransacciones from './components/FiltroTransacciones';
import ContabilidadLayout from './ContabilidadLayout';
import { Box } from '@mui/material';
import HeaderUser from '@/components/headeruser';
import ProtectedRoute from '@/components/ProtectedRoute';


const ContabilidadFinanzas: React.FC = () => {


    return (
        <ProtectedRoute>
        <ContabilidadLayout>
        <Box sx={{ p: 4 }}>
        <HeaderUser title='Contabilidad y Finanzas ~ Dashboard' />

        <div className="p-4">
             
            <Dashboard />
            <ResumenCuentas />
            <GraficoFinanciero />
            <FiltroTransacciones />
            <TablaTransacciones />
        </div>
        </Box>
        </ContabilidadLayout>
        </ProtectedRoute>
    );
};

export default ContabilidadFinanzas;