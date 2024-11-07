import React from 'react';

interface ButtonCardProps {
  title: string;
  description: string;
  icon: React.ReactNode; // Propiedad para el ícono
  onClick: () => void;
  isActive: boolean; // Propiedad para determinar si el botón está activo
}

const ButtonCard: React.FC<ButtonCardProps> = ({ title, description, icon, onClick, isActive }) => {
  return (
    <div
      className={`w-[209px] h-36 rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition duration-300 
        ${isActive ? 'bg-[#c7f0c2]' : 'bg-[#d9d9d9]'} hover:bg-[#c7f0c2`}
      onClick={onClick}
    >
      <div className="text-center text-black text-2xl">{icon}</div> {/* Ícono en el centro */}
      <div className="text-center text-black text-lg font-bold">{title}</div> {/* Título en negrita */}
      <div className="text-center text-black text-sm">{description}</div> {/* Descripción más pequeña */}
    </div>
  );
};

export default ButtonCard;