"use client"; // Necesario para usar hooks como useState
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AiFillHome, AiOutlineUser, AiOutlineFolderOpen } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { IconType } from 'react-icons';
import IconLogo from '@/components/logo';

interface SidebarItemProps {
  icon: IconType;
  label: string;
  href: string;
  expanded: boolean;
}

interface SidebarProps {
  expanded: boolean; // Propiedad que indica si el sidebar está expandido
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, expanded }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 p-3 w-full text-white hover:bg-gray-700 rounded-lg transition-all duration-300 ${
      expanded ? "justify-start" : "justify-center"
    }`}
  >
    <Icon size={24} />
    {/* Mostrar el texto solo si el sidebar está expandido */}
    {expanded && <span className="text-lg">{label}</span>}
  </Link>
);

const Sidebar: React.FC<SidebarProps> = ({ expanded: initialExpanded }) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#25aa80] text-white flex flex-col items-center py-8 gap-4 transition-transform duration-300 ${
        expanded ? 'translate-x-0 w-48' : 'translate-x-[-1px] w-16' // Cambia esto para ajustar el tamaño
      } z-40 rounded-r-3xl`}
      onMouseEnter={() => setExpanded(true)} // Expande al pasar el mouse
      onMouseLeave={() => setExpanded(false)} // Contrae al salir el mouse
    >
      {/* Logo */}
      <div className="mb-1 ml-1">
        <IconLogo />
      </div>
      
      {/* Línea decorativa más gruesa y pegada al logo */}
      <div className={`w-full h-1 bg-white mb-2 transition-all duration-300 ${expanded ? "opacity-100" : "opacity-0"}`} />

      <nav className="flex flex-col w-full gap-2 flex-grow"> {/* Permite que el nav ocupe el espacio restante */}
        <SidebarItem icon={AiFillHome} label="Inicio" href="/" expanded={expanded} />
        <SidebarItem icon={AiOutlineUser} label="Perfil" href="/profile" expanded={expanded} />
        <SidebarItem icon={AiOutlineFolderOpen} label="Pacientes" href="/patients" expanded={expanded} />
      </nav>
      
      {/* Icono de Ajustes en la parte inferior */}
      <div className={`mt-auto flex flex-col items-center gap-4 p-3 w-full text-white rounded-lg transition-all duration-300 ${expanded ? "justify-start" : "justify-center"}`}>
        <div className={`flex items-center gap-4 ${expanded ? "justify-start" : "justify-center"}`}>
          <FiSettings size={24} />
          {expanded && <span className="text-lg">Ajustes</span>}
        </div>
        {expanded && (
          <span className="text-sm font-bold text-white"> {currentTime} </span> // Mostrar la fecha y hora en negrita
        )}
      </div>
    </div>
  );
};

export default Sidebar;
