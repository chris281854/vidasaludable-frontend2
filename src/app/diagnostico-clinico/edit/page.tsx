'use client';

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import HeaderUser from "../../../components/headeruser";
import Sidebar from "../../../components/sidebar";
import PatientRightBar from "../components/PatientRightBar";
import ConfirmacionFirmaDialog from "../components/ConfirmacionFirmaDialog";
import ConfirmLimpiarDialog from "../components/ConfirmLimpiarDialog";
import DiagnosticoSearchField from "./components/DiagnosticoSearchField";
import { 
  TextField, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel,
  Box,
  Paper,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { format } from 'date-fns';
import ProtectedRoute from "@/components/ProtectedRoute";
import DiagnosticoClinicoLayout from "../DiagnosticoClinicoLayout";

interface DetallePaciente {
  objetivo: string;
  motivo: string;
}

interface Patient {
  rup: string;
  nombre: string;
  apellido: string;
  sexo: string;
  ciudad: string;
  nacimiento: string;
  registro: string;
  email: string;
  detallepaciente?: DetallePaciente[]; // Make this optional to match the expected type
  fotoUrl?: string;
  rupPaciente?: string;
  nombrePaciente?: string;
  apellidoPaciente?: string;
  ciudadPaciente?: string;
  fechaRegistro?: string;
  objetivoConsulta?: string;
}

interface FormData {
  diagnosticoId: string;
  analiticas: string;
  observaciones: string;
  conclusionMedica: string;
  requiereEvaluacion: string;
  prioridad: string;
  codigoMedico: string;
  nombreMedico: string;
  apellidoMedico: string;
  especialidad: string;
  firmaDigital: boolean;
  firmadoPor: string;
  fechaFirma: string;
  resultados: string;
  observacionesPrioridad: string;
  fechaDiagnostico: string;
  fechaProximaRevision: string;
  rupPaciente: string;
  nombrePaciente: string;
  apellidoPaciente: string;
  ciudadPaciente: string;
  fechaRegistro: string | null;
  objetivoConsulta: string;
}

const sectionStyles = {
  marginBottom: '2rem',
  backgroundColor: 'transparent',
};

const headerStyles = {
  backgroundColor: 'black',
  color: 'white',
  borderRadius: '30px',
  padding: '0.5rem 1rem',
  marginBottom: '1rem',
};

const textFieldStyles = {
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover fieldset': {
      borderColor: '#25aa80',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#25aa80',
    },
  },
};

const buttonStyles = {
  backgroundColor: '#131416',
  '&:hover': {
    backgroundColor: '#25aa80',
  }
};

