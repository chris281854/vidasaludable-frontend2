// components/RightNav.tsx
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Asegúrate de que este import sea correcto

interface Patient {
  id: number;
  firstName: string; // Cambia esto según los campos que tengas en tu API
  lastName: string;
  city: string;
  objective: string;
}

const RightNav: React.FC = () => {
  const { data: session } = useSession();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pacientes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.token}`, // Asegúrate de que el token esté presente
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener los pacientes');
        }

        const data = await res.json();
        setPatients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.token) {
      fetchPatients();
    }
  }, [session]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (patients.length === 0) {
    return <div>No se encontraron pacientes.</div>;
  }

  return (
    <div className="w-64 bg-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Últimos pacientes registrados</h2>
      <div className="space-y-2">
        {patients.map((patient) => (
          <div key={patient.id} className="p-2 bg-white rounded shadow">
            <p className="font-bold">{`${patient.firstName} ${patient.lastName}`}</p>
            <p>{`Ciudad: ${patient.city}`}</p>
            <p>{`Objetivo: ${patient.objective}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightNav;
