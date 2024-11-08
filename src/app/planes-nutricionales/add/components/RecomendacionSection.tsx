import { Box } from "@mui/material";
import SectionDivider from "./SectionDivider";
import RecomendacionActividad from "./RecomendacionActividad";
import ConsumoLiquidosSection from "./RecomendacionLiquidos";
import AlimentosEvitarSection from "./AlimentosEvitar";
import OtrasRecomendaciones from "./OtrasRecomendaciones";

const RecomendacionesSection = () => {
 
 
    return (
    <div>
            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Actividad Fisica Recomendada'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <RecomendacionActividad/>
            </Box>

            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Consumo de Liquidos Recomendados'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <ConsumoLiquidosSection/>
            </Box>

            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Alimentos a Evitar'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <AlimentosEvitarSection/>
            </Box>

            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Otras recomendaciones'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <OtrasRecomendaciones/>
            </Box>
    </div>
  );
}

export default RecomendacionesSection;