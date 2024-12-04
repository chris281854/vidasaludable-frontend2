'use client';

import HeaderUser from "@/components/headeruser";
import EvaluacionesNutricionalesLayout from "../EvaluacionesNutricionalesLayout";
import { Box, Card, CardContent } from '@mui/material';
import PatientRightBar from "@/components/PatientRightBar";
import EvaluacionesNutricionalesForm from "./components/EvalacionesNutricionalesForm";

const AddEvaluacionesNutricionales = () => {    
    return (
        <EvaluacionesNutricionalesLayout>
            <div>
                <HeaderUser title="Evaluaciones Nutricionales ~ Registro de Evaluaciones" />
                
                {/* Contenedor flex para el formulario y el right bar */}
                <Box sx={{ display: 'flex', mt: 4 }}> {/* mt: 4 para espacio entre el header y el formulario */}
                    <Box sx={{ flex: 1, mr: 2 }}> {/* Espacio a la derecha del formulario */}
                        <EvaluacionesNutricionalesForm />
                    </Box>
                    <Box sx={{ mt:26,mr:3, width: '500px', position: 'relative' }}>
                        <Card sx={{ background: 'white', boxShadow: 3 }}>
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
                    </Box>
                </Box>
            </div>
        </EvaluacionesNutricionalesLayout>
    );
}

export default AddEvaluacionesNutricionales;