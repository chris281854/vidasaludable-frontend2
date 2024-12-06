// NutritionalAnalysis.tsx

import React, { useState } from 'react';
import { Box, Typography, Paper, Slider, Button } from '@mui/material';
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

interface NutritionalAnalysisProps {
    tallaMt: number; // Talla en metros
    pesoKg: number; // Peso en kilogramos
    indiceCintura: number; // Índice de cintura
    indiceCadera: number; // Índice de cadera
    pesoGraso: number; // Peso graso
    pesoMagra: number; // Peso magro
}

const NutritionalAnalysis: React.FC<NutritionalAnalysisProps> = ({
    tallaMt,
    pesoKg,
    indiceCintura,
    indiceCadera,
    pesoGraso,
    pesoMagra,
}) => {
    const [peso, setPeso] = useState(pesoKg);
    const [talla, setTalla] = useState(tallaMt);

    // Calcular IMC
    const imc = peso / (talla * talla);

    // Datos para el gráfico
    const data = {
        labels: ['Bajo Peso', 'Normal', 'Sobrepeso', 'Obesidad'],
        datasets: [
            {
                label: 'IMC',
                data: [18.5, 24.9, 29.9, 34.9],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
            {
                label: 'Tu IMC',
                data: [imc],
                fill: false,
                backgroundColor: 'rgba(255,99,132,0.4)',
                borderColor: 'rgba(255,99,132,1)',
            },
        ],
    };

    return (
        <Paper sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h5" gutterBottom>
                Análisis Detallado de la Evaluación Nutricional
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">
                    <strong>Talla:</strong> {talla.toFixed(2)} m
                </Typography>
                <Typography variant="body1">
                    <strong>Peso:</strong> {peso.toFixed(2)} kg
                </Typography>
                <Typography variant="body1">
                    <strong>Índice de Cintura:</strong> {indiceCintura} cm
                </Typography>
                <Typography variant="body1">
                    <strong>Índice de Cadera:</strong> {indiceCadera} cm
                </Typography>
                <Typography variant="body1">
                    <strong>Peso Graso:</strong> {pesoGraso} kg
                </Typography>
                <Typography variant="body1">
                    <strong>Peso Magro:</strong> {pesoMagra} kg
                </Typography>
                <Typography variant="body1">
                    <strong>IMC:</strong> {imc.toFixed(2)} kg/m²
                </Typography>
            </Box>

            {/* Sliders para ajustar peso y talla */}
            <Box sx={{ marginBottom: 2 }}>
                <Typography gutterBottom>Peso (kg)</Typography>
                <Slider
                    value={peso}
                    onChange={(e, newValue) => setPeso(newValue as number)}
                    min={30}
                    max={200}
                    step={0.1}
                    valueLabelDisplay="auto"
                />
                <Typography gutterBottom>Talla (m)</Typography>
                <Slider
                    value={talla}
                    onChange={(e, newValue) => setTalla(newValue as number)}
                    min={1.5}
                    max={2.2}
                    step={0.01}
                    valueLabelDisplay="auto"
                />
            </Box>

            {/* Gráfico de IMC */}
            <Box sx={{ marginBottom: 2 }}>
                <Line data={data} />
            </Box>

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary">
                    Guardar Análisis
                </Button>
                <Button variant="outlined" color="secondary">
                    Exportar Análisis
                </Button>
            </Box>
        </Paper>
    );
};

export default NutritionalAnalysis;