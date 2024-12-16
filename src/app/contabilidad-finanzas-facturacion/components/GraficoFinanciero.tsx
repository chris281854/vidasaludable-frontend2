// src/components/GraficoFinanciero.tsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar las escalas y otros componentes necesarios
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoFinanciero: React.FC = () => {
    const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
        datasets: [
            {
                label: 'Cuentas por Cobrar',
                data: [3000, 2000, 4000, 5000],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Cuentas por Pagar',
                data: [2000, 3000, 1000, 4000],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold">Gráfico Financiero</h2>
            <Bar data={data} />
        </div>
    );
};

export default GraficoFinanciero;