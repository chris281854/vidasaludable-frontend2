'use client';

import { useState } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Paper,
  Checkbox,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  Box,
  Modal
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ConfirmacionFirmaDialog from "@/app/diagnostico-clinico/components/ConfirmacionFirmaDialog";
import { LockIcon } from "lucide-react";

const MedicalSignatureComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  }>({
    open: false,
    message: '',
    severity: 'success',
    duration: 6000,
  });

  // Estados para los modales
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [openFirmaDialog, setOpenFirmaDialog] = useState(false); // Estado para el nuevo modal
  const [nutritionPlan, setNutritionPlan] = useState({
    codigoMedico: '',
    nombreMedico: '',
    apellidoMedico: '',
    especialidad: '',
    firmadoDigital: false,
    fechaFirma: '',
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
      duration: 6000,
    });
  };

  const buscarMedico = async () => {
    if (!session?.user?.token) {
      showNotification('No hay sesión activa', 'error');
      return;
    }
  
    if (!nutritionPlan.codigoMedico) {
      showNotification('Por favor ingrese un código de médico', 'warning');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicos/${nutritionPlan.codigoMedico}`, {
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
        setNutritionPlan((prev) => ({
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
      setNutritionPlan((prev) => ({
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

  const handleLimpiar = () => {
    showNotification('Formulario limpiado exitosamente', 'success');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Validar campos antes de abrir el modal
      if (!nutritionPlan.codigoMedico || !nutritionPlan.nombreMedico || !nutritionPlan.especialidad) {
        showNotification('Por favor complete todos los campos requeridos', 'warning');
        setNutritionPlan(prev => ({ ...prev, firmadoDigital: false })); // Desmarca el checkbox
        return;
      }
      setOpenFirmaDialog(true); // Abre el nuevo modal de confirmación de firma
    } else {
      setNutritionPlan(prev => ({ ...prev, firmadoDigital: false })); // Desmarca el checkbox
    }
  };

  const handleConfirmFirma = () => {
    setOpenFirmaDialog(false);
    setOpenPasswordModal(true); // Abre el modal para solicitar la contraseña
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      showNotification('La contraseña es requerida', 'warning');
      return;
    }

    if (!session?.user?.name) {
      showNotification('No se encontró información del usuario', 'warning');
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
        setNutritionPlan(prev => ({
          ...prev,
          firmadoDigital: true, // Asegúrate de que este valor se establezca en true
          firmadoPor: session?.user?.name || '',
          fechaFirma: new Date().toISOString()
        }));
        setOpenPasswordModal(false);
        setPassword('');
        showNotification('Firma digital realizada con éxito', 'success');
      } else {
        showNotification('Contraseña incorrecta', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('La contraseña ingresada no es correcta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-grow">
        <div className="p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Columna principal - Lado izquierdo */}
            <div className="col-span-12">
              {/* Sección Datos del Médico */}
              <Paper sx={{ marginBottom: '2rem', backgroundColor: 'transparent' }} elevation={0} className="mt-6">
                <div className="grid grid-cols-3 gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <TextField
                      label="ID Médico"
                      variant="outlined"
                      name="codigoMedico"
                      value={nutritionPlan.codigoMedico}
                      sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                    />
                    <IconButton 
                      onClick={buscarMedico}
                      disabled={loading}
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
                    value={`${nutritionPlan.nombreMedico} ${nutritionPlan.apellidoMedico}`.trim()}
                    sx={{ mb: 2, borderRadius: '20px' }}
                        InputProps={{
                            sx: {
                                borderRadius: '20px',
                            },
                        }}
                  />
                  <TextField
                    fullWidth
                    label="Especialidad"
                    variant="outlined"
                    value={nutritionPlan.especialidad}
                    sx={{ mb: 2, borderRadius: '20px' }}
                    InputProps={{
                        sx: {
                            borderRadius: '20px',
                        },
                    }}
                  />
                </div>
              </Paper>

              {/* Sección de firma digital */}
              <div className="flex flex-col gap-2 mt-4">
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={nutritionPlan.firmadoDigital}
                      onChange={handleCheckboxChange} // Cambia el manejador aquí
                      sx={{ 
                        '&.Mui-checked': { 
                          color: '#25aa80' 
                        }
                      }}
                      disabled={nutritionPlan.firmadoDigital} // Deshabilitar si ya está firmado
                    />
                  }
                  label={
                    <Typography variant="body1" className="font-semibold">
                      Firma digital
                    </Typography>
                  }
                />
              </div>

              {/* Sección de firma */}
              {nutritionPlan.firmadoDigital && (
                <Box sx={{ marginTop: 2, padding: 2, border: '1px solid #25aa80', borderRadius: '8px', backgroundColor: '#f0f8f0' }}>
                  <Typography variant="body1">
                    El plan nutricional ha sido firmado por el usuario <strong>{nutritionPlan.nombreMedico + " " +nutritionPlan.apellidoMedico}</strong> en fecha <strong>{new Date(nutritionPlan.fechaFirma).toLocaleDateString()}</strong> y hora <strong>{new Date(nutritionPlan.fechaFirma).toLocaleTimeString()}</strong>.
                  </Typography>
                </Box>
              )}

             
            </div>
          </div>

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
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
      </div>

      {/* Modal de Confirmación de Firma */}
      <ConfirmacionFirmaDialog 
        open={openFirmaDialog} 
        onClose={() => setOpenFirmaDialog(false)} 
        onConfirm={handleConfirmFirma} 
      />

      {/* Modal para Solicitar Contraseña */}
      <Modal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 600, // Aumentar el ancho del modal
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h5" align="center" color="primary">Ingrese su Contraseña</Typography>
          <TextField
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ marginRight: 1 }}>
                  <LockIcon />
                </Box>
              ),
            }}
          />
          <Button 
            variant="contained" 
            onClick={handlePasswordSubmit}
            sx={{ backgroundColor: '#25aa80', width: '100%' }}
          >
            Confirmar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default MedicalSignatureComponent;