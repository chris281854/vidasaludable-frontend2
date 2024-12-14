// src/components/EvaluacionesNutricionalesForm.tsx

'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Modal, Typography } from '@mui/material';
import SectionDivider from '@/components/SectionDivider';
import MedicalSignatureComponent from '@/components/MedicalSignature';
import useSaveNutritionEvaluation from '@/app/hooks/evaluacion-nutricional/useSaveNutritionEvaluation';
import { useSession } from 'next-auth/react';
import { CheckCircleIcon } from 'lucide-react';

interface EvaluacionesNutricionalesFormProps {
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
}

const EvaluacionesNutricionalesForm: React.FC<EvaluacionesNutricionalesFormProps> = ({ nutritionPlan, onChange, rup, onRupChange }) => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState<{ [key: string]: any }>({
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

    const [openModal, setOpenModal] = useState(false);
    const { saveNutritionEvaluation, loading, error } = useSaveNutritionEvaluation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        // Verificar si el campo es de tipo "date"
        if (name === "proximaCita") {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
            onChange(name, value);
        } else {
            const numericValue = parseFloat(value);
            
            // Si el campo está vacío, se asigna un valor por defecto
            if (value === "") {
                setFormData((prevData) => ({ ...prevData, [name]: null }));
                onChange(name, "");
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: value }));
                if (!isNaN(numericValue)) {
                    onChange(name, numericValue);
                } else {
                    onChange(name, value);
                }
            }
        }
    
        // Realizar conversiones y cálculos para campos específicos
        if (name === "tallaMt") {
            const tallaMt = value ? parseFloat(value) : 0; // Convertir metros a centímetros (validación)
            const cm = tallaMt * 100;
            const feet = tallaMt * 3.28084;
            const inches = feet * 12;
    
            // Validación antes de actualizar el estado
            setFormData((prevData) => ({
                ...prevData,
                tallaCm: cm || null,
                tallaPie: feet || null,
                tallaPgs: inches || null,
            }));
        }
    
        if (name === "pesoLb") {
            const pesoLb = value ? parseFloat(value) : 0; // Validación de libras
            const kg = pesoLb * 0.453592;
    
            // Validación antes de actualizar el estado
            setFormData((prevData) => ({
                ...prevData,
                pesoKg: kg || null,
            }));
        }
    
        // Calcular IMC y otros valores si los datos están disponibles
        calculateNutritionMetrics();
    };
    
    const calculateNutritionMetrics = () => {
        const { tallaMt, pesoKg, indiceCintura, indiceCadera } = formData;
    
        // Verificar que los valores no sean null o cero antes de hacer cálculos
        if (tallaMt && pesoKg && tallaMt > 0 && pesoKg > 0 && tallaMt != null && pesoKg != null) {
            const imc = pesoKg / (tallaMt ** 2);
            const grasaViceral = calculateGrasaViceral(imc);
            const metabolismo = calculateMetabolismo(pesoKg, tallaMt);
            const porcientoGrasa = calculatePorcentajeGrasa(imc);
            const pesoGraso = (porcientoGrasa / 100) * pesoKg;
            const pesoMagro = pesoKg - pesoGraso;
    
            setFormData((prevData) => ({
                ...prevData,
                IMC: imc,
                grasaViceral,
                metabolismo,
                porcientoGrasa,
                pesoGraso,
                pesoMagro,
            }));
        }
    
        // Calcular índices de cintura y cadera si están disponibles
        if (indiceCintura && indiceCadera && indiceCintura > 0 && indiceCadera > 0) {
            // Aquí puedes agregar la lógica para calcular los índices si es necesario
        }
    };
    
    const calculateGrasaViceral = (imc: number): number => {
        // Implementa la lógica para calcular la grasa visceral
        return imc * 0.1; // Ejemplo simple, ajusta según tus estándares
    };
    
    const calculateMetabolismo = (pesoKg: number, tallaMt: number): number => {
        // Implementa la lógica para calcular el metabolismo
        return 10 * pesoKg + 6.25 * (tallaMt * 100) - 5 * 30 + 5; // Ejemplo simple para hombres
    };
    
    const calculatePorcentajeGrasa = (imc: number): number => {
        // Implementa la lógica para calcular el porcentaje de grasa corporal
        return (imc - 20) * 0.5; // Ejemplo simple, ajusta según tus estándares
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

        const dataToSend = {
            rup: rup,
            objetivo: formData.objetivo,
            motivoConsulta: formData.motivoConsulta,
            alergias: formData.alergias,
            antecedentes: formData.antecedentes,
            medicamentos: formData.medicamentos,
            analiticas: formData.analiticas,
            tratamientos: formData.tratamientos,
            observaciones: formData.observaciones,
            funcionIntestinal: formData.funcionIntestinal || "",
            funcionSueno: formData.funcionSuneo || "",
            nivelActividad: formData.nivelActividad || "",
            ingestaAlcoholica: formData.ingestaAlcoholica || "",
            nivelesAnciedad: formData.nivelAnciedad || "",
            otrasInformaciones: formData.otrasInformaciones || "",
            tallaMt: Number(formData.tallaMt) || 0,
            tallaCm: Number(formData.tallaCm) || 0,
            tallaPie: Number(formData.tallaPie) || 0,
            tallaPgs: Number(formData.tallaPgs) || 0,
            pesoLb: Number(formData.pesoLb) || 0,
            tallaKg: Number(formData.pesoKg) || 0,
            indiceCadera: Number(formData.indiceCadera) || 0,
            indiceCintura: Number(formData.indiceCintura) || 0,
            IMC: Number(formData.IMC) || 0,
            porcientoGrasa: Number(formData.porcientoGrasa) || 0,
            grasaViceral: Number(formData.grasaViceral) || 0,
            pesoGraso: Number(formData.pesoGraso) || 0,
            metabolismo: Number(formData.metabolismo) || 0,
            pesoMagro: Number(formData.pesoMagro) || 0,
            diagnosticoNutricional: formData.diagnosticoNutricional || "",
            conclusionMedica: formData.conclusionMedica || "",
            idMedico: Number(formData.idMedico) || 0,
            analiticasRecomendadas: formData.analiticasRecomendadas || "",
            liquidoRecomendado: formData.liquidoRecomendado || "",
            farmacos: formData.farmacos || "",
            otrasRecomendaciones: formData.otrasRecomendaciones || "",
            proximaCita: formData.proximaCita || new Date().toISOString(),
            userName: session.user.name,
        };

        if (!dataToSend.rup) {
            console.error('El campo "rup" no puede estar vacío.');
            return;
        }

        const numericFields: (keyof typeof dataToSend)[] = ['tallaMt', 'tallaCm', 'tallaPie', 'pesoLb', 'indiceCadera', 'indiceCintura', 'tallaKg'];
        for (const key of numericFields) {
            if (isNaN(dataToSend[key]) || dataToSend[key] < 0) {
                console.error(`El campo "${key}" debe ser un número válido y no negativo.`);
                return;
            }
        }

        try {
            const response = await saveNutritionEvaluation(dataToSend);
            if (response) {
                console.log('Evaluación nutricional guardada con éxito:', response);
                setOpenModal(true);
                clearFields();
            }
        } catch (error) {
            console.error('Error al guardar la evaluación nutricional:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Card>
                <CardContent>
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

            {/* Nuevo Card para Antropometria del paciente */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <SectionDivider top={0} text={'Antropometria del paciente'} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ flex: 1, mr: 1 }}>
                            <TextField
                                fullWidth
                                label="Talla Mt"
                                name="tallaMt"
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
                                name="tallaPie"
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
                                label="Indice de Cintura"
                                name="indiceCintura"
                                value={formData.indiceCintura}
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
                </CardContent>
            </Card>

            {/* Nuevo Card para Calculos Antropometricos del paciente */}
            <Card sx={{ marginTop: 4 }}>
                <CardContent>
                    <SectionDivider top={0} text={'Calculos Antropometricos del paciente'} />
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
                                label="Grasa Visceral"
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
                            <TextField
                                fullWidth
                                label="Porciento Grasa Corporal"
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
                        </Box>
                        <Box sx={{ flex: 1, ml: 1 }}>
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
                </CardContent>
            </Card>

            {/* Sección para validaciones médicas */}
            <Card sx={{ marginTop: 4, maxWidth: 1600, padding: 1, maxHeight: 890 }}>
                <CardContent>
                    <SectionDivider top={0} text={'Recomendaciones Analiticas Medicas'} />
                    <TextField
                        fullWidth
                        label="Analiticas Recomendadas"
                        name="analiticasRecomendadas"
                        value={formData.analiticasRecomendadas}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <SectionDivider top={0} text={'Recomendacion de Consumos Liquidos'} />
                    <TextField
                        fullWidth
                        label="Recomendacion de Liquidos"
                        name="liquidoRecomendado"
                        value={formData.liquidoRecomendado}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <SectionDivider top={0} text={'Recomendacion de Farmacos'} />
                    <TextField
                        fullWidth
                        label="Recomendacion de farmacos"
                        name="farmacos"
                        value={formData.farmacos}
                        onChange={handleChange}
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
                        value={formData.otrasRecomendaciones}
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
                        label="Fecha de Proxima Cita"
                        name="proximaCita"
                        type="date"
                        value={formData.proximaCita}
                        onChange={handleChange}
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
                    border: '2px solid #4caf50',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                            <CheckCircleIcon style={{ color: '#cc0000' }} />
                        </Box>
                        Evaluación Nutricional Guardada
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2, color: '#0a0a0a' }}>
                        La evaluación nutricional ha sido guardada con éxito.
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
                    disabled={loading}
                    sx={{ marginTop: 5, mr: 10, borderRadius: '20px', padding: '10px 20px' }}
                    size="large"
                >
                    {loading ? 'Guardando...' : 'Guardar Evaluación Nutricional'}
                </Button>

                {/* Botón para limpiar */}
                <Button
                    variant="outlined"
                    color="error"
                    onClick={clearFields}
                    sx={{ marginTop: 5, borderRadius: '20px', padding: '10px 20px' }}
                    size="large"
                >
                    Limpiar Campos
                </Button>
            </div>
        </Box>
    );
}

export default EvaluacionesNutricionalesForm;