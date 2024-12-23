import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Search } from '@mui/icons-material';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from "react-icons/gr";
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';
import useNutritionPlan from '../../../hooks/useNutritionPlan'; // Importa el hook
import { useFormContext } from '../../context/FormContext'; // Asegúrate de que este sea el contexto correcto
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface Liquido {
  nombre: string; // Nombre del líquido
  frecuencia: string; // Frecuencia de consumo
  cantidad: string; // Cantidad consumida
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


const ConsumoLiquidosSection: React.FC = () => {

  const {
    planesNutrionales,
    setNutritionPlan,
  } = useFormContext(); // Usa el contexto

   const [liquido, setLiquido] = useState<Liquido>({ nombre: '', frecuencia: '', cantidad: '' });
  const [buscar, setBuscar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const agregarLiquido = () => {
    if (liquido.nombre && liquido.frecuencia && liquido.cantidad) {
  
    setNutritionPlan(prev => ({
      ...prev,
      recomliquido:[...prev.recomliquido, { ...liquido }]
    }));
    
      setLiquido({ nombre: '', frecuencia: '', cantidad: '' }); // Reinicia el estado del líquido
      setSnackbar({ open: true, message: 'Líquido agregado exitosamente', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Por favor completa todos los campos', severity: 'error' });
    }
  };

  const limpiarBuscar = () => {
    setBuscar('');
  };

  const eliminarLiquido = (index: number) => {
    setNutritionPlan((prev) => {
      const nuevaLista = prev.recomliquido.filter((_, i) => i !== index);
      return { ...prev, recomliquido: nuevaLista };
    });
    
    setSnackbar({ open: true, message: 'Líquido eliminado exitosamente', severity: 'success' });
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
        <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Consumo de Líquidos</Typography>
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Líquido</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomliquido.length === 0 ? (
                <li style={{ marginBottom: '14px', color: "orange" }}>No hay líquidos agregados.</li>
              ) : (
                planesNutrionales.recomliquido.map((recomliquido, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recomliquido.nombre}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Frecuencia</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomliquido.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                planesNutrionales.recomliquido.map((recomliquido, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recomliquido.frecuencia}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Cantidad</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomliquido.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                planesNutrionales.recomliquido.map((recomliquido, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{recomliquido.cantidad}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {planesNutrionales.recomliquido.length === 0 ? (
                <li style={{ marginBottom: '-1px' }}>-</li>
              ) : (
                planesNutrionales.recomliquido.map((_, index) => (
                  <li key={index} style={{ marginBottom: '-1px' }}>
                    <IconButton onClick={() => eliminarLiquido(index)} color="error">
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
          label="Buscar líquido"
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
          value={liquido.nombre}
          onChange={(e) => setLiquido({ ...liquido, nombre: e.target.value })}
          label="Nombre del líquido"
          sx={{ width: '500px' }}
          style={{ borderRadius: '50px', marginRight: '9px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={liquido.frecuencia}
          onChange={(e) => setLiquido({ ...liquido, frecuencia: e.target.value })}
          label="Frecuencia de consumo"
          sx={{ width: '210px' }}
          style={{ borderRadius: '20px', marginRight: '8px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={liquido.cantidad}
          onChange={(e) => setLiquido({ ...liquido, cantidad: e.target.value })}
          label="Cantidad"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={agregarLiquido}
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

export default ConsumoLiquidosSection;