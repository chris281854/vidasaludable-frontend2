import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, Snackbar, Alert } from '@mui/material';

interface Evaluacion {
    id: number;
    tipo: string; // 'nutricion' o 'clinico'
    paciente: string;
    fecha: string;
    descripcion: string;
    estado: string; // 'pendiente', 'completado', etc.
}

const EvaluacionesTable: React.FC = () => {
    const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        // Simulación de la carga de datos
        const fetchEvaluaciones = async () => {
            // Aquí deberías hacer una llamada a tu API para obtener las evaluaciones
            const data = [
                { id: 1, tipo: 'nutricion', paciente: 'Juan Pérez', fecha: '2023-10-01', descripcion: 'Evaluación nutricional inicial', estado: 'completado' },
                { id: 2, tipo: 'clinico', paciente: 'María López', fecha: '2023-10-02', descripcion: 'Consulta médica general', estado: 'completado' },
                // Agrega más datos según sea necesario
            ];
            setEvaluaciones(data);
        };

        fetchEvaluaciones();
    }, []);

    const handleConvertToFactura = (evaluacion: Evaluacion) => {
        // Lógica para convertir la evaluación a factura
        // Aquí puedes hacer una llamada a tu API para crear la factura
        setSnackbarMessage(`La evaluación de ${evaluacion.paciente} ha sido convertida a factura.`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Registros de Evaluaciones
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluaciones.map((evaluacion) => (
                            <TableRow key={evaluacion.id}>
                                <TableCell>{evaluacion.id}</TableCell>
                                <TableCell>{evaluacion.tipo}</TableCell>
                                <TableCell>{evaluacion.paciente}</TableCell>
                                <TableCell>{evaluacion.fecha}</TableCell>
                                <TableCell>{evaluacion.descripcion}</TableCell>
                                <TableCell>{evaluacion.estado}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleConvertToFactura(evaluacion)}
                                    >
                                        Convertir a Factura
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default EvaluacionesTable;