'use client'

import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, FormControlLabel, Switch, Snackbar, Alert, Divider, Grid, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from 'next-auth/react';

const ModuloAjustes: React.FC = () => {
    const { data: session } = useSession();

    const { modoOscuro, toggleModoOscuro } = useTheme(); // Usa el contexto
    const [nombreConsultorio, setNombreConsultorio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [notificaciones, setNotificaciones] = useState(true);
    const [intervaloNotificaciones, setIntervaloNotificaciones] = useState(15); // Intervalo en minutos
    const [idioma, setIdioma] = useState('es'); // Idioma por defecto
    const [nombreMedico, setNombreMedico] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // Sección de usuario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [fotoUsuario, setFotoUsuario] = useState<string | null>(null);
    const [contrasenaVieja, setContrasenaVieja] = useState('');
    const [contrasenaNueva, setContrasenaNueva] = useState('');
    const [contrasenaConfirmar, setContrasenaConfirmar] = useState('');



    const fetchUserData = async () => {
        // Asegúrate de que el token esté disponible
        if (!session) {
        
        }
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token || ''}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Error al obtener la información del usuario');
            }
    
            const data = await response.json();
            
            setName(data.name);
            setEmail(data.email);
            setFotoUsuario(data.foto || null);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setSnackbarMessage('Error al cargar la información del usuario.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
    
    useEffect(() => {
        fetchUserData(); // Llama a la función para obtener la información del usuario al montar el componente
    }, []);

    const handleSave = () => {
        setSnackbarMessage('Configuraciones guardadas con éxito.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleUploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoUsuario(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetPhoto = () => {
        setFotoUsuario(null);
    };

    return (
        <Paper sx={{ padding: 2, margin: 1, mt: 12 }}>
            <Divider sx={{ margin: '20px 0' }} />

            {/* Sección General */}
            <Typography color="success" className="text-2xl font-extrabold" variant="h6" gutterBottom>
                General
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <img
                    src={fotoUsuario || 'https://via.placeholder.com/100'} // Imagen predeterminada
                    alt="Foto de Usuario"
                    style={{ borderRadius: '70%', width: '150px', height: '150px', marginRight: '20px' }}
                />
                <div>
                    <Button variant="contained" component="label" sx={{ marginRight: 1 }}>
                        Subir Foto
                        <input type="file" hidden accept="image/*" onChange={handleUploadPhoto} />
                    </Button>
                    <Button variant="outlined" onClick={handleResetPhoto}>
                        Resetear Foto
                    </Button>
                </div>
            </div>
            <TextField
                label="Nombre de Usuario"
                value={name}
                onChange={(e) => setName(e.target.value)} // Permitir cambios en el estado, pero no se reflejará en el input
                fullWidth
                margin="normal"
                disabled // Deshabilitar el campo
            />
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Permitir cambios en el estado
                fullWidth
                margin="normal"
            />

            <Divider sx={{ margin: '20px 0' }} />

            {/* Sección Cambiar Contraseña */}
            <Typography variant="h6" gutterBottom>
                Cambiar Contraseña
            </Typography>
            <TextField
                label="Contraseña Vieja"
                type="password"
                value={contrasenaVieja}
                onChange={(e) => setContrasenaVieja(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Nueva Contraseña"
                type="password"
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                value={contrasenaConfirmar}
                onChange={(e) => setContrasenaConfirmar(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Divider sx={{ margin: '20px 0' }} />

            {/* Sección Preferencias de Usuario */}
            <Typography variant="h6" gutterBottom>
                Preferencias de Usuario
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={notificaciones}
                        onChange={() => setNotificaciones(!notificaciones)}
                    />
                }
                label="Activar Notificaciones"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Intervalo de Notificaciones (minutos)</InputLabel>
                <Select
                    value={intervaloNotificaciones}
                    onChange={(e) => setIntervaloNotificaciones(Number(e.target.value))}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={60}>60</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Idioma</InputLabel>
                <Select
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                >
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="en">Inglés</MenuItem>
                    <MenuItem value="fr">Francés</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Switch
                        checked={modoOscuro}
                        onChange={toggleModoOscuro} // Usa la función del contexto
                    />
                }
                label="Modo Oscuro"
            />

            <Divider sx={{ margin: '20px 0' }} />

            <Grid container justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ marginTop: 2 }}
                >
                    Guardar Configuraciones
                </Button>
            </Grid>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ModuloAjustes;