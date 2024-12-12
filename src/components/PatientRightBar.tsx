// src/components/PatientRightBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Paper, 
  TextField, 
  Box, 
  Typography,
  InputAdornment,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';
import useFetchPatients from '../app/hooks/userFetchPatients';
import { Patient } from '../app/planes-nutricionales/interfaces/interfases';

interface PatientRightBarProps {
  patientData: {
    fotoUrl: string;
    nombrePaciente: string;
    apellidoPaciente: string;
    rupPaciente: string;
    fechaRegistro: Date | null;
    ciudadPaciente: string;
    objetivoConsulta: string;
    fechaNacimiento: string; // Añadir la fecha de nacimiento
    edad: number;
  };
  disabled?: boolean; 
  onRupChange: (rup: string) => void;
  onPatientSelect: (patient: Patient) => void;
}

const PatientRightBar: React.FC<PatientRightBarProps> = ({
  patientData,
  onRupChange,
  onPatientSelect,
  disabled
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patientData);
  const [warningOpen, setWarningOpen] = useState(false);
  const { patients, loading, error, fetchPatients } = useFetchPatients();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'F12') {
        event.preventDefault(); // Evita la acción predeterminada de F12
        setModalOpen(true); // Abre el modal
        fetchPatients(); // Llama a la función para obtener pacientes
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    const mappedPatientData = {
      fotoUrl: '',
      nombrePaciente: patient.nombre,
      apellidoPaciente: patient.apellido,
      rupPaciente: patient.rup,
      fechaRegistro: new Date(patient.registro),
      ciudadPaciente: patient.ciudad,
      objetivoConsulta: patient.detallepaciente?.[0]?.objetivo || 'No especificado',
      fechaNacimiento: patient.nacimiento, // Asegúrate de que esto esté en el objeto del paciente
      edad: calcularEdad(patient.nacimiento) // Calcular la edad
    };

    setSelectedPatient(mappedPatientData);
    onPatientSelect(patient);
    onRupChange(patient.rup);
    setModalOpen(false); // Cerrar el modal después de seleccionar
  };

  const calcularEdad = (fechaNacimiento: string) => {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const filteredPatients = patients.filter((patient: Patient) =>
    patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.rup.includes(searchTerm)
  );

  const handleRupClick = () => {
    setWarningOpen(true);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#25aa80', fontWeight: 'bold' }}>
          Información del Paciente
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="RUP"
            value={selectedPatient.rupPaciente}
            onChange={(e) => onRupChange(e.target.value)}
            disabled={disabled}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleRupClick}>
                    <EditIcon sx={{ color: '#25aa80' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: '20px', // Borde redondeado
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px', // Asegúrate de que el borde del input también sea redondeado
              },
            }}
          />

          <TextField
            fullWidth
            label="Nombre"
            value={selectedPatient.nombrePaciente}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Apellido"
            value={selectedPatient.apellidoPaciente}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Ciudad"
            value={selectedPatient.ciudadPaciente}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Fecha de Registro"
            value={selectedPatient.fechaRegistro ? new Date(selectedPatient.fechaRegistro).toLocaleDateString() : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Edad"
            value={selectedPatient.edad} // Mostrar la edad calculada
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Objetivo de la Consulta"
            value={selectedPatient.objetivoConsulta}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />
        </Box>
      </Box>

      {/* Modal para la búsqueda de pacientes */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="patient-search-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 1200,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Búsqueda de Pacientes</Typography>
            <IconButton onClick={() => setModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Buscar paciente"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    backgroundColor: '#f5f5f5',
                    '& th': { 
                      fontWeight: 'bold',
                      color: '#25aa80'
                    }
                  }}>
                    <TableCell>RUP</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Fecha Registro</TableCell>
                    <TableCell>Objetivo Clínico</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients.map((patient: Patient) => (
                    <TableRow
                      key={patient.rup}
                      hover
                      onDoubleClick={() => handlePatientSelect(patient)} // Al hacer doble clic, se selecciona el paciente
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f8f8f8'
                        }
                      }}
                    >
                      <TableCell>{patient.rup}</TableCell>
                      <TableCell>{patient.nombre}</TableCell>
                      <TableCell>{patient.apellido}</TableCell>
                      <TableCell>{patient.ciudad}</TableCell>
                      <TableCell>{new Date(patient.registro).toLocaleDateString()}</TableCell>
                      <TableCell>{patient.detallepaciente?.[0]?.objetivo || 'No especificado'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>

      {/* Modal de advertencia para el RUP */}
      <Modal
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        aria-labelledby="rup-warning-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Advertencia
          </Typography>
          <Alert severity="warning" icon={<WarningIcon fontSize="inherit" />}>
            No se recomienda modificar el RUP. Asegúrate de que los cambios sean necesarios.
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <IconButton onClick={() => setWarningOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default PatientRightBar;