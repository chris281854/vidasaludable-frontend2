import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Skeleton, 
  Box,
  CircularProgress
} from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';

// Interfaz que coincide con la respuesta de la API
interface ApiResponse {
  paciente_id: number;
  paciente_rup: string;
  paciente_nombre: string;
  paciente_apellido: string;
  diagnosticoclinico_conclusiones_medicas: string;
  diagnosticoclinico_prioridad_diagnostico: string;
  diagnosticoclinico_fecha_diagnostico: string;
}

interface Patient {
  id: number;
  rup: string;
  photo: string;
  name: string;
  apellido: string;
  fechaDiagnostico: string;
  conclusionMedica: string;
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
}

interface DiagnosticoCount {
  name: string;
  value: number;
}

interface SeguimientoCount {
  requiereSeguimiento: number;
  noRequiereSeguimiento: number;
}

// Componentes auxiliares permanecen igual
const PatientSkeleton: React.FC = () => (
  <Card className="mb-4">
    <CardContent className="flex items-center space-x-4">
      <Skeleton variant="circular" width={50} height={50} />
      <div className="flex-grow">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </CardContent>
  </Card>
);

const PriorityIcon: React.FC<{ prioridad: 'ALTA' | 'MEDIA' | 'BAJA' }> = ({ prioridad }) => {
  const colorMap = {
    'ALTA': 'text-red-500',
    'MEDIA': 'text-yellow-500',
    'BAJA': 'text-green-500'
  };

  const prioridadNormalizada = prioridad.toUpperCase() as 'ALTA' | 'MEDIA' | 'BAJA';
  return (
    <FaExclamationCircle 
      className={`inline mr-2 ${colorMap[prioridadNormalizada]}`} 
      title={`Prioridad ${prioridadNormalizada}`}
    />
  );
};

const CircularProgressWithLabel: React.FC<{ value: number, color: string, label: string }> = ({ value, color, label }) => {
  return (
    <Box position="relative" display="inline-flex" flexDirection="column" alignItems="center" m={1}>
      <CircularProgress variant="determinate" value={value} size={80} thickness={4} style={{ color }} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(value)}%`}</Typography>
      </Box>
      <Typography variant="body2" color="textSecondary" mt={1}>{label}</Typography>
    </Box>
  );
};

const RightBar: React.FC = () => {
  const { data: session, status } = useSession();
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [diagnosticoCounts, setDiagnosticoCounts] = useState<DiagnosticoCount[]>([]);
  const [seguimientoCounts, setSeguimientoCounts] = useState<SeguimientoCount>({ requiereSeguimiento: 0, noRequiereSeguimiento: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user?.token) {
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
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse[] = await response.json();
      console.log('Datos recibidos:', data);

      if (Array.isArray(data)) {
        const formattedData = data
          .filter(paciente => paciente.paciente_rup) // Filtrar pacientes sin RUP
          .map(paciente => ({
            id: paciente.paciente_id,
            rup: paciente.paciente_rup,
            photo: '/c.png',
            name: paciente.paciente_nombre,
            apellido: paciente.paciente_apellido,
            fechaDiagnostico: paciente.diagnosticoclinico_fecha_diagnostico,
            conclusionMedica: paciente.diagnosticoclinico_conclusiones_medicas,
            prioridad: paciente.diagnosticoclinico_prioridad_diagnostico as 'ALTA' | 'MEDIA' | 'BAJA',
          }))
          .sort((a, b) => new Date(b.fechaDiagnostico).getTime() - new Date(a.fechaDiagnostico).getTime())
          .slice(0, 4);

        setRecentPatients(formattedData);

        // Configurar diagnósticos
        const diagnosticosContados = {
          'Total Diagnósticos': data.length
        };

        setDiagnosticoCounts(
          Object.entries(diagnosticosContados).map(([name, value]) => ({
            name,
            value
          }))
        );

        // Configurar seguimientos (ejemplo)
        setSeguimientoCounts({
          requiereSeguimiento: Math.floor(data.length * 0.7), // 70% requieren seguimiento (ejemplo)
          noRequiereSeguimiento: Math.ceil(data.length * 0.3)  // 30% no requieren seguimiento
        });
      }
    } catch (error) {
      console.error('Error detallado:', error);
      setError(`Error al cargar los datos: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [session, status]);



   useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, fetchData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      {status === 'loading' || loading ? (
        <>
          <PatientSkeleton />
          <PatientSkeleton />
          <PatientSkeleton />
          <PatientSkeleton />
        </>
      ) : error ? (
        <div className="text-red-500 p-4">
          <Typography variant="h6">Error</Typography>
          <Typography>{error}</Typography>
        </div>
      ) : (
        <>
          {recentPatients.length === 0 ? (
            <Typography className="text-center py-4">
              No hay pacientes para mostrar
            </Typography>
          ) : (
            <>
              {recentPatients.map((patient) => (
                <Card key={patient.id} className="mb-4">
                  <CardContent className="flex items-center space-x-4">
                    <Image
                      src={patient.photo}
                      alt={patient.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                      priority
                    />
                    <div className="flex-grow">
                      <Typography className="font-bold text-[#25aa80]" variant="subtitle1">
                        <PriorityIcon prioridad={patient.prioridad} />
                        {patient.rup}
                      </Typography>
                      <Typography variant="subtitle1">
                        {patient.name} {patient.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de diagnóstico: {new Date(patient.fechaDiagnostico).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conclusión médica: {patient.conclusionMedica}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {diagnosticoCounts.length > 0 && (
                <Card className="mt-8">
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      Diagnósticos de la Semana
                    </Typography>
                    <Box display="flex" justifyContent="center" flexWrap="wrap">
                      {diagnosticoCounts.map((entry, index) => (
                        <CircularProgressWithLabel
                          key={entry.name}
                          value={(entry.value / diagnosticoCounts.reduce((acc, curr) => acc + curr.value, 0)) * 100}
                          color={COLORS[index % COLORS.length]}
                          label={entry.name}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {(seguimientoCounts.requiereSeguimiento > 0 || seguimientoCounts.noRequiereSeguimiento > 0) && (
                <Card className="mt-8">
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      Pacientes que Requieren Seguimiento
                    </Typography>
                    <Box display="flex" justifyContent="center">
                      <CircularProgressWithLabel
                        value={(seguimientoCounts.requiereSeguimiento / 
                          (seguimientoCounts.requiereSeguimiento + seguimientoCounts.noRequiereSeguimiento)) * 100}
                        color="#00C49F"
                        label="Requiere Seguimiento"
                      />
                      <CircularProgressWithLabel
                        value={(seguimientoCounts.noRequiereSeguimiento / 
                          (seguimientoCounts.requiereSeguimiento + seguimientoCounts.noRequiereSeguimiento)) * 100}
                        color="#FF8042"
                        label="No Requiere Seguimiento"
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RightBar;