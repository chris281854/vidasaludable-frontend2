import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

interface DiagnosticoDetailsProps {
    diagnosticoId: string;
    session: { user: { token: string } };
}

interface Diagnostico {
    id: string;
    analiticas: string;
    resultados: string;
    conclusionMedica: string;
    prioridad: string;
    fechaDiagnostico: string;
    proximaVisita: string;
    paciente: {
        nombre: string;
        apellido: string;
        rup: string;
    };
    userName: string;
}

const DiagnosticoDetails: React.FC<DiagnosticoDetailsProps> = ({ diagnosticoId, session }) => {
    const [open, setOpen] = useState(false);
    const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
    const [paciente, setPaciente] = useState<{ nombre: string; apellido: string; rup: string } | null>(null);
    const [medico, setMedico] = useState<{ nombre: string; apellido: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'F12') {
                event.preventDefault(); // Evitar la acción predeterminada de F12
                handleOpen();
                fetchDiagnosticoDetails();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const fetchDiagnosticoDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/diagnostico-clinico/${diagnosticoId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${session?.user?.token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los detalles del diagnóstico');
            }

            const data = await response.json();
            setDiagnostico(data);
            setPaciente(data.paciente);
            setMedico({ nombre: data.userName, apellido: '' }); // Asigna el apellido si está disponible
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ 
                    width: 400, 
                    bgcolor: 'background.paper', 
                    p: 4, 
                    borderRadius: 2, 
                    boxShadow: 24 
                }}>
                    <Typography variant="h6" component="h2">
                        Detalles del Diagnóstico Clínico
                    </Typography>
                    {loading ? (
                        <Typography>Cargando...</Typography>
                    ) : (
                        <>
                            {paciente && (
                                <>
                                    <Typography sx={{ mt: 2 }}>
                                        <strong>Nombre del Paciente:</strong> {paciente.nombre} {paciente.apellido}
                                    </Typography>
                                    <Typography>
                                        <strong>RUP del Paciente:</strong> {paciente.rup}
                                    </Typography>
                                </>
                            )}
                            {medico && (
                                <Typography>
                                    <strong>Médico que Registró:</strong> {medico.nombre} {medico.apellido}
                                </Typography>
                            )}
                            {diagnostico && (
                                <>
                                    <Typography>
                                        <strong>Detalles del Diagnóstico:</strong>
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText primary="ID" secondary={diagnostico.id} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Analíticas" secondary={diagnostico.analiticas} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Resultados" secondary={diagnostico.resultados} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Conclusión Médica" secondary={diagnostico.conclusionMedica} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Prioridad" secondary={diagnostico.prioridad} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Fecha de Diagnóstico" secondary={diagnostico.fechaDiagnostico} />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Proxima Visita" secondary={diagnostico.proximaVisita} />
                                        </ListItem>
                                    </List>
                                </>
                            )}
                        </>
                    )}
                    <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default DiagnosticoDetails;