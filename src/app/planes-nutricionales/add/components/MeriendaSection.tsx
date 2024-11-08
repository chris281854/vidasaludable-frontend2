import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import { Search, Clear, Check } from '@mui/icons-material';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from "react-icons/gr";
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';

interface Alimento {
  nombre: string;
  frecuencia: string;
  kilocalorias: string;
}

const MeriendaSection = () => {
  const [alimento, setAlimento] = useState<Alimento>({ nombre: '', frecuencia: '', kilocalorias: '' });
  const [listaAlimentos, setListaAlimentos] = useState<Alimento[]>([]);
  const [buscar, setBuscar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const agregarAlimento = () => {
    if (alimento.nombre && alimento.frecuencia && alimento.kilocalorias) {
      setListaAlimentos([...listaAlimentos, alimento]);
      setAlimento({ nombre: '', frecuencia: '', kilocalorias: '' });
    }
  };

  const limpiarBuscar = () => {
    setBuscar('');
  };

  const eliminarAlimento = (index: number) => {
    const nuevaLista = listaAlimentos.filter((_, i) => i !== index);
    setListaAlimentos(nuevaLista);
  };

  return (
    <Box className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <Box className="p-4">
        <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Meriendas</Typography>
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Alimento</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaAlimentos.map((alimento, index) => (
                <li key={index} style={{ marginBottom: '14px' }}>{alimento.nombre}</li>
              ))}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Frecuencia</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaAlimentos.map((alimento, index) => (
                <li key={index} style={{ marginBottom: '14px' }}>{alimento.frecuencia}</li>
              ))}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Kilocalorias</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaAlimentos.map((alimento, index) => (
                <li key={index} style={{ marginBottom: '14px' }}>{alimento.kilocalorias}</li>
              ))}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaAlimentos.map((_, index) => (
                <li key={index} style={{ marginBottom: '-1px' }}>
                  <IconButton onClick={() => eliminarAlimento(index)} color="error">
                    <FaDeleteLeft />
                  </IconButton>
                </li>
              ))}
            </ul>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <TextField
          variant="outlined"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          label="Buscar alimento"
          fullWidth
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
            style: { borderRadius: '20px' },
          }}
          sx={{ marginRight: 2 }} // Espacio entre el input y los botones
        />
        <Button
          type="submit"
          variant="contained"
          color='primary'
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FaSave />}
          style={{ 
            width: '180px', 
            height: '48px', 
            borderRadius: '20px', // Redondear el botón
            color: 'white',
            fontWeight: 'bold',
            marginRight: 2 // Espacio entre los botones
          }}
        >
          Guardar
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="warning"
          startIcon={<GrClearOption />}
          onClick={limpiarBuscar}
          style={{ width: '180px', height: '48px', borderRadius: '20px' ,marginLeft: '10px'}} // Redondear el botón
        >
          Limpiar
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <TextField
          variant="outlined"
          value={alimento.nombre}
          onChange={(e) => setAlimento({ ...alimento, nombre: e.target.value })}
          label="Nombre del alimento"
          sx={{ width: '500px' }}
          style={{ borderRadius: '50px', marginRight: '9px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={alimento.frecuencia}
          onChange={(e) => setAlimento({ ...alimento, frecuencia: e.target.value })}
          label="Frecuencia de consumo"
          sx={{ width: '210px' }}
          style={{ borderRadius: '20px', marginRight: '8px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={alimento.kilocalorias}
          onChange={(e) => setAlimento({ ...alimento, kilocalorias: e.target.value })}
          label="Kilocalorias"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={agregarAlimento}
          startIcon={<MdAddTask />}
          style={{ width: '140px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Redondear el botón y añadir margen superior
        >
          Agregar
        </Button>
      </Box>
    </Box>
  );
};

export default MeriendaSection;