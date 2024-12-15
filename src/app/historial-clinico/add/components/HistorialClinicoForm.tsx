import useSaveHistorialClinico from "@/app/hooks/historial-clinico/useSaveHistorialClinico";
import MedicalSignatureComponent from "@/components/MedicalSignature";
import SectionDivider from "@/components/SectionDivider";
import { Alert, Button, Card, CardContent, CircularProgress, Snackbar, TextField } from "@mui/material";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


interface HistorialClinicoFormProps {
    historialclinico: {
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

const HistorialClinicoForm: React.FC<HistorialClinicoFormProps> = ({ historialclinico, onChange, rup, onRupChange }) => {
   
   // Dentro del componente HistorialClinicoForm
    useEffect(() => {
        setFormData((prevData) => ({ ...prevData, rup })); // Actualiza el formData con el nuevo RUP
    }, [rup]); // Dependencia en el RUP
   
    const { data: session } = useSession();
    const [formData, setFormData] = useState<{
        idHistorial: number;
        rup: string;
        objetivo: string;
        motivoConsulta: string;
        alergias: string;
        antecedentesPersonales: string; // Cambiado de "antecedentes" a "antecedentesPersonales"
        antecedentesFamiliares: string; // Nueva propiedad
        peso: number; // Cambiado de "pesoKg" a "peso"
        medicamentos: string;
        analiticas: string;
        resultados: string; // Nueva propiedad
        tratamientos: string;
        observaciones: string;
        diagnosticoClinico: string; // Cambiado de "diagnosticoNutricional" a "diagnosticoClinico"
        taGlicemiaSat: string;
         funcionSueno: string;
        nivelActividad: string;
        estadoFisico: string; // Nueva propiedad
        nivelesAnsiedad: string;
        otrasInformaciones: string;
        idMedico: number; // Cambiado de "idMedico" a un número
        tallaMt: number;
        tallaCm: number;
        tallaPie: number;
        tallaPgs: number;
        pesoLb: number;
        tallaKg: number; // Cambiado de "pesoKg" a "tallaKg"
        perimetroBraqueal: number; // Nueva propiedad
        PC: number; // Nueva propiedad
        FC: number; // Nueva propiedad
        frecuenciaRespiratoria: number; // Nueva propiedad
        saturacion: number; // Nueva propiedad
        signosVitales: number; // Nueva propiedad
        pesoEdad: number; // Nueva propiedad
        pesoTalla: number; // Nueva propiedad
        pesoIdeal: number; // Nueva propiedad
        conclusionMedica: string; // Nueva propiedad
        analiticasComplementarias: string;
        otrasRecomendaciones: string;
        farmacos: string;
        proximaCita: string; // Cambiado a string para la fecha
         userName: string;
    }>({
        idHistorial: 0,
        rup: "",
        objetivo: "",
        motivoConsulta: "",
        alergias: "",
        antecedentesPersonales: "", // Cambiado
        antecedentesFamiliares: "", // Nueva propiedad
        peso: 0, // Cambiado
        medicamentos: "",
        analiticas: "",
        resultados: "", // Nueva propiedad
        tratamientos: "",
        observaciones: "",
        diagnosticoClinico: "", // Cambiado
        taGlicemiaSat: "",
         funcionSueno: "",
        nivelActividad: "",
        estadoFisico: "", // Nueva propiedad
        nivelesAnsiedad: "",
        otrasInformaciones: "",
        idMedico: 0, // Cambiado
        tallaMt: 0,
        tallaCm: 0,
        tallaPie: 0,
        tallaPgs: 0,
        pesoLb: 0,
        tallaKg: 0, // Cambiado
        perimetroBraqueal: 0, // Nueva propiedad
        PC: 0, // Nueva propiedad
        FC: 0, // Nueva propiedad
        frecuenciaRespiratoria: 0, // Nueva propiedad
        saturacion: 0, // Nueva propiedad
        signosVitales: 0, // Nueva propiedad
        pesoEdad: 0, // Nueva propiedad
        pesoTalla: 0, // Nueva propiedad
        pesoIdeal: 0, // Nueva propiedad
        conclusionMedica: "", // Nueva propiedad
        analiticasComplementarias: "",
        otrasRecomendaciones: "",
        farmacos: "",
        proximaCita: "", // Cambiado a string
         userName: "",
    });




    // Estado para el Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "warning" | "error">("success");

    const { saveHistorialClinico, loading, error, success } = useSaveHistorialClinico(); // Usa el hook
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        // Verificar si el campo es de tipo "date"
        if (name === "proximaCita") {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
            onChange(name, value); // Llama a onChange aquí
        } else if (name === "rup") {
            // Manejo específico para el RUP
            setFormData((prevData) => ({ ...prevData, [name]: value }));
            onRupChange(value); // Llama a la función para manejar el cambio de RUP
        } else {
            const numericValue = parseFloat(value);
            
            // Si el campo está vacío, se asigna un valor por defecto
            if (value === "") {
                setFormData((prevData) => ({ ...prevData, [name]: "" })); // Cambia null a ""
                onChange(name, ""); // Llama a onChange aquí
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: value }));
                if (!isNaN(numericValue)) {
                    onChange(name, numericValue); // Llama a onChange aquí
                } else {
                    onChange(name, value); // Llama a onChange aquí
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
                tallaCm: cm || 0,
                tallaPie: feet || 0,
                tallaPgs: inches || 0,
            }));
        }
    
        if (name === "pesoLb") {
            const pesoLb = value ? parseFloat(value) : 0; // Validación de libras
            const kg = pesoLb * 0.453592;
    
            // Validación antes de actualizar el estado
            setFormData((prevData) => ({
                ...prevData,
                pesoKg: kg || 0,
            }));
        }
    };

    
    const handleSubmit = async () => {
        // Validaciones
        if (!formData.rup) {
            setSnackbarMessage("Por favor, completa el RUP del paciente.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }else if (!formData.proximaCita){
            setSnackbarMessage("Por favor, completa la fecha de la próxima cita.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;

        }else if (!formData.idMedico){
            setSnackbarMessage("Por favor, completa el id del medico.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;

        }


        try {
            await saveHistorialClinico(formData);
            setSnackbarMessage("Historial clínico guardado con éxito.");
            setSnackbarSeverity("success");
        } catch (err) {
            setSnackbarMessage("Error al guardar el historial clínico.");
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true);
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
            funcionSueno: "",
            nivelActividad: "",
            estadoFisico: "",
            nivelesAnsiedad: "",
            otrasInformaciones: "",
            idMedico: 0,
            tallaMt: 0,
            tallaCm: 0,
            tallaPie: 0,
            tallaPgs: 0,
            pesoLb: 0,
            tallaKg: 0,
            perimetroBraqueal: 0,
            PC: 0,
            FC: 0,
            frecuenciaRespiratoria: 0,
            saturacion: 0,
            signosVitales: 0,
            pesoEdad: 0,
            pesoTalla: 0,
            pesoIdeal: 0,
            conclusionMedica: "",
            analiticasComplementarias: "",
            otrasRecomendaciones: "",
            farmacos: "",
            proximaCita: "",
            userName: "",
        });
    };

    return (
        <div>
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
                        label="Antecedentes Personales"
                        name="antecedentesPersonales"
                        value={formData.antecedentesPersonales}
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
                        label="Antecedentes Familiares"
                        name="antecedentesFamiliares"
                        value={formData.antecedentesFamiliares}
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
                        label="Peso"
                        name="peso"
                        value={formData.peso}
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
                        label="Analiticas"
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
                        label="Resltados"
                        name="resultados"
                        value={formData.resultados}
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

                    <TextField
                        fullWidth
                        label="Diagnostico Clinico"
                        name="diagnosticoClinico"
                        value={formData.diagnosticoClinico}
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
                        label="TA - Glicemia - %Sat - FC"
                        name="taGlicemiaSat"
                        value={formData.taGlicemiaSat}
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
                        label="Analiticas Complementarias"
                        name="analiticasComplementarias"
                        value={formData.analiticasComplementarias}
                        onChange={handleChange}
                        sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />

                    <SectionDivider top={2} text={'Seccion Complementaria'} />


                  

                    <TextField
                        fullWidth
                        label="Fuencion Sueño"
                        name="funcionSueno"
                        value={formData.funcionSueno}
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
                        label="Estado Fisico"
                        name="estadoFisico"
                        value={formData.estadoFisico}
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
                        label="Niveles de Anciedad"
                        name="nivelesAnsiedad"
                        value={formData.nivelesAnsiedad}
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

                    <TextField
                        fullWidth
                        label="Fecha de Proxima Cita"
                        name="proximaCita"
                        type="date"
                        value={formData.proximaCita}
                        onChange={handleChange}
                        sx={{ mt:2,mb: 2, borderRadius: '20px' }}
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

            <div className="flex justify-center">
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={handleSubmit} 
                        disabled={loading} // Deshabilitar el botón mientras se carga
                        sx={{ 
                            mt: 2, 
                            borderRadius: '30px', // Aumenta el valor para bordes más redondeados
                            padding: '10px 20px' // Ajusta el padding si es necesario
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Guardar Historial Clínico'}
                    </Button>

                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={clearForm} 
                        sx={{ 
                            mt: 2, 
                            ml: 2, 
                            borderRadius: '30px', // Aumenta el valor para bordes más redondeados
                            padding: '10px 20px' // Ajusta el padding si es necesario
                        }}
                    >
                        Limpiar Campos
                    </Button>
                </div>
            {/* Snackbar para notificaciones */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>
        </div>
    );
    }

    export default HistorialClinicoForm;