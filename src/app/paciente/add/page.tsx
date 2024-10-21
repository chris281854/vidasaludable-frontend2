 'use client';

import AddPatientForm from '../../paciente/add/components/AddPatientForm';
import RecentPatients from '../../paciente/components/RightBar';
import PacienteLayout from '../../paciente/PacienteLayout';
import HeaderUser from '../components/headeruser';
import { Box, Paper, Typography } from '@mui/material';

export default function AddPatientPage() {
    return (
      <PacienteLayout>
        <Box sx={{ p: 4 }}>
          <HeaderUser title='Agregar Nuevo Paciente' />
          
          {/* Espacio adicional después del HeaderUser */}
          <Box sx={{ height: '8rem' }} /> {/* Aumentado significativamente el espacio */}
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
            <Box sx={{ flex: { xs: '1', lg: '3' } }}>
              <AddPatientForm />
            </Box>
            <Box sx={{ flex: { xs: '1', lg: '1' } }}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Últimos pacientes registrados
                </Typography>
                <RecentPatients />
              </Paper>
            </Box>
          </Box>
        </Box>
      </PacienteLayout>
    );
}