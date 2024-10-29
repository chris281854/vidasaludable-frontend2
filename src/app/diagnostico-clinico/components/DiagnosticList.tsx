import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import SkeletonLoader from '../../../components/SkeletonLoader';
import DiagnosticTable from './DiagnosticTable';

interface DiagnosticoClinico {
  paciente_id: number;
  paciente_rup: string;
  paciente_nombre: string;
  paciente_apellido: string;
  diagnosticoclinico_conclusiones_medicas: string;
  diagnosticoclinico_prioridad_diagnostico: 'ALTA' | 'MEDIA' | 'BAJA';
  diagnosticoclinico_fecha_diagnostico: string;
}

interface PatientListProps {
  filterText: string;
}

const DiagnosticList: React.FC<PatientListProps> = ({ filterText }) => {
  const { data: session, status } = useSession();
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoClinico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      if (!session?.user?.token) {
        console.warn('No hay token disponible.');
        setError('No autorizado. Inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/diagnostico-clinico`, {
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
        console.log('Datos sin procesar:', data); // Para debug

        if (Array.isArray(data)) {
          // Filtrar registros válidos
          const validDiagnosticos = data.filter(diagnostico => 
            diagnostico.paciente_rup && 
            diagnostico.paciente_id && 
            diagnostico.paciente_nombre &&
            diagnostico.diagnosticoclinico_fecha_diagnostico
          );

          // Eliminar duplicados basados en ID y RUP
          const uniqueDiagnosticos = validDiagnosticos.reduce((acc, current) => {
            const x = acc.find((item: DiagnosticoClinico) => 
              item.paciente_id === current.paciente_id && 
              item.paciente_rup === current.paciente_rup
            );
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, [] as DiagnosticoClinico[]);

          console.log('Diagnósticos procesados:', uniqueDiagnosticos); // Para debug
          setDiagnosticos(uniqueDiagnosticos);
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
      fetchDiagnosticos();
    }
  }, [session, status]);

  const filteredDiagnosticos = diagnosticos.filter((diagnostico) =>
    Object.values(diagnostico).some((value) =>
      value?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  if (loading) return <SkeletonLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto grid grid-cols-12 mt-10">
      <div className="col-span-10 bg-white rounded-lg shadow-lg p-4 overflow-auto">
        <h2 className="text-2xl text-black font-extrabold mb-4 text-center">
          Diagnósticos Clínicos
        </h2>
        <DiagnosticTable diagnosticos={filteredDiagnosticos} />
      </div>
    </div>
  );
};

export default DiagnosticList;