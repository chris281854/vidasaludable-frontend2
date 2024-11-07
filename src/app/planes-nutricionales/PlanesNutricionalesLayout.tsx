import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';

interface PlanesNutricionalesLayoutProps {
  children: React.ReactNode;
}

const PlanesNutricionalesLayout: React.FC<PlanesNutricionalesLayoutProps> = ({ children }) => {
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

export default PlanesNutricionalesLayout;