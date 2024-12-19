 "use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AiFillHome, AiOutlineUser, AiOutlineFolderOpen, AiOutlinePlusCircle, AiOutlineEdit, AiOutlineDelete, AiOutlineLogout } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { IconType } from 'react-icons';
import Logo from '@/app/paciente/components/logo';
import { FaListAlt } from "react-icons/fa";
import { LiaListAlt } from "react-icons/lia";
import { MdAssignmentAdd } from 'react-icons/md';
import { SiTestcafe } from "react-icons/si";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { ImHome2 } from "react-icons/im";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoCalendarNumberSharp } from "react-icons/io5";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  href: string;
  expanded: boolean;
  subItems?: { icon: IconType; label: string; href: string }[];
  activeSubmenu: string | null;
  setActiveSubmenu: (label: string | null) => void;
}

interface SidebarProps {
  initialExpanded?: boolean;
  initialWidth?: string;
  expandedWidth?: string;
  onExpand?: (expanded: boolean) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  expanded, 
  subItems, 
  activeSubmenu,
  setActiveSubmenu 
}) => {
  const isOpen = activeSubmenu === label;

  const handleClick = (e: React.MouseEvent) => {
    if (subItems) {
      e.preventDefault();
      setActiveSubmenu(isOpen ? null : label);
    }
  };

  return (
    <div className="w-full">
      <Link
        href={href}
        className={`flex items-center gap-4 p-3 w-full text-white hover:bg-gray-700 rounded-lg transition-all duration-300 ${
          expanded ? "justify-start" : "justify-center"
        }`}
        onClick={handleClick}
      >
        <Icon size={24} />
        {expanded && <span className="text-lg">{label}</span>}
      </Link>
      {expanded && subItems && isOpen && (
        <div className="ml-8 mt-2 space-y-2">
          {subItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-4 p-2 w-full text-white hover:bg-gray-700 rounded-lg transition-all duration-300"
              onClick={() => setActiveSubmenu(null)}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ 
  initialExpanded = false,
  initialWidth = 'w-16',
  expandedWidth = 'w-64',
  onExpand
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [isHovering, setIsHovering] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isHovering) {
        setExpanded(true);
      } else {
        setExpanded(false);
        setActiveSubmenu(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isHovering]);

  useEffect(() => {
    if (onExpand) {
      onExpand(expanded);
    }
  }, [expanded, onExpand]);

  const patientSubItems = [
    {icon: LiaListAlt, label: "Dashboard ", href: "/paciente/" },

    { icon: AiOutlinePlusCircle, label: "Agregar Paciente", href: "/paciente/add" },
    { icon: AiOutlineEdit, label: "Editar Paciente", href: "/paciente/edit" },
    { icon: AiOutlineDelete, label: "Eliminar Paciente", href: "/paciente/delete" },
  ];


  const diagnosticoSubItems = [
    {icon: LiaListAlt, label: "Dashboard ", href: "/diagnostico-clinico/" },
    { icon: AiOutlinePlusCircle, label: "Agregar Diagnostico", href: "/diagnostico-clinico/add" },
    { icon: AiOutlineEdit, label: "Editar Diagnostico", href: "/diagnostico-clinico/edit" },
    { icon: AiOutlineDelete, label: "Eliminar Diagnostico", href: "/diagnostico-clinico/delete" },
  ];


  const planesnutricionalesSubItems = [
    {icon: LiaListAlt, label: "Dashboard ", href: "/planes-nutricionales" },
    { icon: AiOutlinePlusCircle, label: "Asignar Plan", href: "/planes-nutricionales/add" },
    { icon: AiOutlineEdit, label: "Modificar Plan", href: "/planes-nutricionales/edit" },
    { icon: AiOutlineDelete, label: "Eliminar Plan", href: "/planes-nutricionales/delete" },
  ];


  const evaluacionesNutricionalesItems = [
    {icon: LiaListAlt, label: "Dashboard ", href: "/evaluaciones-nutricionales" },
    { icon: AiOutlinePlusCircle, label: "Realizar Evaluacion", href: "/evaluaciones-nutricionales/add" },
    { icon: AiOutlineEdit, label: "Modificar Evaluacion", href: "/evaluaciones-nutricionales/edit" },
    { icon: AiOutlineDelete, label: "Eliminar Evaluacion", href: "/evaluaciones-nutricionales/delete" },
  ];


  const historialclinicoSubItems = [
    {icon: LiaListAlt, label: "Dashboard ", href: "/historial-clinico/" },
    { icon: AiOutlinePlusCircle, label: "Agregar Historial Clinico", href: "/historial-clinico/add" },
    { icon: AiOutlineEdit, label: "Editar Historial Clinico", href: "/historial-clinico/edit" },
    { icon: AiOutlineDelete, label: "Eliminar Historial Clinico", href: "/historial-clinico/delete" },
  ];

  const ContabilidadSubItems = [
    {icon: LiaListAlt, label: "Dashboard ", href: "/contabilidad-finanzas-facturacion/" },
    { icon: AiOutlinePlusCircle, label: "Registrar Pago", href: "/contabilidad-finanzas-facturacion/pago" },
    { icon: AiOutlineEdit, label: "Conversion de Citas", href: "/contabilidad-finanzas-facturacion/conversion-citas" },
  //  { icon: AiOutlineDelete, label: "Eliminar Historial Clinico", href: "/historial-clinico/delete" },
  ];



  const handleLogout = async () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token'); // Cambia 'token' por la clave que estés usando para almacenar el token

    // Cerrar sesión usando next-auth
    await signOut({ redirect: false });

    // Redirigir al usuario a la página de login
    router.push('/login');
};

  const handlegoHome = async () => {
   
    // Aquí puedes agregar cualquier lógica adicional para eliminar el token si es necesario
    router.push('/dashboard'); // Redirige al usuario a la página de login
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#25aa80] text-white flex flex-col items-center py-8 transition-all duration-300 ${
        expanded ? expandedWidth : initialWidth
      } z-40 rounded-r-3xl overflow-hidden`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mb-1 ml-1">
        <Logo expanded={false} />
      </div>

      <div
        className={`w-full h-1 bg-white mb-2 transition-all duration-300 ${
          expanded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <nav className="flex flex-col w-full gap-2 flex-grow overflow-y-auto">
        
        <SidebarItem 
          icon={AiOutlineUser} 
          label="Perfil" 
          href="/profile" 
          expanded={expanded}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        />
        <SidebarItem 
          icon={AiOutlineFolderOpen} 
          label="Pacientes" 
          href="/paciente" 
          expanded={expanded}
          subItems={patientSubItems}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        />
        <SidebarItem 
          icon={FaListAlt} 
          label="Diagnosticos" 
          href="/diagnostico-clinico" 
          expanded={expanded}
          subItems={diagnosticoSubItems}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        />
 
        <SidebarItem
        icon={MdAssignmentAdd}
         label="Planes Nutricionales" 
         href="/planes-nutricionales" 
         expanded={expanded}
         subItems={planesnutricionalesSubItems}
         activeSubmenu={activeSubmenu}
         setActiveSubmenu={setActiveSubmenu}
        
        
        />

        <SidebarItem 
          icon={SiTestcafe} 
          label="Evaluaciones Nutricionales" 
          href="/evaluaciones-nutricionales" 
          expanded={expanded}
          subItems={evaluacionesNutricionalesItems}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          />

        <SidebarItem
          icon={BsFileEarmarkMedicalFill}
          label="Historial Clinico"
          href="/historial-clinico"
          expanded={expanded}
          subItems={historialclinicoSubItems}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          />

        <SidebarItem
          icon={FaMoneyBillTrendUp}
          label="Contabilidad y Facturacion"
          href="/contabilidad-finanzas-facturacion"
          expanded={expanded}
          subItems={ContabilidadSubItems}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          />

        <SidebarItem
          icon={IoCalendarNumberSharp}
          label="Gestion de Citas"
          href="/calendario"
          expanded={expanded}
         // subItems={ContabilidadSubItems}
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
          />

      </nav>

      <div
          className={`flex items-center gap-4 p-3 w-full hover:bg-gray-700 rounded-lg transition-all duration-300 cursor-pointer ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
          onClick={handlegoHome}
        >
       <ImHome2 size={24}/>
          {expanded && <span className="text-lg">Ir a Inicio</span>}
        </div>


      <div className="mt-auto flex flex-col items-start w-full">
        <div
          className={`flex items-center gap-4 p-3 w-full hover:bg-gray-700 rounded-lg transition-all duration-300 ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
          onClick={() => router.push('/ajustes')}
        >
          <FiSettings size={24} />
          {expanded && <span className="text-lg">Ajustes</span>}
        </div>
        <div
          className={`flex items-center gap-4 p-3 w-full hover:bg-gray-700 rounded-lg transition-all duration-300 cursor-pointer ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
          onClick={handleLogout}
        >
          <AiOutlineLogout size={24} />
          {expanded && <span className="text-lg">Cerrar sesión</span>}
        </div>


        


      </div>
    </div>
  );
};

export default Sidebar;