// pages/dashboard/generacionReportes.js
import { Box, Button, Typography } from "@mui/material";
import jsPDF from "jspdf"; // Asegúrate de instalar esta biblioteca

const GeneracionReportes = () => {
    const generarPDF = (tipoReporte: string) => {
        const doc = new jsPDF();
        doc.text(`Reporte de ${tipoReporte}`, 20, 20);
        doc.text(`Contenido del reporte de ${tipoReporte}...`, 20, 30);
        doc.save(`${tipoReporte}.pdf`);
    };

    return (
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
    );
};

export default GeneracionReportes;
