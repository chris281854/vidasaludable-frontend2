import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  // Otras props que pueda necesitar
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#25aa80] text-white px-4 py-2 rounded-full hover:bg-[#1e8f6e]"
    >
      {label}
    </button>
  );
};

export default ActionButton;