import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button, Card, CardContent, Typography, Skeleton } from '@mui/material';
import PatientRegistrationChart from './PatientRegistrationChart';

interface Patient {
  rup: string;
  photo: string;
  name: string;
  apellido: string;
  consultationReason: string;
  objective: string;
}

const PatientSkeleton: React.FC = () => (
  <Card className="mb-4">
    <CardContent className="flex items-center space-x-4">
      <Skeleton variant="circular" width={50} height={50} />
      <div className="flex-grow">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" width={80} height={30} />
        <Skeleton variant="rectangular" width={80} height={30} />
      </div>
    </CardContent>
  </Card>
);

const RightBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPatients = async () => {
      if (status !== 'authenticated' || !session?.user?.token) {
        console.warn('Sesión no autenticada o token no disponible.');
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
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los datos de pacientes recientes');
        }

        const data = await response.json();
        console.log('Datos de pacientes recientes obtenidos del backend:', data);

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            rup: item.rup,
            photo: item.photo || '/default-avatar.png',
            name: item.nombre,
            apellido: item.apellido,
            consultationReason: item.detallepaciente[0]?.motivo || 'No especificado',
            objective: item.detallepaciente[0]?.objetivo || 'No especificado',
          }));
          setRecentPatients(formattedData);
        } else {
          setError('Formato de datos inesperado');
        }
      } catch (error) {
        console.error('Error fetching recent patients:', error);
        setError('Error al cargar los pacientes recientes. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchRecentPatients();
    } else if (status === 'unauthenticated') {
      setError('No autorizado. Por favor, inicia sesión.');
      setLoading(false);
    }
  }, [session, status]);

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]"> {/* Ajusta la altura máxima según sea necesario */}
      <Typography variant="h6" component="h2" gutterBottom>
           </Typography>
      
      {status === 'loading' || loading ? (
        <>
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
                  src="/c.png"
                  alt={patient.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex-grow">
                <Typography className="font-bold text-[#25aa80]" variant="subtitle1">{patient.rup}</Typography>
                  <Typography variant="subtitle1">{patient.name}</Typography>
                  <Typography variant="subtitle1">{patient.apellido}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.consultationReason}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.objective}
                  </Typography>
                </div>
                <div className="flex space-x-2">
                  <Button variant="contained" size="small" style={{ backgroundColor: '#25aa80' }}>
                    Consultar
                  </Button>
                  <Button variant="outlined" size="small" style={{ borderColor: '#25aa80', color: '#25aa80' }}>
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="mt-8">
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Registro de Pacientes
              </Typography>
              <PatientRegistrationChart />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RightBar;