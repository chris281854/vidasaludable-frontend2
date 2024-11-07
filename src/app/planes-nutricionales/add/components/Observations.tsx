import React from 'react';

const Observations: React.FC = () => {
  return (
    <div className="mt-4">
      <div className="text-black text-xl font-bold">Observaciones del paciente</div>
      <div className="w-[479px] h-[37px] bg-[#d9d9d9] mt-2"></div>
      <div className="text-black text-xl font-normal">Niveles de ansiedad</div>
      <div className="w-[586px] h-[37px] bg-[#d9d9d9] mt-2"></div>
      <div className="text-black text-xl font-normal">Otras informaciones</div>
    </div>
  );
};

export default Observations;