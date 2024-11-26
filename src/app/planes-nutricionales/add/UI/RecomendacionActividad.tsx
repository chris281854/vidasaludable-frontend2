import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, CircularProgress, Snackbar, Alert, createTheme, ThemeProvider } from '@mui/material';
import { Search } from '@mui/icons-material';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from "react-icons/gr";
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';
import useNutritionPlan from '../../hooks/useNutritionPlan'; // Importa el hook
import { useFormContext } from '../../context/FormContext';

interface Actividad {
  nombre: string;
  frecuencia: string;
  duracion: string; // Cambiado de kilocalorias a duracion
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});


const RecomendacionSection: React.FC = () => {

  const {
    planesNutrionales,
    setNutritionPlan,
  } = useFormContext(); // Usa el contexto

  
  const [actividad, setActividad] = useState<Actividad & { cantidad: string }>({ nombre: '', frecuencia: '', duracion: '', cantidad: '' });
  const [buscar, setBuscar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const agregarActividad = () => {
    if (actividad.nombre && actividad.frecuencia && actividad.duracion) {
      // Agrega la actividad al array de recomendaciones
      setNutritionPlan(prev => ({
        ...prev,
        recomactivida: [...prev.recomactivida, { ...actividad, cantidad: actividad.duracion }]
      }));
            
      setActividad({ nombre: '', frecuencia: '', duracion: '', cantidad: '' }); // Reinicia el estado de la actividad
      setSnackbar({ open: true, message: 'Actividad agregada exitosamente', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Por favor completa todos los campos', severity: 'error' });
    }
  };

  const limpiarBuscar = () => {
    setBuscar('');
  };

  const eliminarActividad = (index: number) => {
    setNutritionPlan((prev) => {
      const nuevaLista = prev.recomactivida.filter((_, i) => i !== index);
      return { ...prev, recomactivida: nuevaLista };
    });
   setSnackbar({ open: true, message: 'Actividad eliminada exitosamente', severity: 'success' });
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (

    <ThemeProvider theme={theme}>
    <Box className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <Box className="p-4">
        <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Actividades Físicas</Typography>
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Actividad</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomactivida.length === 0 ? (
                <li style={{ marginBottom: '14px', color: 'blue' }}>No hay actividades agregadas.</li>
              ) : (
                planesNutrionales.recomactivida.map((recomactivida, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recomactivida.nombre}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Frecuencia</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomactivida.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                planesNutrionales.recomactivida.map((recomactivida, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recomactivida.frecuencia}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Duración</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomactivida.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                planesNutrionales.recomactivida.map((recomactivida, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recomactivida.cantidad}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomactivida.length === 0 ? (
                <li style={{ marginBottom: '-1px' }}>-</li>
              ) : (
                planesNutrionales.recomactivida.map((_, index) => (
                  <li key={index} style={{ marginBottom: '-1px' }}>
                    <IconButton onClick={() => eliminarActividad(index)} color="error">
                      <FaDeleteLeft />
                    </IconButton>
                  </li>
                ))
              )}
            </ul>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <TextField
          variant="outlined"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          label="Buscar actividad"
          fullWidth
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
            style: { borderRadius: '20px' },
          }}
          sx={{ marginRight: 2 }} // Espacio entre el input y los botones
        />
        <Button
          type="submit"
          variant="contained"
          color='primary'
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FaSave />}
          style={{ 
            width: '180px', 
            height: '48px', 
            borderRadius: '20px', // Redondear el botón
            color: 'white',
            fontWeight: 'bold',
            marginRight: 2 // Espacio entre los botones
          }}
        >
          Guardar
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="warning"
          startIcon={<GrClearOption />}
          onClick={limpiarBuscar}
          style={{ width: '180px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Redondear el botón
        >
          Limpiar
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <TextField
          variant="outlined"
          value={actividad.nombre}
          onChange={(e) => setActividad({ ...actividad, nombre: e.target.value })}
          label="Nombre de la actividad"
          sx={{ width: '500px' }}
          style={{ borderRadius: '50px', marginRight: '9px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={actividad.frecuencia}
          onChange={(e) => setActividad({ ...actividad, frecuencia: e.target.value })}
          label="Frecuencia de consumo"
          sx={{ width: '210px' }}
          style={{ borderRadius: '20px', marginRight: '8px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={actividad.duracion}
          onChange={(e) => setActividad({ ...actividad, duracion: e.target.value })}
          label="Duración"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={agregarActividad}
          startIcon={<MdAddTask />}
          style={{ width: '140px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Redondear el botón
        >
          Agregar
        </Button>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
    </ThemeProvider>
  );
};

export default RecomendacionSection;