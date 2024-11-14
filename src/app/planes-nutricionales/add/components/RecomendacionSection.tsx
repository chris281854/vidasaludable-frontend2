import { Box } from "@mui/material";
import SectionDivider from "./SectionDivider";
import RecomendacionActividad from "../UI/RecomendacionActividad";
import ConsumoLiquidosSection from "../UI/RecomendacionLiquidos";
import AlimentosEvitarSection from "../UI/AlimentosEvitar";
import OtrasRecomendaciones from "../UI/OtrasRecomendaciones";

const RecomendacionesSection = () => {
 
 
    return (
    <div>
            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Actividad Fisica Recomendada'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <RecomendacionActividad index={0}/>
            </Box>

            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Consumo de Liquidos Recomendados'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <ConsumoLiquidosSection index={0}/>
            </Box>

            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Alimentos a Evitar'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <AlimentosEvitarSection index={0}/>
            </Box>

            <Box className="w-full max-w-[1430px] p-5 rounded-lg">
                <SectionDivider top={0} text={'Otras recomendaciones'} />
            </Box>

            <Box className="flex items-center mb-2">
                    <OtrasRecomendaciones index={0}/>
            </Box>
    </div>
  );
}

export default RecomendacionesSection;