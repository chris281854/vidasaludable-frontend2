// pages/index.tsx
'use client';

import HeaderUser from "../../app/paciente/components/headeruser";
import Sidebar from "../../app/paciente/components/sidebar";
import PatientList from "../../app/paciente/components/pacienteList";
import ActionButton from "../../app/paciente/components/ActionButton";
import { useState } from "react";

 
const PacienteDashboard: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="w-screen h-screen relative bg-white border border-black">
           <Sidebar expanded={isExpanded} />
          <HeaderUser
            username="Nombre de usuario"
            role="Rol"
            dateTime="Fecha y hora local"
          />
          <div className="absolute top-20 left-40">
            <h1 className="text-3xl font-semibold mb-4">Consulta general de pacientes</h1>
            <div className="flex gap-4 mb-8">
              <ActionButton label="Agregar" />
              <ActionButton label="Filtrar" />
            </div>
            <PatientList />
          </div>
        </div>
      );
};

export default PacienteDashboard;
