'use client';

import DeletePatientForm from '../delete/components/DeletePatientForm';
import RecentPatients from '../components/RightBar';
import PacienteLayout from '../PacienteLayout';
import HeaderUser from '../components/headeruser';
import { Box, Paper, Typography } from '@mui/material';

export default function DeletePatientPage() {
    return (
      <PacienteLayout>
        <Box sx={{ p: 4 }}>
          <HeaderUser title='Gestion de Pacientes ~ Eliminar Pacientes' />
          
          {/* Espacio adicional después del HeaderUser */}
          <Box sx={{ height: '8rem' }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
            <Box sx={{ flex: { xs: '1', lg: '3' } }}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}> {/* Añadido Paper aquí */}
                <DeletePatientForm />
              </Paper>
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