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
  SelectChangeEvent,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useSession } from "next-auth/react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PatientSearchModal from '@/app/paciente/components/PatientSearchModal';

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
  userNamepac: string;
}

interface DetallePaciente {
  objetivo: string;
  motivo: string;
}

interface Paciente {
  rup: string;
  nombre: string;
  apellido: string;
  sexo: string;
  ciudad: string;
  nacimiento: string;
  registro: string;
  email: string;
  detallePaciente?: DetallePaciente;
}

const EditPatientForm: React.FC = () => {
  const { data: session, status } = useSession();
  const [patientData, setPatientData] = useState<PatientData>({
    rup: '',
    nombre: '',
    apellido: '',
    sexo: '',
    ciudad: '',
    email: '',
    nacimiento: '',
    registro: '',
    estado: '',
    userNamepac: '',
  });

  const [detallepaciente, setDetallepaciente] = useState<DetallePaciente>({
    objetivo: '',
    motivo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isRupDisabled, setIsRupDisabled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
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

  const checkRupExists = async (rup: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable/${rup}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.user?.token?.trim() || ''}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error al verificar el RUP:', error);
      return false;
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name === 'objetivo' || name === 'motivo') {
      setDetallepaciente(prev => ({ ...prev, [name]: value }));
    } else {
      setPatientData(prev => ({ ...prev, [name]: value }));
    }
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  
    // Si el campo es RUP y tiene al menos 5 caracteres, buscar el paciente
    if (name === 'rup' && value.length >= 5) {
      try {
        const patient = await searchPatientByRup(value);
        setPatientData({
          rup: patient.rup,
          nombre: patient.nombre,
          apellido: patient.apellido,
          sexo: patient.sexo,
          ciudad: patient.ciudad,
          email: patient.email,
          nacimiento: patient.nacimiento,
          registro: patient.registro,
          estado: patient.estado,
          userNamepac: patient.userNamepac,
        });
        if (patient.detallePaciente) {
          setDetallepaciente({
            objetivo: patient.detallePaciente.objetivo || '',
            motivo: patient.detallePaciente.motivo || '',
          });
        }
        setIsRupDisabled(true);
        setSnackbar({
          open: true,
          message: 'Paciente encontrado',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error al buscar el paciente:', error);
        setSnackbar({
          open: true,
          message: error instanceof Error ? error.message : 'Error al buscar el paciente',
          severity: 'error',
        });
        // Limpiar los campos si no se encuentra el paciente
        handleClear();
      }
    }
  };
    
//     const error = validateField(name, value);
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

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

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRupKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchPatient(patientData.rup);
    } else if (event.key === 'F12') {
      event.preventDefault();
      setIsSearchModalOpen(true);
    }
  };

  const handleRupContextMenu = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    setIsSearchModalOpen(true);
  };

  const handleSelectPatient = (paciente: Paciente) => {
    setPatientData({
      rup: paciente.rup,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      sexo: paciente.sexo,
      ciudad: paciente.ciudad,
      email: paciente.email,
      nacimiento: paciente.nacimiento,
      registro: paciente.registro,
      estado: '',
      userNamepac: '',
    });

    if (paciente.detallePaciente) {
      setDetallepaciente({
        objetivo: paciente.detallePaciente.objetivo || '',
        motivo: paciente.detallePaciente.motivo || '',
      });
    } else {
      setDetallepaciente({
        objetivo: '',
        motivo: '',
      });
    }

    setIsSearchModalOpen(false);
    setIsRupDisabled(true);
  };


  const searchPatient = async (rup: string) => {
    if (rup.length < 5) {
      setSnackbar({
        open: true,
        message: 'El RUP debe tener al menos 5 caracteres',
        severity: 'error',
      });
      return;
    }
  
    setIsLoading(true);
    try {
      const patient = await searchPatientByRup(rup);
      setPatientData({
        rup: patient.rup,
        nombre: patient.nombre,
        apellido: patient.apellido,
        sexo: patient.sexo,
        ciudad: patient.ciudad,
        email: patient.email,
        nacimiento: patient.nacimiento,
        registro: patient.registro,
        estado: patient.estado,
        userNamepac: patient.userNamepac,
      });
      if (patient.detallePaciente) {
        setDetallepaciente({
          objetivo: patient.detallePaciente.objetivo || '',
          motivo: patient.detallePaciente.motivo || '',
        });
      }
      setIsRupDisabled(true);
      setSnackbar({
        open: true,
        message: 'Paciente encontrado',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al buscar el paciente:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error al buscar el paciente',
        severity: 'error',
      });
      handleClear();
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRupGeneration = () => {
    const rup = `${patientData.nombre.charAt(0)}${patientData.apellido.charAt(0)}${Date.now()}`;
    setPatientData(prev => ({ ...prev, rup }));
    setIsRupDisabled(true);
    setOpenDialog(false);
  };


  const searchPatientByRup = async (rup: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable/${rup}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.user?.token?.trim() || ''}`,
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Paciente no encontrado');
        }
        throw new Error('Error al buscar el paciente');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al buscar el paciente:', error);
      throw error;
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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
        const rupExists = await checkRupExists(patientData.rup);
    if (!rupExists) {
      throw new Error('El RUP no existe. No se puede actualizar.');
    }
      const dataToSend = {
        
        nombre: patientData.nombre,
        apellido: patientData.apellido,
        sexo: patientData.sexo,
        ciudad: patientData.ciudad,
        email: patientData.email,
        nacimiento: new Date(patientData.nacimiento).toISOString().split('T')[0],
        registro: new Date(patientData.registro).toISOString().split('T')[0],
        estado: 'VIGENTE',                      
        userNamepac: session?.user?.name || 'defaultUser',
        detallepaciente:[ 
            {
          idPaciente: patientData.rup,
          objetivo: detallepaciente.objetivo,
          motivo: detallepaciente.motivo,
          fechaRegistro: new Date().toISOString(),
          fechaModificacion: new Date().toISOString(),
          estado: 'VIGENTE',
          userName: session?.user?.name || 'defaultUser',
        },
    ]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable/${patientData.rup}`, {
        method: 'PATCH',
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
    //    console.log('Datos a enviar:', JSON.stringify(dataToSend, null, 2));
      }

      setSnackbar({
        open: true,
        message: 'Paciente actualizado exitosamente',
        severity: 'success',
      });
    
      handleClear();
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar los datos del paciente',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
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
      estado: '',
      userNamepac: '',
    });
    setDetallepaciente({
      objetivo: '',
      motivo: '',
    });
    setErrors({});
    setIsRupDisabled(false);
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
              label="RUP"
              name="rup"
              value={patientData.rup}
              onChange={handleChange}
              onKeyDown={handleRupKeyDown}
              onContextMenu={handleRupContextMenu}
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

        <Box bgcolor="black" borderRadius="20px" mb={3} py={1} px={2}>
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
      <PatientSearchModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPatient={handleSelectPatient}
      />
    </ThemeProvider>
  );
};

export default EditPatientForm;