/// src/components/AddEvaluacionesNutricionales.tsx

'use client'

import React, { useState } from 'react';
import HeaderUser from "@/components/headeruser";
import EvaluacionesNutricionalesLayout from "../EvaluacionesNutricionalesLayout";
import { Box, Card, CardContent } from '@mui/material';
import PatientRightBar from "@/components/PatientRightBar";
import HistorialPatologico from "../components/HistorialPatologico"; 
import HistorialClinico from "../components/HistorialClinico"; 
import EvaluacionesNutricionalesForm from "./components/EvalacionesNutricionalesForm";
import NutritionalAnalysis from "../components/NutritionalAnalysis";
import IMCAnalysis from '../components/IMCAnalysis';
import IMCComparisonModal from '../components/IMCComparisonModal';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/ProtectedRoute';

const AddEvaluacionesNutricionales = () => {  
    const { data: session, status } = useSession(); // Obtener la sesión y su estado
  
    const [nutritionPlan, setNutritionPlan] = useState({
        tallaMt: 1.75,
        pesoKg: 70,
        indiceCintura: 80,
        indiceCadera: 95,
        pesoGraso: 15,
        pesoMagra: 55,
    });

    const [rup, setRup] = useState(""); // Estado para almacenar el RUP
    const [historialPatologico, setHistorialPatologico] = useState<string[]>([]);
    const [historialClinico, setHistorialClinico] = useState<string[]>([]);

    const handleRemoveHistorialPatologico = (index: number) => {
        setHistorialPatologico(historialPatologico.filter((_, i) => i !== index));
    };

    const handleRemoveHistorialClinico = (index: number) => {
        setHistorialClinico(historialClinico.filter((_, i) => i !== index));
    };

    // Función para manejar cambios en los inputs
    const handleInputChange = (field: string, value: string | number) => {
        setNutritionPlan((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Función para manejar el cambio de RUP
    const handleRupChange = (newRup: string) => {
        setRup(newRup); // Actualiza el estado de RUP
    };

    return (
        <ProtectedRoute>
        <EvaluacionesNutricionalesLayout>
            <div>
                <HeaderUser title="Evaluaciones Nutricionales ~ Registro de Evaluaciones" />
                
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1, mt: 24, mr: 2 }}>
                        <EvaluacionesNutricionalesForm 
                            nutritionPlan={nutritionPlan}
                            onChange={handleInputChange} // Pasar la función de manejo de cambios
                            rup={rup} // Pasar el RUP
                            onRupChange={handleRupChange} // Pasar la función para actualizar el RUP
                            idMedico={0} onIdMedicoChange={function (id: number): void {
                                throw new Error('Function not implemented.');
                            } }                        />
                    </Box>
            
                    <Box sx={{ mt: 26, mr: 3, width: '600px', position: 'relative' }}>
                        <Card sx={{ background: 'white', boxShadow: 3, mb: 2 }}>
                            <CardContent>
                                <PatientRightBar 
                                    patientData={{
                                        fotoUrl: "",
                                        nombrePaciente: "",
                                        apellidoPaciente: "",
                                        rupPaciente: rup, // Usar el RUP aquí
                                        fechaRegistro: null,
                                        ciudadPaciente: "",
                                        objetivoConsulta: "",
                                        fechaNacimiento: "",
                                        edad: 0, // Add the missing 'edad' property
                                    }} 
                                    onRupChange={handleRupChange} // Pasar la función para manejar el cambio de RUP
                                    onPatientSelect={() => {
                                        // Implementar la lógica para manejar la selección del paciente
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <Card sx={{ background: 'white', boxShadow: 3, mb: 2 }}>
                            <CardContent>
                                <HistorialPatologico 
                                    historial={historialPatologico} 
                                    onAddHistorial={(nuevoHistorial) => setHistorialPatologico([...historialPatologico, nuevoHistorial])} 
                                    onRemoveHistorial={handleRemoveHistorialPatologico} 
                                />
                            </CardContent>
                        </Card>
                        <Card sx={{ background: 'white', boxShadow: 3 }}>
                            <CardContent>
                                <HistorialClinico 
                                    historial={historialClinico} 
                                    onAddHistorial={(nuevoHistorial) => setHistorialClinico([...historialClinico, nuevoHistorial])} 
                                    onRemoveHistorial={handleRemoveHistorialClinico} 
                                />
                            </CardContent>
                        </Card>

                        <Card sx={{ background: 'white', boxShadow: 3, mt: 14 }}>
                            <CardContent>
                                <NutritionalAnalysis 
                                  tallaMt={nutritionPlan.tallaMt}
                                  pesoKg={nutritionPlan.pesoKg}
                                  indiceCintura={nutritionPlan.indiceCintura}
                                  indiceCadera={nutritionPlan.indiceCadera}
                                  pesoGraso={nutritionPlan.pesoGraso}
                                  pesoMagra={nutritionPlan.pesoMagra}
                                />
                            </CardContent>

                            <Card sx={{ background: 'white', boxShadow: 3, mt: 2 }}>
                            <CardContent>
                                <IMCAnalysis 
                                    imc={nutritionPlan.pesoKg / (nutritionPlan.tallaMt ** 2)}
                                />
                            </CardContent>
                        </Card>
                        </Card>

                        <Card sx={{ mb:10, background: 'white', boxShadow: 3, mt: 2 }}>
                            <CardContent>
                                <IMCComparisonModal 
                                   tallaMt={nutritionPlan.tallaMt} 
                                   pesoKg={nutritionPlan.pesoKg} 
                                   pesoGraso={nutritionPlan.pesoGraso} 
                                   pesoMagra={nutritionPlan.pesoMagra} 
                                   imc={nutritionPlan.pesoKg / (nutritionPlan.tallaMt ** 2)} 
                                />
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </div>
        </EvaluacionesNutricionalesLayout>
        </ProtectedRoute>
    );
}

export default AddEvaluacionesNutricionales;