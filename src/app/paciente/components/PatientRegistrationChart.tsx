import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useSession } from 'next-auth/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RegistrationData {
  currentWeek: number;
  lastWeek: number;
}

const PatientRegistrationChart: React.FC = () => {
  const { data: session, status } = useSession();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (status !== 'authenticated' || !session?.user?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos de registro');
        }

        const data = await response.json();
        setRegistrationData(data);
      } catch (error) {
        console.error('Error fetching registration data:', error);
        setError('Error al cargar los datos de registro');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchRegistrationData();
    }
  }, [session, status]);

  if (loading) return <div>Cargando gráfico...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!registrationData) return null;

  const chartData = {
    labels: ['Semana pasada', 'Semana actual'],
    datasets: [
      {
        label: 'Pacientes registrados',
        data: [registrationData.lastWeek, registrationData.currentWeek],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgb(75, 192, 192)', 'rgb(54, 162, 235)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Registro de Pacientes por Semana',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default PatientRegistrationChart;