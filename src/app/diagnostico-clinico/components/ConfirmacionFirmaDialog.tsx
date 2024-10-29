// components/ConfirmacionFirmaDialog.tsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography
  } from '@mui/material';
  
  interface ConfirmacionFirmaDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const ConfirmacionFirmaDialog: React.FC<ConfirmacionFirmaDialogProps> = ({ 
    open, 
    onClose, 
    onConfirm 
  }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          color: '#25aa80',
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}>
          Confirmación de Firma Digital
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2,
            py: 2 
          }}>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              ⚠️ Importante: Al firmar digitalmente este diagnóstico clínico:
            </Typography>
            <Box sx={{ 
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '16px',
              width: '100%'
            }}>
              <ul className="list-disc space-y-2 pl-4 text-gray-700">
                <li>Los datos del médico quedarán bloqueados y no podrán ser modificados</li>
                <li>La firma digital quedará registrada con fecha y hora</li>
                <li>Este documento tendrá validez legal una vez firmado</li>
              </ul>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center">
              ¿Está seguro de que desea proceder con la firma digital?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: '#25aa80',
              color: '#25aa80',
              '&:hover': {
                borderColor: '#1e8c66',
                backgroundColor: 'rgba(37, 170, 128, 0.04)'
              }
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
              }
            }}
          >
            Confirmar Firma
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmacionFirmaDialog;