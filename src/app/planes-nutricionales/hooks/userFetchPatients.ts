// src/hooks/useFetchPatients.ts
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Patient } from '../interfaces/interfases';

const useFetchPatients = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]); // Asegúrate de que el tipo sea correcto

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token || ''}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener los datos');

      const data = await response.json();
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        console.error('Los datos recibidos no son un array:', data);
        throw new Error('Formato de datos incorrecto');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  return { patients, loading, error, fetchPatients }; // Asegúrate de retornar estos valores
};

export default useFetchPatients;