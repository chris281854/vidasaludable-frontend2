import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';

interface HistorialClinicoLayoutProps {
  children: React.ReactNode;
}

const HistorialClinicoLayout: React.FC<HistorialClinicoLayoutProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex">
      <Sidebar 
        initialExpanded={isExpanded}
        initialWidth="w-14"
        expandedWidth="w-55"
        onExpand={(expanded) => setIsExpanded(expanded)}
      />
      <main className="flex-1 bg-gray-100 min-h-screen ml-16"> {/* Margen izquierdo fijo */}
        {children}
      </main>
    </div>
  );
};

export default HistorialClinicoLayout;