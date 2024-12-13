// src/components/NutritionEvaluationModal.tsx

import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface NutritionEvaluationModalProps {
    open: boolean;
    onClose: () => void;
    evaluationData: any[]; // Cambia esto a un tipo más específico si es necesario
    onSelectEvaluation: (evaluation: any) => void; // Nueva prop para manejar la selección
}

const NutritionEvaluationModal: React.FC<NutritionEvaluationModalProps> = ({ open, onClose, evaluationData = [], onSelectEvaluation }) => {
    const [filter, setFilter] = useState('');

    // Filtrar los datos según el input
    const filteredData = evaluationData.filter(evaluation => {
        const fullName = `${evaluation.paciente?.nombre} ${evaluation.paciente?.apellido}`.toLowerCase();
        return (
            evaluation.idEvaluacion.toString().includes(filter.toLowerCase()) ||
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
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>ID de Evaluación</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>Nombre del Paciente</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>Fecha de Evaluación</strong></TableCell>
                                    <TableCell sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}><strong>Próxima Cita</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((evaluation) => (
                                    <TableRow 
                                        key={evaluation.idEvaluacion} 
                                        onDoubleClick={() => onSelectEvaluation(evaluation)} // Manejar el doble clic
                                    >
                                        <TableCell>{evaluation.idEvaluacion}</TableCell>
                                        <TableCell>{evaluation.paciente?.nombre} {evaluation.paciente?.apellido}</TableCell>
                                        <TableCell>{formatDate(evaluation.fechaEvaluacion)}</TableCell>
                                        <TableCell>{evaluation.proximaCita}</TableCell>
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

export default NutritionEvaluationModal;