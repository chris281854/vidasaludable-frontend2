import { useState } from 'react';
import { TextField, Button, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import { Search, Clear, Check } from '@mui/icons-material';
import { FaSave } from 'react-icons/fa';
import { GrClearOption } from "react-icons/gr";
import { MdAddTask } from 'react-icons/md';
import { FaDeleteLeft } from 'react-icons/fa6';

interface Actividad {
  nombre: string;
  frecuencia: string;
  duracion: string; // Cambiado de kilocalorias a duracion
}

const RecomendacionSection = () => {
  const [actividad, setActividad] = useState<Actividad>({ nombre: '', frecuencia: '', duracion: '' });
  const [listaActividades, setListaActividades] = useState<Actividad[]>([]);
  const [buscar, setBuscar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const agregarActividad = () => {
    if (actividad.nombre && actividad.frecuencia && actividad.duracion) {
      setListaActividades([...listaActividades, actividad]);
      setActividad({ nombre: '', frecuencia: '', duracion: '' });
    }
  };

  const limpiarBuscar = () => {
    setBuscar('');
  };

  const eliminarActividad = (index: number) => {
    const nuevaLista = listaActividades.filter((_, i) => i !== index);
    setListaActividades(nuevaLista);
  };

  return (
    <Box className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <Box className="p-4">
        <Typography variant="h6" fontWeight="bold" mb={2}>Lista de Actividades Físicas</Typography>
        <Box display="flex" justifyContent="space-around" mb={2}>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Actividad</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaActividades.length === 0 ? ( // Verifica si la lista está vacía
                <li style={{ marginBottom: '14px', color: 'blue' }}>No hay actividades agregadas.</li>
              ) : (
                listaActividades.map((actividad, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{actividad.nombre}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Frecuencia</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaActividades.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                listaActividades.map((actividad, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{actividad.frecuencia}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Duración</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaActividades.length === 0 ? (
                <li style={{ marginBottom: '14px' }}>-</li>
              ) : (
                listaActividades.map((actividad, index) => (
                  <li key={index} style={{ marginBottom: '14px' }}>{actividad.duracion}</li>
                ))
              )}
            </ul>
          </Box>
          <Box width="25%">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>Acciones</Typography>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
              {listaActividades.length === 0 ? (
                <li style={{ marginBottom: '-1px' }}>-</li>
              ) : (
                listaActividades.map((_, index) => (
                  <li key={index} style={{ marginBottom: '-1px' }}>
                    <IconButton onClick={() => eliminarActividad(index)} color="error">
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
          label="Buscar actividad"
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
          value={actividad.nombre}
          onChange={(e) => setActividad({ ...actividad, nombre: e.target.value })}
          label="Nombre de la actividad"
          sx={{ width: '500px' }}
          style={{ borderRadius: '50px', marginRight: '9px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={actividad.frecuencia}
          onChange={(e) => setActividad({ ...actividad, frecuencia: e.target.value })}
          label="Frecuencia de consumo"
          sx={{ width: '210px' }}
          style={{ borderRadius: '20px', marginRight: '8px' }} // Redondear el input
        />
        <TextField
          variant="outlined"
          value={actividad.duracion}
          onChange={(e) => setActividad({ ...actividad, duracion: e.target.value })}
          label="Duración"
          sx={{ width: '150px' }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={agregarActividad}
          startIcon={<MdAddTask />}
          style={{ width: '140px', height: '48px', borderRadius: '20px', marginLeft: '10px' }} // Redondear el botón y añadir margen
        >
          Agregar
        </Button>
      </Box>
    </Box>
  );
};

export default RecomendacionSection;