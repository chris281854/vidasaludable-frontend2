// src/components/EvaluacionesNutricionalesEditForm.tsx

'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import NutritionEvaluationModal from './NutritionEvaluationModal'; // Importar el nuevo componente
import ProtectedRoute from '@/components/ProtectedRoute';
import { SearchIcon, InfoIcon } from 'lucide-react'; // Asegúrate de tener estos íconos disponibles

const EvaluacionesNutricionalesEditForm: React.FC = () => {
    const { data: session } = useSession(); // Obtener la sesión
    const [openNutritionModal, setOpenNutritionModal] = useState(false); // Estado para controlar el modal
    const [idEvaluacion, setIdEvaluacion] = useState<number | null>(null); // Estado para el ID de evaluación
    const [evaluacionData, setEvaluacionData] = useState<any[]>([]); // Estado para almacenar los datos de la evaluación

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevenir el comportamiento por defecto
            const inputValue = event.currentTarget.value; // Obtener el valor del input
            const idEvaluacion = parseInt(inputValue);
            if (!isNaN(idEvaluacion)) {
                setIdEvaluacion(idEvaluacion); // Establecer el ID de evaluación
            }
        }
    };

    const fetchEvaluacionData = async () => {
       
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/evaluaciones-nutricionales/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${session?.user?.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la evaluación');
                }

                const data = await response.json();
                console.log('Datos de evaluación:', data); // Agrega este log para verificar los datos
                setEvaluacionData(data); // Almacenar los datos de la evaluación
                setOpenNutritionModal(true); // Abrir el modal después de obtener los datos
            } catch (error) {
                console.error('Error:', error);
            }
       
    };

    return (
        <ProtectedRoute>
            <Box sx={{ padding: 2, mt: 3 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
                            <TextField
                                label="ID de Evaluación"
                                name="idEvaluacion"
                                onKeyPress={handleKeyPress}
                                sx={{ mb: 2, borderRadius: '20px', width: '230px' }} // Ajusta el ancho aquí
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <IconButton onClick={fetchEvaluacionData} sx={{ ml: 1, color: "green" }}>
                                <InfoIcon />
                            </IconButton>
                            <IconButton onClick={async () => {
                                // Lógica para buscar la evaluación en el backend
                                if (idEvaluacion) {
                                    console.log(`Buscando evaluación con ID: ${idEvaluacion}`);
                                }
                            }} sx={{ ml: 1, color: "green" }}>
                                <SearchIcon fontSize="large" />
                            </IconButton>
                        </Box>

                        {/* Modal de evaluación nutricional */}
                        <NutritionEvaluationModal 
                            open={openNutritionModal}
                            onClose={() => setOpenNutritionModal(false)}
                            evaluationData={evaluacionData} // Pasar los datos de la evaluación
                        />
                    </CardContent>
                </Card>
            </Box>
        </ProtectedRoute>
    );
}

export default EvaluacionesNutricionalesEditForm;