import React from 'react';

const PatientGoalTracker: React.FC = () => {
  const patients = [
    { name: "Ana García", goal: "Perder 5kg", progress: 60 },
    { name: "Carlos Ruiz", goal: "Ganar masa muscular", progress: 40 },
    { name: "Laura Martínez", goal: "Mejorar niveles de colesterol", progress: 75 },
  ];

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Seguimiento de Objetivos de Pacientes</h2>
      <div className="space-y-4">
        {patients.map((patient, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{patient.name}</span>
              <span className="text-sm text-gray-600">{patient.goal}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${patient.progress}%`}}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{patient.progress}% completado</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientGoalTracker;