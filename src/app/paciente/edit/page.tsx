'use client'

import React from 'react';
import Sidebar from '../components/sidebar';
import HeaderUser from '../components/headeruser';
import RightBar from '../components/RightBar';
import EditPatientForm from '../edit/components/EditPatientForm';

const EditPatientPage: React.FC = () => {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden pl-24">
          <HeaderUser title="Gestion de Pacientes - Edicion"/>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-12 py-6">
              <h1 className="text-[#27272e] text-3xl font-semibold font-['Inter']"></h1>
              <div className="h-0.5 bg-[#d9d9d9] mt-4"></div>
            </div>
            <div className="flex-1 flex overflow-hidden px-12 pt-8"> {/* Añadido pt-8 aquí */}
              <main className="w-2/3 overflow-y-auto pr-8">
                <div className="bg-white p-6 rounded-lg shadow-md"> {/* Nuevo contenedor para el formulario */}
                  <EditPatientForm />
                </div>
              </main>
              <div className="w-1/2 pl-6">
                <div className="bg-white p-7 rounded-lg shadow-md"> {/* Nuevo contenedor para el RightBar */}
                  <RightBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditPatientPage;