// src/components/EvaluacionesNutricionalesEditForm.tsx

'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, IconButton, Button, CircularProgress, Snackbar } from '@mui/material';
import { useSession } from 'next-auth/react';
import NutritionEvaluationModal from '../../edit/components/NutritionEvaluationModal'; // Importar el nuevo componente
import ProtectedRoute from '@/components/ProtectedRoute';
import { SearchIcon, InfoIcon } from 'lucide-react'; // Asegúrate de tener estos íconos disponibles
import MedicalSignatureComponent from '@/components/MedicalSignature';
import SectionDivider from '@/components/SectionDivider';
import PatientRightBar from '@/components/PatientRightBar';
import HistorialPatologico from '../../components/HistorialPatologico';
import HistorialClinico from '../../components/HistorialClinico';
import NutritionalAnalysis from '../../components/NutritionalAnalysis';
import IMCAnalysis from '../../components/IMCAnalysis';
import IMCComparisonModal from '../../components/IMCComparisonModal';
import useDeleteNutritionEvaluation from '@/app/hooks/evaluacion-nutricional/useDeleteNutritionEvaluation';

const EvaluacionesNutricionalesDeleteForm: React.FC = () => {
    const { data: session } = useSession(); // Obtener la sesión
    const [openNutritionModal, setOpenNutritionModal] = useState(false); // Estado para controlar el modal
    const [idEvaluacion, setIdEvaluacion] = useState<number | null>(null); // Estado para el ID de evaluación
    const [evaluacionData, setEvaluacionData] = useState<any[]>([]); // Estado para almacenar los datos de la evaluación
    const [formData, setFormData] = useState<any>({}); // Estado para los datos del formulario
    const { deleteNutritionEvaluation, loading, error } = useDeleteNutritionEvaluation(); // Usar el hook

    const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para el Snackbar



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
            setEvaluacionData(data); // Almacenar los datos de la evaluación
            setOpenNutritionModal(true); // Abrir el modal después de obtener los datos
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const clearFields = () => {
        setFormData({
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
            funcionIntestinal: "",
            funcionSuneo: "",
            nivelActividad: "",
            ingestaAlcoholica: "",
            nivelAnciedad: "",
            otrasInformaciones: "",
            tallaMt: 0,
            tallaCm: 0,
            tallaPie: 0,
            tallaPgs: 0,
            pesoLb: 0,
            pesoKg: 0,
            indiceCadera: 0,
            indiceCintura: 0,
            IMC: 0,
            porcientoGrasa: 0,
            grasaViceral: 0,
            pesoGraso: 0,
            metabolismo: 0,
            pesoMagro: 0,
            diagnosticoNutricional: "",
            conclusionMedica: "",
            idMedico: 0,
            analiticasRecomendadas: "",
            liquidoRecomendado: "",
            farmacos: "",
            otrasRecomendaciones: "",
            proximaCita: "",
            userName: "",
           
        });
        setOpenNutritionModal(false);
    };

    const handleSelectEvaluation = (evaluation: any) => {
        // Completar los campos del formulario con los datos de la evaluación seleccionada
        setFormData({
            idEvaluacion: evaluation.idEvaluacion,
            objetivo: evaluation.objetivo,
            motivoConsulta: evaluation.motivoConsulta,
            alergias: evaluation.alergias,
            antecedentes: evaluation.antecedentes,
            medicamentos: evaluation.medicamentos,
            analiticas: evaluation.analiticas,
            tratamientos: evaluation.tratamientos,
            observaciones: evaluation.observaciones,
            funcionIntestital: evaluation.funcionIntestital || '', // Asegurarse de que se muestre
            funcionSuneo: evaluation.funcionSueno || '', // Asegurarse de que se muestre
            nivelActividad: evaluation.nivelActividad,
            ingestaAlcoholica: evaluation.ingestaAlcoholica,
            nivelAnciedad: evaluation.nivelesAnciedad || '', // Asegurarse de que se muestre
            otrasInformaciones: evaluation.otrasInformaciones,
            tallaMt: evaluation.tallaMt,
            tallaPie: evaluation.tallaPie,
            pesoLb: evaluation.pesoLb,
            indiceCadera: evaluation.indiceCadera,
            tallaCm: evaluation.tallaCm,
            tallaPgs: evaluation.tallaPgs,
            pesoKg: evaluation.pesoKg,
            indiceCintura: evaluation.indiceCintura,
            IMC: evaluation.IMC,
            grasaViceral: evaluation.grasaViceral,
            metabolismo: evaluation.metabolismo,
            porcientoGrasa: evaluation.porcientoGrasa,
            pesoGraso: evaluation.pesoGraso,
            pesoMagro: evaluation.pesoMagro,
            analiticasRecomendadas: evaluation.analiticasRecomendadas,
            liquidoRecomendado: evaluation.liquidoRecomendado,
            farmacos: evaluation.farmacos,
            otrasRecomendaciones: evaluation.otrasRecomendaciones,
            proximaCita: evaluation.proximaCita,
            paciente:{
                pacientname: evaluation.paciente.pacientname,
            }
            
        });
        setOpenNutritionModal(false); // Cerrar el modal después de seleccionar
    };

    const handleUpdate = async () => {
        try {
            // Asegúrate de que los nombres de las propiedades coincidan con el DTO
            const dataToUpdate = {
                idEvaluacion: formData.idEvaluacion,
                objetivo: formData.objetivo,
                motivoConsulta: formData.motivoConsulta,
                alergias: formData.alergias,
                antecedentes: formData.antecedentes,
                medicamentos: formData.medicamentos,
                analiticas: formData.analiticas,
                tratamientos: formData.tratamientos,
                observaciones: formData.observaciones,
                funcionIntestinal: formData.funcionIntestinal, // Cambiar a funcionIntestinal
                funcionSueno: formData.funcionSuneo, // Cambiar a funcionSueno
                nivelActividad: formData.nivelActividad,
                ingestaAlcoholica: formData.ingestaAlcoholica,
                nivelesAnciedad: formData.nivelAnciedad, // Cambiar a nivelesAnciedad
                otrasInformaciones: formData.otrasInformaciones,
                tallaMt: formData.tallaMt,
                tallaCm: formData.tallaCm,
                tallaPie: formData.tallaPie,
                tallaPgs: formData.tallaPgs,
                pesoLb: formData.pesoLb,
                tallaKg: formData.pesoKg,
                indiceCadera: formData.indiceCadera,
                indiceCintura: formData.indiceCintura,
                IMC: formData.IMC,
                porcientoGrasa: formData.porcientoGrasa,
                grasaViceral: formData.grasaViceral,
                pesoGraso: formData.pesoGraso,
                metabolismo: formData.metabolismo,
                pesoMagro: formData.pesoMagro,
                diagnosticoNutricional: formData.diagnosticoNutricional,
                conclusionMedica: formData.conclusionMedica,
                idMedico: formData.idMedico,
                analiticasRecomendadas: formData.analiticasRecomendadas,
                liquidoRecomendado: formData.liquidoRecomendado,
                farmacos: formData.farmacos,
                otrasRecomendaciones: formData.otrasRecomendaciones,
                proximaCita: formData.proximaCita,
                registro: formData.registro,
                userName: formData.userName,
            };
    
            await deleteNutritionEvaluation(formData.idEvaluacion, dataToUpdate);
            setSnackbarMessage('Evaluación eliminada con éxito');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            clearFields;
        } catch (error) {
            console.error('Error al actualizar la evaluación:', error);
            setSnackbarOpen(true); // Mostrar Snackbar de error
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
                                value={formData.idEvaluacion || ''}
                                onChange={(e) => setFormData({ ...formData, idEvaluacion: e.target.value })}
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

                        <SectionDivider top={0} text={'Antecedentes de Consulta'} />
                        <TextField
                            fullWidth
                            label="Objetivo"
                            name="objetivo"
                            value={formData.objetivo || ''}
                            onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
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
                            value={formData.motivoConsulta || ''}
                            onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
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
                            value={formData.alergias || ''}
                            onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
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
                            value={formData.antecedentes || ''}
                            onChange={(e) => setFormData({ ...formData, antecedentes: e.target.value })}
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
                            value={formData.medicamentos || ''}
                            onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
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
                            value={formData.analiticas || ''}
                            onChange={(e) => setFormData({ ...formData, analiticas: e.target.value })}
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
                            value={formData.tratamientos || ''}
                            onChange={(e) => setFormData({ ...formData, tratamientos: e.target.value })}
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
                            value={formData.observaciones || ''}
                            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />

                        <SectionDivider top={0} text={'Antecedentes Personales'} />
                        <TextField
                            fullWidth
                            label="Función Intestinal"
                            name="funcionIntestinal"
                            value={formData.funcionIntestital || ''}
                            onChange={(e) => setFormData({ ...formData, funcionIntestital: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Función del Sueño"
                            name="funcionSuneo"
                            value={formData.funcionSuneo || ''}
                            onChange={(e) => setFormData({ ...formData, funcionSuneo: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Nivel de Actividad Física"
                            name="nivelActividad"
                            value={formData.nivelActividad || ''}
                            onChange={(e) => setFormData({ ...formData, nivelActividad: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Ingesta Alcohólica"
                            name="ingestaAlcoholica"
                            value={formData.ingestaAlcoholica || ''}
                            onChange={(e) => setFormData({ ...formData, ingestaAlcoholica: e.target.value })}
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
                            name="nivelAnciedad"
                            value={formData.nivelAnciedad || ''}
                            onChange={(e) => setFormData({ ...formData, nivelAnciedad: e.target.value })}
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
                            value={formData.otrasInformaciones || ''}
                            onChange={(e) => setFormData({ ...formData, otrasInformaciones: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />

                        {/* Nuevo Card para Antropometría del paciente */}
                        <Card sx={{ marginTop: 4 }}>
                            <CardContent>
                                <SectionDivider top={0} text={'Antropometría del paciente'} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ flex: 1, mr: 1 }}>
                                        <TextField
                                            fullWidth
                                            label="Talla Mt"
                                            name="tallaMt"
                                            value={formData.tallaMt || ''}
                                            onChange={(e) => setFormData({ ...formData, tallaMt: e.target.value })}
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
                                            name="tallaPie"
                                            value={formData.tallaPie || ''}
                                            onChange={(e) => setFormData({ ...formData, tallaPie: e.target.value })}
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
                                            value={formData.pesoLb || ''}
                                            onChange={(e) => setFormData({ ...formData, pesoLb: e.target.value })}
                                            sx={{ mb: 2, borderRadius: '20px' }}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '20px',
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Índice de Cadera"
                                            name="indiceCadera"
                                            value={formData.indiceCadera || ''}
                                            onChange={(e) => setFormData({ ...formData, indiceCadera: e.target.value })}
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
                                            value={formData.tallaCm || ''}
                                            onChange={(e) => setFormData({ ...formData, tallaCm: e.target.value })}
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
                                            value={formData.tallaPgs || ''}
                                            onChange={(e) => setFormData({ ...formData, tallaPgs: e.target.value })}
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
                                            value={formData.pesoKg || ''}
                                            onChange={(e) => setFormData({ ...formData, pesoKg: e.target.value })}
                                            sx={{ mb: 2, borderRadius: '20px' }}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '20px',
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Índice de Cintura"
                                            name="indiceCintura"
                                            value={formData.indiceCintura || ''}
                                            onChange={(e) => setFormData({ ...formData, indiceCintura: e.target.value })}
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

                        {/* Nuevo Card para Cálculos Antropométricos del paciente */}
                        <Card sx={{ marginTop: 4 }}>
                            <CardContent>
                                <SectionDivider top={0} text={'Cálculos Antropométricos del paciente'} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ flex: 1, mr: 1 }}>
                                        <TextField
                                            fullWidth
                                            label="IMC"
                                            name="IMC"
                                            value={formData.IMC || ''}
                                            onChange={(e) => setFormData({ ...formData, IMC: e.target.value })}
                                            sx={{ mb: 2, borderRadius: '20px' }}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '20px',
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Grasa Visceral"
                                            name="grasaViceral"
                                            value={formData.grasaViceral || ''}
                                            onChange={(e) => setFormData({ ...formData, grasaViceral: e.target.value })}
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
                                            value={formData.metabolismo || ''}
                                            onChange={(e) => setFormData({ ...formData, metabolismo: e.target.value })}
                                            sx={{ mb: 2, borderRadius: '20px' }}
                                            InputProps={{
                                                sx: {
                                                    borderRadius: '20px',
                                                },
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Porcentaje Grasa Corporal"
                                            name="porcientoGrasa"
                                            value={formData.porcientoGrasa || ''}
                                            onChange={(e) => setFormData({ ...formData, porcientoGrasa: e.target.value })}
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
                                            label="Peso Graso"
                                            name="pesoGraso"
                                            value={formData.pesoGraso || ''}
                                            onChange={(e) => setFormData({ ...formData, pesoGraso: e.target.value })}
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
                                            value={formData.pesoMagro || ''}
                                            onChange={(e) => setFormData({ ...formData, pesoMagro: e.target.value })}
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

                        {/* Sección para validaciones médicas */}
                        <Card sx={{ marginTop: 4, maxWidth: 1600, padding: 1, maxHeight: 890 }}>
                            <CardContent>
                                <SectionDivider top={0} text={'Recomendaciones Analíticas Médicas'} />
                                <TextField
                                    fullWidth
                                    label="Analíticas Recomendadas"
                                    name="analiticasRecomendadas"
                                    value={formData.analiticasRecomendadas || ''}
                                    onChange={(e) => setFormData({ ...formData, analiticasRecomendadas: e.target.value })}
                                    sx={{ mb: 2, borderRadius: '20px' }}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '20px',
                                        },
                                    }}
                                />
                                <SectionDivider top={0} text={'Recomendación de Consumos Líquidos'} />
                                <TextField
                                    fullWidth
                                    label="Recomendación de Líquidos"
                                    name="liquidoRecomendado"
                                    value={formData.liquidoRecomendado || ''}
                                    onChange={(e) => setFormData({ ...formData, liquidoRecomendado: e.target.value })}
                                    sx={{ mb: 2, borderRadius: '20px' }}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '20px',
                                        },
                                    }}
                                />
                                <SectionDivider top={0} text={'Recomendación de Fármacos'} />
                                <TextField
                                    fullWidth
                                    label="Recomendación de fármacos"
                                    name="farmacos"
                                    value={formData.farmacos || ''}
                                    onChange={(e) => setFormData({ ...formData, farmacos: e.target.value })}
                                    sx={{ mb: 2, borderRadius: '20px' }}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '20px',
                                        },
                                    }}
                                />
                                <SectionDivider top={0} text={'Otras Recomendaciones'} />
                                <TextField
                                    fullWidth
                                    label="Otras Recomendaciones"
                                    name="otrasRecomendaciones"
                                    value={formData.otrasRecomendaciones || ''}
                                    onChange={(e) => setFormData({ ...formData, otrasRecomendaciones: e.target.value })}
                                    sx={{ mb: 2, borderRadius: '20px' }}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '20px',
                                        },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Fecha de Próxima Cita"
                                    name="proximaCita"
                                    type="date"
                                    value={formData.proximaCita || ''}
                                    onChange={(e) => setFormData({ ...formData, proximaCita: e.target.value })}
                                    sx={{ mb: 2, borderRadius: '20px' }}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '20px',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Sección para validaciones médicas */}
                        <Card sx={{ marginTop: 4, maxWidth: 1600, padding: 1, maxHeight: 480 }}>
                            <CardContent>
                                <SectionDivider top={0} text={'Validaciones Médicas'} />
                                <MedicalSignatureComponent onMedicoIdChange={(id: string) => console.log(id)} />
                            </CardContent>
                        </Card>

                        {/* Botón para guardar la evaluación */}
                        <Box className="flex justify-center mt-8">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleUpdate}
                                disabled={loading} // Deshabilitar el botón mientras se guarda
                                sx={{ borderRadius: '20px', padding: '10px 20px', mr: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Eliminar Evaluación'}
                            </Button>

                            <Button
                                variant="contained"
                                color="warning"
                                onClick={clearFields}
                                disabled={loading} // Deshabilitar el botón mientras se guarda
                                sx={{ borderRadius: '20px', padding: '10px 20px',ml: 2 }}
                            >
                                Limpiar Campos
                            </Button>
                        </Box>

                        {/* Snackbar para mostrar errores */}
                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={6000}
                            onClose={() => setSnackbarOpen(false)}
                            message={error || 'Evaluación actualizada con éxito'}
                        />

                        {/* Modal de evaluación nutricional */}
                        <NutritionEvaluationModal 
                            open={openNutritionModal}
                            onClose={() => setOpenNutritionModal(false)}
                            evaluationData={evaluacionData} // Pasar los datos de la evaluación
                            onSelectEvaluation={handleSelectEvaluation} // Pasar la función para manejar la selección
                        />
                    </CardContent>
                </Card>
            </Box>


            <Box sx={{ mt: 26, mr: 3, width: '600px', position: 'relative' }}>
                        <Card sx={{ background: 'white', boxShadow: 3, mb: 2 }}>
                            <CardContent>
                                <PatientRightBar 
                                    patientData={{
                                        fotoUrl: "",
                                        nombrePaciente: formData.paciente?.pacientname || '',
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
        </ProtectedRoute>
    );
}

export default EvaluacionesNutricionalesDeleteForm;

function setSnackbarMessage(arg0: string) {
    throw new Error('Function not implemented.');
}
function setSnackbarSeverity(arg0: string) {
    throw new Error('Function not implemented.');
}

