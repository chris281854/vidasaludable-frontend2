'use client';

import { useState, useCallback } from "react";
import HeaderUser from "../../components/headeruser";
import Sidebar from "../../components/sidebar";
import PatientList from "./components/pacienteList";
import RightBar from "./components/RightBar";
import { Button } from "@mui/material";
import FilterInput from "../../components/FilterButon";
import ProtectedRoute from "@/components/ProtectedRoute";

interface SidebarProps {
    initialExpanded?: boolean;
    initialWidth?: string;
    expandedWidth?: string;
    onExpand?: (expanded: boolean) => void;
}

const PacienteDashboard: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filterText, setFilterText] = useState('');

    const handleFilterChange = useCallback((value: string) => {
        setFilterText(value);
    }, []);

    const handleFilterSubmit = useCallback(() => {
        console.log("Filtro aplicado:", filterText);
    }, [filterText]);

    return (
        <ProtectedRoute>

        <div className="flex h-screen bg-white">
            <Sidebar 
                initialExpanded={isExpanded}
                initialWidth="w-16"
                expandedWidth="w-40"
                onExpand={setIsExpanded}
            />
            <div className="flex-grow overflow-hidden">
                <HeaderUser title="Consulta General de Paciente" />
                
                <div className="p-8 pl-24 mt-48"> {/* Aumentado el margen superior a mt-48 */}
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
                    
                    <div className="flex gap-8">
                        <div className="w-2/3 pr-4">
                            <PatientList filterText={filterText} />
                        </div>
                        <div className="w-1/4">
                            <div className="sticky top-24">
                                <h2 className="text-black text-2xl font-semibold font-['Inter'] mb-4">
                                    Últimos pacientes registrados
                                </h2>
                                <div className="top-24">
                                    <RightBar />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </ProtectedRoute>

    );
};

export default PacienteDashboard;