// PatientSearchModal.tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  styled,
} from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon, PersonOutline as PersonOutlineIcon } from '@mui/icons-material';



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
}

const GreenTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  }));

  const PatientSearchModal: React.FC<PatientSearchModalProps> = ({ open, onClose, onSelectPatient }) => {
    const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
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

    if (status === 'authenticated') {
      fetchPatients();
    }
  }, [session, status]);

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

  const handleSelectPatient = (patient: Patient) => {
    onSelectPatient(patient);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Buscar Paciente
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
      <TextField
          autoFocus
          margin="dense"
          id="search"
          label="Buscar paciente"
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
              <GreenTableCell>RUP</GreenTableCell>
                <GreenTableCell>Nombre</GreenTableCell>
                <GreenTableCell>Apellido</GreenTableCell>
                <GreenTableCell>Sexo</GreenTableCell>
                <GreenTableCell>Ciudad</GreenTableCell>
                <GreenTableCell>Email</GreenTableCell>
                <GreenTableCell>Nacimiento</GreenTableCell>
                <GreenTableCell>Registro</GreenTableCell>
                <GreenTableCell>Motivo</GreenTableCell>
                <GreenTableCell>Objetivo</GreenTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow
                  key={patient.rup}
                  hover
                  onClick={() => handleSelectPatient(patient)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{patient.rup}</TableCell>
                  <TableCell>{patient.nombre}</TableCell>
                  <TableCell>{patient.apellido}</TableCell>
                  <TableCell>{patient.sexo}</TableCell>
                  <TableCell>{patient.ciudad}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.nacimiento}</TableCell>
                  <TableCell>{patient.registro}</TableCell>
                  <TableCell>{patient.detallePaciente?.motivo}</TableCell>
                  <TableCell>{patient.detallePaciente?.objetivo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default PatientSearchModal;