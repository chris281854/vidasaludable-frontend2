import { useState } from 'react';
import { TextField, Button, Typography, Snackbar, Alert, Box } from '@mui/material';
import { Mail, Download } from 'lucide-react';

const PlanNutricionalForm = () => {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleObservacionesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservaciones(e.target.value);
  };

  const generarContrasena = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const contrasenaAleatoria = Array(10).fill('').map(() => caracteres.charAt(Math.floor(Math.random() * caracteres.length))).join('');
    setContrasena(contrasenaAleatoria);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generarContrasena();
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasena, observaciones }),
      });
  
      if (response.ok) {
        setMensaje(`Se ha enviado el plan nutricional a ${email}`);
        setOpenSnackbar(true);
        setEnviado(true);
      } else {
        setMensaje('Error al enviar el correo');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al enviar el correo');
      setOpenSnackbar(true);
    }
  };

  const handleExportar = (tipo: string) => {
    console.log(`Exportando en ${tipo}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 bg-white rounded shadow">
      <Typography variant="h4" component="h2" className="mb-4">Enviar Plan Nutricional</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo electrónico del paciente"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={handleEmailChange}
          required
          InputProps={{
            style: { borderRadius: '20px' }, // Bordes redondeados
          }}
        />
        <TextField
          label="Observaciones"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={observaciones}
          onChange={handleObservacionesChange}
          InputProps={{
            style: { borderRadius: '20px' }, // Bordes redondeados
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="mt-4"
          style={{ borderRadius: '20px' }} // Bordes redondeados
        >
          Enviar Plan Nutricional
        </Button>
      </form>
      {enviado && (
        <Box className="mt-4">
          <Mail className="text-green-500" />
          <Typography variant="body1" className="text-green-500">{mensaje}</Typography>
          <Typography variant="body2">Contraseña provisional: {contrasena}</Typography>
        </Box>
      )}
      <Box className="mt-4">
        <Download className="text-gray-700" />
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleExportar('PDF')}
          className="mr-2"
          style={{ borderRadius: '20px' }} // Bordes redondeados
        >
          Exportar en PDF
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleExportar('Word')}
          className="mr-2"
          style={{ borderRadius: '20px' }} // Bordes redondeados
        >
          Exportar en Word
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleExportar('Excel')}
          style={{ borderRadius: '20px' }} // Bordes redondeados
        >
          Exportar en Excel
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlanNutricionalForm;