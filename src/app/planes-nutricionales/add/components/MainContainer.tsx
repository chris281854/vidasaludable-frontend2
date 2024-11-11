import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import ButtonCard from './ButtonCard';
import InformacionesSection from '../UI/InformacionesSection';
import RecomendacionesSection from './RecomendacionSection';
import { FaInfoCircle, FaClipboardList, FaUtensils, FaClipboardCheck, FaFileExport } from 'react-icons/fa';
import PlanificationSection from '../UI/PlanificationSection';
import ComidaSection from './ComidaSection';
import ExportarSection from './ExportarSection';
import { useFormContext } from '../../context/FormContext'; // Asegúrate de que la ruta sea correcta

const MainContainer: React.FC = () => {
    const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<string>('informacion');

    const handleSectionChange = (section: string, index: number) => {
        setActiveSection(section);
        setActiveButtonIndex(index);
    };

    return (
        <div className="min-h-[946px] relative p-6">
            <div className="flex justify-around gap-4">
                <ButtonCard
                    title="1. Informaciones"
                    description="Recopilación de hábitos del paciente"
                    icon={<FaInfoCircle />}
                    onClick={() => handleSectionChange('informacion', 0)}
                    isActive={activeButtonIndex === 0}
                />
                <ButtonCard
                    title="2. Planificación"
                    description="Planeación de plan nutricional para paciente"
                    icon={<FaClipboardList />}
                    onClick={() => handleSectionChange('planificacion', 1)}
                    isActive={activeButtonIndex === 1}
                />
                <ButtonCard
                    title="3. Comidas"
                    description="Planes nutricionales para pacientes"
                    icon={<FaUtensils />}
                    onClick={() => handleSectionChange('comidas', 2)}
                    isActive={activeButtonIndex === 2}
                />
                <ButtonCard
                    title="4. Recomendaciones"
                    description="Especifica recomendaciones claves para el paciente"
                    icon={<FaClipboardCheck />}
                    onClick={() => handleSectionChange('recomendacion', 3)}
                    isActive={activeButtonIndex === 3}
                />
                <ButtonCard
                    title="5. Exportar"
                    description="Formatos para compartir con el paciente"
                    icon={<FaFileExport />}
                    onClick={() => handleSectionChange('exportar', 4)}
                    isActive={activeButtonIndex === 4}
                />
            </div>

            {activeSection === 'informacion' && <InformacionesSection />}
            {activeSection === 'planificacion' && <PlanificationSection />}
            {activeSection === 'comidas' && <ComidaSection />}
            {activeSection === 'recomendacion' && <RecomendacionesSection />}
            {activeSection === 'exportar' && <ExportarSection />}
        </div>
    );
};

export default MainContainer;