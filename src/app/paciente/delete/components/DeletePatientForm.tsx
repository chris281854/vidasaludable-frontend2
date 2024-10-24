import React, { useState } from 'react';
import { FaFingerprint } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';
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

const DeletePatientForm: React.FC = () => {
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
      case 'rup':
        if (value.trim().length < 5) {
          error = 'Debe tener al menos 5 caracteres';
        }
        break;
      // Puedes agregar más validaciones si es necesario
    }
    return error;
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  
    if (name === 'rup' && value.length >= 5) {
      await searchPatient(value);
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

  const handleDelete = () => {
    if (window.confirm('¿Está seguro de que desea eliminar este paciente?')) {
      handleSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!patientData.rup) {
      setSnackbar({
        open: true,
        message: 'Por favor, ingrese un RUP válido',
        severity: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable/${patientData.rup}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.user?.token?.trim() || ''}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta del servidor:', response.status, errorText);
        throw new Error(`Error del servidor: ${response.status} ${errorText}`);
      }

      setSnackbar({
        open: true,
        message: 'Paciente eliminado exitosamente',
        severity: 'success',
      });
    
      handleClear();
    } catch (error) {
      console.error('Error al eliminar los datos:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error al eliminar los datos del paciente',
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
            Datos del paciente a eliminar
          </Typography>
        </Box>
        
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
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
                  <IconButton onClick={() => searchPatient(patientData.rup)} disabled={isRupDisabled}>
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
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido del paciente"
              name="apellido"
              value={patientData.apellido}
              variant="outlined"
              disabled
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleDelete}
            disabled={isLoading || !patientData.rup}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <MdDeleteSweep />}
            style={{ 
              width: '180px', 
              height: '48px', 
              borderRadius: '90px',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Eliminar
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
      <PatientSearchModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPatient={handleSelectPatient}
      />
    </ThemeProvider>
  );
};

export default DeletePatientForm;