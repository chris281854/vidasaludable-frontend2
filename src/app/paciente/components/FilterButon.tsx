import React from 'react';
import ActionButton from './ActionButton';

interface FilterInputProps {
  filterText: string;
  onFilterChange: (value: string) => void;
  onFilterSubmit: () => void;
}

const FilterInput: React.FC<FilterInputProps> = ({ filterText, onFilterChange, onFilterSubmit }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onFilterSubmit();
    }
  };

  return (
    <div className="flex gap-2 mt-4"> 
      <input
        type="text"
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Buscar por nombre, RUP, motivo..."
        className="border border-[#25aa80] rounded-full px-4 py-2 w-96 text-[#25aa80] placeholder-[#25aa80] focus:outline-none focus:ring-2 focus:ring-[#25aa80]"
      />
      <ActionButton 
        label="Buscar"
        onClick={onFilterSubmit}
      //  className="bg-[#25aa80] text-white px-4 py-2 rounded-full hover:bg-[#1e8f6e] transition duration-300"
      />
    </div>
  );
};

export default FilterInput;