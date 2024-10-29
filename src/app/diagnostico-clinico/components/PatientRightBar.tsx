'use client';

import { useState, useEffect } from 'react';
import { 
  Paper, 
  TextField, 
  Box, 
  Typography,
  Avatar,
  InputAdornment,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useSession } from 'next-auth/react';

interface Patient {
    rup: string;
    nombre: string;
    apellido: string;
    sexo: string;
    ciudad: string;
    nacimiento: string;
    registro: string;
    email: string;
    detallepaciente?: DetallePaciente[];
  }

  interface DetallePaciente {
    objetivo: string;
    motivo: string;
  }

interface PatientRightBarProps {
  patientData: {
    fotoUrl: string;
    nombrePaciente: string;
    apellidoPaciente: string;
    rupPaciente: string;
    fechaRegistro: Date | null;
    ciudadPaciente: string;
    objetivoConsulta: string;
  };
  onRupChange: (rup: string) => void;
  onPatientSelect: (patient: Patient) => void;
}

const PatientRightBar: React.FC<PatientRightBarProps> = ({
  patientData,
  onRupChange,
  onPatientSelect
}) => {
  const { data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(patientData.fotoUrl || null);
  const [modalOpen, setModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'F12') {
        event.preventDefault();
        setModalOpen(true);
        fetchPatients();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const fetchPatients = async () => {
    if (!session?.user?.token) {
      setError('No autorizado. Inicia sesión.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener los datos');

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      setError('Error al cargar los pacientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    // Mapear los datos del paciente al formato esperado por patientData
    const formattedPatient = {
      ...patient,
      detallepaciente: patient.detallepaciente || [{
        objetivo: 'No especificado',
        motivo: 'No especificado'
      }]
    };
  
  // Crear el objeto con el formato correcto de patientData
  const mappedPatientData = {
    fotoUrl: '', // Si tienes una URL de foto en los datos del paciente
    nombrePaciente: formattedPatient.nombre,
    apellidoPaciente: formattedPatient.apellido,
    rupPaciente: formattedPatient.rup,
    fechaRegistro: new Date(formattedPatient.registro),
    ciudadPaciente: formattedPatient.ciudad,
    objetivoConsulta: formattedPatient.detallepaciente[0]?.objetivo || 'No especificado'
  };
    // Llamar a onPatientSelect con los datos mapeados
    onPatientSelect(formattedPatient);
    onRupChange(formattedPatient.rup);
    setModalOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.rup.includes(searchTerm)
  );

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

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={imagePreview || '/default-avatar.png'}
              sx={{ 
                width: 120, 
                height: 120,
                border: '3px solid #25aa80'
              }}
            />
            <input
              accept="image/*"
              type="file"
              hidden
              id="photo-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="photo-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#25aa80',
                  '&:hover': { backgroundColor: '#1e8c66' },
                }}
              >
                <PhotoCameraIcon sx={{ color: 'white' }} />
              </IconButton>
            </label>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="RUP"
            value={patientData.rupPaciente}
            onChange={(e) => onRupChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#25aa80',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#25aa80',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Nombre"
            value={patientData.nombrePaciente}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Apellido"
            value={patientData.apellidoPaciente}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Ciudad"
            value={patientData.ciudadPaciente}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Fecha de Registro"
            value={patientData.fechaRegistro ? new Date(patientData.fechaRegistro).toLocaleDateString() : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Objetivo de la Consulta"
            value={patientData.objetivoConsulta}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon sx={{ color: '#25aa80' }} />
                </InputAdornment>
              ),
              readOnly: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />
        </Box>
      </Box>

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
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
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
                  {filteredPatients.map((patient) => (
                    <TableRow
                      key={patient.rup}
                      hover
                      onDoubleClick={() => handlePatientSelect(patient)}
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
                      <TableCell>{formatDate(patient.registro)}</TableCell>
                      <TableCell sx={{ 
                        maxWidth: 200,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                          {patient.detallepaciente?.[0]?.objetivo || 'No especificado'}
                          </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>
    </Paper>
  );
};

export default PatientRightBar;