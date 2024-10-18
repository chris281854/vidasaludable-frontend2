// components/HeaderUser.tsx
import React from 'react';
import { useSession } from 'next-auth/react'; // Asegúrate de que este import sea correcto

const HeaderUser: React.FC = () => {
  const { data: session } = useSession(); // Obtén la sesión
  const username = session?.user.name || 'Invitado'; // Obtén el nombre del usuario
  const role = session?.user.role || 'Usuario'; // Ajusta según tu estructura de datos

  // Obtener la fecha y hora actuales
  const dateTime = new Date().toLocaleString(); // Formato por defecto, ajusta según tus necesidades

  return (
    <div className="absolute top-5 right-10 flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div className="flex flex-col">
        <span className="font-bold">Usuario</span>
        <span className="text-sm">{username}</span>
        <span className="text-sm">{role}</span>
        <span className="text-sm">{dateTime}</span>
      </div>
    </div>
  );
};

export default HeaderUser;
