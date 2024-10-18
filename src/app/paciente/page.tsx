// pages/index.tsx
'use client';

import HeaderUser from "../../app/paciente/components/headeruser";
import Sidebar from "../../app/paciente/components/sidebar";
import PatientList from "../../app/paciente/components/pacienteList";
import ActionButton from "../../app/paciente/components/ActionButton";
import FilterInput from "../../app/paciente/components/FilterButon";
import { useState } from "react";

const PacienteDashboard: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="w-screen h-screen relative bg-white border border-black">
            <Sidebar expanded={isExpanded} />
            <HeaderUser />
            <div className="absolute top-20 left-40">
                <h1 className="text-3xl text-black font-semibold mb-4">Consulta general de pacientes</h1>

                {/* Espacio para los botones debajo de las líneas verdes */}
                <div className="mt-16"> {/* Aumenta el margen superior para bajar los botones */}
                    <div className="flex gap-4 mb-4">
                        <ActionButton label="Agregar" />
                        <ActionButton label="Actualizar" />
                         
                    </div>
                    <FilterInput/>
                </div>

                <PatientList />
            </div>
        </div>
    );
};

export default PacienteDashboard;
