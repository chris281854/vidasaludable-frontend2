import { Box } from "@mui/material";
import SectionDivider from "./SectionDivider";
import PlanNutricionalForm from "../UI/ExportarPlanes";
import MedicalSignatureComponent from "./AccionPlanes";
import { FormProvider } from "../../context/FormContext";

const ExportarSection = () => {

    return(

        <div>
             <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Formato de Exportacion de Planes Nutricionales'} />
            </Box>
             

            <Box className="flex items-center mb-2">
                    <PlanNutricionalForm/>
            </Box>

            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Acciones de Planes Nutricionales'} />
            </Box>

            <Box className="flex items-center mb-2">
            <FormProvider>
            <MedicalSignatureComponent />
            </FormProvider>
            </Box>

        </div>
    )

}

export default ExportarSection;