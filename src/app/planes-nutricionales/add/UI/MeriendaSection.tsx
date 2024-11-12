import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, CircularProgress, Snackbar, Alert, ThemeProvider, createTheme } from '@mui/material';
import { Search } from '@mui/icons-material';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from "react-icons/gr";
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';
import useNutritionPlan from '../../hooks/useNutritionPlan'; // Importa el hook
import { useFormContext } from '../../context/FormContext';

interface Alimento {
  nombre: string;
  frecuencia: string;
  kilocalorias: string;
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

const MeriendaSection: React.FC = () => {

  const {
    planesNutrionales,
    setNutritionPlan,
  } = useFormContext(); // Usa el contexto

  const [alimento, setAlimento] = useState<Alimento>({ nombre: '', frecuencia: '', kilocalorias: '' });
  const [buscar, setBuscar] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [isLoading, setIsLoading] = useState(false);

  const agregarAlimento = () => {
    if (alimento.nombre && alimento.frecuencia && alimento.kilocalorias) {
      // Agrega el alimento como objeto al array
      setNutritionPlan((prev) => ({
        ...prev,
        merienda: [...prev.merienda, {...alimento}] // Asegúrate de que esto sea un objeto de tipo Alimento
      }));
      setAlimento({ nombre: '', frecuencia: '', kilocalorias: '' }); // Reinicia el estado del alimento
      setSnackbar({ open: true, message: 'Alimento agregado exitosamente', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Por favor completa todos los campos', severity: 'error' });
    }
  };

  const limpiarBuscar = () => {
    setBuscar('');
  };

  const eliminarAlimento = (index: number) => {
    setNutritionPlan((prev) => {
      const nuevaLista = prev.merienda.filter((_, i) => i !== index);
      return { ...prev, merienda: nuevaLista };
    });
    setSnackbar({ open: true, message: 'Alimento eliminado exitosamente', severity: 'success' });
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
        <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Meriendas</Typography>
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Alimento</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.merienda.length === 0 ? (
                <li style={{ marginBottom: '14px', color: 'green' }}>No hay alimentos listados.</li>
              ):(
                planesNutrionales.merienda.map((alimento: Alimento, index: number) => (
                <li key={index} style={{ marginBottom: '14px' }}>
                  {`${alimento.nombre} - ${alimento.frecuencia} - ${alimento.kilocalorias} kcal`} {/* Muestra el alimento concatenado */}
                </li>
              ))
            )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Frecuencia</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.merienda.map((alimento: Alimento, index: number) => (
                <li key={index} style={{ marginBottom: '14px' }}>{alimento.frecuencia}</li>
              ))}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Kilocalorias</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.merienda.map((alimento: Alimento, index: number) => (
                <li key={index} style={{ marginBottom: '14px' }}>{alimento.kilocalorias}</li>
              ))}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.merienda.map((_, index) => (
                <li key={index} style={{ marginBottom: '-1px' }}>
                  <IconButton onClick={() => eliminarAlimento(index)} color="error">
                    <FaDeleteLeft />
                  </IconButton>
                </li>
              ))}
            </ul>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <TextField
          variant="outlined"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          label="Buscar alimento"
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
          value={alimento.nombre}
          onChange={(e) => setAlimento({ ...alimento, nombre: e.target.value })}
          label="Nombre del alimento"
          sx={{ width: '500px' }}
          style={{ borderRadius: '50px', marginRight: '9px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={alimento.frecuencia}
          onChange={(e) => setAlimento({ ...alimento, frecuencia: e.target.value })}
          label="Frecuencia de consumo"
          sx={{ width: '210px' }}
          style={{ borderRadius: '20px', marginRight: '8px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={alimento.kilocalorias}
          onChange={(e) => setAlimento({ ...alimento, kilocalorias: e.target.value })}
          label="Kilocalorias"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={agregarAlimento}
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

export default MeriendaSection;