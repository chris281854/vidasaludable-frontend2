'use client';

import ProtectedRoute from "@/components/ProtectedRoute"; // Asegúrate de que esta ruta sea correcta
import HistorialClinicoLayout from "../historialClinicoLayout"; // Verifica que esta ruta sea correcta
import HeaderUser from "@/components/headeruser"; // Asegúrate de que esta ruta sea correcta
import { Box, Card, CardContent } from "@mui/material";
import { useState } from "react";
import PatientRightBar from "@/components/PatientRightBar"; // Asegúrate de que esta ruta sea correcta
import { useSession } from "next-auth/react";
import HistorialClinico from "@/app/evaluaciones-nutricionales/components/HistorialClinico";
import HistorialPatologico from "@/app/evaluaciones-nutricionales/components/HistorialPatologico";
import IMCAnalysis from "@/app/evaluaciones-nutricionales/components/IMCAnalysis";
import IMCComparisonModal from "@/app/evaluaciones-nutricionales/components/IMCComparisonModal";
import NutritionalAnalysis from "@/app/evaluaciones-nutricionales/components/NutritionalAnalysis";
import HistorialClinicoEditForm from "./components/HistorialClinicoEditForm";
 



const HistorialClinicoEditPage = () => {
    const [nutritionPlan, setNutritionPlan] = useState({
        tallaMt: 1.75,
        pesoKg: 70,
        indiceCintura: 80,
        indiceCadera: 95,
        pesoGraso: 15,
        pesoMagra: 55,
    });

    const { data: session, status } = useSession(); // Obtener la sesión y su estado

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
        setHistorialClinico((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Función para manejar el cambio de RUP
    const handleRupChange = (newRup: string) => {
        console.log("RUP actualizado:", newRup); // Verifica el nuevo valor

        setRup(newRup); // Actualiza el estado de RUP
    };

    return (
        <ProtectedRoute>
            <HistorialClinicoLayout>
                <div>
                    <HeaderUser title="Historiales Clinicos ~ Edicion de Historiales" />
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1, mt: 21, mr: 2 }}>
                        <HistorialClinicoEditForm 
                            //onChange={handleInputChange} 
                           
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

                        <Card sx={{ background: 'white', boxShadow: 3, mt: 2}}>
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
            </HistorialClinicoLayout>
        </ProtectedRoute>
    );
}

export default HistorialClinicoEditPage;