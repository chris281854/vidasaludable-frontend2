import { Box } from "@mui/material";
import SectionDivider from "./SectionDivider";
import DesayunoSection from "./DesayunoSection";
import MeriendaSection from "./MeriendaSection";
import AlmuerzoSection from "./AlmuerzoSection";
import CenasSection from "./CenasSection";
import OtrasComidasSection from "./OtrasComidasSection";

const ComidaSection = () => {

    return (
        <>
            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Asignacion de Desayunos'} />
            </Box>
           
              
                <Box className="flex items-center mb-2">
                    <DesayunoSection/>
                </Box>
                
            <Box className="w-full max-w-[1430px] rounded-lg">
                <SectionDivider top={0} text={'Asignacion de Meriendas'} />
            </Box>
           

                <Box className="flex items-center mb-2">
                    <MeriendaSection/>
                </Box>

            
            <Box className="w-full max-w-[1430px] rounded-lg">
                <SectionDivider top={0} text={'Asignacion de Almuerzos'} />
            </Box>


                <Box className="flex items-center mb-2">
                    <AlmuerzoSection/>
                </Box>

            <Box className="w-full max-w-[1430px] rounded-lg">
                <SectionDivider top={0} text={'Asignacion de Cenas'} />
            </Box>

                <Box className="flex items-center mb-2">
                    <CenasSection/>
                </Box>

            <Box className="w-full max-w-[1430px] rounded-lg">
                <SectionDivider top={0} text={'Asignacion de Otras Comidas'} />
            </Box>

               <Box className="flex items-center mb-2">
                    <OtrasComidasSection/>
                </Box>
           
        </>
    )
}

export default ComidaSection;