'use client';

import { useState, useEffect } from "react";
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
  Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { format } from 'date-fns';
import useNutritionPlan from '../../hooks/useNutritionPlan'; // Importa el hook

const MedicalSignatureComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { nutritionPlan, setNutritionPlan, errors, handleInputChange, handleSubmit, handleClear } = useNutritionPlan(); // Usa el hook
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
        setNutritionPlan(prev => ({
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
      setNutritionPlan(prev => ({
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

  const handleGuardar = async () => {
    if (session?.user?.token) {
      try {
        await handleSubmit(session.user.token);
        showNotification('Datos guardados exitosamente', 'success');
      } catch (error) {
        showNotification('Error al guardar los datos', 'error');
      }
    }
  };

  const handleLimpiar = () => {
    handleClear();
    showNotification('Formulario limpiado exitosamente', 'success');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-grow">
        <div className="p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Columna principal - Lado izquierdo */}
            <div className="col-span-8">
              {/* Sección Datos del Médico */}
              <Paper sx={{ marginBottom: '2rem', backgroundColor: 'transparent' }} elevation={0} className="mt-12">
                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <TextField
                      label="ID Médico"
                      variant="outlined"
                      name="codigoMedico"
                      value={nutritionPlan.codigoMedico}
                      onChange={handleInputChange}
                      sx={{ backgroundColor: 'white', borderRadius: '12px' }}
                      size="small"
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
                  //  value={`${nutritionPlan.nombreMedico} ${nutritionPlan.apellidoMedico}`.trim()}
                    sx={{ backgroundColor: 'white', borderRadius: '12px' }}
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Especialidad"
                    variant="outlined"
                  //  value={nutritionPlan.especialidad}
                    sx={{ backgroundColor: 'white', borderRadius: '12px' }}
                    disabled
                  />
                </div>
              </Paper>

              {/* Sección de firma digital */}
              <div className="flex flex-col gap-2 mt-4">
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={nutritionPlan.firmadoDigital}
                      onChange={(e) => setNutritionPlan(prev => ({ ...prev, firmaDigital: e.target.checked }))}
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
              </div>

              {/* Botones de acción */}
              <div className="flex justify-between gap-4 mt-8">
                <Button 
                  variant="contained" 
                  onClick={handleGuardar}
                  sx={{
                    backgroundColor: '#25aa80',
                    '&:hover': {
                      backgroundColor: '#1e8c66',
                    }
                  }}
                >
                  Guardar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleLimpiar}
                  sx={{ backgroundColor: '#131416' }}
                >
                  Limpiar
                </Button>
              </div>
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
    </div>
  );
}

export default MedicalSignatureComponent;