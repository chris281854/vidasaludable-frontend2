import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, CircularProgress, Snackbar, Alert, createTheme, ThemeProvider } from '@mui/material';
import { Search } from '@mui/icons-material';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from "react-icons/gr";
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';
import useNutritionPlan from '../../../hooks/useNutritionPlan'; // Importa el hook
import { useFormContext } from '../../context/FormContext';

interface Elemento {
  nombre: string; // Nombre del elemento a evitar
  frecuencia: string; // Frecuencia de consumo
  cantidad: string; // Cantidad a evitar
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

 
const OtrasRecomendaciones: React.FC = () => {
  const { planesNutrionales, setNutritionPlan } = useFormContext();
  
  const [elemento, setElemento] = useState<Elemento>({ nombre: '', frecuencia: '', cantidad: '' });
  const [buscar, setBuscar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const agregarElemento = () => {
    if (elemento.nombre && elemento.frecuencia && elemento.cantidad) {
     
      // Agrega el elemento como objeto al array

      setNutritionPlan(prev => ({
        ...prev,
        recorecomotrasmplan: [...prev.recorecomotrasmplan, { ...elemento }] 
      }));

      // Actualiza solo las propiedades relevantes
      setElemento({ nombre: '', frecuencia: '', cantidad: '' });
      setSnackbar({ open: true, message: 'Elemento agregado exitosamente', severity: 'success' });

     
    } else {
      // Muestra un mensaje de error si los campos no están completos
      setSnackbar({ open: true, message: 'Por favor completa todos los campos', severity: 'error' });
    }
  };
  
  const limpiarBuscar = () => {
    setBuscar(''); // Limpia el campo de búsqueda
  };
  
  const eliminarElemento = (index: number) => {
    // Elimina el elemento de la lista de recomendaciones
    setNutritionPlan((prev) => {
      const nuevaLista = prev.recorecomotrasmplan.filter((_, i) => i !== index);
      return { ...prev, recorecomotrasmplan: nuevaLista };
    });
    setSnackbar({ open: true, message: 'Elemento eliminado exitosamente', severity: 'success' });
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
        <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Otras Recomendaciones</Typography>
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Elemento</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recorecomotrasmplan.length === 0 ? (
                <li style={{ marginBottom: '14px', color: "olivedrab" }}>No hay elementos agregados.</li>
              ) : (
                planesNutrionales.recorecomotrasmplan.map((recorecomotrasmplan, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recorecomotrasmplan.nombre}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Frecuencia</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recorecomotrasmplan.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                planesNutrionales.recorecomotrasmplan.map((recorecomotrasmplan, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recorecomotrasmplan.frecuencia}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Cantidad</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recorecomotrasmplan.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                planesNutrionales.recorecomotrasmplan.map((recorecomotrasmplan, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recorecomotrasmplan.cantidad}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recorecomotrasmplan.length === 0 ? (
                <li style={{ marginBottom: '-1px' }}>-</li>
              ) : (
                planesNutrionales.recorecomotrasmplan.map((_, index) => (
                  <li key={index} style={{ marginBottom: '-1px' }}>
                    <IconButton onClick={() => eliminarElemento(index)} color="error">
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
          label="Buscar elemento"
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
          value={elemento.nombre}
          onChange={(e) => setElemento({ ...elemento, nombre: e.target.value })}
          label="Nombre del elemento"
          sx={{ width: '500px' }}
          style={{ borderRadius: '50px', marginRight: '9px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={elemento.frecuencia}
          onChange={(e) => setElemento({ ...elemento, frecuencia: e.target.value })}
          label="Frecuencia de consumo"
          sx={{ width: '210px' }}
          style={{ borderRadius: '20px', marginRight: '8px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={elemento.cantidad}
          onChange={(e) => setElemento({ ...elemento, cantidad: e.target.value })}
          label="Cantidad"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={agregarElemento}
          startIcon={<MdAddTask />}
          style={{ width: '140px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Redondear el botón y añadir margen
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

export default OtrasRecomendaciones;