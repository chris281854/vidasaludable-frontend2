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
                <HeaderUser title="Registros de transacciones ~ Pagos de consultas medicas" />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Box sx={{ flex: 1, mt: 24, mr: 2, backgroundColor: 'white', padding: 3, borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Tipo de Transacción"
                                    value={tipoTransaccion}
                                    onChange={(e) => setTipoTransaccion(e.target.value)}
                                    fullWidth
                                    required
                                >
                                    {Object.values(TipoTransacciones).map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Monto de Transacción"
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Descripción"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    label="Método de Pago"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    fullWidth
                                    required
                                >
                                    {Object.values(TipoPago).map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ID de Factura"
                                    value={idFactura}
                                    onChange={(e) => setIdFactura(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleSubmit}>
                            Registrar Pago
                        </Button>
                        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            </PagosLayout>
        </ProtectedRoute>
    );
};

export default RegistroPagos;