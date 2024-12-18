'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import ContabilidadLayout from "../ContabilidadLayout";
import ConversionCitas from "./components/ConversionCitas";
import EvaluacionesTable from "./components/ConversionCitas";
import HeaderUser from "@/components/headeruser";
import { Box } from "@mui/material";

const ConversionCitasPage = () => {
    return (
        <ProtectedRoute> 
        <ContabilidadLayout>
        <Box sx={{ p: 4 }}>
                <HeaderUser title='Gestion de Evaluaciones de Nutricion ~ Dashboard' />

                </Box>

        <div className="mt-40 mr-10 ml-10">
        <ConversionCitas/>
        {/* <EvaluacionesTable/> */}
        </div>
        
         
        </ContabilidadLayout>
        </ProtectedRoute>
    );
    }

    export default ConversionCitasPage;