'use client';

import { useState } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Asegúrate de tener este ícono instalado
import { useSession } from 'next-auth/react';

const PatientIdentification = () => {
  const { data: session } = useSession();
  const [patientData, setPatientData] = useState({
    identificacion: '',
    tipoIdentificacion: 'cedula', // Valor por defecto
    nombre: '',
  });

  const [errors, setErrors] = useState({
    identificacion: '',
    nombre: '',
  });

  const [isIdentificacionValid, setIsIdentificacionValid] = useState<boolean | null>(null); // Estado para manejar la validación

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));

    // Validación de la identificación
    if (name === 'identificacion') {
      if (patientData.tipoIdentificacion === 'cedula') {
        // Validar cédula
        const isValidCedula = /^\d{11}$/.test(value);
        setErrors((prev) => ({
          ...prev,
          identificacion: isValidCedula ? '' : 'La cédula debe tener 11 dígitos y solo contener números.',
        }));
      } else if (patientData.tipoIdentificacion === 'pasaporte') {
        // Validación para pasaporte (puede ser texto y números)
        setErrors((prev) => ({
          ...prev,
          identificacion: '', // No hay validación específica para pasaporte
        }));
      }
    }
  };

  const handleTipoIdentificacionChange = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    const { value } = e.target;
    setPatientData((prev) => ({ ...prev, tipoIdentificacion: value as string, identificacion: '' })); // Reiniciar el campo de identificación
    setErrors((prev) => ({ ...prev, identificacion: '' })); // Limpiar errores
  };

  const validateIdentification = async () => {
    if (patientData.tipoIdentificacion === 'cedula') {
      // Aquí puedes hacer la llamada a la API para validar la cédula
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vidasaludable/validar/${patientData.identificacion}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al validar la cédula');
        }

        const data = await response.json();

        // Verifica si se encontró el paciente
        if (data.identificacion) {
          // Si la identificación coincide con la ingresada
          if (data.identificacion === patientData.identificacion) {
            // Muestra el mensaje de error debajo del input
            setErrors((prev) => ({
              ...prev,
              identificacion: 'La cédula ya está registrada.',
            }));
            setIsIdentificacionValid(false); // Indica que la identificación no es válida
          }
        } else {
          // Si no se devuelve nada, la cédula está disponible
          setErrors((prev) => ({
            ...prev,
            identificacion: 'Identificación disponible', // Mensaje de disponibilidad
          }));
          setIsIdentificacionValid(true); // Indica que la identificación es válida
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al validar la cédula.');
        setIsIdentificacionValid(false); // En caso de error, marcamos como no válida
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Tipo de Identificación</InputLabel>
          <Select
            name="tipoIdentificacion"
            value={patientData.tipoIdentificacion}
            onChange={handleTipoIdentificacionChange}
            label="Tipo de Identificación"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderColor: isIdentificacionValid === null ? 'transparent' : isIdentificacionValid ? 'green' : 'red',
              },
              '& .MuiSelect-icon': {
                color: isIdentificacionValid === null ? 'inherit' : isIdentificacionValid ? 'green' : 'red', // Color del ícono de selección
              }
            }}
          >
            <MenuItem value="cedula">Cédula</MenuItem>
            <MenuItem value="pasaporte">Pasaporte</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Identificación"
          name="identificacion"
          value={patientData.identificacion}
          onChange={handleChange}
          variant="outlined"
          error={!!errors.identificacion}
          helperText={errors.identificacion}
          id="identificacionInput"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={validateIdentification} edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              // Cambiar el color del borde en función de si la identificación es válida
              borderColor: isIdentificacionValid === null ? 'transparent' : isIdentificacionValid ? 'green' : 'red',
            },
            '& .MuiFormHelperText-root': {
              color: isIdentificacionValid === null ? 'inherit' : isIdentificacionValid ? 'green' : 'red', // Cambiar color del helper text
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombre del paciente"
          name="nombre"
          value={patientData.nombre}
          onChange={handleChange}
          variant="outlined"
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
      </Grid>
    </Grid>
  );
};

export default PatientIdentification;
