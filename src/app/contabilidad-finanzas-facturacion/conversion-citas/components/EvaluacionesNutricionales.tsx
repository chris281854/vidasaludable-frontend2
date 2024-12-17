import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, Snackbar, Alert } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs'; // Asegúrate de que dayjs esté instalado

interface EvaluacionNutricional {
    id: number;
    paciente: string;
    fecha: string;
    descripcion: string;
    estado: string; // 'completado', 'facturado', etc.
}

interface Factura {
    id: number;
    evaluacionId: number;
    monto: number;
    fecha: string;
}

const EvaluacionesNutricionales: React.FC = () => {
    const [evaluaciones, setEvaluaciones] = useState<EvaluacionNutricional[]>([]);
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchEvaluaciones = async () => {
            try {
                const response = await fetch('/api/server/evaluaciones-nutricionales');
                const data: EvaluacionNutricional[] = await response.json();
                
                // Aquí ya no filtramos por mes, simplemente asignamos todas las evaluaciones
                setEvaluaciones(data);
            } catch (error) {
                console.error('Error fetching evaluaciones:', error);
            }
        };

        fetchEvaluaciones();
    }, []);

    const handleConvertToFactura = (evaluacion: EvaluacionNutricional) => {
        // Lógica para convertir la evaluación a factura
        const newFactura: Factura = {
            id: facturas.length + 1, // Simulación de ID
            evaluacionId: evaluacion.id,
            monto: 100, // Simulación de monto
            fecha: new Date().toISOString(),
        };

        setFacturas([...facturas, newFactura]);
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
                Evaluaciones Nutricionales
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
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
                                <TableCell>{evaluacion.paciente}</TableCell>
                                <TableCell>{dayjs(evaluacion.fecha).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>{evaluacion.descripcion}</TableCell>
                                <TableCell>{evaluacion.estado}</TableCell>
                                <TableCell>
                                    {evaluacion.estado !== 'facturado' ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleConvertToFactura(evaluacion)}
                                            startIcon={<AddCircle />}
                                            sx={{ borderRadius: '50%' }} // Botón redondo
                                        >
                                            Convertir
                                        </Button>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">Facturado</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
                Facturas Generadas
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Factura</TableCell>
                            <TableCell>ID Evaluación</TableCell>
                            <TableCell>Monto</TableCell>
                            <TableCell>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {facturas.map((factura) => (
                            <TableRow key={factura.id}>
                                <TableCell>{factura.id}</TableCell>
                                <TableCell>{factura.evaluacionId}</TableCell>
                                <TableCell>${factura.monto}</TableCell>
                                <TableCell>{dayjs(factura.fecha).format('DD/MM/YYYY')}</TableCell>
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

export default EvaluacionesNutricionales;