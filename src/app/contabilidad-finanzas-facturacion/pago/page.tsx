'use client'

import React, { useState } from 'react';
import {
    TextField,
    MenuItem,
    Button,
    Typography,
    Snackbar,
    Alert,
    Grid,
    Paper,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';
import PagosLayout from './PagosLayout';
import HeaderUser from '@/components/headeruser';

enum TipoTransacciones {
    ABONO = 'Abono',
    CANCELACION = 'Cancelación',
    COMPRA = 'Compra',
    DEVOLUCION = 'Devolución',
    DONACION = 'Donación',
    GASTO = 'Gasto',
    INGRESO = 'Ingreso',
    PAGO = 'Pago',
    PRESTAMO = 'Préstamo',
    REEMBOLSO = 'Reembolso',
    RETIRO = 'Retiro',
    TRANSFERENCIA = 'Transferencia',
    VENTA = 'Venta',
}

enum TipoPago {
    EFECTIVO = 'Efectivo',
    TARJETA = 'Tarjeta',
    CHEQUE = 'Cheque',
    TRANSFERENCIA = 'Transferencia',
    PAYPAL = 'PayPal',
    OTRO = 'Otro',
}

const RegistroPagos: React.FC = () => {
    const [tipoTransaccion, setTipoTransaccion] = useState('');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [idFactura, setIdFactura] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Aquí puedes agregar la lógica para enviar los datos a la API
        // Por ejemplo, usando fetch para enviar un POST a tu backend

        // Simulación de éxito
        setSnackbarMessage('Pago registrado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <ProtectedRoute>
            <PagosLayout>
            <div>
            <HeaderUser title="Evaluaciones Nutricionales ~ Registro de Evaluaciones" />
            <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1, mt: 24, mr: 2 }}>
                        <RegistroPagos />
                    </Box>
            </Box>         
            
            </div>
            </PagosLayout>
        </ProtectedRoute>
    );
};

export default RegistroPagos;