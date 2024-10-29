 'use client';

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import HeaderUser from "../../../components/headeruser";
import Sidebar from "../../../components/sidebar";
import PatientSearchModal from "../../diagnostico-clinico/components/PatientInfoSidebar";
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
import CloseIcon from '@mui/icons-material/Close';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import es from 'date-fns/locale/es';
import { format } from 'date-fns';
import PatientRightBar from "../components/PatientRightBar";

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
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedRup, setSelectedRup] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

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

  const [formData, setFormData] = useState({
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
    fechaFirma: null as Date | null,
    resultados: '',
    observacionesPrioridad: '',
    fechaDiagnostico: null as Date | null,
    fechaProximaRevision: null as Date | null,
    rupPaciente: '',
    nombrePaciente: '',
    apellidoPaciente: '',
    ciudadPaciente: '',
    fechaRegistro: null as Date | null,
    objetivoConsulta: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (selectedRup) {
      buscarPaciente(selectedRup);
    }
  }, [selectedRup]);

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

  const buscarPaciente = async (rup: string) => {
    if (!session?.user?.token) {
      showNotification('No hay sesión activa', 'error');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/paciente/${rup}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los datos del paciente');
      }
  
      const data = await response.json();
      if (data) {
        setFormData(prev => ({
          ...prev,
          rupPaciente: data.rup || '',
          nombrePaciente: data.nombre || '',
          apellidoPaciente: data.apellido || '',
          ciudadPaciente: data.ciudad || '',
          fechaRegistro: data.fechaRegistro ? new Date(data.fechaRegistro) : null,
          objetivoConsulta: data.objetivo || '',
        }));
        showNotification('Paciente encontrado exitosamente', 'success');
      } else {
        throw new Error('No se encontraron datos del paciente');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormData(prev => ({
        ...prev,
        rupPaciente: rup, // Asegúrate de que este valor se mantenga
        nombrePaciente: '',
        apellidoPaciente: '',
        ciudadPaciente: '',
        fechaRegistro: null,
        objetivoConsulta: '',
      }));
      showNotification('Error al buscar el paciente', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFirmaDigital = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.firmaDigital) {
      return;
    }

    if (e.target.checked) {
      if (!validateFieldsForSignature()) {
        setFormData({
          ...formData,
          firmaDigital: false
        });
        return;
      }
      setOpenPasswordDialog(true);
    } else {
      setFormData({
        ...formData,
        firmaDigital: false,
        firmadoPor: '',
        fechaFirma: null
      });
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError('La contraseña es requerida');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Error al verificar la contraseña');
      }

      const data = await response.json();
      if (data.success) {
        setFormData({
          ...formData,
          firmaDigital: true,
          firmadoPor: session?.user?.name || '',
          fechaFirma: new Date(),
        });
        setOpenPasswordDialog(false);
        setPassword('');
        setPasswordError('');
        showNotification('Firma digital realizada con éxito', 'success');
      } else {
        setPasswordError('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error:', error);
      setPasswordError('Error al verificar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la selección del paciente
  const handlePatientSelect = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      nombrePaciente: patient.nombre,
      apellidoPaciente: patient.apellido,
      rupPaciente: patient.rup,
      fechaRegistro: patient.registro ? new Date(patient.registro) : null,
      ciudadPaciente: patient.ciudad,
      objetivoConsulta: patient.detallePaciente?.objetivo || 'No especificado'
    }));
  };

  // Función para manejar el cambio de RUP
  const handleRupChange = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      nombrePaciente: patient.nombre,
      apellidoPaciente: patient.apellido,
      rupPaciente: patient.rup,
      fechaRegistro: patient.registro ? new Date(patient.registro) : null,
      ciudadPaciente: patient.ciudad,
      objetivoConsulta: patient.detallePaciente?.objetivo || 'No especificado'
    }));
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

  const handleLimpiar = () => {
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
      fechaFirma: null,
      resultados: '',
      observacionesPrioridad: '',
      fechaDiagnostico: null,
      fechaProximaRevision: null,
      rupPaciente: '',
      nombrePaciente: '',
      apellidoPaciente: '',
      ciudadPaciente: '',
      fechaRegistro: null,
      objetivoConsulta: '',
    });
  };

  const showNotification = (message: string, severity: 'info' | 'warning' | 'success' | 'error' = 'info', duration: number = 6000) => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration
    });
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
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
                        <FormControlLabel value="si" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="Sí" />
                        <FormControlLabel value="no" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="No" />
                      </RadioGroup>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                      <DatePicker 
                        label="Fecha próxima revisión"
                        value={formData.fechaProximaRevision}
                        onChange={(date) => setFormData({...formData, fechaProximaRevision: date})}
                        className="w-full"
                        disabled={formData.firmaDigital}
                        slotProps={{
                          textField: {
                            variant: 'outlined',
                            sx: textFieldStyles
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
                        <FormControlLabel value="alto" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="Alto" />
                        <FormControlLabel value="moderado" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="Moderado" />
                        <FormControlLabel value="bajo" control={<Radio sx={{ '&.Mui-checked': { color: '#25aa80' } }} />} label="Bajo" />
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
                    <div className="min-w-[65px]">
                      <TextField
                        label="Código"
                        variant="outlined"
                        value={formData.codigoMedico}
                        onChange={(e) => setFormData({...formData, codigoMedico: e.target.value})}
                        sx={textFieldStyles}
                        size="small"
                        disabled={formData.firmaDigital}
                      />
                    </div>
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
                        value={formData.fechaDiagnostico}
                        onChange={(date) => setFormData({...formData, fechaDiagnostico: date})}
                        className="w-full"
                        disabled={formData.firmaDigital}
                        slotProps={{
                          textField: {
                            variant: 'outlined',
                            sx: textFieldStyles
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={formData.firmaDigital}
                          onChange={handleFirmaDigital}
                          disabled={formData.firmaDigital}
                          sx={{ 
                            '&.Mui-checked': { 
                              color: '#25aa80' 
                            },
                            '&.Mui-disabled': {
                              color: '#25aa80',
                              opacity: 0.7
                            }
                          }}
                        />
                      }
                      label={
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">Firma digital</span>
                          <span className="text-xs font-bold">Certifico</span>
                        </div>
                      }
                      sx={{
                        '&.Mui-disabled': {
                          cursor: 'not-allowed'
                        }
                      }}
                      disabled={formData.firmaDigital}
                    />
                    {formData.firmaDigital && formData.firmadoPor && (
                      <div className="space-y-2">
                        <TextField
                          fullWidth
                          label="Firmado digitalmente por"
                          value={`${formData.firmadoPor} - ${formData.fechaFirma ? format(formData.fechaFirma, 'dd/MM/yyyy HH:mm:ss') : ''}`}
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            ...textFieldStyles,
                            backgroundColor: '#f5f5f5',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Paper>
      
              {/* Botones de acción */}
              <div className="flex gap-4 mt-16">
                <Button 
                  variant="contained" 
                  sx={buttonStyles}
                  disabled={formData.firmaDigital}
                >
                  Guardar
                </Button>
                <Button 
                  variant="contained" 
                  sx={buttonStyles}
                  disabled={formData.firmaDigital}
                >
                  Actualizar
                </Button>
                <Button 
                  variant="contained" 
                  sx={buttonStyles}
                  disabled={formData.firmaDigital}
                >
                  Eliminar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleLimpiar} 
                  sx={buttonStyles}
                  disabled={formData.firmaDigital}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            {/* Columna lateral - Lado derecho */}
            <div className="col-span-4">
              <PatientSearchModal 
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectPatient={handleRupChange}
                onRupChange={(rup: string) => {
                  setSelectedRup(rup);
                  setFormData(prev => ({
                    ...prev,
                    rupPaciente: rup
                  }));
                }}
                patientData={{
                  fotoUrl: '',
                  nombrePaciente: formData.nombrePaciente,
                  apellidoPaciente: formData.apellidoPaciente,
                  rupPaciente: formData.rupPaciente,
                  fechaRegistro: formData.fechaRegistro,
                  ciudadPaciente: formData.ciudadPaciente,
                  objetivoConsulta: formData.objetivoConsulta,
                  ultimaActualizacion: null,
                }}
              />

              <PatientRightBar 
                patientData={{
                  fotoUrl: "",
                  nombrePaciente: formData.nombrePaciente,
                  apellidoPaciente: formData.apellidoPaciente,
                  rupPaciente: formData.rupPaciente,
                  fechaRegistro: formData.fechaRegistro,
                  ciudadPaciente: formData.ciudadPaciente,
                  objetivoConsulta: formData.objetivoConsulta,
                }} 
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
                    fechaRegistro: patient.registro ? new Date(patient.registro) : null,
                    ciudadPaciente: patient.ciudad,
                    objetivoConsulta: patient.detallePaciente?.objetivo || 'No especificado'
                  }));
                }}
              />

              <TextField
                label="RUP"
                value={formData.rupPaciente}
                onChange={(e) => setFormData(prev => ({ ...prev, rupPaciente: e.target.value }))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => buscarPaciente(formData.rupPaciente)}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            </div>
          </div>

          {/* Diálogo de validación de contraseña */}
          <Dialog
            open={openPasswordDialog}
            onClose={() => {
              setOpenPasswordDialog(false);
              setPassword('');
              setPasswordError('');
              setFormData({
                ...formData,
                firmaDigital: false
              });
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
                  setFormData({
                    ...formData,
                    firmaDigital: false
                  });
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
  );
};

export default NuevoDiagnostico;