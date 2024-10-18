import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Asegúrate de que este import sea correcto

interface Patient {
  id: number;
  name: string; // Ajusta esto según los campos que tengas en tu API
  // Agrega otros campos según sea necesario
}

const PatientList: React.FC = () => {
  const { data: session } = useSession(); // Obtén la sesión
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener los datos');
        }

        const data = await res.json();
        console.log(data);
        setPatients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [session]); // Dependencia añadida para que se ejecute si la sesión cambia

  if (loading) {
    return <div>Cargando...</div>; // Mensaje de carga
  }

  if (error) {
    return <div>Error: {error}</div>; // Mensaje de error
  }

  if (patients.length === 0) {
    return <div>No se encontraron pacientes.</div>; // Mensaje si no hay pacientes
  }

  return (
    <div className="w-[800px] bg-gray-200 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Últimos pacientes registrados</h2>
      <div className="space-y-2">
        {patients.map((patient) => (
          <div key={patient.id} className="p-2 bg-gray-300 rounded">
            {patient.name} {/* Muestra el nombre del paciente */}
            {/* Agrega otros campos aquí según sea necesario */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;
