// src/components/EvaluacionesNutricionalesEditForm.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Modal, Typography, InputAdornment } from '@mui/material';
import SectionDivider from '@/components/SectionDivider';
import MedicalSignatureComponent from '@/components/MedicalSignature';
import useSaveNutritionEvaluation from '@/app/planes-nutricionales/hooks/evaluacion-nutricional/useSaveNutritionEvaluation';
import { useSession } from 'next-auth/react';
import { CheckCircleIcon } from 'lucide-react';
import updateNutritionEvaluation from '@/app/planes-nutricionales/hooks/evaluacion-nutricional/useUpdateNutritionEvaluation';
import useFetchEvaluacion from '@/app/planes-nutricionales/hooks/evaluacion-nutricional/useFetchEvaluacion';
 
interface EvaluacionesNutricionalesEditFormProps {
    nutritionPlan: {
        tallaMt: number;
        pesoKg: number;
        indiceCintura: number;
        indiceCadera: number;
        pesoGraso: number;
        pesoMagra: number;
    };
    onChange: (field: string, value: number | string) => void; // Permitir tanto number como string
    rup: string; // Recibir el RUP
    onRupChange: (rup: string) => void; // Función para manejar cambios en el RUP

    idMedico: number;
    onIdMedicoChange: (id: number) => void;

    evaluationId: number; // ID de la evaluación a editar
    onEvaluationLoad: (id: number) => Promise<void>; // Función para cargar la evaluación
}

