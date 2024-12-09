// IMCAnalysis.tsx

import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
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

interface IMCAnalysisProps {
    imc: number; // IMC calculado
}

const IMCAnalysis: React.FC<IMCAnalysisProps> = ({ imc }) => {
    // Definición de los rangos de IMC según la OMS
    const imcCategories = [
        { label: 'Bajo Peso', min: 0, max: 18.4 },
        { label: 'Peso Normal', min: 18.5, max: 24.9 },
        { label: 'Sobrepeso', min: 25, max: 29.9 },
        { label: 'Obesidad Grado 1', min: 30, max: 34.9 },
        { label: 'Obesidad Grado 2', min: 35, max: 39.9 },
        { label: 'Obesidad Grado 3', min: 40, max: Infinity },
    ];

    // Determinar la categoría del IMC
    const category = imcCategories.find(cat => imc >= cat.min && imc <= cat.max);

    // Datos para el gráfico
    const data = {
        labels: ['Bajo Peso', 'Normal', 'Sobrepeso', 'Obesidad Grado 1', 'Obesidad Grado 2', 'Obesidad Grado 3'],
        datasets: [
            {
                label: 'Rango de IMC',
                data: [18.4, 24.9, 29.9, 34.9, 39.9, 40],
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
                Análisis del IMC
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body1">
                    <strong>Tu IMC:</strong> {imc.toFixed(2)} kg/m²
                </Typography>
                {category ? (
                    <Typography variant="body1" color="green">
                        <strong>Categoría:</strong> {category.label}
                    </Typography>
                ) : (
                    <Typography variant="body1" color="red">
                        <strong>Categoría:</strong> No definido
                    </Typography>
                )}
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

export default IMCAnalysis;