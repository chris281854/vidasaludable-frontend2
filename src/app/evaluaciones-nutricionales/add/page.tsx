'use client';

import HeaderUser from "@/components/headeruser";
import EvaluacionesNutricionalesLayout from "../EvaluacionesNutricionalesLayout";
import { Box, Card, CardContent } from '@mui/material';
import PatientRightBar from "@/components/PatientRightBar";
 import HistorialPatologico from "../components/HistorialPatologico"; // Asegúrate de que la ruta sea correcta
import HistorialClinico from "../components/HistorialClinico"; // Asegúrate de que la ruta sea correcta
import { useState } from 'react';
import EvaluacionesNutricionalesForm from "./components/EvalacionesNutricionalesForm";

const AddEvaluacionesNutricionales = () => {    
    const [historialPatologico, setHistorialPatologico] = useState<string[]>([]);
    const [historialClinico, setHistorialClinico] = useState<string[]>([]);

    const handleRemoveHistorialPatologico = (index: number) => {
        setHistorialPatologico(historialPatologico.filter((_, i) => i !== index));
    };

    const handleRemoveHistorialClinico = (index: number) => {
        setHistorialClinico(historialClinico.filter((_, i) => i !== index));
    };

    return (
        <EvaluacionesNutricionalesLayout>
            <div>
                <HeaderUser title="Evaluaciones Nutricionales ~ Registro de Evaluaciones" />
                
                {/* Contenedor flex para el formulario y el right bar */}
                <Box sx={{ display: 'flex' }}> {/* mt: 4 para espacio entre el header y el formulario */}
              
                    <Box sx={{ flex: 1, mt:24, mr: 2 }}> {/* Espacio a la derecha del formulario */}
                        <EvaluacionesNutricionalesForm />
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
                                    onRemoveHistorial={handleRemoveHistorialPatologico} // Pasar la función de eliminación
                                />
                            </CardContent>
                        </Card>
                        <Card sx={{ background: 'white', boxShadow: 3 }}>
                            <CardContent>
                                <HistorialClinico 
                                    historial={historialClinico} 
                                    onAddHistorial={(nuevoHistorial) => setHistorialClinico([...historialClinico, nuevoHistorial])} 
                                    onRemoveHistorial={handleRemoveHistorialClinico} // Pasar la función de eliminación
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