const EvaluacionesNutricionalesEditForm: React.FC<EvaluacionesNutricionalesEditFormProps> = ({ nutritionPlan, onChange, rup, onRupChange, evaluationId, onEvaluationLoad }) => {
    const { data: session } = useSession(); // Obtener la sesión
    const [formData, setFormData] = useState<{ [key: string]: any }>({
        idEvaluacion: evaluationId,
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
        idMedico: "",
        analiticasRecomendadas: "",
        liquidoRecomendado: "",
        farmacos: "",
        otrasRecomendaciones: "",
        proximaCita: "",
        userName: "",
    });

    const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal
    const { saveNutritionEvaluation, loading, error } = useSaveNutritionEvaluation(); // Usar el hook
    const [idEvaluacion, setIdEvaluacion] = useState<number | null>(null); // Estado para el ID de evaluación
    const { data, loading: loadingEvaluacion, error: errorEvaluacion } = useFetchEvaluacion(idEvaluacion); // Usar el hook para obtener la evaluación

    useEffect(() => {
        const loadEvaluation = async () => {
            if (evaluationId) {
                await onEvaluationLoad(evaluationId);
            }
        };
        loadEvaluation();
    }, [evaluationId, onEvaluationLoad]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const id = parseInt(event.currentTarget.value);
            if (!isNaN(id)) {
                console.log(`Buscando evaluación con ID: ${id}`); // Debugging
                setIdEvaluacion(id); // Establecer el ID de evaluación
            }
        }
    };

    useEffect(() => {
        if (data) {
            console.log('Datos de evaluación cargados:', data); // Debugging
            setFormData((prevData) => ({
                ...prevData,
                ...data, // Cargar los datos de la evaluación en el estado del formulario
            }));
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Verificar si el campo es de tipo "date"
        if (name === "proximaCita") {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
            onChange(name, value); // Llama a la función onChange con el valor de la fecha (string)
        } else {
            const numericValue = parseFloat(value);
            setFormData((prevData) => ({ ...prevData, [name]: value })); // Mantén el valor como string para campos de texto
            if (!isNaN(numericValue)) {
                onChange(name, numericValue); // Llama a la función onChange con el valor numérico
            } else {
                onChange(name, value); // Llama a la función onChange con el valor de texto
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
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
            idMedico: "",
            analiticasRecomendadas: "",
            liquidoRecomendado: "",
            farmacos: "",
            otrasRecomendaciones: "",
            proximaCita: "",
            userName: "",
        });
        setOpenModal(false);
    };

    const handleSave = async () => {
        if (!session) {
            console.error('No hay sesión activa. El token es undefined.');
            return; // No continuar si no hay sesión
        }

        // Crear un objeto con todos los campos necesarios
        const dataToSend = {
            rup: rup, // Asegúrate de que 'rup' tenga un valor válido
            objetivo: formData.objetivo,
            motivoConsulta: formData.motivoConsulta,
            alergias: formData.alergias,
            antecedentes: formData.antecedentes,
            medicamentos: formData.medicamentos,
            analiticas: formData.analiticas,
            tratamientos: formData.tratamientos,
            observaciones: formData.observaciones,
            funcionIntestinal: formData.funcionIntestinal || "", // Asegúrate de que sea un string
            funcionSueno: formData.funcionSuneo || "", // Asegúrate de que sea un string
            nivelActividad: formData.nivelActividad || "", // Asegúrate de que sea un string
            ingestaAlcoholica: formData.ingestaAlcoholica || "", // Asegúrate de que sea un string
            nivelesAnciedad: formData.nivelAnciedad || "", // Asegúrate de que sea un string
            otrasInformaciones: formData.otrasInformaciones || "", // Asegúrate de que sea un string
            tallaMt: Number(formData.tallaMt) || 0, // Asegúrate de que sea un número
            tallaCm: Number(formData.tallaCm) || 0,
            tallaPie: Number(formData.tallaPie) || 0,
            tallaPgs: Number(formData.tallaPgs) || 0, // Agregado
            pesoLb: Number(formData.pesoLb) || 0,
            tallaKg: Number(formData.pesoKg) || 0, // Agregado
            indiceCadera: Number(formData.indiceCadera) || 0,
            indiceCintura: Number(formData.indiceCintura) || 0,
            IMC: Number(formData.pesoKg) / (Number(formData.tallaMt) ** 2) || 0, // Cálculo del IMC
            porcientoGrasa: Number(formData.porcientoGrasa) || 0, // Agregado
            grasaViceral: Number(formData.grasaViceral) || 0, // Agregado
            pesoGraso: Number(formData.pesoGraso) || 0, // Agregado
            metabolismo: Number(formData.metabolismo) || 0, // Agregado
            pesoMagro: Number(formData.pesoMagro) || 0, // Agregado
            diagnosticoNutricional: formData.diagnosticoNutricional || "", // Asegúrate de que sea un string
            conclusionMedica: formData.conclusionMedica || "", // Asegúrate de que sea un string
            idMedico: Number(formData.idMedico) || 0, // Asegúrate de que sea un número entero
            analiticasRecomendadas: formData.analiticasRecomendadas || "", // Asegúrate de que sea un string
            liquidoRecomendado: formData.liquidoRecomendado || "", // Asegúrate de que sea un string
            farmacos: formData.farmacos || "", // Asegúrate de que sea un string
            otrasRecomendaciones: formData.otrasRecomendaciones || "", // Asegúrate de que sea un string
            proximaCita: formData.proximaCita || new Date().toISOString(), // Asegúrate de que sea una fecha válida
            userName: session.user.name, // Asegúrate de que el nombre de usuario esté disponible
        };

        // Validar que 'rup' no esté vacío
        if (!dataToSend.rup) {
            console.error('El campo "rup" no puede estar vacío.');
            return;
        }

        // Validar que los campos numéricos sean válidos
        const numericFields: (keyof typeof dataToSend)[] = ['tallaMt', 'tallaCm', 'tallaPie', 'pesoLb', 'indiceCadera', 'indiceCintura', 'tallaKg'];
        for (const key of numericFields) {
            if (isNaN(dataToSend[key]) || dataToSend[key] < 0) {
                console.error(`El campo "${key}" debe ser un número válido y no negativo.`);
                return;
            }
        }

        try {
            const response = await updateNutritionEvaluation(); // Llamar a la función para guardar
            if (response) {
                console.log('Evaluación nutricional guardada con éxito:', response);
                setOpenModal(true); // Abre el modal al guardar con éxito
                clearFields(); // Limpia los campos después de guardar
            }
        } catch (error) {
            console.error('Error al guardar la evaluación nutricional:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Card>
                <CardContent>
                    <TextField
                        label="ID de Evaluación"
                        name="idEvaluacion"
                        onKeyPress={handleKeyPress} // Agregar el manejador de eventos aquí
                        sx={{ mt: 10, mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CheckCircleIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <SectionDivider top={0} text={'Antecedentes de Consulta'} />
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

                    <SectionDivider top={0} text={'Antecedentes Personales'} />

                    <TextField
                        fullWidth
                        label="Funcion Intestinal"
                        name="funcionIntestinal"
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
                        name="funcionSuneo"
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
                        name="nivelAnciedad"
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

            {/* Sección para validaciones médicas */}
            <Card sx={{ marginTop: 4, maxWidth: 1600, padding: 1, maxHeight: 480 }}>
                <CardContent>
                    <SectionDivider top={0} text={'Validaciones Medicas'} />
                    <MedicalSignatureComponent onMedicoIdChange={(id: string) => console.log(id)} />
                </CardContent>
            </Card>

            {/* Modal de confirmación */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #4caf50', // Color verde para el borde
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2, // Bordes redondeados
                }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <CheckCircleIcon style={{ color: '#cc0000' }} /> {/* Icono de éxito */}
                        </Box>
                        Evaluación Nutricional Actualizada
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2, color: '#0a0a0a' }}>
                        La evaluación nutricional ha sido actualizada con éxito.
                    </Typography>
                    <Button onClick={handleCloseModal} sx={{ mt: 2 }} variant="contained" color="success">
                        Cerrar
                    </Button>
                </Box>
            </Modal>

            {/* Botón para guardar */}
            <div className='flex justify-center mb-11'>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={loading} // Deshabilitar el botón mientras se guarda
                    sx={{ marginTop: 5, mr: 10, borderRadius: '20px', padding: '10px 20px' }} // Bordes redondeados y mayor tamaño
                    size="large" // Aumentar el tamaño del botón
                >
                    {loading ? 'Guardando...' : 'Actualizar Evaluación Nutricional'}
                </Button>

                {/* Botón para limpiar */}
                <Button
                    variant="outlined"
                    color="error"
                    onClick={clearFields} // Llama a la función para limpiar los campos
                    sx={{ marginTop: 5, borderRadius: '20px', padding: '10px 20px' }} // Bordes redondeados
                    size="large" // Aumentar el tamaño del botón
                >
                    Limpiar Campos
                </Button>
            </div>
        </Box>
    );
}

export default EvaluacionesNutricionalesEditForm;