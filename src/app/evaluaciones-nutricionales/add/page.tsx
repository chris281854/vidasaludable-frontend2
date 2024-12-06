// AddEvaluacionesNutricionales.tsx

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

const AddEvaluacionesNutricionales = () => {    
    const [nutritionPlan, setNutritionPlan] = useState({
        tallaMt: 1.75,
        pesoKg: 70,
        indiceCintura: 80,
        indiceCadera: 95,
        pesoGraso: 15,
        pesoMagra: 55,
    });

    const [historialPatologico, setHistorialPatologico] = useState<string[]>([]);
    const [historialClinico, setHistorialClinico] = useState<string[]>([]);

    const handleRemoveHistorialPatologico = (index: number) => {
        setHistorialPatologico(historialPatologico.filter((_, i) => i !== index));
    };

    const handleRemoveHistorialClinico = (index: number) => {
        setHistorialClinico(historialClinico.filter((_, i) => i !== index));
    };

    // Función para manejar cambios en los inputs
    const handleInputChange = (field: string, value: number) => {
        setNutritionPlan((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <EvaluacionesNutricionalesLayout>
            <div>
                <HeaderUser title="Evaluaciones Nutricionales ~ Registro de Evaluaciones" />
                
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1, mt: 24, mr: 2 }}>
                        <EvaluacionesNutricionalesForm 
                            nutritionPlan={nutritionPlan} 
                            onChange={handleInputChange} // Pasar la función de manejo de cambios
                        />
                    </Box>
            
                    <Box sx={{ mt: 26, mr: 3, width: '600px', position: 'relative' }}>
                        <Card sx={{ background: 'white', boxShadow: 3, mb: 2 }}>
                            <CardContent>
                                <PatientRightBar 
                                    patientData={{
                                        fotoUrl: "",
                                        nombrePaciente: "",
                                        apellidoPaciente: "",
                                        rupPaciente: "",
                                        fechaRegistro: null,
                                        ciudadPaciente: "",
                                        objetivoConsulta: ""
                                    }} 
                                    onRupChange={(rup: string): void => {
                                        // Implementar la lógica para manejar el cambio de RUP
                                    }} 
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
                        </Card>
                    </Box>
                </Box>
            </div>
        </EvaluacionesNutricionalesLayout>
    );
}

export default AddEvaluacionesNutricionales;