import React from 'react';
import { FaSave } from 'react-icons/fa';
import { 
  TextField, 
  Button, 
  CircularProgress,
  Grid,
  Box,
  Snackbar,
  Alert,
  Typography
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useFormContext } from '../../context/FormContext'; // Asegúrate de que la ruta sea correcta
import SectionDivider from '../components/SectionDivider';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00A896',
    },
  },
});

const AddPatientForm: React.FC = () => {
  const {
    planesNutrionales,
    setNutritionPlan,
    handleInputChange, // Usa la función del contexto
    errors, // Asegúrate de que errors también esté en el contexto
    handleClear // Asegúrate de que handleClear también esté en el contexto
  } = useFormContext(); // Usa el contexto

  const [isLoading, setIsLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setIsLoading(true);
    const token = ''; // Obtén el token de sesión aquí
    try {
        await submitForm(token); // Asegúrate de que submitForm esté definido correctamente
        setSnackbar({
            open: true,
            message: 'Datos guardados exitosamente',
            severity: 'success',
        });
    } catch (error) {
        setSnackbar({
            open: true,
            message: 'Error al guardar los datos del paciente',
            severity: 'error',
        });
    } finally {
        setIsLoading(false);
    }
};

  const submitForm = async (token: string) => {
    // Lógica de envío del formulario con el token
    // Aquí puedes agregar la lógica que necesites para enviar el formulario
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };
 
    return (
      <ThemeProvider theme={theme}>
        <form onSubmit={handleFormSubmit} style={{ width: '100%', maxWidth: '1300px', margin: '0 auto' }}>
          
          {/* Sección de Recopilación Base del Paciente */}
          <Box className="w-full max-w-[1430px] p-5 rounded-lg">
            <SectionDivider top={0} text={'Recopilación base del paciente>'} />
          </Box>
          
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Objetivo del plan nutricional"
                name="objetivoPlan" // Cambia el nombre a "objetivoPlan"
                value={planesNutrionales.objetivoPlan} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.objetivoPlan} // Usa el error del hook
                helperText={errors.objetivoPlan} // Usa el helper text del hook
                multiline
                rows={2}
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observaciones del paciente"
                name="observacionesGenerales" // Cambia el nombre a "observacionesGenerales"
                value={planesNutrionales.observacionesGenerales} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.observacionesGenerales} // Usa el error del hook
                helperText={errors.observacionesGenerales} // Usa el helper text del hook
                multiline
                rows={2}
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
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
                value={planesNutrionales.funcionIntestinal} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.funcionIntestinal} // Usa el error del hook
                helperText={errors.funcionIntestinal} // Usa el helper text del hook
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Función del Sueño"
                name="funcionSueno"
                value={planesNutrionales.funcionSueno} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.funcionSueno} // Usa el error del hook
                helperText={errors.funcionSueno} // Usa el helper text del hook
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nivel de Actividad Física"
                name="nivelActividad"
                value={planesNutrionales.nivelActividad} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.nivelActividad} // Usa el error del hook
                helperText={errors.nivelActividad} // Usa el helper text del hook
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ingesta Calórica"
                name="ingestaCalorica"
                value={planesNutrionales.ingestaCalorica} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.ingestaCalorica} // Usa el error del hook
                helperText={errors.ingestaCalorica} // Usa el helper text del hook
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Niveles de Ansiedad"
                name="nivelesAnsiedad"
                value={planesNutrionales.nivelAnsiedad} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.nivelesAnsiedad} // Usa el error del hook
                helperText={errors.nivelesAnsiedad} // Usa el helper text del hook
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Otras Informaciones"
                name="otrasInformaciones"
                value={planesNutrionales.otrasInformaciones} // Usa el valor del hook
                onChange={handleInputChange} // Usa la función del hook
                variant="outlined"
                error={!!errors.otrasInformaciones} // Usa el error del hook
                helperText={errors.otrasInformaciones} // Usa el helper text del hook
                InputProps={{ style: { borderRadius: '15px' } }} // Input redondeado
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
              onClick={handleClear} // Usa la función del hook
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