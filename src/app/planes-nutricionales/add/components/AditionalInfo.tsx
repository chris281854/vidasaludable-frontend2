import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, InputAdornment } from '@mui/material';
import { FaAllergies, FaClipboardList,   FaPlus, FaUtensils, FaPills } from 'react-icons/fa';

const AditionalInfo: React.FC = () => {
    const [patologias, setPatologias] = useState('');
    const [alergias, setAlergias] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [comportamiento, setComportamiento] = useState('');
    const [medicamentos, setMedicamentos] = useState('');
    const [control, setControl] = useState('');
    const [infoType, setInfoType] = useState('');
    const [infoContent, setInfoContent] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const handleDialogOpen = (type: string) => {
        setInfoType(type);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setInfoContent('');
    };

    const handleAddInfo = () => {
        // Aquí puedes manejar la lógica para agregar la información a la sección correspondiente
        setSnackbar({ open: true, message: `Información de ${infoType} agregada: ${infoContent}`, severity: 'success' });
        handleDialogClose();
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 2,   borderRadius: '8px', backgroundColor: '#ffffff', height: '100%' }}>
            <Typography color = '#25aa80' variant="h6" gutterBottom>
                Información Adicional
            </Typography>
           <TextField
           fullWidth
           label="Patologías"
           value={patologias}
           onChange={(e) => setPatologias(e.target.value)}
           variant="outlined"
           InputProps={{
               startAdornment: (
                   <InputAdornment position="start">
                       <FaAllergies style={{ color: '#25aa80' }} />
                   </InputAdornment>
               ),
           }}
           sx={{
               mb: 2,
               '& .MuiOutlinedInput-root': {
                   borderRadius: '15px', // Bordes redondos
                   '& fieldset': {
                       borderColor: '#25aa80', // Color del borde
                   },
                   '&:hover fieldset': {
                       borderColor: 'darkgreen', // Color del borde al pasar el mouse
                   },
                   '&.Mui-focused fieldset': {
                       borderColor: '#25aa80', // Color del borde al estar enfocado
                   },
               },
           }}
       />
       
       <TextField
           fullWidth
           label="Alergias"
           value={alergias}
           onChange={(e) => setAlergias(e.target.value)}
           variant="outlined"
           InputProps={{
               startAdornment: (
                   <InputAdornment position="start">
                       <FaAllergies style={{ color: '#25aa80' }} />
                   </InputAdornment>
               ),
           }}
           sx={{
               mb: 2,
               '& .MuiOutlinedInput-root': {
                   borderRadius: '15px', // Bordes redondos
                   '& fieldset': {
                       borderColor: '#25aa80', // Color del borde
                   },
                   '&:hover fieldset': {
                       borderColor: 'darkgreen', // Color del borde al pasar el mouse
                   },
                   '&.Mui-focused fieldset': {
                       borderColor: '#25aa80', // Color del borde al estar enfocado
                   },
               },
           }}
       />
       
       <TextField
           fullWidth
           label="Comportamiento alimenticio"
           value={comportamiento}
           onChange={(e) => setComportamiento(e.target.value)}
           variant="outlined"
           InputProps={{
               startAdornment: (
                   <InputAdornment position="start">
                       <FaUtensils style={{ color: '#25aa80' }} />
                   </InputAdornment>
               ),
           }}
           sx={{
               mb: 2,
               '& .MuiOutlinedInput-root': {
                   borderRadius: '15px', // Bordes redondos
                   '& fieldset': {
                       borderColor: '#25aa80', // Color del borde
                   },
                   '&:hover fieldset': {
                       borderColor: 'darkgreen', // Color del borde al pasar el mouse
                   },
                   '&.Mui-focused fieldset': {
                       borderColor: '#25aa80', // Color del borde al estar enfocado
                   },
               },
           }}
       />
       
       <TextField
           fullWidth
           label="Medicamentos recomendados"
           value={medicamentos}
           onChange={(e) => setMedicamentos(e.target.value)}
           variant="outlined"
           InputProps={{
               startAdornment: (
                   <InputAdornment position="start">
                       <FaPills style={{ color: '#25aa80' }} />
                   </InputAdornment>
               ),
           }}
           sx={{
               mb: 2,
               '& .MuiOutlinedInput-root': {
                   borderRadius: '15px', // Bordes redondos
                   '& fieldset': {
                       borderColor: '#25aa80', // Color del borde
                   },
                   '&:hover fieldset': {
                       borderColor: 'darkgreen', // Color del borde al pasar el mouse
                   },
                   '&.Mui-focused fieldset': {
                       borderColor: '#25aa80', // Color del borde al estar enfocado
                   },
               },
           }}
       />
       
       <TextField
           fullWidth
           label="Info de control nutricional"
           value={control}
           onChange={(e) => setControl(e.target.value)}
           variant="outlined"
           InputProps={{
               startAdornment: (
                   <InputAdornment position="start">
                       <FaClipboardList style={{ color: '#25aa80' }} />
                   </InputAdornment>
               ),
           }}
           sx={{
               mb: 2,
               '& .MuiOutlinedInput-root': {
                   borderRadius: '15px', // Bordes redondos
                   '& fieldset': {
                       borderColor: '#25aa80', // Color del borde
                   },
                   '&:hover fieldset': {
                       borderColor: 'darkgreen', // Color del borde al pasar el mouse
                   },
                   '&.Mui-focused fieldset': {
                       borderColor: '#25aa80', // Color del borde al estar enfocado
                   },
               },
           }}
       />

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Agregar {infoType}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={`Información de ${infoType}`}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={infoContent}
                        onChange={(e) => setInfoContent(e.target.value)}
                        
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleAddInfo} color="primary">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AditionalInfo;