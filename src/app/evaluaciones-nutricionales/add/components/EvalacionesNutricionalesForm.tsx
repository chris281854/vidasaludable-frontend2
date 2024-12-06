'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import SectionDivider from '@/components/SectionDivider';
import MedicalSignatureComponent from '@/components/MedicalSignature';

interface EvaluacionesNutricionalesFormProps {
    nutritionPlan: {
        tallaMt: number;
        pesoKg: number;
        indiceCintura: number;
        indiceCadera: number;
        pesoGraso: number;
        pesoMagra: number;
    };
    onChange: (field: string, value: number) => void; // Función para manejar cambios
}

const EvaluacionesNutricionalesForm = () => {
    const [formData, setFormData] = useState({
        idEvaluacion: 0,
        rup: "",
        objetivo: "",
        motivoConsulta: "",
        alergias: "",
        antecedentes: "",
        medicamentos: "",
        analiticas: "",
        tratamientos: "",
        observaciones: "",
        funcionIntestinal:"",
        funcionSuneo:"",
        nivelActividad:"",
        ingestaAlcoholica:"",
        nivelAnciedad:"",
        otrasInformaciones:"",
        tallaMt:"",
        tallaCm:"",
        tallaPie:"",
        tallaPgs:"",
        pesoLb:"",
        pesoKg:"",
        indiceCadera:"",
        indiceCintura:"",
        IMC:"",
        porcientoGrasa:"",
        grasaViceral:"",
        pesoGraso:"",
        metabolismo:"",
        pesoMagro:"",
        diagnosticoNutricional:"",
        conclusionMedica:"",
        idMedico:"",
        analiticasRecomendadas:"",
        liquidoRecomendado:"",
        farmacos:"",
        otrasRecomendaciones:"",
        proximaCita:"",
        userName:"",

        // Agrega otros campos según sea necesario
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        // Aquí puedes implementar la lógica para enviar los datos a la API
        console.log(formData);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Card>
                <CardContent>
                 <SectionDivider top={0} text={'Antecedentes de Consulta'}/>
                    <TextField
                        fullWidth
                        label="Objetivo"
                        name="objetivo"
                        value={formData.objetivo}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Motivo de Consulta"
                        name="motivoConsulta"
                        value={formData.motivoConsulta}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Alergias"
                        name="alergias"
                        value={formData.alergias}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Antecedentes"
                        name="antecedentes"
                        value={formData.antecedentes}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Medicamentos"
                        name="medicamentos"
                        value={formData.medicamentos}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Analíticas"
                        name="analiticas"
                        value={formData.analiticas}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Tratamientos"
                        name="tratamientos"
                        value={formData.tratamientos}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Observaciones"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />

                <SectionDivider top={0} text={'Antecedentes Personales'}/>

                <TextField
                        fullWidth
                        label="Funcion Intestinal"
                        name="funcionintestinal"
                        value={formData.funcionIntestinal}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                

                    <TextField
                        fullWidth
                        label="Funcion del Sueno"
                        name="funcionSueno"
                        value={formData.funcionSuneo}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />


                        <TextField
                        fullWidth
                        label="Nivel de Actividad Fisica"
                        name="nivelActividad"
                        value={formData.nivelActividad}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />

                        <TextField
                        fullWidth
                        label="Ingesta Alcoholica"
                        name="ingestaAlcoholica"
                        value={formData.ingestaAlcoholica}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Niveles de Ansiedad"
                        name="nivelAnsiedad"
                        value={formData.nivelAnciedad}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Otras Informaciones"
                        name="otrasInformaciones"
                        value={formData.otrasInformaciones}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />



                </CardContent>


                
            </Card>

            {/* Nuevo Card para Antecedentes Personales */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <SectionDivider top={0} text={'Antropometria del paciente'} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1, mr: 1 }}>
                            <TextField
                                fullWidth
                                label="Talla Mt"
                                name="tallamt"
                                value={formData.tallaMt}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                sx: {
                                borderRadius: '20px',
                            },
                        }}
                            />
                            <TextField
                                fullWidth
                                label="Talla Pies"
                                name="tallapies"
                                value={formData.tallaPie}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Peso Libras"
                                name="pesoLb"
                                value={formData.pesoLb}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Indice de Cadera"
                                name="indiceCadera"
                                value={formData.indiceCadera}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, ml: 1 }}>
                            <TextField
                                fullWidth
                                label="Talla Cm"
                                name="tallaCm"
                                value={formData.tallaCm}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Talla pulgadas"
                                name="tallaPgs"
                                value={formData.tallaPgs}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Peso (Kg)"
                                name="pesoKg"
                                value={formData.pesoKg}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Indice de Cadera"
                                name="indiceCadera"
                                value={formData.indiceCadera}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                        </Box>
                        </Box>
                    <SectionDivider top={0} text={'Calculos Antropometricos'}/>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1, mr: 1 }}>
                            <TextField
                                fullWidth
                                label="IMC"
                                name="IMC"
                                value={formData.IMC}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                sx: {
                                borderRadius: '20px',
                            },
                        }}
                            />
                            <TextField
                                fullWidth
                                label="Grasa Viceral"
                                name="grasaViceral"
                                value={formData.grasaViceral}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Metabolismo"
                                name="metabolismo"
                                value={formData.metabolismo}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                           
                        </Box>
                        <Box sx={{ flex: 1, ml: 1 }}>
                            <TextField
                                fullWidth
                                label="Porciento de Grasa"
                                name="porcientoGrasa"
                                value={formData.porcientoGrasa}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Peso Graso"
                                name="pesoGraso"
                                value={formData.pesoGraso}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Peso Magro"
                                name="pesoMagro"
                                value={formData.pesoMagro}
                                onChange={handleChange}
                                sx={{ mb: 2, borderRadius: '20px' }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '20px',
                                    },
                                }}
                            />
                           
                        </Box>
                        </Box>

                    <SectionDivider top={0} text={'Analisis y diagnostico nutricional'}/>
                     
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1, mr: 1 }}>
                        <TextField
                            fullWidth
                            label="Análisis & Diagnóstico Nutricional"
                            name="analisisdiganostico"
                            value={formData.diagnosticoNutricional}
                            onChange={handleChange}
                            multiline // Esto convierte el TextField en un área de texto
                            rows={6} // Ajusta el número de filas según sea necesario
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                                />
                            </Box>
                        </Box>

                        <SectionDivider top={0} text={'Conclusiones Medicas'}/>
                     
                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
     <Box sx={{ flex: 1, mr: 1 }}>
         <TextField
             fullWidth
             label="Conclusiones Medicas"
             name="conclusionesMedicas"
             value={formData.conclusionMedica}
             onChange={handleChange}
             multiline // Esto convierte el TextField en un área de texto
             rows={6} // Ajusta el número de filas según sea necesario
             sx={{ mb: 2, borderRadius: '20px' }}
             InputProps={{
                 sx: {
                     borderRadius: '20px',
                 },
             }}
                 />
             </Box>
         </Box>
                </CardContent>
            </Card>

            {/* Nuevo Card para Antecedentes Personales */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <SectionDivider top={0} text={'Validaciones Medicas'} />
           

                <MedicalSignatureComponent />
                </CardContent>
            </Card>    

             
        </Box>
    );
}

export default EvaluacionesNutricionalesForm;