'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import ContabilidadLayout from "../ContabilidadLayout";
import ConversionCitas from "./components/ConversionCitas";
import EvaluacionesTable from "./components/ConversionCitas";

const ConversionCitasPage = () => {
    return (
        <ProtectedRoute> 
        <ContabilidadLayout>
        <div>
        <ConversionCitas/>
        {/* <EvaluacionesTable/> */}
        </div>
        </ContabilidadLayout>
        </ProtectedRoute>
    );
    }

    export default ConversionCitasPage;