const EditarDiagnostico = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [diagnosticoId, setDiagnosticoId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    diagnosticoId: '',
    analiticas: '',
    observaciones: '',
    conclusionMedica: '',
    requiereEvaluacion: 'no',
    prioridad: 'baja',
    codigoMedico: '',
    nombreMedico: '',
    apellidoMedico: '',
    especialidad: '',
    firmaDigital: false,
    firmadoPor: '',
    fechaFirma: '',
    resultados: '',
    observacionesPrioridad: '',
    fechaDiagnostico: '',
    fechaProximaRevision: '',
    rupPaciente: '',
    nombrePaciente: '',
    apellidoPaciente: '',
    ciudadPaciente: '',
    fechaRegistro: '',
    objetivoConsulta: '',
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'info' | 'warning' | 'success' | 'error';
    duration: number;
  }>({
    open: false,
    message: '',
    severity: 'info',
    duration: 6000
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }



  }, [status, router]);

  const showNotification = (message: string, severity: 'info' | 'warning' | 'success' | 'error' = 'info', duration: number = 6000) => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration
    });
  };

  const FirmaDigitalContainer = () => {
    if (!formData.firmaDigital || !formData.firmadoPor) return null;

    return (
      
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          border: '2px solid #25aa80',
          borderRadius: '12px',
          backgroundColor: '#f8fdfb'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <Typography variant="subtitle1" className="font-semibold text-gray-800">
                Firmado digitalmente por: {formData.firmadoPor}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Fecha: {formData.fechaFirma ? format(new Date(formData.fechaFirma), 'dd/MM/yyyy HH:mm:ss') : ''}
              </Typography>
            </div>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full">
            <Typography variant="caption" className="text-green-700 font-medium">
              Verificado
            </Typography>
          </div>
        </div>
      </Paper>
    );
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return;
    }

    if (!session?.user?.name) {
      setPasswordError('No se encontró información del usuario');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ 
          name: session.user.name,
          password: password 
        })
      });

      if (!response.ok) {
        throw new Error('Error al verificar la contraseña');
      }

      const data = await response.json();
      
      if (data) {
        setFormData(prev => ({
          ...prev,
          firmaDigital: true,
          firmadoPor: session?.user?.name || '',
          fechaFirma: new Date().toISOString()
          // No modificar el rupPaciente aquí
        }));
        setOpenPasswordDialog(false);
        setPassword('');
        setPasswordError('');
        showNotification('Firma digital realizada con éxito', 'success');
      } else {
        setPasswordError('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error:', error);
      setPasswordError('La contraseña ingresada no es correcta');
    } finally {
      setLoading(false);
    }
  };

  const validateFieldsForSignature = () => {
    if (!formData.nombreMedico || !formData.apellidoMedico) {
      showNotification('Debe buscar y seleccionar un médico antes de firmar', 'error');
      return false;
    }
    if (!formData.especialidad) {
      showNotification('La especialidad del médico es requerida', 'error');
      return false;
    }
    if (!formData.fechaDiagnostico) {
      showNotification('La fecha y hora del diagnóstico son requeridas', 'error');
      return false;
    }
    if (!formData.rupPaciente) {
      showNotification('Debe seleccionar un paciente antes de firmar', 'error');
      return false;
    }
    return true;
  };


  const handleFirmaDigital = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.firmaDigital) {
      return;
    }

    if (e.target.checked) {
      if (!validateFieldsForSignature()) {
        setFormData(prev => ({
          ...prev,
          firmaDigital: false
        }));
        return;
      }
      setShowConfirmDialog(true);
    } else {
      setFormData(prev => ({
        ...prev,
        firmaDigital: false,
        firmadoPor: '',
        fechaFirma: ''
      }));
    }
  };

  const buscarMedico = async () => {
    if (!session?.user?.token) {
      showNotification('No hay sesión activa', 'error');
      return;
    }

    if (!formData.codigoMedico) {
      showNotification('Por favor ingrese un código de médico', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicos/${formData.codigoMedico}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del médico');
      }

      const data = await response.json();
      if (data) {
        setFormData(prev => ({
          ...prev,
          nombreMedico: data.nombre || '',
          apellidoMedico: data.apellido || '',
          especialidad: data.especialidad || ''
        }));
        showNotification('Médico encontrado exitosamente', 'success');
      } else {
        throw new Error('No se encontró ningún médico con ese código');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormData(prev => ({
        ...prev,
        nombreMedico: '',
        apellidoMedico: '',
        especialidad: ''
      }));
      showNotification('Error al buscar el médico', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBuscarDiagnostico = async () => {
    if (!session?.user?.token) {
        setError('No hay sesión activa');
        setSuccess(false);
        return;
    }

    if (!diagnosticoId) {
        setError('Ingrese un ID de diagnóstico');
        setSuccess(false);
        return;
    }

    setLoading(true);
    setError(''); // Limpiar el mensaje de error
    setSuccess(false);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/diagnostico-clinico/${diagnosticoId}`,
            {
                headers: {
                    'Authorization': `Bearer ${session.user.token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Diagnóstico no encontrado');
        }

        const data = await response.json();

        // Imprimir la respuesta para verificar la estructura
        console.log('Respuesta de la API:', data);

        // Acceder al primer elemento de detallepaciente
        const detallePaciente = data.paciente.detallepaciente[0]; // Asegúrate de que haya al menos un elemento

        setFormData(prev => ({
            ...prev,
            // Actualiza el estado con los datos recibidos
            diagnosticoId: data.id,
            analiticas: data.analiticas,
            observaciones: data.observaciones || '', // Asegúrate de que este campo exista
            conclusionMedica: data.conclusionMedica,
            requiereEvaluacion: data.seguimiento ? 'SI' : 'NO',
            prioridad: data.prioridad,
            codigoMedico: data.idMedico,
            nombreMedico: data.userName,
            apellidoMedico: '', // Asigna el apellido si está disponible
            especialidad: '', // Asigna la especialidad si está disponible
            firmaDigital: false, // Asigna según tu lógica
            firmadoPor: '', // Asigna según tu lógica
            fechaFirma: '', // Asigna según tu lógica
            resultados: data.resultados,
            observacionesPrioridad: data.observacionesPriodidad || '',
            fechaDiagnostico: data.fechaDiagnostico,
            fechaProximaRevision: data.proximaVisita,
            // Asignar los datos del paciente
            rupPaciente: data.paciente.rup,
            nombrePaciente: data.paciente.nombre,
            apellidoPaciente: data.paciente.apellido,
            ciudadPaciente: data.paciente.ciudad,
            fechaRegistro: detallePaciente?.fechaRegistro || '', // Acceso seguro
            objetivoConsulta: detallePaciente?.objetivo || 'No especificado', // Acceso seguro
        }));

        // Aquí puedes acceder a los datos del paciente
        console.log('Datos del paciente:', {
            nombrePaciente: data.paciente.nombre,
            apellidoPaciente: data.paciente.apellido,
            rupPaciente: data.paciente.rup,
            fechaRegistro: detallePaciente?.fechaRegistro || 'No especificado', // Acceso seguro
            objetivoConsulta: detallePaciente?.objetivo || 'No especificado', // Acceso seguro
        });

        setSuccess(true);
    } catch (error) {
        console.error('Error:', error);
        setError('Diagnóstico no encontrado'); // Mensaje de error
    } finally {
        setLoading(false);
    }
};

const handleEditar = async () => {
    if (!formData.diagnosticoId) {
        showNotification('No hay un diagnóstico seleccionado para editar', 'error');
        return;
    }

    setLoading(true);
    try {
        const diagnosticoData = {
          
            rup: formData.rupPaciente,
            idMedico: parseInt(formData.codigoMedico),
            analiticas: formData.analiticas || '',
            resultados: formData.resultados || '',
            conclusionMedica: formData.conclusionMedica || '',
            seguimiento: formData.requiereEvaluacion === 'SI',
            prioridad: formData.prioridad || '',
            
            observacionesPriodidad: formData.observacionesPrioridad || '',
            userName: session?.user?.name || '',
        };

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/diagnostico-clinico/${diagnosticoId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token}`,
                },
                body: JSON.stringify(diagnosticoData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json(); // Obtener el mensaje de error del servidor
            throw new Error(errorData.message || 'Error al actualizar el diagnóstico');
        }

        showNotification('Diagnóstico actualizado exitosamente', 'success');
        handleLimpiar(); // Limpiar el formulario después de editar
    } catch (error) {
        console.error('Error:', error);
        showNotification((error as Error).message || 'Error al actualizar el diagnóstico', 'error'); // Mostrar el mensaje de error
    } finally {
        setLoading(false);
    }
};

  const [showConfirmLimpiarDialog, setShowConfirmLimpiarDialog] = useState(false);

  const handleLimpiar = (forceClear: boolean = false) => {
   
    setShowConfirmLimpiarDialog(true);
  };

  const resetForm = () => {
    setFormData({
      diagnosticoId: '',
      analiticas: '',
      observaciones: '',
      conclusionMedica: '',
      requiereEvaluacion: 'no',
      prioridad: 'baja',
      codigoMedico: '',
      nombreMedico: '',
      apellidoMedico: '',
      especialidad: '',
      firmaDigital: false,
      firmadoPor: '',
      fechaFirma: '',
      resultados: '',
      observacionesPrioridad: '',
      fechaDiagnostico: '',
      fechaProximaRevision: '',
      rupPaciente: '',
      nombrePaciente: '',
      apellidoPaciente: '',
      ciudadPaciente: '',
      fechaRegistro: '',
      objetivoConsulta: '',
      
    });
    showNotification('Formulario limpiado exitosamente', 'success');
    }

   

  return (
    <ProtectedRoute>
    <DiagnosticoClinicoLayout>

    <div className="flex h-screen bg-white">
       
      
      <div className="flex-grow">
        <HeaderUser title="Diagnóstico Clínico ~ Edición de Registros" />
        
        <div className="p-8 pl-24 mt-48">
        <Box display="flex" alignItems="center">
                <DiagnosticoSearchField 
                    diagnosticoId={diagnosticoId} 
                    onChange={(value: string) => setDiagnosticoId(value)} 
                    onSearch={handleBuscarDiagnostico}
                    disabled={loading}
                />
                {error && (
                    <Alert severity="error" sx={{ marginLeft: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
          <div className="grid grid-cols-12 gap-8">
            {/* Columna principal - Lado izquierdo */}
            <div className="col-span-8">
              {/* Sección Analíticas */}
              <Paper sx={sectionStyles} elevation={0} className="mt-16">
                <Box sx={headerStyles}>
                  <h2 className="text-xl font-bold">Analíticas recomendadas</h2>
                </Box>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Analíticas"
                    variant="outlined"
                    value={formData.analiticas}
                    onChange={(e) => setFormData({...formData, analiticas: e.target.value})}
                    sx={textFieldStyles}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Resultados / Observaciones"
                    variant="outlined"
                    value={formData.resultados}
                    onChange={(e) => setFormData({...formData, resultados: e.target.value})}
                    sx={textFieldStyles}
                  />
                </div>
              </Paper>
              {/* Sección Diagnóstico */}
              <Paper sx={sectionStyles} elevation={0} className="mt-12">
                <Box sx={headerStyles}>
                  <h2 className="text-xl font-bold">Diagnóstico clínico de paciente</h2>
                </Box>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Conclusión médica"
                    variant="outlined"
                    value={formData.conclusionMedica}
                    onChange={(e) => setFormData({...formData, conclusionMedica: e.target.value})}
                    sx={textFieldStyles}
                  />
                  <div className="space-y-6">
                    <FormControl component="fieldset" disabled={formData.firmaDigital}>
                      <FormLabel>Requiere próxima evaluación</FormLabel>
                      <RadioGroup
                        row
                        value={formData.requiereEvaluacion}
                        onChange={(e) => setFormData({...formData, requiereEvaluacion: e.target.value})}
                      >
                        <FormControlLabel value="SI" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="Sí" />
                        <FormControlLabel value="NO" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="No" />
                      </RadioGroup>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                      <DatePicker 
                        label="Fecha próxima revisión"
                        value={formData.fechaProximaRevision ? new Date(formData.fechaProximaRevision) : null}
                        onChange={(newValue: Date | null) => {
                          setFormData({
                            ...formData, 
                            fechaProximaRevision: newValue ? newValue.toISOString().split('T')[0] : '',
                          });
                        }}
                        className="w-full"
                        disabled={formData.firmaDigital}
                        slotProps={{
                          textField: {
                            variant: 'outlined',
                            sx: textFieldStyles,
                          }
                        }}
                      />
                    </LocalizationProvider>

                    <FormControl component="fieldset" disabled={formData.firmaDigital}>
                      <FormLabel>Prioridad del diagnóstico</FormLabel>
                      <RadioGroup
                        row
                        value={formData.prioridad}
                        onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                      >
                        <FormControlLabel value="ALTA" control={<Radio sx={{ '&.Mui-checked': { color: '#8B0000' } }} />} label="Alto" />
                        <FormControlLabel value="MEDIA" control={<Radio sx={{ '&.Mui-checked': { color: '#E5BE01' } }} />} label="Moderado" />
                        <FormControlLabel value="BAJA" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="Bajo" />
                      </RadioGroup>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Observaciones de prioridad"
                      variant="outlined"
                      value={formData.observacionesPrioridad}
                      onChange={(e) => setFormData({...formData, observacionesPrioridad: e.target.value})}
                      sx={textFieldStyles}
                      disabled={formData.firmaDigital}
                    />
                  </div>
                </div>
              </Paper>
              {/* Sección Datos del Médico */}
              <Paper sx={sectionStyles} elevation={0} className="mt-12">
                <Box sx={headerStyles}>
                  <h2 className="text-xl font-bold">Datos del médico</h2>
                </Box>
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <TextField
                      label="Código"
                      variant="outlined"
                      value={formData.codigoMedico}
                      onChange={(e) => setFormData({...formData, codigoMedico: e.target.value})}
                      sx={textFieldStyles}
                      size="small"
                      disabled={formData.firmaDigital}
                    />
                    <IconButton 
                      onClick={buscarMedico}
                      disabled={loading || formData.firmaDigital}
                      sx={{ 
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                          backgroundColor: '#e0e0e0'
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: '#25aa80' }} />
                      ) : (
                        <SearchIcon sx={{ color: '#25aa80' }} />
                      )}
                    </IconButton>
                  </div>

                  <TextField
                    fullWidth
                    label="Médico"
                    variant="outlined"
                    value={`${formData.nombreMedico} ${formData.apellidoMedico}`.trim()}
                    sx={textFieldStyles}
                    disabled
                  />

                  <TextField
                    fullWidth
                    label="Especialidad"
                    variant="outlined"
                    value={formData.especialidad}
                    sx={textFieldStyles}
                    disabled
                  />

                  <div className="col-span-2">
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                      <DatePicker 
                        label="Fecha y hora del diagnóstico"
                        value={formData.fechaDiagnostico ? new Date(formData.fechaDiagnostico) : null}
                        onChange={(newValue: Date | null) => {
                          setFormData({
                            ...formData, 
                            fechaDiagnostico: newValue ? newValue.toISOString().split('T')[0] : '',
                          });
                        }}
                        className="w-full"
                        disabled={formData.firmaDigital}
                        slotProps={{
                          textField: {
                            variant: 'outlined',
                            sx: textFieldStyles,
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                {/* Sección de firma digital */}
                <div className="flex flex-col gap-2 mt-4">
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.firmaDigital}
                        onChange={handleFirmaDigital}
                        disabled={formData.firmaDigital}
                        sx={{ 
                          '&.Mui-checked': { 
                            color: '#25aa80' 
                          }
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" className="font-semibold">
                        Firma digital
                      </Typography>
                    }
                  />
                  <FirmaDigitalContainer />
                </div>
              </Paper>
              {/* Botones de acción */}
              <div className="flex justify-between gap-4 mt-8">
                <Button 
                  variant="contained" 
                  onClick={handleEditar}
                  disabled={loading || !formData.diagnosticoId}
                  sx={{
                    ...buttonStyles,
                    backgroundColor: '#25aa80',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Actualizar'
                  )}
                </Button>
              
                <Button 
                  variant="contained" 
                  onClick={() => handleLimpiar(false)}
                  disabled={loading}
                  sx={buttonStyles}
                >
                  Limpiar
                </Button>

                {/* El diálogo de confirmación */}
                <ConfirmLimpiarDialog
                  open={showConfirmLimpiarDialog}
                  onClose={() => setShowConfirmLimpiarDialog(false)}
                  onConfirm={() => {
                    resetForm();
                    setShowConfirmLimpiarDialog(false);
                  }}
                  title="Confirmar Limpieza"
                  message="¿Está seguro que desea limpiar todos los campos del formulario?"
                  submessage="Esta acción no se puede deshacer y todos los datos ingresados se perderán."
                disable={formData.firmaDigital}
              />
            </div>
          </div>

          {/* Diálogos */}
          <ConfirmacionFirmaDialog
            open={showConfirmDialog}
            onClose={() => {
              setShowConfirmDialog(false);
              setFormData(prev => ({
                ...prev,
                firmaDigital: false
              }));
            }}
            onConfirm={() => {
              setShowConfirmDialog(false);
              setOpenPasswordDialog(true);
            }}
          />

          <Dialog
            open={openPasswordDialog}
            onClose={() => {
              setOpenPasswordDialog(false);
              setPassword('');
              setPasswordError('');
              setFormData(prev => ({
                ...prev,
                firmaDigital: false
              }));
            }}
          >
            <DialogTitle>
              Verificación de identidad
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Por favor, ingrese su contraseña para confirmar su identidad
              </Typography>
              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                sx={textFieldStyles}
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  setOpenPasswordDialog(false);
                  setPassword('');
                  setPasswordError('');
                  setFormData(prev => ({
                    ...prev,
                    firmaDigital: false
                  }));
                }}
                sx={{ color: 'text.secondary' }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handlePasswordSubmit}
                disabled={!password || loading}
                sx={{ 
                  backgroundColor: '#25aa80',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1e8c66',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Verificar'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar para notificaciones */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={snackbar.duration}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ 
                width: '100%',
                '& .MuiAlert-icon': {
                  fontSize: '24px'
                },
                '& .MuiAlert-message': {
                  fontSize: '14px',
                  fontWeight: 500
                }
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  </div>
    </DiagnosticoClinicoLayout>
    </ProtectedRoute>
  );
}

export default EditarDiagnostico;