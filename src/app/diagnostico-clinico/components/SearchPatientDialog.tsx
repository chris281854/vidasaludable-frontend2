// components/SearchPatientsDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface Patient {
  rup: string;
  nombre: string;
  apellido: string;
  ciudad: string;
  fechaRegistro: string;
}

interface SearchPatientsDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectPatient: (rup: string) => void;
  loading: boolean;
  patients: Patient[];
}

const SearchPatientsDialog = ({
  open,
  onClose,
  onSelectPatient,
  loading,
  patients
}: SearchPatientsDialogProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPatients = patients.filter(patient => 
    patient.rup.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span>Búsqueda de Pacientes</span>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por RUP, nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>RUP</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Fecha Registro</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.rup}
                    hover
                    onClick={() => onSelectPatient(patient.rup)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>{patient.rup}</TableCell>
                    <TableCell>{patient.nombre}</TableCell>
                    <TableCell>{patient.apellido}</TableCell>
                    <TableCell>{patient.ciudad}</TableCell>
                    <TableCell>{patient.fechaRegistro}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchPatientsDialog;