 'use client';

import { useState, useEffect } from 'react';
import { 
  Paper, 
  TextField, 
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

interface DetallePaciente {
  objetivo: string;
  motivo: string;
}

interface Patient {
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

interface PatientSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectPatient: (patient: Patient) => void;
  onRupChange: (rup: string) => void;
  patientData: {
    fotoUrl: string;
    nombrePaciente: string;
    apellidoPaciente: string;
    rupPaciente: string;
    fechaRegistro: Date | null;
    ciudadPaciente: string;
    objetivoConsulta: string;
    ultimaActualizacion: null;
  };
}

const PatientSearchModal: React.FC<PatientSearchModalProps> = ({ 
  open, 
  onClose, 
  onSelectPatient,
  onRupChange}) => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientData, setSelectedPatientData] = useState({
    fotoUrl: '',
    nombrePaciente: '',
    apellidoPaciente: '',
    rupPaciente: '',
    fechaRegistro: null as Date | null,
    ciudadPaciente: '',
    objetivoConsulta: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!session?.user?.token) {
        console.warn('No hay token disponible.');
        setError('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los datos');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => {
            const detalle: DetallePaciente | undefined = item.detallepaciente[0];
            return {
              rup: item.rup,
              nombre: item.nombre,
              apellido: item.apellido,
              sexo: item.sexo,
              ciudad: item.ciudad,
              nacimiento: item.nacimiento,
              registro: item.registro,
              email: item.email,
              detallePaciente: {
                objetivo: detalle?.objetivo || 'No especificado',
                motivo: detalle?.motivo || 'No especificado',
              },
            };
          });

          setPatients(formattedData);
        } else {
          setError('Formato de datos inesperado');
        }
      } catch (err) {
        console.error('Error durante la llamada a la API:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && open) {
      fetchPatients();
    }
  }, [session, status, open]);

  useEffect(() => {
    setFilteredPatients(
      patients.filter(patient =>
        patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.rup.includes(searchTerm)
      )
    );
  }, [searchTerm, patients]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatientData({
      fotoUrl: '', // Actualizar si tienes una URL de foto
      nombrePaciente: patient.nombre,
      apellidoPaciente: patient.apellido,
      rupPaciente: patient.rup,
      fechaRegistro: new Date(patient.registro),
      ciudadPaciente: patient.ciudad,
      objetivoConsulta: patient.detallePaciente?.objetivo || 'No especificado'
    });
  };
  

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: '400px',
        zIndex: 1200,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <div className="flex justify-between items-center">
          <Typography variant="h6">Búsqueda de Pacientes</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </Box>

      <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        <TextField
          fullWidth
          margin="dense"
          label="Buscar paciente"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ color: 'error.main', p: 2 }}>{error}</Box>
        ) : (
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>RUP</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Ciudad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.rup}
                    hover
                    onClick={() => onSelectPatient(patient)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{patient.rup}</TableCell>
                    <TableCell>{`${patient.nombre} ${patient.apellido}`}</TableCell>
                    <TableCell>{patient.ciudad}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
};

export default PatientSearchModal;