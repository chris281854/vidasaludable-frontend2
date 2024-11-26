import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, Snackbar, Alert, createTheme, ThemeProvider, CircularProgress } from '@mui/material';
import { FaDeleteLeft } from 'react-icons/fa6';
import { Search, Clear } from '@mui/icons-material'; // Importa los iconos necesarios
import { useFormContext } from '../../context/FormContext';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from 'react-icons/gr';

interface Elemento {
  nombre: string;
  
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

const AlimentosEvitarSection: React.FC = () => {

  const {
    planesNutrionales,
    setNutritionPlan,
  } = useFormContext(); // Usa el contexto

  
  const [elemento, setElemento] = useState<Elemento>({ nombre: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [buscar, setBuscar] = useState(''); // Estado para el campo de búsqueda
  const [isLoading, setIsLoading] = useState(false); // Estado para el estado de carga

  const agregarElemento = () => {
    if (elemento.nombre) {
      
       setNutritionPlan(prev => ({
       ...prev,
       recomalimentos: [...prev.recomalimentos,{...elemento, frecuencia: '', cantidad: ''}]
      }));
      setElemento({ nombre: ''});
      setSnackbar({ open: true, message: 'Elemento agregado exitosamente', severity: 'success' });
    }else {
      setSnackbar({ open: true, message: 'Por favor ingrese un elemento', severity: 'error' });
    }
  };
  const eliminarElemento = (index: number) => {
    setNutritionPlan((prev) => {
      const nuevaLista = prev.recomalimentos.filter((_, i) => i !== index);
      return { ...prev, recomalimentos: nuevaLista };
    });
    setSnackbar({ open: true, message: 'Elemento eliminado exitosamente', severity: 'success' });
  };

  const limpiarBuscar = () => {
    setBuscar(''); // Limpia el campo de búsqueda
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="max-w-5xl mx-auto p-3 bg-white rounded-xl shadow-md">
        <Box className="p-6">
          <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Elementos a Evitar</Typography>
          <Box display="flex" justifyContent="space-around" mb={2}>
            <Box width="25%">
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>Elemento</Typography>
              <ul style={{ padding: 0, listStyleType: 'none' }}>
                {planesNutrionales.recomalimentos.length === 0 ? (
                   <li style={{ marginBottom: '14px', color: 'green' }}>No hay Alimentos listados.</li>
                ) : (
                  planesNutrionales.recomalimentos.map((elemento: Elemento, index: number) => (
                    <li key={index} style={{ marginBottom: '14px' }}>
                      {`${elemento.nombre}`} {/* Muestra el alimento concatenado */}
                    </li>
                  ))
                )}
              </ul>
            </Box>
            <Box width="25%">
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
              <ul style={{ padding: 0, listStyleType: 'none' }}>
                {planesNutrionales.recomalimentos.map((_, index: number) => (
                  <li key={index} style={{ marginBottom: '-1px' }}>
                    <IconButton onClick={() => eliminarElemento(index)} color="error">
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
            label="Buscar elemento"
            InputProps={{
              startAdornment: (
                <IconButton>
                  <Search />
                </IconButton>
              ),
              style: { borderRadius: '20px' },
            }}
            sx={{ width: '500px', marginRight: '10px' }} // Espacio entre el input y el botón
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
            sx={{ width: '690px' }}
            style={{ borderRadius: '50px', marginRight: '9px' }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={agregarElemento}
            style={{ width: '180px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Asegúrate de que el botón sea más ancho
          >
            Agregar
          </Button>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AlimentosEvitarSection;