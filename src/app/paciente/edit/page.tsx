'use client';

import EditPatientForm from '../edit/components/EditPatientForm';
import RecentPatients from '../components/RightBar';
import PacienteLayout from '../PacienteLayout';
import HeaderUser from '../../../components/headeruser';
import { Box, Paper, Typography } from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditPatientPage() {
    return (
      <ProtectedRoute>

      <PacienteLayout>
        <Box sx={{ p: 4 }}>
          <HeaderUser title='Gestion de Pacientes ~ Editar Paciente' />
          
          {/* Espacio adicional después del HeaderUser */}
          <Box sx={{ height: '8rem' }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
            <Box sx={{ flex: { xs: '1', lg: '3' } }}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}> {/* Añadido Paper aquí */}
                <EditPatientForm />
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
      </ProtectedRoute>

    );
}