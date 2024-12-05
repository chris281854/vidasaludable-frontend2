// src/components/HistorialClinico.tsx
'use client';

import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';

interface HistorialClinicoProps {
  onAddHistorial: (historial: string) => void;
  historial: string[];
  onRemoveHistorial: (index: number) => void; // Nueva prop para eliminar historial
}

const HistorialClinico: React.FC<HistorialClinicoProps> = ({ onAddHistorial, historial, onRemoveHistorial }) => {
  const [nuevoHistorial, setNuevoHistorial] = useState('');

  const handleAddHistorial = () => {
    if (nuevoHistorial.trim()) {
      onAddHistorial(nuevoHistorial);
      setNuevoHistorial('');
    }
  };

  const handleLimpiar = () => {
    setNuevoHistorial('');
  };

  return (
    <Paper sx={{ padding: 2, borderRadius: 2 }}>
      <Typography color="success" variant="h6" sx={{ mb: 2 }}>Historial Clínico</Typography>
      <TextField
        fullWidth
        label="Agregar historial clínico"
        value={nuevoHistorial}
        onChange={(e) => setNuevoHistorial(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DescriptionIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, borderRadius: '20px' }}
      />
      <div className="flex justify-around">
        <Button variant="contained" color="success" onClick={handleAddHistorial}>
          Agregar
        </Button>
        <Button variant="contained" color="warning" onClick={handleLimpiar}>
          Limpiar
        </Button>
      </div>
      <List sx={{ mt: 2 }}>
        {historial.map((item, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onRemoveHistorial(index)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default HistorialClinico;