import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, Snackbar, Alert } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs'; // Asegúrate de que dayjs esté instalado
import { useSession } from 'next-auth/react';

interface Paciente {
    id: number;
    nombre: string;
    apellido: string;
    sexo: string;
    ciudad: string;
    nacimiento: string;
    email: string;
}

interface EvaluacionNutricional {
    idEvaluacion: number;
    paciente: Paciente;
    fecha: string; // Cambiar a la fecha de registro o la fecha que desees mostrar
    objetivo: string;
    motivoConsulta: string;
    alergias: string;
    antecedentes: string;
    medicamentos: string;
    analiticas: string;
    tratamientos: string;
    observaciones: string;
    // Agrega otros campos según sea necesario
    estado: string; // 'completado', 'facturado', etc.
}

interface Factura {
    id: number;
    evaluacionId: number;
    monto: number;
    fecha: string;
}

const EvaluacionesNutricionales: React.FC = () => {
    const { data: session } = useSession();

    const [evaluaciones, setEvaluaciones] = useState<EvaluacionNutricional[]>([]);
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchEvaluaciones = async () => {
            try {
                if (!session) {
                    console.error('No session found');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/evaluaciones-nutricionales`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.user.token}`,
                    },
                });
                const data: EvaluacionNutricional[] = await response.json();
                
                // Asignamos todas las evaluaciones
                setEvaluaciones(data);
            } catch (error) {
                console.error('Error fetching evaluaciones:', error);
            }
        };

        fetchEvaluaciones();
    }, [session]);

    const handleConvertToFactura = (evaluacion: EvaluacionNutricional) => {
        // Lógica para convertir la evaluación a factura
        const newFactura: Factura = {
            id: facturas.length + 1, // Simulación de ID
            evaluacionId: evaluacion.idEvaluacion,
            monto: 100, // Simulación de monto
            fecha: new Date().toISOString(),
        };

        setFacturas([...facturas, newFactura]);
        setSnackbarMessage(`La evaluación de ${evaluacion.paciente.nombre} ${evaluacion.paciente.apellido} ha sido convertida a factura.`);
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
                            <TableCell>ID Evaluación</TableCell>
                            <TableCell>Paciente</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Objetivo</TableCell>
                            <TableCell>Motivo de Consulta</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluaciones.map((evaluacion) => (
                            <TableRow key={evaluacion.idEvaluacion}>
                                <TableCell>{evaluacion.idEvaluacion}</TableCell>
                                <TableCell>{`${evaluacion.paciente.nombre} ${evaluacion.paciente.apellido}`}</TableCell>
                                <TableCell>{dayjs(evaluacion.fecha).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>{evaluacion.objetivo}</TableCell>
                                <TableCell>{evaluacion.motivoConsulta}</TableCell>
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