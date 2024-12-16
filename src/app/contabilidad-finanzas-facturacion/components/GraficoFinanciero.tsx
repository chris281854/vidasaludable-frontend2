import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar las escalas y otros componentes necesarios
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoFinanciero: React.FC = () => {
    const [data, setData] = useState<any>(null); // Estado para almacenar los datos del gráfico
    const [loading, setLoading] = useState(true); // Estado para manejar la carga

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/facturacion/resumen/mes`); // Cambia la ruta a tu API
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const result = await response.json();
                
                // Suponiendo que la respuesta tiene la estructura adecuada
                const labels = result.map((item: any) => item.mes); // Cambia 'mes' por el campo correspondiente
                const totalACredito = result.map((item: any) => item.totalACredito); // Total de facturas A CREDITO
                const totalFacturado = result.map((item: any) => item.totalFacturado); // Total del monto total facturado

                setData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total A CREDITO',
                            data: totalACredito,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                        {
                            label: 'Total Facturado',
                            data: totalFacturado,
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Cambia el estado de carga
            }
        };

        fetchData();
    }, []); // Se ejecuta una vez al montar el componente

    if (loading) {
        return <div>Cargando...</div>; // Mensaje de carga
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold text-green-700">Gráfico Financiero</h2>
            {data && <Bar data={data} />} {/* Renderiza el gráfico solo si hay datos */}
        </div>
    );
};

export default GraficoFinanciero;