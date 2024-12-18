import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, Snackbar, Alert, Modal, Box, TextField, Select, MenuItem, SnackbarCloseReason } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs'; // Asegúrate de que dayjs esté instalado
import { useSession } from 'next-auth/react';

interface Paciente {
    id: number;
    rup: string;
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
    estado: string; // 'completado', 'facturado', etc.
    facturado: boolean; // Nuevo campo booleano
}

interface Factura {
    rup: string;
    idFactura: number;
    total: number;
    fecha: string;
}

const ConversionCitas: React.FC = () => {
    const { data: session } = useSession();

    const [evaluaciones, setEvaluaciones] = useState<EvaluacionNutricional[]>([]);
    const [facturas, setFacturas] = useState<Factura[]>([]); // Asegúrate de que esto sea un array
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // Estado para el modal
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvaluacion, setSelectedEvaluacion] = useState<EvaluacionNutricional | null>(null);
    const [rup, setRup] = useState('');
    const [montoBruto, setMontoBruto] = useState(0);
    const [itbis, setItbis] = useState(0);
    const [total, setTotal] = useState(0);
    const [tipoFactura, setTipoFactura] = useState('AL CONTADO');

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
                        Authorization: `Bearer ${session?.user?.token || ''}`,
                    },
                });
                const data: EvaluacionNutricional[] = await response.json();
                
                // Filtrar evaluaciones del mes actual
                const currentMonth = dayjs().month();
                const currentYear = dayjs().year();
                const filteredEvaluaciones = data.filter(evaluacion => {
                    const evaluacionDate = dayjs(evaluacion.fecha);
                    return evaluacionDate.month() === currentMonth && evaluacionDate.year() === currentYear;
                });

                // Convertir el campo facturado a booleano si es necesario
                const updatedEvaluaciones = filteredEvaluaciones.map(evaluacion => ({
                    ...evaluacion,
                    facturado: Boolean(evaluacion.facturado), // Convertir a booleano
                }));

                // Asignamos las evaluaciones filtradas
                setEvaluaciones(updatedEvaluaciones);
            } catch (error) {
                console.error('Error fetching evaluaciones:', error);
            }
        };

        const fetchFacturas = async () => {
            try {
                if (!session) {
                    console.error('No session found');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/facturacion/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.user?.token || ''}`,
                    },
                });

                // Asegúrate de que la respuesta sea un array
                const data: Factura[] = await response.json();
                if (Array.isArray(data)) {
                    setFacturas(data);
                } else {
                    console.error('La respuesta de facturas no es un array:', data);
                }
            } catch (error) {
                console.error('Error fetching facturas:', error);
            }
        };

        fetchEvaluaciones();
        fetchFacturas(); // Llama a la función para obtener las facturas
    }, [session]);

    const handleConvertToFactura = (evaluacion: EvaluacionNutricional) => {
        setSelectedEvaluacion(evaluacion);
        setRup(evaluacion.paciente.rup); // Asignar el RUP del paciente
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setMontoBruto(0);
        setItbis(0);
        setTotal(0);
        setTipoFactura('AL CONTADO');
    };

    const handleSubmit = async () => {
        const newFactura = {
            rup,
            conceptoFactura: `Evaluación de ${selectedEvaluacion?.paciente.nombre} ${selectedEvaluacion?.paciente.apellido}`,
            montoBruto,
            itbis,
            total: montoBruto + (montoBruto * (itbis / 100)),
            tipoFactura,
            idMedico: 0, // Cambia esto según tu lógica
            userName: session?.user?.name,
        };
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/facturacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.token || ''}`,
                },
                body: JSON.stringify(newFactura),
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Captura el mensaje de error
                console.error('Error al crear la factura:', errorData);
                throw new Error(errorData.message || 'Error al crear la factura');
            }
    
            // Actualizar el estado de la evaluación a "facturado"
            const updatedEvaluaciones = evaluaciones.map(evaluacion => {
                if (evaluacion.idEvaluacion === selectedEvaluacion!.idEvaluacion) {
                    return { ...evaluacion, estado: 'facturado', facturado: true }; // Cambiar el estado a "facturado"
                }
                return evaluacion;
            });
    
            setEvaluaciones(updatedEvaluaciones); // Actualizar el estado local
            setFacturas([...facturas, { idFactura: facturas.length + 1, rup: selectedEvaluacion!.paciente.rup, total: newFactura.total, fecha: new Date().toISOString() }]); // Cambiar idEvaluacion por id del paciente
            setSnackbarMessage(`Factura creada para ${selectedEvaluacion?.paciente.nombre} ${selectedEvaluacion?.paciente.apellido}.`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage('Error al crear la factura.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleMontoChange = (value: number) => {
        setMontoBruto(value);
        setTotal(value + (value * (itbis / 100))); // Calcular total
    };

    const handleItbisChange = (value: number) => {
        setItbis(value);
        setTotal(montoBruto + (montoBruto * (value / 100))); // Calcular total
    };

    const handleCloseSnackbar = (event: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Typography color="success" variant="h4" gutterBottom>
                Evaluaciones Nutricionales
            </Typography>
            <Paper sx={{ marginBottom: 2, padding: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Evaluación</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Paciente</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Fecha</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Objetivo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Motivo de Consulta</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {evaluaciones.filter(evaluacion => !evaluacion.facturado).map((evaluacion) => (
                                <TableRow key={evaluacion.idEvaluacion}>
                                    <TableCell>{evaluacion.idEvaluacion}</TableCell>
                                    <TableCell>{`${evaluacion.paciente.nombre} ${evaluacion.paciente.apellido}`}</TableCell>
                                    <TableCell>{dayjs(evaluacion.fecha).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{evaluacion.objetivo}</TableCell>
                                    <TableCell>{evaluacion.motivoConsulta}</TableCell>
                                    <TableCell>
                                        {evaluacion.facturado ? (
                                            <Typography variant="body2" sx={{ 
                                                border: '1px solid green', 
                                                borderRadius: '20px', 
                                                padding: '4px 10px', 
                                                color: 'green', 
                                                display: 'inline-block' 
                                            }}>
                                                Facturado
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" sx={{ 
                                                border: '1px solid orange', 
                                                borderRadius: '20px', 
                                                padding: '4px 10px', 
                                                color: 'orange', 
                                                display: 'inline-block' 
                                            }}>
                                                Pendiente de Facturar
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {!evaluacion.facturado ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleConvertToFactura(evaluacion)}
                                                startIcon={<AddCircle />}
                                                sx={{ borderRadius: '50%' }} // Botón redondo
                                            >
                                                Convertir
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Typography color="success" variant="h4" gutterBottom sx={{ marginTop: 4 }}>
                Facturas Generadas
            </Typography>
            <Paper sx={{ padding: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Factura</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID Paciente</TableCell> {/* Cambiado de ID Evaluación a ID Paciente */}
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Monto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facturas.map((factura) => (
                                <TableRow key={factura.idFactura}>
                                    <TableCell>{factura.idFactura}</TableCell>
                                    <TableCell>{factura.rup}</TableCell> {/* Cambiado a idEvaluacion para mostrar el ID del paciente */}
                                    <TableCell>${factura.total}</TableCell>
                                    <TableCell>{dayjs(factura.fecha).format('DD/MM/YYYY')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Modal para crear factura */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 400, 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" gutterBottom>
                        Crear Factura
                    </Typography>
                    <TextField
                        label="RUP"
                        value={rup}
                        fullWidth
                        margin="dense"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        label="Monto Bruto"
                        type="number"
                        value={montoBruto}
                        onChange={(e) => handleMontoChange(Number(e.target.value))}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="ITBIS (%)"
                        type="number"
                        value={itbis}
                        onChange={(e) => handleItbisChange(Number(e.target.value))}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Total"
                        value={total}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <Select
                        value={tipoFactura}
                        onChange={(e) => setTipoFactura(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="AL CONTADO">AL CONTADO</MenuItem>
                        <MenuItem value="A CREDITO">A CREDITO</MenuItem>
                    </Select>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSubmit} 
                        sx={{ marginTop: 2 }}
                    >
                        Registrar Factura
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default ConversionCitas;