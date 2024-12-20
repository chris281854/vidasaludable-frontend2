'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
// pages/reportes.js
import { useEffect, useState } from 'react';
import ReporteLayout from './ReportesLayout';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HeaderUser from '@/components/headeruser';
import { Box, Button, Typography } from '@mui/material';
import GeneracionReportes from './components/ReportesGeneration';
import jsPDF from 'jspdf';

const Reportes = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    
    const generarPDF = (tipoReporte: string) => {
        const doc = new jsPDF();
        doc.text(`Reporte de ${tipoReporte}`, 20, 20);
        doc.text(`Contenido del reporte de ${tipoReporte}...`, 20, 30);
        doc.save(`${tipoReporte}.pdf`);
    };





  // Efecto para redirigir si no hay sesión
  useEffect(() => {
    if (status === 'loading') return; // Espera a que se cargue la sesión
    if (!session) {
        router.push('/login'); // Redirige a la página de inicio de sesión si no hay sesión
    }
}, [session, status, router]);
   
    return(
        <ProtectedRoute>
            <ReporteLayout>
            <div className="flex-grow flex flex-col h-screen overflow-hidden">
            <HeaderUser title=" Generacion de Reportes ~ Dashboard" />
            </div>

            <Box sx={{ p: 4 }}> 
     
            <Box sx={{ p: 4 }}>
            <div className="p-4">
                <Typography variant="h4" gutterBottom>
                    Generación de Reportes
                </Typography>
                <Button variant="contained" onClick={() => generarPDF("Pacientes Registrados")} sx={{ mb: 2 }}>
                    Pacientes Registrados
                </Button>
                <Button variant="contained" onClick={() => generarPDF("Evaluaciones Nutricionales")} sx={{ mb: 2 }}>
                    Evaluaciones Nutricionales
                </Button>
                <Button variant="contained" onClick={() => generarPDF("Historiales Clínicos")} sx={{ mb: 2 }}>
                    Historiales Clínicos
                </Button>
                <Button variant="contained" onClick={() => generarPDF("Citas Agendadas")} sx={{ mb: 2 }}>
                    Citas Agendadas
                </Button>
                <Button variant="contained" onClick={() => generarPDF("Diagnósticos Realizados")} sx={{ mb: 2 }}>
                    Diagnósticos Realizados
                </Button>
            </div>
        </Box>
                  
            </Box>
            </ReporteLayout>
        </ProtectedRoute>
    );
};

export default Reportes;