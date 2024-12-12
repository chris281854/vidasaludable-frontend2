// hooks/useRecentPatients.ts
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Patient {
    rup: string; // ID del paciente
    nombre: string; // Nombre del paciente
    apellido: string; // Apellido del paciente
    registro: string; // Fecha de registro del paciente
    idPlan: number; // ID del plan nutricional
    proximaRevision: string; // Fecha de próxima revisión
}

const useRecentPatients = () => {
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/planes-nutricionales`, {
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
              //  console.log('Datos de pacientes recientes obtenidos del backend:', data);

                if (Array.isArray(data)) {
                    const formattedData = data
                        .map((item) => ({
                            rup: item.paciente.rup, // Acceder al ID del paciente
                            nombre: item.paciente.nombre, // Nombre del paciente
                            apellido: item.paciente.apellido, // Apellido del paciente
                            registro: item.paciente.registro || 'No especificado', // Fecha de registro
                            idPlan: item.idPlan, // ID del plan nutricional
                            proximaRevision: item.proximaRevision || 'No especificado', // Fecha de próxima revisión
                        }))
                        .sort((a, b) => new Date(b.registro).getTime() - new Date(a.registro).getTime())
                        .slice(0, 4); // Limitar a 4 registros
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

    return { recentPatients, loading, error };
};

export default useRecentPatients;