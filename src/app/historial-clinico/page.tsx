'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import HistorialClinicoLayout from "./historialClinicoLayout";
import HeaderUser from "@/components/headeruser";
import { Box, Button, Paper, Typography } from "@mui/material";
import FilterInput from "@/components/FilterButon";
import { useState, useCallback } from "react";
import HistorialList from "../historial-clinico/components/HistorialList";
import RecentHistorial from "../historial-clinico/components/RecentHistorial";

const HistorialClinicoDashboard = () => {
    
    
    const [filterText, setFilterText] = useState('');

    const handleFilterChange = useCallback((value: string) => {
        setFilterText(value);
    }, []);

    const handleFilterSubmit = useCallback(() => {
        console.log("Filtro aplicado:", filterText);
    }, [filterText]);
    

    return (
      <ProtectedRoute>
      <HistorialClinicoLayout>
          <Box sx={{ p: 4 }}>
                <HeaderUser title='Administracion de Historiales Clinicos ~ Dashboard' />
            </Box>
        
           
            <div className="p-8 pl-24 mt-40">
                    <div className="flex flex-col gap-8 mb-8">
                        <div className="flex gap-4"> {/* Aumentado el gap entre los botones */}
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

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                    <Box sx={{ flex: { xs: '1', lg: '2' } }}>
                    
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            
                            <HistorialList filterText={filterText} />
                        </Paper>
                    </Box>
                    <Box className="mr-5" sx={{ flex: { xs: '1', lg: '1' } }}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Typography className="text-black-800 align-middle font-extrabold " variant="h6" gutterBottom>
                                Últimos Historiales Clinicos realizados
                            </Typography>
                            <RecentHistorial />
                        </Paper>
                    </Box>
                </Box>
           
       </HistorialClinicoLayout>     
      </ProtectedRoute>
    
    );
    }

    export default HistorialClinicoDashboard;