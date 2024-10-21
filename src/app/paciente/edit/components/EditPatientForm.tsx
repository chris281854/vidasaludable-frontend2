import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  CircularProgress,
  Grid,
  Typography,
  Box,
  SelectChangeEvent
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: '15px',
        },
      },
    },
  },
});

const EditPatientForm: React.FC = () => {
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    patientId: '',
    email: '',
    birthDate: '',
    gender: '',
    registrationDate: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Datos guardados:', patientData);
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPatientData({
      firstName: '',
      lastName: '',
      phone: '',
      patientId: '',
      email: '',
      birthDate: '',
      gender: '',
      registrationDate: '',
      address: '',
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '1024px', margin: '0 auto' }}>
        <Box bgcolor="black" borderRadius="20px" mb={3} py={1} px={2}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Datos generales del paciente
          </Typography>
        </Box>
        
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del paciente"
              name="firstName"
              value={patientData.firstName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido del paciente"
              name="lastName"
              value={patientData.lastName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={patientData.phone}
              onChange={handleChange}
              variant="outlined"
              type="tel"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Registro Único de Paciente"
              name="patientId"
              value={patientData.patientId}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box bgcolor="black" borderRadius="20px" mb={3} py={1} px={2}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Datos complementarios del paciente
          </Typography>
        </Box>
        
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email del paciente"
              name="email"
              value={patientData.email}
              onChange={handleChange}
              variant="outlined"
              type="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de nacimiento"
              name="birthDate"
              value={patientData.birthDate}
              onChange={handleChange}
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="gender-label">Sexo</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={patientData.gender}
                onChange={handleChange}
                label="Sexo"
              >
                
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Femenino</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Registro"
              name="registrationDate"
              value={patientData.registrationDate}
              onChange={handleChange}
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Dirección"
          name="address"
          value={patientData.address}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FaSave />}
            style={{ width: '180px', height: '48px', borderRadius: '90px' }}
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
    </ThemeProvider>
  );
};

export default EditPatientForm;