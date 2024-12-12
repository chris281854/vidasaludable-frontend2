 // RightBar.tsx
import React from 'react';
import Image from 'next/image'; // Importar el componente Image
import { Button, Card, CardContent, Typography } from '@mui/material';
import useRecentPatients from '../../hooks/useRecentPatients';
import PatientSkeleton from './PatientSkeleton';

const RightBar: React.FC = () => {
    const { recentPatients, loading, error } = useRecentPatients();

    return (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {loading ? (
                <>
                    <PatientSkeleton />
                    <PatientSkeleton />
                    <PatientSkeleton />
                    <PatientSkeleton />
                </>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <>
                    {recentPatients.map((patient) => (
                        <Card key={patient.rup} className="mb-4">
                            <CardContent className="flex items-center space-x-4"> {/* Flex para alinear imagen y texto */}
                                <Image
                                    src="/c.png" // Ruta de la imagen por defecto
                                    alt={`${patient.nombre} ${patient.apellido}`} // Texto alternativo
                                    width={70} // Ancho de la imagen
                                    height={70} // Alto de la imagen
                                    className="rounded-full" // Clase para hacer la imagen circular
                                />
                                <div className="flex flex-col space-y-2">
                                    <Typography className="font-bold text-[#25aa80]" variant="subtitle1">
                                        {patient.rup} {/* ID del paciente */}
                                    </Typography>
                                    <Typography variant="subtitle1" className="text-[#333]"> {/* Cambiar color del texto */}
                                        {patient.nombre} {patient.apellido} {/* Nombre y apellido */}
                                    </Typography>
                                    <Typography variant="body2" className="text-[#555] font-bold"> {/* Cambiar color del texto */}
                                        Fecha de registro: {new Date(patient.registro).toLocaleDateString()} {/* Fecha de registro del paciente */}
                                    </Typography>
                                    <Typography variant="body2" className="text-[#555]"> {/* Cambiar color del texto */}
                                        ID del Plan Nutricional: {patient.idPlan} {/* ID del plan nutricional */}
                                    </Typography>
                                    <Typography variant="body2" className="text-[#555] font-bold"> {/* Cambiar color del texto */}
                                        Fecha de Asignación: {new Date(patient.proximaRevision).toLocaleDateString()} {/* Fecha de próxima revisión */}
                                    </Typography>
                                    <div className="flex space-x-2">
                                        <Button variant="contained" size="small" style={{ backgroundColor: '#25aa80' }}>
                                            Consultar
                                        </Button>
                                        <Button variant="outlined" size="small" style={{ borderColor: '#25aa80', color: '#25aa80' }}>
                                            Editar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </>
            )}
        </div>
    );
};

export default RightBar;