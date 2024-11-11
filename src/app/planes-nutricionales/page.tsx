'use client'

import HeaderUser from "@/components/headeruser";
import PlanesNutricionalesLayout from "./PlanesNutricionalesLayout";
import { Box, Button } from "@mui/material";
import FilterInput from "@/components/FilterButon";
import { useState, useCallback } from "react";
import RightBar from "./components/RightBar";
import PlanesNutricionalesList from "./components/PlanesNutricionalesList";
import { FormProvider } from "./context/FormContext";

const PlanesNutricionales = () => {

    const [filterText, setFilterText] = useState<string>('');

   const handleFilterChange = useCallback((value: string) => {
       setFilterText(value);
   }, []);

   const handleFilterSubmit = useCallback(() => {
       console.log("Filtro aplicado:", filterText);
       // Aquí podrías aplicar el filtrado si es necesario
   }, [filterText]);

return (
    <FormProvider>
    <PlanesNutricionalesLayout>
        
        <Box sx={{ p: 4 }}>
          <HeaderUser title='Planes Nutricionales ~ Dashboard' />
          
          {/* Espacio adicional después del HeaderUser */}
          <Box sx={{ height: '8rem' }} />


          <div className="p-8 pl-24 mt-38"> {/* Aumentado el margen superior a mt-48 */}
                    <div className="flex flex-col gap-8 mb-10"> {/* Aumentado el gap y el margen inferior */}
                        <div className="flex gap-4">
                            <Button variant="contained" style={{ backgroundColor: '#25aa80' }}>
                                Agregar
                            </Button>
                            <Button variant="contained" style={{ backgroundColor: '#25aa80' }}>
                                Actualizar
                            </Button>
                        </div>
                        
                        <FilterInput
                            filterText={filterText}
                            onFilterChange={handleFilterChange}
                            onFilterSubmit={handleFilterSubmit}
                        />
                    </div>
                    </div>
                         
                    <div className="flex gap-8">
                        <div className="w-2/3 pr-4">
                            <PlanesNutricionalesList filterText={filterText} />
                        </div>
                    <div className="w-1/4">
                            <div className="sticky top-24">
                                <h2 className="text-black text-2xl font-semibold font-['Inter'] mb-4">
                                    Últimos Planes registrados
                                </h2>
                                <div className="top-24">
                                    <RightBar />
                                </div>
                            </div>
                        </div>
                        </div>

        </Box>
    </PlanesNutricionalesLayout>
    </FormProvider>
)

}

export default PlanesNutricionales;