// src/components/NutritionEvaluationModal.tsx

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface HistorialClinicoModalProps {
    open: boolean;
    onClose: () => void;
    historialClinico: any[]; // Cambia esto a un tipo más específico si es necesario
    onSelectHistorial: (historial: any) => void; // Nueva prop para manejar la selección
}

const HistorialClinicoModal: React.FC<HistorialClinicoModalProps> = ({ open, onClose, historialClinico = [], onSelectHistorial }) => {
    const [filter, setFilter] = useState('');

    // Filtrar los datos según el input
    const filteredData = historialClinico.filter(historial => {
        const fullName = `${historial.paciente?.nombre} ${historial.paciente?.apellido}`.toLowerCase();
        return (
            historial.idHistorial.toString().includes(filter.toLowerCase()) ||
            fullName.includes(filter.toLowerCase())
        );
    }).slice(0, 5); // Limitar a 5 registros

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getDate()) ? 'Fecha inválida' : date.toLocaleDateString();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ 
                width: '80%', 
                maxWidth: 800, 
                bgcolor: 'background.paper', 
                p: 4, 
                borderRadius: 2, 
                boxShadow: 24, 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
            }}>
                <Typography color="success.main" variant="h6" component="h2" align="center">
                    Detalles de la Historial Clinico
                </Typography>

                {/* Input de búsqueda */}
                <TextField
                    label="Buscar por ID, Nombre o Apellido"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2, borderRadius: '20px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '20px',
                        },
                    }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />

                {filteredData.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>ID de Historial</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>Nombre del Paciente</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>Fecha de Historial</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>Próxima Cita</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((historial) => (
                                    <TableRow 
                                        key={historial.idHistorial} 
                                        onDoubleClick={() => onSelectHistorial(historial)} // Manejar el doble clic
                                    >
                                        <TableCell>{historial.idHistorial}</TableCell>
                                        <TableCell>{historial.paciente?.nombre} {historial.paciente?.apellido}</TableCell>
                                        <TableCell>{formatDate(historial.fechaRegistro)}</TableCell>
                                        <TableCell>{historial.proximaCita}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No se encontraron datos.</Typography>
                )}
               
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
                    <Button onClick={onClose} color="success" variant="contained" sx={{ borderRadius: '20px' }}>
                        Cerrar
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default HistorialClinicoModal;