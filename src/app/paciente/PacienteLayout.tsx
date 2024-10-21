import React, { useState } from 'react';
import Sidebar from '../paciente/components/sidebar';

interface PacienteLayoutProps {
  children: React.ReactNode;
}

const PacienteLayout: React.FC<PacienteLayoutProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex">
      <Sidebar 
        initialExpanded={isExpanded}
        initialWidth="w-16"
        expandedWidth="w-50"
        onExpand={(expanded) => setIsExpanded(expanded)}
      />
      <main className="flex-1 bg-gray-100 min-h-screen ml-16"> {/* Margen izquierdo fijo */}
        {children}
      </main>
    </div>
  );
};

export default PacienteLayout;