// components/HeaderUser.tsx
import React from 'react';
import { useSession } from 'next-auth/react';

const HeaderUser: React.FC = () => {
  const { data: session } = useSession();
  const username = session?.user.name || 'Invitado';
  const role = session?.user.role || 'Usuario';

  // Obtener la fecha y hora actuales
  const dateTime = new Date().toLocaleString();

  return (
    <div>
      <div className="absolute top-5 right-10 flex items-center gap-4"> {/* Alineación horizontal */}
        {/* Imagen de perfil con borde */}
        <div className="w-16 h-16 rounded-full border-4 border-green-500 overflow-hidden">
          <img
            src={session?.user.icon || '/c.png'} // Cambia esto a la ruta de tu imagen predeterminada
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-black font-extrabold text-lg">Bienvenido:</span>
          <span className="text-sm text-black font-extrabold">{username}</span>
          <span className="text-sm text-black font-extrabold">{role}</span>
          <span className="text-sm text-black font-extrabold">{dateTime}</span>
        </div>
      </div>
      
      {/* Líneas decorativas que atraviesan toda la pantalla */}
      <div className="flex flex-col w-full gap-1 mt-32"> {/* Ajuste de margen superior a mt-32 */}
        <div className="h-2 bg-[#25aa80] w-85 ml-24"></div> {/* Línea de arriba */}
        <div className="h-2 bg-[#25aa80] w-full ml-28"></div> {/* Línea de abajo */}
      </div>
    </div>
  );
};

export default HeaderUser;
