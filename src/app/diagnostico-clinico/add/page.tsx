'use client';

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import HeaderUser from "../../../components/headeruser";
import Sidebar from "../../../components/sidebar";
import PatientSearchModal from "../../diagnostico-clinico/components/PatientInfoSidebar";
import ConfirmacionFirmaDialog from "../components/ConfirmacionFirmaDialog";
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
import PatientRightBar from "../components/PatientRightBar";
import ConfirmLimpiarDialog from "../components/ConfirmLimpiarDialog";
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
  detallePaciente?: DetallePaciente;
}

interface FormData {
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
  fechaDiagnostico: string ;
  fechaProximaRevision: string ;
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

const NuevoDiagnostico = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedRup, setSelectedRup] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const [formData, setFormData] = useState<FormData>({
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

  const formatearFechaSQL = (fecha: string | null | undefined): string | null => {
    if (!fecha) return null;
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        console.error('Fecha inválida');
        return null;
      }
      
      // Formato YYYY-MM-DD
      const year = fechaObj.getFullYear();
      const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const day = String(fechaObj.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return null;
    }
  };

  const handleGuardar = async () => {
    if (!session?.user?.token) {
      showNotification('No hay sesión activa', 'error');
      return;
    }
  
    if (!formData.rupPaciente) {
      showNotification('Debe seleccionar un paciente', 'error');
      return;
    }
  
    if (!formData.codigoMedico) {
      showNotification('Debe ingresar el código del médico', 'error');
      return;
    }
  
    if (!formData.fechaDiagnostico) {
      showNotification('La fecha del diagnóstico es requerida', 'error');
      return;
    }

    if (!formData.fechaProximaRevision) {
      showNotification('La fecha de la proxima revision es requerida', 'error');
      return;
    }
  
    setLoading(true);
    try {
      const formatearFecha = (fecha: string | Date | null): string | null => {
        if (!fecha) return null;
        // Si es string, convertir a Date primero
        const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
        if (!(fechaObj instanceof Date) || isNaN(fechaObj.getTime())) return null;
        
        return `${fechaObj.getFullYear()}-${
          String(fechaObj.getMonth() + 1).padStart(2, '0')
        }-${
          String(fechaObj.getDate()).padStart(2, '0')
        }`;
      };

      // Formatear los datos según la estructura esperada por el backend
      const diagnosticoData = {
        rup: formData.rupPaciente,
        idMedico: parseInt(formData.codigoMedico),
        analiticas: formData.analiticas || '',
        resultados: formData.resultados || '',
        conclusionMedica: formData.conclusionMedica || '',
        seguimiento: formData.requiereEvaluacion === 'si',
        prioridad: formData.prioridad || 'BAJO',
        especialidad: formData.especialidad || '',
        observacionesPriodidad: formData.observacionesPrioridad || '',
        fechaDiagnostico: formatearFecha(new Date(formData.fechaDiagnostico)),
        proximaVisita: formatearFecha(new Date(formData.fechaProximaRevision)),
        userName: session.user.name || '',
      };
  
      console.log('Datos a enviar:', diagnosticoData);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/diagnostico-clinico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(diagnosticoData),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || 'Error al guardar el diagnóstico');
      }
  
      const responseData = await response.json();
      console.log('Respuesta exitosa:', responseData);
  
      showNotification('Diagnóstico guardado exitosamente', 'success');
      handleLimpiar();
    } catch (error) {
      console.error('Error detallado:', error);
      showNotification(
        error instanceof Error ? error.message : 'Error al guardar el diagnóstico',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };



  const [showConfirmLimpiarDialog, setShowConfirmLimpiarDialog] = useState(false);

  const handleLimpiar = (forceClear: boolean = false) => {
    if (formData.firmaDigital && !forceClear) {
      showNotification('No se pueden limpiar los datos de un diagnóstico firmado', 'warning');
      return;
    }
    setShowConfirmLimpiarDialog(true);
  };
  
  const resetForm = () => {
    setFormData({
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
  };
     

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <CircularProgress sx={{ color: '#25aa80' }} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
      <DiagnosticoClinicoLayout>
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        initialExpanded={isExpanded}
        initialWidth="w-16"
        expandedWidth="w-40"
        onExpand={setIsExpanded}
      />
      
      <div className="flex-grow">
        <HeaderUser title="Diagnóstico Clínico ~ Nuevos Registros" />
        
        <div className="p-8 pl-24 mt-48">
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
                    disabled={formData.firmaDigital}
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
                    disabled={formData.firmaDigital}
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
                  disabled={formData.firmaDigital}
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
                          error: false // opcional: para manejo de errores
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
                            error: false // opcional: manejo de errores
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
                onClick={handleGuardar}
                disabled={loading}
                sx={{
                  ...buttonStyles,
                  backgroundColor: '#25aa80',
                  '&:hover': {
                    backgroundColor: '#1e8c66',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Guardar'
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
    />
            </div>
          </div>

          {/* Columna lateral - Lado derecho */}
          <div className="col-span-4">
                    <PatientRightBar 
            patientData={{
              fotoUrl: "",
              nombrePaciente: formData.nombrePaciente,
              apellidoPaciente: formData.apellidoPaciente,
              rupPaciente: formData.rupPaciente,
              fechaRegistro: formData.fechaRegistro ? new Date(formData.fechaRegistro) : null,
              ciudadPaciente: formData.ciudadPaciente,
              objetivoConsulta: formData.objetivoConsulta,
            }} 
            disabled={formData.firmaDigital}
            onRupChange={(rup: string) => {
              setFormData(prev => ({
                ...prev,
                rupPaciente: rup
              }));
            }}
            onPatientSelect={(patient: Patient) => {
              setFormData(prev => ({
                ...prev,
                nombrePaciente: patient.nombre,
                apellidoPaciente: patient.apellido,
                rupPaciente: patient.rup,
                fechaRegistro: patient.registro 
                  ? new Date(patient.registro).toISOString().split('T')[0]  // Convertir a string YYYY-MM-DD
                  : null,
                ciudadPaciente: patient.ciudad,
                objetivoConsulta: patient.detallePaciente?.objetivo || 'No especificado'
              }));
            }}
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
  </DiagnosticoClinicoLayout>
);
 

}

export default NuevoDiagnostico;