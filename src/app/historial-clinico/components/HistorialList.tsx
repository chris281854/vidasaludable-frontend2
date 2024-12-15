import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '../../../components/SkeletonLoader';
import HistorialTable from './HistorialTable'; // Asegúrate de que la ruta sea correcta

interface Historial {
  idHistorial: number;
  rup: string; // ID del paciente
  nombre: string;
  apellido: string;
  registro: string; // Fecha de evaluación
  proximaCita: string; // Fecha de la próxima cita
  observaciones: string; // Observaciones
  conclusionesMedicas: string; // Asegúrate de que este campo esté disponible
}

interface HistorialListProps {
  filterText: string;
}

const EvaluacionesList: React.FC<HistorialListProps> = ({ filterText }) => {
  const { data: session, status } = useSession();
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!session?.user?.token) {
        console.warn('No hay token disponible.');
        setError('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Historial-clinico`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los datos');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            idHistorial: item.idHistorial,
            rup: item.paciente.rup,
            nombre: item.paciente.nombre,
            apellido: item.paciente.apellido,
            registro: item.registro,
            proximaCita: item.proximaCita,
            observaciones: item.observaciones || 'No especificado',
            conclusionesMedicas: item.conclusionesMedicas || 'No especiificado', // Asegúrate de que este campo esté disponible
             
          }));

          setHistorial(formattedData);
        } else {
          setError('Formato de datos inesperado');
        }
      } catch (err) {
        console.error('Error durante la llamada a la API:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchHistorial();
    }
  }, [session, status]);

  const filteredHistorial = historial.filter((historial) =>
    Object.values(historial).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  if (loading) return <SkeletonLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto grid  mt-10">
      <div className="col-span-10 bg-white rounded-lg shadow-lg p-4 overflow-auto">
        <h2 className="text-2xl text-black font-extrabold mb-4 text-center">Historial Clinico Registrados</h2>
        <HistorialTable historial={filteredHistorial} />
      </div>
    </div>
  );
};

export default EvaluacionesList;