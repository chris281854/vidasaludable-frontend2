import React from 'react';

interface DetailPaciente {
  objetivo: string; // Objetivo
  motivo: string; // Motivo
}

interface Patient {
  rup: string;
  nombre: string;
  apellido: string;
  sexo: string;
  ciudad: string;
  nacimiento: string;
  registro: string;
  objetivo: string;
  motivo: string;
}

interface PatientTableProps {
  patients: Patient[];
}

const PatientTable: React.FC<PatientTableProps> = ({ patients }) => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {patients.length === 0 ? (
        <div className="text-center text-gray-500">No se encontraron pacientes.</div>
      ) : (
        <table className="min-w-full bg-gray-100 text-gray-800 border border-gray-300">
          <thead className='text-slate-100'>
            <tr className="text-center bg-[#25aa80] ">
              <th className="py-4 px-4 border-b border-gray-300">RUP</th>
              <th className="py-4 px-4 border-b border-gray-300">Nombre</th>
              <th className="py-4 px-4 border-b border-gray-300">Apellido</th>
              <th className="py-4 px-4 border-b border-gray-300">Sexo</th>
              <th className="py-4 px-4 border-b border-gray-300">Ciudad</th>
              <th className="py-4 px-4 border-b border-gray-300">Edad</th>
              <th className="py-4 px-4 border-b border-gray-300">Motivo de Consulta</th>
              <th className="py-4 px-4 border-b border-gray-300">Objetivos</th>
              <th className="py-4 px-4 border-b border-gray-300">Fecha de Registro</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.rup} className="hover:bg-gray-200 text-center transition duration-200">
                <td className="py-4 px-4 border-b border-gray-300">{patient.rup}</td>
                <td className="py-4 px-4 border-b border-gray-300">{patient.nombre}</td>
                <td className="py-4 px-4 border-b border-gray-300">{patient.apellido}</td>
                <td className="py-4 px-4 border-b border-gray-300">{patient.sexo}</td>
                <td className="py-4 px-4 border-b border-gray-300">{patient.ciudad}</td>
                <td className="py-4 px-4 border-b border-gray-300">{currentYear - new Date(patient.nacimiento).getFullYear()}</td>
                <td className="py-4 px-4 border-b border-gray-300">{patient.motivo}</td>
                <td className="py-4 px-4 border-b border-gray-300">{patient.objetivo}</td>
                <td className="py-4 px-4 border-b border-gray-300">{patient.registro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default PatientTable;
