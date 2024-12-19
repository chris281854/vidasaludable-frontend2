'use client'

import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, FormControlLabel, Switch, Snackbar, Alert, Divider, Grid, InputLabel, Select, MenuItem, FormControl, IconButton, LinearProgress } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import { useSession } from 'next-auth/react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ModuloAjustes: React.FC = () => {
    const { data: session } = useSession();
    const { modoOscuro, toggleModoOscuro } = useTheme(); // Usa el contexto

    const [nombreConsultorio, setNombreConsultorio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [notificaciones, setNotificaciones] = useState(true);
    const [intervaloNotificaciones, setIntervaloNotificaciones] = useState(15); // Intervalo en minutos
    const [idioma, setIdioma] = useState('es'); // Idioma por defecto
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // Sección de usuario
    const [name, setName] = useState(session?.user?.name || ''); // Inicializa con el nombre de la sesión
    const [email, setEmail] = useState(session?.user?.email || ''); // Inicializa con el email de la sesión
    const [fotoUsuario, setFotoUsuario] = useState<string | null>(null);
    const [contrasenaVieja, setContrasenaVieja] = useState('');
    const [contrasenaNueva, setContrasenaNueva] = useState('');
    const [contrasenaConfirmar, setContrasenaConfirmar] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseñas
    const [loading, setLoading] = useState(false); // Estado para controlar la carga

    const [isSessionLoaded, setIsSessionLoaded] = useState(false); // Estado para esperar la carga de la sesión

    useEffect(() => {
        if (session) {
            setName(session.user.name);
            setEmail(session.user.email);
            setIsSessionLoaded(true);
        }
    }, [session]);

    if (!isSessionLoaded) {
        return <div>Loading...</div>; // O algún componente de carga mientras la sesión está siendo cargada
    }

    const handleSave = async () => {
        setLoading(true); // Iniciar carga
        setSnackbarMessage('Configuraciones guardadas con éxito.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        // Simular una petición
        setTimeout(() => {
            setLoading(false); // Finalizar carga
        }, 2000); // Simular un retraso de 2 segundos
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

    const handleChangePassword = async () => {
        // Validaciones
        if (!contrasenaVieja || !contrasenaNueva || !contrasenaConfirmar) {
            setSnackbarMessage('Todos los campos de contraseña son obligatorios.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
    
        // Validar longitud de la nueva contraseña
        if (contrasenaNueva.length < 6) {
            setSnackbarMessage('La nueva contraseña debe tener al menos 6 caracteres.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (contrasenaNueva !== contrasenaConfirmar) {
            setSnackbarMessage('La nueva contraseña y la confirmación deben coincidir.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
    
        try {
            const userId = session?.user?.id; // Asegúrate de que el ID del usuario esté disponible en la sesión
            setLoading(true); // Iniciar carga
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, {
                method: 'PATCH', // Usamos PATCH para actualizar la contraseña
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token || ''}`, // Asegúrate de incluir el token si es necesario
                },
                body: JSON.stringify({
                    password: contrasenaNueva,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Intenta obtener el cuerpo de la respuesta de error
                console.error('Error response:', errorData); // Imprime el error en la consola
                throw new Error('Error al cambiar la contraseña');
            }
    
            setSnackbarMessage('Contraseña cambiada con éxito.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Limpiar campos
            setContrasenaVieja('');
            setContrasenaNueva('');
            setContrasenaConfirmar('');
        } catch (error) {
            console.error('Error changing password:', error);
            setSnackbarMessage('Error al cambiar la contraseña.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setLoading(false); // Finalizar carga
        }
    };

    return (
        <Paper sx={{ padding: 2, margin: 1, mt: 12 }}>
            {loading && <LinearProgress />} {/* Mostrar barra de progreso si está cargando */}
            <Divider sx={{ margin: '20px 0' }} />

            {/* Sección General */}
            <Typography color="success" className="text-2xl font-extrabold" variant="h6" gutterBottom>
                General
            </Typography>
            <Grid container spacing={2} justifyContent="start" alignItems="center">
                <Grid item>
                    <img
                        src={fotoUsuario || 'https://via.placeholder.com/100'} // Imagen predeterminada
                        alt="Foto de Usuario"
                        style={{ borderRadius: '70%', width: '150px', height: '150px' }}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" component="label" sx={{ marginRight: 1, borderRadius: '20px' }}>
                        Subir Foto
                        <input type="file" hidden accept="image/*" onChange={handleUploadPhoto} />
                    </Button>
                    <Button variant="outlined" onClick={handleResetPhoto} sx={{ borderRadius: '20px' }}>
                        Resetear Foto
                    </Button>
                </Grid>
            </Grid>
            <TextField
                label="Nombre de Usuario"
                value={name}
                onChange={(e) => setName(e.target.value)} // Permitir cambios en el estado
                fullWidth
                margin="normal"
                disabled // Deshabilitar el campo
                sx={{ borderRadius: '20px' }} // Bordes redondeados
                InputProps={{ sx: { borderRadius: '20px' } }} // Asegurarse de que el input también tenga bordes redondeados
            />
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Permitir cambios en el estado
                fullWidth
                margin="normal"
                sx={{ borderRadius: '20px' }} // Bordes redondeados
                InputProps={{ sx: { borderRadius: '20px' } }} // Asegurarse de que el input también tenga bordes redondeados
            />

            <Divider sx={{ margin: '20px 0' }} />

            {/* Sección Cambiar Contraseña */}
            <Typography color="success" className="text-2xl font-extrabold" variant="h6" gutterBottom>
                Cambiar Contraseña
            </Typography>
            <TextField
                label="Contraseña Vieja"
                type={showPassword ? 'text' : 'password'}
                value={contrasenaVieja}
                onChange={(e) => setContrasenaVieja(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    ),
                    sx: { borderRadius: '20px' } // Bordes redondeados
                }}
                sx={{ borderRadius: '20px' }} // Bordes redondeados
            />
            <TextField
                label="Nueva Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={contrasenaNueva}
                onChange={(e) => setContrasenaNueva(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    ),
                    sx: { borderRadius: '20px' } // Bordes redondeados
                }}
                sx={{ borderRadius: '20px' }} // Bordes redondeados
            />
            <TextField
                label="Confirmar Nueva Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={contrasenaConfirmar}
                onChange={(e) => setContrasenaConfirmar(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    ),
                    sx: { borderRadius: '20px' } // Bordes redondeados
                }}
                sx={{ borderRadius: '20px' }} // Bordes redondeados
            />

            <div className="flex justify-start">
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2, borderRadius: '20px' }} // Bordes redondeados
                    onClick={handleChangePassword} // Llama a la función para cambiar la contraseña
                >
                    Cambiar Contraseña
                </Button>

                <Button
                    variant="outlined"
                    color="warning"
                    sx={{ marginTop: 2, ml: 2, borderRadius: '20px' }} // Bordes redondeados
                    onClick={() => {
                        setContrasenaVieja('');
                        setContrasenaNueva('');
                        setContrasenaConfirmar('');
                    }} // Limpiar campos
                >
                    Limpiar
                </Button>
            </div>

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
                    sx={{ borderRadius: '20px' }} // Bordes redondeados
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
                    sx={{ borderRadius: '20px' }} // Bordes redondeados
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

            <Grid container justifyContent="flex-center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ marginTop: 2, borderRadius: '20px' }} // Bordes redondeados
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