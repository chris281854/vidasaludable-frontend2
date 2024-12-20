'use client';

import React, { useState } from 'react';
import { FaSave, FaFingerprint } from 'react-icons/fa';
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
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  SelectChangeEvent
} from '@mui/material';
import { useSession } from "next-auth/react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

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

interface PatientData {
  rup: string;
  nombre: string;
  apellido: string;
  sexo: string;
  ciudad: string;
  email: string;
  nacimiento: string;
  registro: string;
  estado: string;
  identificacion: string;
  tipoIdentificacion: string; // Valor por defecto
  userNamepac: string;
}

interface DetallePaciente {
  objetivo: string;
  motivo: string;
}

const AddPatientForm: React.FC = () => {
  const { data: session } = useSession();

  const [patientData, setPatientData] = useState<PatientData>({
    rup: '',
    nombre: '',
    apellido: '',
    sexo: '',
    ciudad: '',
    email: '',
    nacimiento: '',
    registro: '',
    userNamepac: '',
    estado: '',
    identificacion: '',
    tipoIdentificacion: 'cedula', // Valor por defecto
  });

  const [detallepaciente, setDetallepaciente] = useState<DetallePaciente>({
    objetivo: '',
    motivo: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [errors, setErrors] = useState<Record<string, string>>({
    identificacion: '',
    nombre: '',
    apellido: '',
    sexo: '',
    ciudad: '',
    email: '',
    nacimiento: '',
    registro: '',
    objetivo: '',
    motivo: '',
  });

  const [isIdentificacionValid, setIsIdentificacionValid] = useState<boolean | null>(null); // Estado para manejar la validación
  const [openDialog, setOpenDialog] = useState(false);
  const [isRupDisabled, setIsRupDisabled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name === 'objetivo' || name === 'motivo') {
      setDetallepaciente(prev => ({ ...prev, [name]: value }));
    } else {
      setPatientData(prev => ({ ...prev, [name]: value }));
    }

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'identificacion':
        if (patientData.tipoIdentificacion === 'cedula') {
          const isValidCedula = /^\d{11}$/.test(value);
          if (!isValidCedula) {
            error = 'La cédula debe tener exactamente 11 dígitos y solo contener números.';
          }
        }
        break;
      case 'nombre':
      case 'apellido':
        if (value.trim().length < 2) {
          error = 'Debe tener al menos 2 caracteres';
        }
        break;
      case 'rup':
        if (value.trim().length < 5) {
          error = 'Debe tener al menos 5 caracteres';
        }
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Debe ser un email válido';
        }
        break;
      case 'nacimiento':
      case 'registro':
        if (!value) {
          error = 'La fecha es requerida';
        }
        break;
      case 'sexo':
        if (!value) {
          error = 'Seleccione una opción';
        }
        break;
      case 'ciudad':
        if (value.trim().length < 3) {
          error = 'Debe tener al menos 3 caracteres';
        }
        break;
      case 'objetivo':
      case 'motivo':
        if (value.trim().length < 10) {
          error = 'Debe tener al menos 10 caracteres';
        }
        break;
    }
    return error;
  };

  const handleTipoIdentificacionChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setPatientData(prev => ({ ...prev, tipoIdentificacion: value as string, identificacion: '' })); // Reiniciar el campo de identificación
    setErrors(prev => ({ ...prev, identificacion: '' })); // Limpiar errores
  };

  const validateIdentification = async (): Promise<boolean> => {
    if (patientData.tipoIdentificacion === 'cedula') {
      // Aquí puedes hacer la llamada a la API para validar la cédula
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable/validar/${patientData.identificacion}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token || ''}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Error al validar la cédula');
        }
  
        const data = await response.json();
  
        // Verifica si se encontró el paciente
        if (data.identificacion) {
          // Si la identificación coincide con la ingresada
          if (data.identificacion === patientData.identificacion) {
            // Muestra el mensaje de error debajo del input
            setErrors(prev => ({
              ...prev,
              identificacion: 'La cédula ya está registrada.',
            }));
            setIsIdentificacionValid(false); // Indica que la identificación no es válida
            return false;
          }
        } else {
          // Si no se devuelve nada, la cédula está disponible
          setErrors(prev => ({
            ...prev,
            identificacion: 'Identificación disponible', // Mensaje de disponibilidad
          }));
          setIsIdentificacionValid(true); // Indica que la identificación es válida
          return true;
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al validar la cédula.');
        setIsIdentificacionValid(false); // En caso de error, marcamos como no válida
        return false;
      }
    }
    return false;
  };

  const handleGenerateRup = () => {
    if (patientData.nombre && patientData.apellido) {
      setOpenDialog(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Por favor, complete el nombre y apellido antes de generar el RUP',
        severity: 'error',
      });
    }
  };

  const handleConfirmRupGeneration = () => {
    const rup = `${patientData.nombre.charAt(0)}${patientData.apellido.charAt(0)}${Date.now()}`;
    setPatientData(prev => ({ ...prev, rup }));
    setIsRupDisabled(true);
    setOpenDialog(false);
  };


  const handleClear = () => {
    setPatientData({
      rup: '',
      nombre: '',
      apellido: '',
      sexo: '',
      ciudad: '',
      email: '',
      nacimiento: '',
      registro: '',
      userNamepac: '',
      estado: '',
      identificacion: '',
      tipoIdentificacion: 'cedula', // Valor por defecto
    });
    setDetallepaciente({
      objetivo: '',
      motivo: '',
    });
    setErrors({
      identificacion: '',
      nombre: '',
      apellido: '',
      sexo: '',
      ciudad: '',
      email: '',
      nacimiento: '',
      registro: '',
      objetivo: '',
      motivo: '',
    });
    setIsRupDisabled(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isAvailable = await validateIdentification();
    if (isAvailable === false) {
      setSnackbar({
        open: true,
        message: 'La identificación ya está registrada.',
        severity: 'error',
      });
      return;
    }

    const newErrors = {
      ...Object.keys(patientData).reduce((acc, key) => ({
        ...acc,
        [key]: validateField(key, patientData[key as keyof PatientData])
      }), {}),
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
      const dataToSend = {
        rup: patientData.rup,
        nombre: patientData.nombre,
        apellido: patientData.apellido,
        sexo: patientData.sexo,
        ciudad: patientData.ciudad,
        email: patientData.email,
        nacimiento: new Date(patientData.nacimiento).toISOString().split('T')[0], // Formato YYYY-MM-DD
        registro: new Date(patientData.registro).toISOString().split('T')[0], // Formato YYYY-MM-DD
        estado: 'VIGENTE',
        userNamepac: session?.user?.name || 'defaultUser',
        detallepaciente: {
          idPaciente: patientData.rup,
          objetivo: detallepaciente.objetivo,
          motivo: detallepaciente.motivo,
          fechaRegistro: new Date().toISOString(),
          fechaModificacion: new Date().toISOString(),
          estado: 'VIGENTE',
          userName: session?.user?.name || 'defaultUser',
        },
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token?.trim() || ''}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta del servidor:', response.status, errorText);
        throw new Error(`Error del servidor: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      setSnackbar({
        open: true,
        message: 'Paciente guardado exitosamente',
        severity: 'success',
      });

      handleClear();
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

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para restringir la entrada de caracteres especiales
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (patientData.tipoIdentificacion === 'cedula') {
      const char = String.fromCharCode(e.which);
      if (!/^\d$/.test(char)) {
        e.preventDefault(); // Evita la entrada de caracteres no numéricos
      }
    }
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tipo de Identificación</InputLabel>
              <Select
                name="tipoIdentificacion"
                value={patientData.tipoIdentificacion}
                onChange={handleTipoIdentificacionChange}
                label="Tipo de Identificación"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderColor: isIdentificacionValid === null ? 'transparent' : isIdentificacionValid ? 'green' : 'red',
                  },
                  '& .MuiSelect-icon': {
                    color: isIdentificacionValid === null ? 'inherit' : isIdentificacionValid ? 'green' : 'red', // Color del ícono de selección
                  }
                }}
              >
                <MenuItem value="cedula">Cédula</MenuItem>
                <MenuItem value="pasaporte">Pasaporte</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Identificación"
              name="identificacion"
              value={patientData.identificacion}
              onChange={handleChange}
              onKeyPress={handleKeyPress} // Agregar el evento onKeyPress
              variant="outlined"
              error={!!errors.identificacion}
              helperText={errors.identificacion}
              id="identificacionInput"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={validateIdentification} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderColor: isIdentificacionValid === null ? 'transparent' : isIdentificacionValid ? 'green' : 'red',
                },
                '& .MuiFormHelperText-root': {
                  color: isIdentificacionValid === null ? 'inherit' : isIdentificacionValid ? 'green' : 'red', // Cambiar color del helper text
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="RUP"
              name="rup"
              value={patientData.rup}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.rup}
              helperText={errors.rup}
              disabled={isRupDisabled}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleGenerateRup} disabled={isRupDisabled}>
                    <FaFingerprint />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre del paciente"
              name="nombre"
              value={patientData.nombre}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido del paciente"
              name="apellido"
              value={patientData.apellido}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.apellido}
              helperText={errors.apellido}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" error={!!errors.sexo}>
              <InputLabel id="sexo-label">Sexo</InputLabel>
              <Select
                labelId="sexo-label"
                name="sexo"
                value={patientData.sexo}
                onChange={handleChange}
                label="Sexo"
              >
                <MenuItem value="">Seleccione</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="femenino">Femenino</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
              {errors.sexo && <Typography color="error" variant="caption">{errors.sexo}</Typography>}
            </FormControl>
          </Grid>
        </Grid>

        <Box bgcolor="black" borderRadius="20px" mb={3} mt={4} py={1} px={2}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Datos complementarios del paciente
          </Typography>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ciudad"
              name="ciudad"
              value={patientData.ciudad}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.ciudad}
              helperText={errors.ciudad}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={patientData.email}
              onChange={handleChange}
              variant="outlined"
              type="email"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de nacimiento"
              name="nacimiento"
              value={patientData.nacimiento}
              onChange={handleChange}
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.nacimiento}
              helperText={errors.nacimiento}
              inputProps={{
                max: new Date().toISOString().split("T")[0], // Establecer la fecha máxima como la fecha actual
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Registro"
              name="registro"
              value={patientData.registro}
              onChange={handleChange}
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.registro}
              helperText={errors.registro}
              inputProps={{
                max: new Date().toISOString().split("T")[0], // Establecer la fecha máxima como la fecha actual
              }}
            />
          </Grid>
        </Grid>

        <Box bgcolor="black" borderRadius="20px" mb={3} mt={4} py={1} px={2}>
          <Typography variant="subtitle1" color="white" fontWeight="bold">
            Detalle de pacientes
          </Typography>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objetivo del paciente"
              name="objetivo"
              value={detallepaciente.objetivo}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.objetivo}
              helperText={errors.objetivo}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Motivo de consulta"
              name="motivo"
              value={detallepaciente.motivo}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.motivo}
              helperText={errors.motivo}
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
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmación de generación de RUP"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Una vez generado, el RUP no podrá ser editado. ¿Está seguro de que desea generar el RUP ahora?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmRupGeneration} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default AddPatientForm;