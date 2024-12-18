'use client'

import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Switch, FormControlLabel, Snackbar, Alert } from '@mui/material';

const ConfiguracionConsultorio: React.FC = () => {
    const [nombreConsultorio, setNombreConsultorio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [notificaciones, setNotificaciones] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSave = () => {
        // Aquí puedes agregar la lógica para guardar la configuración
        console.log({
            nombreConsultorio,
            direccion,
            telefono,
            notificaciones,
        });
        setSnackbarMessage('Configuraciones guardadas con éxito.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Paper sx={{ padding: 3, margin: 2 }}>
            <Typography variant="h4" gutterBottom>
                Configuración del Consultorio
            </Typography>
            <TextField
                label="Nombre del Consultorio"
                value={nombreConsultorio}
                onChange={(e) => setNombreConsultorio(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={notificaciones}
                        onChange={() => setNotificaciones(!notificaciones)}
                    />
                }
                label="Activar Notificaciones"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ marginTop: 2 }}
            >
                Guardar Configuraciones
            </Button>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ConfiguracionConsultorio;