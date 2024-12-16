import HistorialClinico from "@/app/evaluaciones-nutricionales/components/HistorialClinico";
import useUpdateHistorialClinico from "@/app/hooks/historial-clinico/useUpdateHistorialClinico";
import MedicalSignatureComponent from "@/components/MedicalSignature";
import SectionDivider from "@/components/SectionDivider";
import { Alert, Button, Card, CardContent, CircularProgress, IconButton, InputAdornment, Snackbar, TextField } from "@mui/material";
import { Box } from "@mui/material";
import { InfoIcon, SearchIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import HistorialClinicoModal from "./HistorialClinicoModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import { HiIdentification } from "react-icons/hi2";

const HistorialClinicoEditForm: React.FC = () => {
    const { data: session } = useSession(); // Obtener la sesión

    const [openHistorialModal, setOpenHistorialModal] = useState(false); // Estado para controlar el modal
    const [idHistorial, setIdHistorial] = useState<number | null>(null); // Estado para el ID de historial
    const [historialData, setHistorialData] = useState<any[]>([]); // Estado para almacenar los datos del historial
    const [formData, setFormData] = useState<any>({}); // Estado para los datos del formulario
    const { updateHistorialClinico, loading, error } = useUpdateHistorialClinico(); // Usar el hook

    const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para el Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Estado para el mensaje del Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success'); // Estado para la severidad del Snackbar

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevenir el comportamiento por defecto
            const inputValue = event.currentTarget.value; // Obtener el valor del input
            const idHistorial = parseInt(inputValue);
            if (!isNaN(idHistorial)) {
                setIdHistorial(idHistorial); // Establecer el ID de historial
            }
        }
    };

    const fetchHistorialData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/historial-clinico/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del historial clínico');
            }

            const data = await response.json();
            setHistorialData(data); // Almacenar los datos del historial
            setOpenHistorialModal(true); // Abrir el modal después de obtener los datos
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const clearForm = () => {
        setFormData({
            idHistorial: 0,
            rup: "",
            objetivo: "",
            motivoConsulta: "",
            alergias: "",
            antecedentesPersonales: "",
            antecedentesFamiliares: "",
            peso: 0,
            medicamentos: "",
            analiticas: "",
            resultados: "",
            tratamientos: "",
            observaciones: "",
            diagnosticoClinico: "",
            taGlicemiaSat: "",
            analiticasComplementarias: "",
            funcionSueno: "",
            nivelActividad: "",
            estadoFisico: "",
            nivelesAnciedad: "",
            otrasInformaciones: "",
            proximaCita: "",
            registro: "",
            modificacion: "",
            userName: "",
            idMedico:0,
            paciente: [] // Incluye el objeto paciente
        });
        setOpenHistorialModal(false);
    };

    const handleSelectHistorial = (evaluation: any) => {
        // Completar los campos del formulario con los datos de la evaluación seleccionada
        setFormData({
            idHistorial: evaluation.idHistorial,
            objetivo: evaluation.objetivo,
            motivoConsulta: evaluation.motivoConsulta,
            antecedentesPersonales: evaluation.antecedentesPersonales,
            antecedentesFamiliares: evaluation.antecedentesFamiliares,
            peso: evaluation.peso,
            medicamentos: evaluation.medicamentos,
            analiticas: evaluation.analiticas,
            resultados: evaluation.resultados,
            tratamientos: evaluation.tratamientos,
            observaciones: evaluation.observaciones,
            diagnosticoClinico: evaluation.diagnosticoClinico,
            taGlicemiaSat: evaluation.taGlicemiaSat,
            analiticasComplementarias: evaluation.analiticasComplementarias,
            funcionSueno: evaluation.funcionSueno,
            nivelActividad: evaluation.nivelActividad,
            estadoFisico: evaluation.estadoFisico,
            nivelesAnciedad: evaluation.nivelesAnciedad,
            otrasInformaciones: evaluation.otrasInformaciones,
            proximaCita: evaluation.proximaCita,
            registro: evaluation.registro,
            userName: evaluation.userName,
        });
        setOpenHistorialModal(false); // Cerrar el modal después de seleccionar
    };

    const handleUpdate = async () => {
        try {
            const dataToUpdate = {
                idHistorial: formData.idHistorial, // Cambiado a idHistorial
                objetivo: formData.objetivo,
                motivoConsulta: formData.motivoConsulta,
                alergias: formData.alergias,
                antecedentesPersonales: formData.antecedentesPersonales,
                antecedentesFamiliares: formData.antecedentesFamiliares,
                peso: formData.peso,
                medicamentos: formData.medicamentos,
                analiticas: formData.analiticas,
                resultados: formData.resultados,
                tratamientos: formData.tratamientos,
                observaciones: formData.observaciones,
                diagnosticoClinico: formData.diagnosticoClinico,
                taGlicemiaSat: formData.taGlicemiaSat,
                analiticasComplementarias: formData.analiticasComplementarias,
                funcionSueno: formData.funcionSueno,
                nivelActividad: formData.nivelActividad,
                estadoFisico: formData.estadoFisico,
                nivelesAnciedad: formData.nivelesAnciedad,
                otrasInformaciones: formData.otrasInformaciones,
                proximaCita: formData.proximaCita,
            };

            await updateHistorialClinico(formData.idHistorial, dataToUpdate);
            setSnackbarOpen(true); // Mostrar Snackbar de éxito
            clearForm(); // Limpiar el formulario después de enviar
        } catch (error) {
            console.error('Error al actualizar el historial clínico del paciente:', error);
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
                            label="ID de Historial"
                            name="idHistorial"
                            value={formData.idHistorial || ''}
                            onChange={(e) => setFormData({ ...formData, idHistorial: e.target.value })}
                            onKeyPress={handleKeyPress}
                            sx={{ mb: 2, borderRadius: '20px', width: '230px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HiIdentification style={{ fontSize: '24px', color: 'goldenrod' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                            <IconButton onClick={fetchHistorialData} sx={{ ml: 1, color: "green" }}>
                                <InfoIcon />
                            </IconButton>
                            <IconButton onClick={async () => {
                                // Lógica para buscar la evaluación en el backend
                                if (idHistorial) {
                                    console.log(`Buscando evaluación con ID: ${idHistorial}`);
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
                            label="Antecedentes Personales"
                            name="antecedentesPersonales"
                            value={formData.antecedentesPersonales || ''}
                            onChange={(e) => setFormData({ ...formData, antecedentesPersonales: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Antecedentes Familiares"
                            name="antecedentesFamiliares"
                            value={formData.antecedentesFamiliares || ''}
                            onChange={(e) => setFormData({ ...formData, antecedentesFamiliares: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Peso"
                            name="peso"
                            value={formData.peso || ''}
                            onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
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
                            label="Resultados"
                            name="resultados"
                            value={formData.resultados || ''}
                            onChange={(e) => setFormData({ ...formData, resultados: e.target.value })}
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
                            label="Diagnóstico Clínico"
                            name="diagnosticoClinico"
                            value={formData.diagnosticoClinico || ''}
                            onChange={(e) => setFormData({ ...formData, diagnosticoClinico: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="TA - Glicemia - %Sat - FC"
                            name="taGlicemiaSat"
                            value={formData.taGlicemiaSat || ''}
                            onChange={(e) => setFormData({ ...formData, taGlicemiaSat: e.target.value })}
                            sx={{ mb: 2, borderRadius: '20px' }}
                            InputProps={{
                                sx: {
                                    borderRadius: '20px',
                                },
                            }}
                        />

                        <SectionDivider top={0} text={'Sección Complementaria'} />
                        <TextField
                            fullWidth
                            label="Función del Sueño"
                            name="funcionSueno"
                            value={formData.funcionSueno || ''}
                            onChange={(e) => setFormData({ ...formData, funcionSueno: e.target.value })}
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
                            label="Estado Físico"
                            name="estadoFisico"
                            value={formData.estadoFisico || ''}
                            onChange={(e) => setFormData({ ...formData, estadoFisico: e.target.value })}
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
                        {loading ? <CircularProgress size={24} /> : 'Actualizar Evaluación'}
                    </Button>

                    <Button
                        variant="contained"
                        color="warning"
                        onClick={clearForm}
                        disabled={loading} // Deshabilitar el botón mientras se guarda
                        sx={{ borderRadius: '20px', padding: '10px 20px', ml: 2 }}
                    >
                  Limpiar Campos
                    </Button>
                </Box>

                {/* Snackbar para mostrar errores */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                    message={error ? error : 'Historial actualizado con éxito'}
                />

                {/* Modal de evaluación nutricional */}
                <HistorialClinicoModal    
                    open={openHistorialModal}
                    onClose={() => setOpenHistorialModal(false)}
                    historialClinico={historialData} // Asegúrate de que esta propiedad esté definida en HistorialClinicoModalProps
                    onSelectHistorial={handleSelectHistorial} // Pasar la función para manejar la selección
                />
            </Box>
       
    </ProtectedRoute>
);
}

export default HistorialClinicoEditForm;