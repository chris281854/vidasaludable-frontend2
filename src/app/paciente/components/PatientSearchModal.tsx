// PatientSearchModal.tsx
import React, { useState, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Aquí deberías cargar los pacientes desde tu API
    // Por ahora, usaremos datos de ejemplo
    setPatients([
        { 
          rup: '001', 
          nombre: 'Juan', 
          apellido: 'Pérez', 
          sexo: 'M', 
          ciudad: 'Asunción', 
          nacimiento: '1990-01-01', 
          registro: '2021-10-01', 
          email: 'juan@example.com',
          detallePaciente: {
            objetivo: 'Perder peso', 
            motivo: 'Sobrepeso'
          }
        },
        { 
          rup: '002', 
          nombre: 'María', 
          apellido: 'González', 
          sexo: 'F', 
          ciudad: 'Luque', 
          nacimiento: '1985-05-15', 
          registro: '2021-10-02', 
          email: 'maria@example.com',
          detallePaciente: {
            objetivo: 'Ganar masa muscular', 
            motivo: 'Delgadez'
          }
        },
        // ... más pacientes
      ]);
    }, []);

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