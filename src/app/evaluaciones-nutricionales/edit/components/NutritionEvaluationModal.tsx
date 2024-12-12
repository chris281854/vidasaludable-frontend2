// src/components/NutritionEvaluationModal.tsx

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface NutritionEvaluationModalProps {
    open: boolean;
    onClose: () => void;
    evaluationData: any[]; // Cambia esto a un tipo más específico si es necesario
}

const NutritionEvaluationModal: React.FC<NutritionEvaluationModalProps> = ({ open, onClose, evaluationData }) => {
    const [filter, setFilter] = useState('');

    // Filtrar los datos según el input
    const filteredData = evaluationData.filter(evaluation  => {
        const fullName = `${evaluation.paciente?.nombre} ${evaluation.paciente?.apellido}`.toLowerCase();
        return (
            evaluation.idEvaluacion.toString().includes(filter.toLowerCase()) ||
            fullName.includes(filter.toLowerCase())
        );
    }).slice(0, 10); // Limitar a 10 registros

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
                <Typography  color='success' variant="h6" component="h2" align="center">
                    Detalles de la Evaluación Nutricional
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
                                    <TableCell sx={{ backgroundColor: '#e0f2f1', fontWeight: 'bold' }}><strong>ID de Evaluación</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#e0f2f1', fontWeight: 'bold' }}><strong>Nombre del Paciente</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#e0f2f1', fontWeight: 'bold' }}><strong>Fecha de Evaluación</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#e0f2f1', fontWeight: 'bold' }}><strong>Próxima Cita</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((evaluation) => (
                                    <TableRow key={evaluation.idEvaluacion}>
                                        <TableCell>{evaluation.idEvaluacion}</TableCell>
                                        <TableCell>{evaluation.paciente?.nombre} {evaluation.paciente?.apellido}</TableCell>
                                        <TableCell>{evaluation.fechaEvaluacion}</TableCell>
                                        <TableCell>{evaluation.proximaCita}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No se encontraron datos.</Typography>
                )}
                <div className="flex justify-start">
                <Button onClick={onClose} variant="contained" sx={{ color:'success', mt: 2, display: 'block', margin: '0 auto' }}>
                    Cerrar
                </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default NutritionEvaluationModal;