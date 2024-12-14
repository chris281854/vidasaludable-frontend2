// src/components/IMCComparisonModal.tsx

import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar las escalas y otros componentes necesarios
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IMCComparisonModalProps {
    tallaMt: number | null; // Talla en metros
    pesoKg: number | null; // Peso en kilogramos
    pesoGraso: number | null; // Peso graso
    pesoMagra: number | null; // Peso magro
    imc: number | null; // IMC calculado
}

const IMCComparisonModal: React.FC<IMCComparisonModalProps> = ({ tallaMt, pesoKg, pesoGraso, pesoMagra, imc }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Datos para el gráfico
    const data = {
        labels: ['Bajo Peso', 'Normal', 'Sobrepeso', 'Obesidad Grado 1', 'Obesidad Grado 2', 'Obesidad Grado 3'],
        datasets: [
            {
                label: 'Rango de IMC (OMS)',
                data: [18.4, 24.9, 29.9, 34.9, 39.9, 40],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
            {
                label: 'Tu IMC',
                data: [imc !== null ? imc : 0], // Asegúrate de que el IMC tenga un valor
                fill: false,
                backgroundColor: 'rgba(255,99,132,0.4)',
                borderColor: 'rgba(255,99,132,1)',
            },
        ],
    };

    return (
        <>
            <div>
                <h1 className="text-center mb-3 text-2xl font-bold">Comparativo de Evaluación</h1>
            </div>
            <Box className="flex justify-center">
                <Button variant="contained" color="success" onClick={handleOpen}>
                    Comparar con OMS
                </Button>
                <Modal open={open} onClose={handleClose}>
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: '80%', // Aumentar el ancho del modal al 80% de la pantalla
                        maxWidth: 800, // Establecer un ancho máximo
                        height: 'auto', // Ajustar la altura automáticamente
                        bgcolor: 'background.paper', 
                        boxShadow: 24, 
                        p: 4 
                    }}>
                        <Typography className="text-green-700" variant="h6" component="h2" gutterBottom>
                            Comparación de Indicadores
                        </Typography>
                        <Paper sx={{ padding: 2, marginBottom: 2 }}>
                            <Typography variant="body1" display="flex" justifyContent="space-between">
                                <span><strong>Talla:</strong> {tallaMt !== null ? tallaMt : 0} m</span>
                                <span><strong>Óptimo:</strong> 1.60 - 2.00 m</span> {/* Rango de talla óptimo */}
                            </Typography>
                            <Typography variant="body1" display="flex" justifyContent="space-between">
                                <span><strong>Peso:</strong> {pesoKg !== null ? pesoKg.toFixed(2) : 0} kg</span>
                                <span><strong>Óptimo:</strong> 50 - 80 kg</span> {/* Rango de peso óptimo */}
                            </Typography>
                            <Typography variant="body1" display="flex" justifyContent="space-between">
                                <span><strong>Peso Graso:</strong> {pesoGraso !== null ? pesoGraso.toFixed(2) : 0} kg</span>
                                <span><strong>Óptimo:</strong> 10 - 20 kg</span> {/* Rango de peso graso óptimo */}
                            </Typography>
                            <Typography variant="body1" display="flex" justifyContent="space-between">
                                <span><strong>Peso Magro:</strong> {pesoMagra !== null ? pesoMagra.toFixed(2) : 0} kg</span>
                                <span><strong>Óptimo:</strong> 30 - 60 kg</span> {/* Rango de peso magro óptimo */}
                            </Typography>
                            <Typography variant="body1" display="flex" justifyContent="space-between">
                                <span><strong>IMC:</strong> {imc !== null ? imc.toFixed(2) : 0} kg/m²</span>
                                <span><strong>Óptimo:</strong> 18.5 - 24.9 kg/m²</span> {/* Rango de IMC óptimo */}
                            </Typography>
                        </Paper>
                        <Box sx={{ marginBottom: 2 }}>
                            <Line data={data} />
                        </Box>
                        <Button color="success" variant="outlined" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </>
    );
};

export default IMCComparisonModal;