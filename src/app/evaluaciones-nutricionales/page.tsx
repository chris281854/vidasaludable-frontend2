'use client'

import React, { useCallback, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
} from '@mui/material';
import HeaderUser from '@/components/headeruser';
import EvaluacionesList from './components/EvaluacionesList';
import EvaluacionesNutricionalesLayout from './EvaluacionesNutricionalesLayout';
import RecentEvaluations from './components/RecentEvaluations';
import FilterInput from '@/components/FilterButon';

const EvaluacionesNutricionales = () => {
    const [filterText, setFilterText] = useState('');

    const handleFilterChange = useCallback((value: string) => {
        setFilterText(value);
    }, []);

    const handleFilterSubmit = useCallback(() => {
        console.log("Filtro aplicado:", filterText);
    }, [filterText]);

    return (
        <EvaluacionesNutricionalesLayout>
            <Box sx={{ p: 4 }}>
                <HeaderUser title='Gestion de Evaluaciones de Nutricion ~ Dashboard' />

                <div className="p-8 pl-24 mt-48">
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
                            
                            <EvaluacionesList filterText={filterText} />
                        </Paper>
                    </Box>
                    <Box sx={{ flex: { xs: '1', lg: '1' } }}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Últimas Evaluaciones realizadas
                            </Typography>
                            <RecentEvaluations />
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </EvaluacionesNutricionalesLayout>
    );
};

export default EvaluacionesNutricionales;