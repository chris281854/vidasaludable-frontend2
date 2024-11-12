import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, Snackbar, Alert } from '@mui/material';
import { Search } from '@mui/icons-material';
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';
import { useFormContext } from '../../context/FormContext'; // Asegúrate de que este sea el contexto correcto
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

const DesayunoSection: React.FC = () => {
  const {
    planesNutrionales,
    setNutritionPlan,
  } = useFormContext(); // Usa el contexto

  const [alimento, setAlimento] = useState<Alimento>({ nombre: '', frecuencia: '', kilocalorias: '' });
  const [buscar, setBuscar] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const agregarAlimento = () => {
    if (alimento.nombre && alimento.frecuencia && alimento.kilocalorias) {
      setNutritionPlan((prev) => ({
        ...prev,
        desayuno: [...prev.desayuno, { ...alimento }]
      }));
      setAlimento({ nombre: '', frecuencia: '', kilocalorias: '' });
      setSnackbar({ open: true, message: 'Alimento agregado exitosamente', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Por favor completa todos los campos', severity: 'error' });
    }
  };

  const eliminarAlimento = (index: number) => {
    setNutritionPlan((prev) => {
      const nuevaLista = prev.desayuno.filter((_, i) => i !== index);
      return { ...prev, desayuno: nuevaLista };
    });
    setSnackbar({ open: true, message: 'Alimento eliminado exitosamente', severity: 'success' });
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const limpiarBuscar = () => {
    setBuscar('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
        <Box className="p-4">
          <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Alimentos</Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box width="70%">
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>Alimentos</Typography>
              <ul style={{ padding: 0, listStyleType: 'none' }}>
                {planesNutrionales.desayuno.length === 0 ? (
                  <li style={{ marginBottom: '14px', color: 'red' }}>No hay alimentos listados.</li>
                ) : (
                  planesNutrionales.desayuno.map((alimento: Alimento, index: number) => (
                    <li key={index} style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{`${alimento.nombre} - ${alimento.frecuencia} - ${alimento.kilocalorias} kcal`}</span>
                      {/* <IconButton onClick={() => eliminarAlimento(index)} color="error">
                        <FaDeleteLeft />
                      </IconButton> */}
                    </li>
                  ))
                )}
              </ul>
            </Box>
            <Box width="25%">
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
              <ul style={{ padding: 0, listStyleType: 'none' }}>
                {planesNutrionales.desayuno.map((_, index) => (
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
            type="button"
            variant="contained"
            color='primary'
            onClick={() => { /* Lógica para buscar */ }}
            style={{ 
              width: '180px', 
              height: '48px', 
              borderRadius: '20px', // Redondear el botón
              color: 'white',
              fontWeight: 'bold',
              marginRight: 2 // Espacio entre los botones
            }}
          >
            Buscar
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="warning"
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
            style={{ borderRadius: '20px', marginRight: '9px' }} // Redondear el input
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
            style={{ borderRadius: '20px' }} // Redondear el input
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

export default DesayunoSection;