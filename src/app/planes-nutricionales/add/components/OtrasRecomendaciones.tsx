import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import { Search, Clear, Check } from '@mui/icons-material';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from "react-icons/gr";
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';

interface Elemento {
  nombre: string; // Nombre del elemento a evitar
  frecuencia: string; // Frecuencia de consumo
  cantidad: string; // Cantidad a evitar
}

const OtrasRecomendaciones = () => {
  const [elemento, setElemento] = useState<Elemento>({ nombre: '', frecuencia: '', cantidad: '' });
  const [listaElementos, setListaElementos] = useState<Elemento[]>([]);
  const [buscar, setBuscar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const agregarElemento = () => {
    if (elemento.nombre && elemento.frecuencia && elemento.cantidad) {
      setListaElementos([...listaElementos, elemento]);
      setElemento({ nombre: '', frecuencia: '', cantidad: '' });
    }
  };

  const limpiarBuscar = () => {
    setBuscar('');
  };

  const eliminarElemento = (index: number) => {
    const nuevaLista = listaElementos.filter((_, i) => i !== index);
    setListaElementos(nuevaLista);
  };

  return (
    <Box className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <Box className="p-4">
        <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Otras recomendaciones</Typography>
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Elemento</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaElementos.length === 0 ? (
                <li style={{ marginBottom: '14px', color: "olivedrab" }}>No hay elementos agregados.</li>
              ) : (
                listaElementos.map((elemento, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{elemento.nombre}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Frecuencia</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaElementos.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                listaElementos.map((elemento, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{elemento.frecuencia}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Cantidad</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaElementos.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                listaElementos.map((elemento, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{elemento.cantidad}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaElementos.length === 0 ? (
                <li style={{ marginBottom: '-1px' }}>-</li>
              ) : (
                listaElementos.map((_, index) => (
                  <li key={index} style={{ marginBottom: '-1px' }}>
                    <IconButton onClick={() => eliminarElemento(index)} color="error">
                      <FaDeleteLeft />
                    </IconButton>
                  </li>
                ))
              )}
            </ul>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <TextField
          variant="outlined"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          label="Buscar elemento"
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
          style={{ width: '180px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Redondear el botón
        >
          Limpiar
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-start" mb={4}>
        <TextField
          variant="outlined"
          value={elemento.nombre}
          onChange={(e) => setElemento({ ...elemento, nombre: e.target.value })}
          label="Nombre del elemento"
          sx={{ width: '500px' }}
          style={{ borderRadius: '50px', marginRight: '9px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={elemento.frecuencia}
          onChange={(e) => setElemento({ ...elemento, frecuencia: e.target.value })}
          label="Frecuencia de consumo"
          sx={{ width: '210px' }}
          style={{ borderRadius: '20px', marginRight: '8px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={elemento.cantidad}
          onChange={(e) => setElemento({ ...elemento, cantidad: e.target.value })}
          label="Cantidad"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={agregarElemento}
          startIcon={<MdAddTask />}
          style={{ width: '140px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Redondear el botón y añadir margen
        >
          Agregar
        </Button>
      </Box>
    </Box>
  );
};

export default OtrasRecomendaciones;