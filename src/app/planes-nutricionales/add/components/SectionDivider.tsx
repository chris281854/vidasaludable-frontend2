// src/components/SectionDivider.tsx
import React from 'react';

interface SectionDividerProps {
    top: number;
    text: string; // Nueva propiedad para el texto
}

const SectionDivider: React.FC<SectionDividerProps> = ({ top, text }) => {
    return (
        <div className={`w-[858px] h-[33px] left-[24px] top-[${top}px] absolute bg-black rounded-[30px] flex items-center justify-center`}>
            <span className="text-white">{text}</span> {/* Renderiza el texto en blanco */}
        </div>
    );
};

export default SectionDivider;