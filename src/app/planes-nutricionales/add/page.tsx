'use client'

import HeaderUser from "@/components/headeruser";
import { Box, Paper } from "@mui/material";
import PlanesNutricionalesLayout from "../PlanesNutricionalesLayout";
import { useState } from "react";
import MainContainer from "./components/MainContainer";
import PatientRightBar from "@/app/planes-nutricionales/add/components/PatientRightBar";
import { Patient as DiagnosticoPatient } from "@/app/planes-nutricionales/interfaces/interfases";
import AditionalInfo from "./UI/AditionalInfo";
import { FormProvider } from "../context/FormContext";

interface Patient extends DiagnosticoPatient {
    fechaRegistro: Date | null;
    sexo: string;
}

const AddPNutritionalPlan:  React.FC = () => {
    const [formData, setFormData] = useState({
        nombrePaciente: '',
        apellidoPaciente: '',
        rupPaciente: '',
        fechaRegistro: null as string | null,
        ciudadPaciente: '',
        objetivoConsulta: '',
        firmaDigital: false
    });

    const handlePatientSelect = (patient: Patient) => {
        console.log(patient);
    };

    const handleRupChange = (rup: string) => {
        setFormData(prevState => ({
            ...prevState,
            rupPaciente: rup
        }));
    };

    return (
        <FormProvider>
        <PlanesNutricionalesLayout>
            <Box sx={{ p: 4 }}>
                <HeaderUser title='Planes Nutricionales ~ Asignacion de Planes' />
                
                {/* Espacio adicional después del HeaderUser */}
                <Box sx={{ height: '8rem' }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 1 }}>
                    <Box sx={{ flex: { xs: '1', lg: '5' }, maxWidth: { lg: '1500px' } }}> {/* Aumentar el tamaño del MainContainer */}
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <MainContainer /> 
                        </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}> {/* Reducir el tamaño de la barra lateral */}
                        <Box sx={{ flex: 1 }}> {/* Mantener el flex para que ocupe el espacio disponible */}
                            <PatientRightBar 
                                patientData={{
                                    fotoUrl: '',
                                    nombrePaciente: '',
                                    apellidoPaciente: '',
                                    rupPaciente: '',
                                    fechaRegistro: null,
                                    ciudadPaciente: '',
                                    objetivoConsulta: ''
                                }}
                                onRupChange={handleRupChange}
                                onPatientSelect={(patient) => handlePatientSelect({
                                    ...patient, fechaRegistro: null,
                                    sexo: "",
                                    nacimiento: "",
                                    email: ""
                                })}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}> {/* Mantener el flex para que ocupe el espacio disponible */}
                            <AditionalInfo /> {/* Asegúrate de que este sea el componente correcto */}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </PlanesNutricionalesLayout>
        </FormProvider>
    );
}

export default AddPNutritionalPlan;