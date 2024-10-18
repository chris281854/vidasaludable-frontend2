// components/FilterInput.tsx
import React, { useState } from 'react';
import ActionButton from './ActionButton'; // Asegúrate de importar ActionButton

const FilterInput = () => {
  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleFilterSubmit = () => {
    // Aquí puedes manejar la lógica de filtrado
    console.log("Filtrar por:", filterText);
  };

  return (
    <div className="flex gap-2 mt-4"> 
      <input
        type="text"
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Ingrese un dato para filtrar..."
        className="border border-gray-300 rounded-full px-4 py-2 w-96" // Usa un ancho válido
      />
      <ActionButton label="Filtrar" /> {/* Usar ActionButton aquí */}
    </div>
  );
};

export default FilterInput;
