import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ConfirmLimpiarDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  submessage?: string;
  disable?: boolean;
}

const ConfirmLimpiarDialog: React.FC<ConfirmLimpiarDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar Limpieza',
  message = '¿Está seguro que desea limpiar todos los campos del formulario?',
  submessage = 'Esta acción no se puede deshacer y todos los datos ingresados se perderán.'
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '400px'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        color: '#25aa80',
        fontWeight: 'bold',
        pb: 1
      }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 2 
        }}>
          <Box sx={{
            backgroundColor: '#f0f9f6',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DeleteOutlineIcon sx={{ 
              fontSize: 40, 
              color: '#25aa80' 
            }} />
          </Box>
          <Typography variant="body1" sx={{ color: '#333' }}>
            {message}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            backgroundColor: '#f5f5f5',
            p: 2,
            borderRadius: '8px',
            fontStyle: 'italic'
          }}
        >
          {submessage}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ 
        justifyContent: 'center',
        gap: 2,
        pb: 2 
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#25aa80',
            color: '#25aa80',
            '&:hover': {
              borderColor: '#1e8c66',
              backgroundColor: '#f0f9f6'
            },
            borderRadius: '8px',
            px: 3
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#25aa80',
            '&:hover': {
              backgroundColor: '#1e8c66'
            },
            borderRadius: '8px',
            px: 3
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLimpiarDialog;