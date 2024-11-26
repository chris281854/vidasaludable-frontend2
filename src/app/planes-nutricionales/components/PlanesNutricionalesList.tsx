import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '../../../components/SkeletonLoader';

interface NutritionPlan {
  idPlan: number; // ID del plan nutricional
  rup: string; // ID del paciente
  objetivoPlan: string; // Objetivo del plan
  proximaRevision: string; // Fecha de próxima revisión
  registro: string; // Fecha de registro
  paciente: {
    nombre: string; // Nombre del paciente
    apellido: string; // Apellido del paciente
    sexo: string; // Sexo del paciente
    ciudad: string; // Ciudad del paciente
    nacimiento: string; // Fecha de nacimiento del paciente
  };
}

interface PatientListProps {
  filterText: string;
}

const PlanesNutricionalesList: React.FC<PatientListProps> = ({ filterText }) => {
  const { data: session, status } = useSession();
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        if (Array.isArray(data)) {
          const formattedData = data.map((nutritionPlan) => ({
            idPlan: nutritionPlan.idPlan,
            rup: nutritionPlan.rup,
            objetivoPlan: nutritionPlan.objetivoPlan,
            proximaRevision: nutritionPlan.proximaRevision || 'No especificado',
            registro: nutritionPlan.registro,
            paciente: {
              nombre: nutritionPlan.nombre,
              apellido: nutritionPlan.apellido,
              sexo: nutritionPlan.sexo,
              ciudad: nutritionPlan.ciudad,
              nacimiento: nutritionPlan.nacimiento,
            },
          }));

          setNutritionPlans(formattedData);
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
      fetchNutritionPlans();
    }
  }, [session, status]);

  const filteredPlans = nutritionPlans.filter((plan) =>
    Object.values(plan).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  if (loading) return <SkeletonLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto grid grid-cols-12 mt-10">
      <div className="col-span-10 bg-white rounded-lg shadow-lg p-4 overflow-auto">
        <h2 className="text-2xl text-black font-extrabold mb-4 text-center">Planes Nutricionales Registrados</h2>
        {filteredPlans.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No se encontraron planes nutricionales.</div>
        ) : (
          <table className="min-w-full bg-gray-100 text-gray-800 border border-gray-300 mt-4">
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
    </div>
  );
};

export default PlanesNutricionalesList;