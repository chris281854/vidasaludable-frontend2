import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { 
  TextField, 
  Button, 
  CircularProgress,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { form } from 'framer-motion/client';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00A896',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '15px',
        },
      },
    },
  },
});

interface DetallePaciente {
  objetivo: string;
  observaciones: string;
  funcionIntestinal: string;
  funcionSueno: string;
  nivelActividad: string;
  ingestaCalorica: string;
  nivelesAnsiedad: string;
  otrasInformaciones: string;
}

const AddPatientForm: React.FC = () => {
  const [detallepaciente, setDetallepaciente] = useState<DetallePaciente>({
    objetivo: '',
    observaciones: '',
    funcionIntestinal: '',
    funcionSueno: '',
    nivelActividad: '',
    ingestaCalorica: '',
    nivelesAnsiedad: '',
    otrasInformaciones: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({
    objetivo: '',
    observaciones: '',
    funcionIntestinal: '',
    funcionSueno: '',
    nivelActividad: '',
    ingestaCalorica: '',
    nivelesAnsiedad: '',
    otrasInformaciones: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'objetivo':
      case 'observaciones':
        if (value.trim().length < 10) {
          error = 'Debe tener al menos 10 caracteres';
        }
        break;
      case 'funcionIntestinal':
      case 'funcionSueno':
      case 'nivelActividad':
      case 'ingestaCalorica':
      case 'nivelesAnsiedad':
      case 'otrasInformaciones':
        if (value.trim().length < 3) {
          error = 'Debe tener al menos 3 caracteres';
        }
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetallepaciente(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors = {
      ...Object.keys(detallepaciente).reduce((acc, key) => ({
        ...acc,
        [key]: validateField(key, detallepaciente[key as keyof DetallePaciente])
      }), {})
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      console.error('Hay errores en el formulario');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí puedes manejar el envío de los datos
      console.log('Datos del paciente:', detallepaciente);
      
      setSnackbar({
        open: true,
        message: 'Datos guardados exitosamente',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al guardar los datos:', `${(error as Error).message}`);
      setSnackbar({
        open: true,
        message: 'Error al guardar los datos del paciente',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setDetallepaciente({
      objetivo: '',
      observaciones: '',
      funcionIntestinal: '',
      funcionSueno: '',
      nivelActividad: '',
      ingestaCalorica: '',
      nivelesAnsiedad: '',
      otrasInformaciones: '',
    });
    setErrors({
      objetivo: '',
      observaciones: '',
      funcionIntestinal: '',
      funcionSueno: '',
      nivelActividad: '',
      ingestaCalorica: '',
      nivelesAnsiedad: '',
      otrasInformaciones: '',
    });
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '1024px', margin: '0 auto' }}>
        
        {/* Sección de Recopilación Base del Paciente */}
        <Box bgcolor="black" borderRadius="20px" mt={5} mb={3} py={1} px={2}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Recopilación base del paciente
          </Typography>
        </Box>
        
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objetivo del plan nutricional"
              name="objetivo"
              value={detallepaciente.objetivo}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.objetivo}
              helperText={errors.objetivo}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones del paciente"
              name="observaciones"
              value={detallepaciente.observaciones}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.observaciones}
              helperText={errors.observaciones}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        {/* Sección de Historial Personal del Paciente */}
        <Box bgcolor="black" borderRadius="20px" mb={3} py={1} px={2}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Historial personal del paciente
          </Typography>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Función Intestinal"
              name="funcionIntestinal"
              value={detallepaciente.funcionIntestinal}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.funcionIntestinal}
              helperText={errors.funcionIntestinal}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Función del Sueño"
              name="funcionSueno"
              value={detallepaciente.funcionSueno}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.funcionSueno}
              helperText={errors.funcionSueno}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nivel de Actividad Física"
              name="nivelActividad"
              value={detallepaciente.nivelActividad}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.nivelActividad}
              helperText={errors.nivelActividad}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ingesta Calórica"
              name="ingestaCalorica"
              value={detallepaciente.ingestaCalorica}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.ingestaCalorica}
              helperText={errors.ingestaCalorica}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Niveles de Ansiedad"
              name="nivelesAnsiedad"
              value={detallepaciente.nivelesAnsiedad}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.nivelesAnsiedad}
              helperText={errors.nivelesAnsiedad}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Otras Informaciones"
              name="otrasInformaciones"
              value={detallepaciente.otrasInformaciones}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.otrasInformaciones}
              helperText={errors.otrasInformaciones}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FaSave />}
            style={{ 
              width: '180px', 
              height: '48px', 
              borderRadius: '90px',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Guardar
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={handleClear}
            style={{ width: '180px', height: '48px', borderRadius: '90px' }}
          >
            Limpiar
          </Button>
        </Box>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AddPatientForm;