import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { FaExclamationCircle } from 'react-icons/fa';

interface Patient {
  rup: string;
  photo: string;
  name: string;
  apellido: string;
  fechaDiagnostico: string:
  conclusionMedica: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
}

interface DiagnosticoCount {
  name: string;
  value: number;
}

interface SeguimientoCount {
  requiereSeguimiento: number;
  noRequiereSeguimiento: number;
}

const PatientSkeleton: React.FC = () => (
  <Card className="mb-4">
    <CardContent className="flex items-center space-x-4">
      <Skeleton variant="circular" width={50} height={50} />
      <div className="flex-grow">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </CardContent>
  </Card>
);

const PriorityIcon: React.FC<{ prioridad: 'ALTA' | 'MEDIA' | 'BAJA' }> = ({ prioridad }) => {
  const colorMap = {
    ALTA: 'text-red-500',
    MEDIA: 'text-yellow-500',
    BAJA: 'text-green-500'
  };

  return <FaExclamationCircle className={`inline mr-2 ${colorMap[prioridad]}`} />;
};

const RightBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [diagnosticoCounts, setDiagnosticoCounts] = useState<DiagnosticoCount[]>([]);
  const [seguimientoCounts, setSeguimientoCounts] = useState<SeguimientoCount>({ requiereSeguimiento: 0, noRequiereSeguimiento: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || !session?.user?.token) {
        console.warn('Sesión no autenticada o token no disponible.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/diagnostico-clinico/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los datos del dashboard');
        }

        const data = await response.json();
        console.log('Datos del dashboard obtenidos del backend:', data);

        setRecentPatients(data.recentPatients.slice(0, 4));
        setDiagnosticoCounts(data.diagnosticoCounts);
        setSeguimientoCounts(data.seguimientoCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Error al cargar los datos del dashboard. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchData();
    } else if (status === 'unauthenticated') {
      setError('No autorizado. Por favor, inicia sesión.');
      setLoading(false);
    }
  }, [session, status]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      {status === 'loading' || loading ? (
        <>
          <PatientSkeleton />
          <PatientSkeleton />
          <PatientSkeleton />
          <PatientSkeleton />
        </>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {recentPatients.map((patient) => (
            <Card key={patient.rup} className="mb-4">
              <CardContent className="flex items-center space-x-4">
                <Image
                  src={patient.photo || "/default-avatar.png"}
                  alt={patient.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex-grow">
                  <Typography className="font-bold text-[#25aa80]" variant="subtitle1">
                    <PriorityIcon prioridad={patient.prioridad} />
                    {patient.rup}
                  </Typography>
                  <Typography variant="subtitle1">{patient.name} {patient.apellido}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de diagnóstico: {new Date(patient.fechaDiagnostico).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conclusión médica: {patient.conclusionMedica}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="mt-8">
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Diagnósticos de la Semana
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={diagnosticoCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {diagnosticoCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="body2" align="center">
                {diagnosticoCounts.map((entry, index) => (
                  <span key={entry.name} style={{color: COLORS[index % COLORS.length]}}>
                    {entry.name}: {entry.value}{' '}
                  </span>
                ))}
              </Typography>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Pacientes que Requieren Seguimiento
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Requiere', value: seguimientoCounts.requiereSeguimiento },
                      { name: 'No Requiere', value: seguimientoCounts.noRequiereSeguimiento }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#00C49F" />
                    <Cell fill="#FF8042" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Typography variant="body2" align="center">
                <span style={{color: '#00C49F'}}>Requiere: {seguimientoCounts.requiereSeguimiento} </span>
                <span style={{color: '#FF8042'}}>No Requiere: {seguimientoCounts.noRequiereSeguimiento}</span>
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RightBar;