import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button, Card, CardContent, Typography, Skeleton } from '@mui/material';

interface Historial {
    idHistorial: number;
    userName: string; // Nombre del usuario
    patientId: string; // ID del paciente
    patientFirstName: string; // Nombre del paciente
    patientLastName: string; // Apellido del paciente
    registro: string;
    observaciones: string;
    proximaCita: string;
    
    userPhoto?: string; // Opcional, en caso de que no haya foto
}

const HistorialSkeleton: React.FC = () => (
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

const RecentHistorial: React.FC = () => {
    const { data: session, status } = useSession();
    const [recentHistorial, setRecentHistorial] = useState<Historial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentHistorial = async () => {
            if (status !== 'authenticated' || !session?.user?.token) {
                console.warn('Sesión no autenticada o token no disponible.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/historial-clinico`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.user.token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener los historiales clinicos recientes');
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const formattedData = data
                        .map((item) => ({
                            idHistorial: item.idHistorial,
                            userName: item.userName,
                            patientId: item.rup, // ID del paciente
                            patientFirstName: item.paciente.nombre || 'No especificado', // Nombre del paciente
                            patientLastName: item.paciente.apellido || 'No especificado', // Apellido del paciente
                            registro: item.registro,
                            observaciones: item.observaciones || 'No especificado',
                            proximaCita: item.proximaCita || 'No especificado',
                            userPhoto: item.photo || '/c.png', // URL de la foto del usuario
                        }))
                        .sort((a, b) => new Date(b.registro).getTime() - new Date(a.registro).getTime())
                        .slice(0, 5); // Limitar a los últimos 5
                    setRecentHistorial(formattedData);
                } else {
                    setError('Formato de datos inesperado');
                }
            } catch (error) {
                console.error('Error fetching recent evaluations:', error);
                setError('Error al cargar los historiales Clinicos recientes. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchRecentHistorial();
        } else if (status === 'unauthenticated') {
            setError('No autorizado. Por favor, inicia sesión.');
            setLoading(false);
        }
    }, [session, status]);

    return (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {status === 'loading' || loading ? (
                <>
                    <HistorialSkeleton />
                    <HistorialSkeleton />
                    <HistorialSkeleton />
                    <HistorialSkeleton />
                    <HistorialSkeleton />
                </>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <>
                    {recentHistorial.length === 0 ? (
                        <Typography variant="body1" color="success" className="text-center">
                            No hay historiales clínicos que mostrar.
                        </Typography>
                    ) : (
                        recentHistorial.map((historial) => (
                            <Card key={historial.idHistorial} className="mb-4">
                                <CardContent className="flex items-center space-x-4">
                                    <Image
                                        src={historial.userPhoto || "/c.png"}
                                        alt={historial.userName}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="flex-grow">
                                        <Typography className="font-bold text-[#25aa80]" variant="subtitle1">
                                            {historial.patientId} - {historial.patientFirstName} {historial.patientLastName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fecha de registro: {new Date(historial.registro).toLocaleDateString()}
                                        </Typography>
                                        <Typography className="font-bold text-[#25aa80]" variant="body2" color="text.secondary">
                                            Historial
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Próxima Cita: {new Date(historial.proximaCita).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Observaciones: {historial.observaciones} 
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
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default RecentHistorial;