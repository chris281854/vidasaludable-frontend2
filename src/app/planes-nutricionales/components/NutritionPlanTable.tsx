import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '../../../components/SkeletonLoader';
import FilterInput from '../components/FIlterInput';

interface NutritionPlan {
  idPlan: number;
  rup: string;
  objetivoPlan: string;
  proximaRevision: string;
  registro: string;
  paciente: {
    nombre: string;
    apellido: string;
    nacimiento: string;
  };
}
interface ActionButtonProps {
    label: string;
    onClick: () => void;
  }
  

const NutritionPlanTable: React.FC <ActionButtonProps>= ({label, onClick}) => {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>(''); // Estado para el texto del filtro

  useEffect(() => {
    const fetchNutritionPlans = async () => {
      if (!session?.user?.token) {
        console.warn('No hay token disponible.');
        setError('No autorizado. Inicia sesión.');
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
          throw new Error(errorData.message || 'Error al obtener los datos');
        }

        const data = await response.json();
        setPlans(data);
      } catch (err) {
        console.error('Error durante la llamada a la API:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchNutritionPlans();
    }
  }, [session, status]);

  // Manejo del cambio en el filtro
  const handleFilterChange = useCallback((value: string) => {
    setFilterText(value);
  }, []);

  // Manejo de la acción de búsqueda
  const handleFilterSubmit = useCallback(() => {
    console.log("Filtro aplicado:", filterText);
    // Aquí podrías aplicar el filtrado si es necesario
  }, [filterText]);

  // Filtrar los planes nutricionales
  const filteredPlans = plans.filter((plan) => {
    const { nombre, apellido } = plan.paciente;
    return (
      plan.rup.toLowerCase().includes(filterText.toLowerCase()) || // Filtrar por ID del paciente
      nombre.toLowerCase().includes(filterText.toLowerCase()) || // Filtrar por nombre
      apellido.toLowerCase().includes(filterText.toLowerCase()) || // Filtrar por apellido
      plan.idPlan.toString().includes(filterText) // Filtrar por ID del plan
    );
  });

  if (loading) return <SkeletonLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
       
      {filteredPlans.length === 0 ? (
        <div className="text-center text-gray-500">No se encontraron planes nutricionales.</div>
      ) : (
        <table className="min-w-full bg-gray-100 text-gray-800 border border-gray-300">
          <thead className='text-slate-100'>
            <tr className="text-center bg-[#25aa80] ">
              <th className="py-4 px-4 border-b border-gray-300">ID del Plan</th>
              <th className="py-4 px-4 border-b border-gray-300">RUP</th>
              <th className="py-4 px-4 border-b border-gray-300">Nombre del Paciente</th>
              <th className="py-4 px-4 border-b border-gray-300">Apellido del Paciente</th>
              <th className="py-4 px-4 border-b border-gray-300">Objetivo del Plan</th>
              <th className="py-4 px-4 border-b border-gray-300">Fecha de Registro</th>
              <th className="py-4 px-4 border-b border-gray-300">Fecha de Próxima Revisión</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan) => (
              <tr key={plan.idPlan} className="hover:bg-gray-200 text-center transition duration-200">
                <td className="py-4 px-4 border-b border-gray-300">{plan.idPlan}</td>
                <td className="py-4 px-4 border-b border-gray-300">{plan.rup}</td>
                <td className="py-4 px-4 border-b border-gray-300">{plan.paciente.nombre}</td>
                <td className="py-4 px-4 border-b border-gray-300">{plan.paciente.apellido}</td>
                <td className="py-4 px-4 border-b border-gray-300">{plan.objetivoPlan}</td>
                <td className="py-4 px-4 border-b border-gray-300">{new Date(plan.registro).toLocaleDateString()}</td>
                <td className="py-4 px-4 border-b border-gray-300">{new Date(plan.proximaRevision).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NutritionPlanTable;