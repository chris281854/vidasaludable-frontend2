// components/HeaderUser.tsx
import React from 'react';
import { useSession } from 'next-auth/react';

interface HeaderUserProps {
  title?: string; // Hacemos el título opcional
}

const HeaderUser: React.FC<HeaderUserProps> = ({ title }) => {
  const { data: session } = useSession();
  const username = session?.user.name || 'Invitado';
  const role = session?.user.role || 'Usuario';
  const email = session?.user.email || 'Usuario@mail.com';

  // Obtener la fecha y hora actuales
  const dateTime = new Date().toLocaleString();

  return (
    <div className="relative mb-20"> {/* Aumentado el margen inferior para acomodar el título */}
      <div className="absolute top-5 right-10 flex items-center gap-4">
        {/* Imagen de perfil con borde */}
        <div className="w-16 h-16 rounded-full border-4 border-green-500 overflow-hidden">
          <img
            src={session?.user.icon || '/c.png'}
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-black font-extrabold text-lg">Bienvenido:</span>
          <span className="text-sm text-black font-extrabold">Usuario:  {username}</span>
          <span className="text-sm text-black font-extrabold">Su rol:  {role}</span>
          <span className="text-sm text-black font-extrabold">{email}</span>
      {/* <span className="text-sm text-black font-extrabold">{dateTime}</span> */}
        {/* Título dinámico */}
         
        </div>
        
      </div>

      {title && (
        <h1 className=" ml-24 absolute top-24 left-0 text-3xl font-semibold text-[#27272e] mb-4">
          {title}
        </h1>
      )}
      
      
      {/* Líneas decorativas debajo de los datos del usuario */}
      <div className="absolute top-36 left-[-60px] right-0 w-[calc(100%+60px)]"> {/* Ajustado para dar espacio al título */}
        <div className="w-full  h-2 bg-[#25aa80] mb-2"></div>
        <div className="w-10/12 h-2 bg-[#25aa80] ml-auto mb-8"></div>
      </div>
    </div>
  );
};

export default HeaderUser;