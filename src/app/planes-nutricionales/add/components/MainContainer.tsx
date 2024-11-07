import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import ButtonCard from './ButtonCard';
import InformacionesSection from '../../add/components/InformacionesSection'
 
import Observations from './Observations';
import { FaInfoCircle, FaClipboardList, FaUtensils, FaClipboardCheck, FaFileExport } from 'react-icons/fa';

const MainContainer: React.FC = () => {
    const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null); // Estado para el índice del botón activo
    const [activeSection, setActiveSection] = useState<string>('informacion');
  
    const handleSectionChange = (section: string, index: number) => {
      setActiveSection(section);
      setActiveButtonIndex(index); // Cambia el índice del botón activo
    };
  
  
    return (
      <div className="h-[946px] relative p-6">
        {/* <SectionHeader title="Planes nutricionales" /> */}
        <div className="flex justify-around gap-4">
          <ButtonCard
            title="1. Informaciones"
            description="Recopilación de hábitos del paciente"
            icon={<FaInfoCircle />}
            onClick={() => handleSectionChange('informacion', 0)}
            isActive={activeButtonIndex === 0} // Verifica si este botón es el activo
          />
          <ButtonCard
            title="2. Planificación"
            description="Planificación del plan nutricional para el paciente"
            icon={<FaClipboardList />}
            onClick={() => handleSectionChange('planificacion', 1)}
            isActive={activeButtonIndex === 1} // Verifica si este botón es el activo
          />
          <ButtonCard
            title="3. Comidas"
            description="Asignación de comidas en el plan nutricional"
            icon={<FaUtensils />}
            onClick={() => handleSectionChange('comidas', 2)}
            isActive={activeButtonIndex === 2} // Verifica si este botón es el activo
          />
          <ButtonCard
            title="4. Recomendaciones"
            description="Especifica recomendaciones claves para el paciente"
            icon={<FaClipboardCheck />}
            onClick={() => handleSectionChange('recomendacion', 3)}
            isActive={activeButtonIndex === 3} // Verifica si este botón es el activo
          />
          <ButtonCard
            title="5. Exportar"
            description="Formatos de plan nutricional para compartir con el paciente"
            icon={<FaFileExport />}
            onClick={() => handleSectionChange('exportar', 4)}
            isActive={activeButtonIndex === 4} // Verifica si este botón es el activo
          />
        </div>

        {activeSection === 'informacion' && <InformacionesSection/>}
       {activeSection === 'planificacion' && <div>Contenido de Planificación</div>}
      {activeSection === 'comidas' && <div>Contenido de Comidas</div>}
      {activeSection === 'recomendacion' && <div>Contenido de Recomendación</div>}
      {activeSection === 'consultar' && <div>Contenido de Consultar</div>}

    
    </div>
  );
};

export default MainContainer;