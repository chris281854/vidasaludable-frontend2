'use client'

import AddPatientForm from "@/app/paciente/add/components/AddPatientForm";
import HeaderUser from "@/components/headeruser";
import { Box, Paper, Typography } from "@mui/material";
import PlanesNutricionalesLayout from "../PlanesNutricionalesLayout";
import { useState } from "react";
import MainContainer from "./components/MainContainer";
import PatientRightBar from "@/app/planes-nutricionales/add/components/PatientRightBar";
import { Patient as DiagnosticoPatient } from "@/app/planes-nutricionales/interfaces/interfases";

interface Patient extends DiagnosticoPatient {
    fechaRegistro: Date | null;
    sexo: string;
}

const AddPNutritionalPlan = () => {
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
        <PlanesNutricionalesLayout>
            <Box sx={{ p: 4 }}>
                <HeaderUser title='Planes Nutricionales ~ Asignacion de Planes' />
                
                {/* Espacio adicional después del HeaderUser */}
                <Box sx={{ height: '8rem' }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                    <Box sx={{ flex: { xs: '1', lg: '3' } }}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <MainContainer /> 
                        </Paper>
                    </Box>
                    <Box sx={{ flex: { xs: '1', lg: '1' } }}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Datos de paciente para asignacion de plan
                            </Typography>
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
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </PlanesNutricionalesLayout>
    );
}

export default AddPNutritionalPlan;