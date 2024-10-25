import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '../../../components/SkeletonLoader';

interface DetailPaciente {
  objetivo: string;
  motivo: string;
}

interface Patient {
  rup: string;
  nombre: string;
  apellido: string;
  sexo: string;
  ciudad: string;
  nacimiento: string;
  registro: string;
  objetivo: string;
  motivo: string;
}

interface PatientListProps {
  filterText: string;
}

const PatientList: React.FC<PatientListProps> = ({ filterText }) => {
  const { data: session, status } = useSession();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!session?.user?.token) {
        console.warn('No hay token disponible.');
        setError('No autorizado. Inicia sesión.');
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
          throw new Error(errorData.message || 'Error al obtener los datos');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedData = data.map((item) => {
            const detalle: DetailPaciente | undefined = item.detallepaciente[0];
            return {
              rup: item.rup,
              nombre: item.nombre,
              apellido: item.apellido,
              sexo: item.sexo,
              ciudad: item.ciudad,
              nacimiento: item.nacimiento,
              registro: item.registro,
              objetivo: detalle?.objetivo || 'No especificado',
              motivo: detalle?.motivo || 'No especificado',
            };
          });

          setPatients(formattedData);
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
      fetchPatients();
    }
  }, [session, status]);

  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  if (loading) return <SkeletonLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto grid grid-cols-12 mt-10">
      <div className="col-span-10 bg-white rounded-lg shadow-lg p-4 overflow-auto">
        <h2 className="text-2xl text-black font-extrabold mb-4 text-center">Pacientes Registrados</h2>
        {filteredPatients.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No se encontraron pacientes.</div>
        ) : (
          <table className="min-w-full bg-gray-100 text-gray-800 border border-gray-300 mt-4">
            <thead className='text-slate-100'>
              <tr className="text-center bg-[#25aa80] ">
                <th className="py-4 px-4 border-b border-gray-300">RUP</th>
                <th className="py-4 px-4 border-b border-gray-300">Nombre</th>
                <th className="py-4 px-4 border-b border-gray-300">Apellido</th>
                <th className="py-4 px-4 border-b border-gray-300">Sexo</th>
                <th className="py-4 px-4 border-b border-gray-300">Ciudad</th>
                <th className="py-4 px-4 border-b border-gray-300">Edad</th>
                <th className="py-4 px-4 border-b border-gray-300">Motivo de Consulta</th>
                <th className="py-4 px-4 border-b border-gray-300">Objetivos</th>
                <th className="py-4 px-4 border-b border-gray-300">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.rup} className="hover:bg-gray-200 text-center transition duration-200">
                  <td className="py-4 px-4 border-b border-gray-300">{patient.rup}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{patient.nombre}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{patient.apellido}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{patient.sexo}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{patient.ciudad}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{new Date().getFullYear() - new Date(patient.nacimiento).getFullYear()}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{patient.motivo}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{patient.objetivo}</td>
                  <td className="py-4 px-4 border-b border-gray-300">{patient.registro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientList;