'use client';

import { useState, useCallback } from "react";
import HeaderUser from "../../components/headeruser";
import Sidebar from "../../components/sidebar";
import DiagnosticList from "./components/DiagnosticList";
import RightBar from "./components/RightBar";
import { Button } from "@mui/material";
import FilterInput from "../../components/FilterButon";
import DiagnosticoClinicoLayout from "./DiagnosticoClinicoLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

  

const DiagnosticoClinicoDashboard: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filterText, setFilterText] = useState('');

    const handleFilterChange = useCallback((value: string) => {
        console.log('Valor del filtro:', value);
        setFilterText(value);
    }, []);

    const handleFilterSubmit = useCallback(() => {
        console.log("Filtro aplicado:", filterText);
    }, [filterText]);

    return (
        <ProtectedRoute>
            <DiagnosticoClinicoLayout>
        <div className="flex h-screen bg-white">
             
            <div className="flex-grow flex flex-col h-screen overflow-hidden">
                <HeaderUser title="Diagnósticos Clínicos ~ Dashboard" />
                
                <div className="flex-1 p-8 pl-24 mt-48 overflow-y-auto">
                    <div className="flex flex-col gap-8 mb-10">
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
                    
                    <div className="flex gap-8">
                        <div className="w-2/3 pr-4">
                            <DiagnosticList filterText={filterText} />
                        </div>
                        <div className="w-1/4">
                            <div className="sticky top-24 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <h2 className="text-black text-2xl font-semibold font-['Inter'] mb-4">
                                    Últimos diagnósticos registrados
                                </h2>
                                <div className="overflow-y-auto">
                                    <RightBar />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        </DiagnosticoClinicoLayout>
        </ProtectedRoute>
    );
};

export default DiagnosticoClinicoDashboard;