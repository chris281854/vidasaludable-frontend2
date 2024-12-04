'use client';

import HeaderUser from "@/components/headeruser";
import EvaluacionesNutricionalesLayout from "../EvaluacionesNutricionalesLayout";
import EvaluacionesNutricionalesForm from "./components/EvalacionesNutricionalesForm";

const AddEvaluacionesNutricionales = () => {    
    return (
        <EvaluacionesNutricionalesLayout>
        <div>
         <HeaderUser title="Evaluaciones Nutricionales ~ Registro de Evaluaciones"/>

        
            <EvaluacionesNutricionalesForm />
        </div>
        </EvaluacionesNutricionalesLayout>
    );
}

export default AddEvaluacionesNutricionales;