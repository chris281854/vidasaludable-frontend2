import React from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper 
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import SearchIcon from '@mui/icons-material/Search';

interface DiagnosticoSearchFieldProps {
  diagnosticoId: string;
  onChange: (value: string) => void;
  onSearch: (id: string) => void;
  disabled?: boolean;
}

const searchFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fdfb',
    '&:hover fieldset': {
      borderColor: '#25aa80',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#25aa80',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666',
    '&.Mui-focused': {
      color: '#25aa80',
    },
  },
  '& .MuiOutlinedInput-input': {
    fontWeight: '500',
    color: '#333',
  },
};

const DiagnosticoSearchField: React.FC<DiagnosticoSearchFieldProps> = ({
  diagnosticoId,
  onChange,
  onSearch,
  disabled = false
}) => {
  return (
    <Paper elevation={0} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="ID del Diagnóstico"
        variant="outlined"
        value={diagnosticoId}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        sx={searchFieldStyles}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <TagIcon sx={{ color: '#25aa80' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={() => diagnosticoId && onSearch(diagnosticoId)}
                edge="end"
                disabled={!diagnosticoId || disabled}
              >
                <SearchIcon sx={{ color: diagnosticoId && !disabled ? '#25aa80' : '#ccc' }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        placeholder="Ingrese el ID del diagnóstico a editar"
      />
    </Paper>
  );
};

export default DiagnosticoSearchField;