// components/Logo.tsx
import React from 'react';

interface LogoProps {
  expanded: boolean;
}

const Logo: React.FC<LogoProps> = ({ expanded }) => {
  return (
    <div
      className={`transition-all duration-300 ${
        expanded ? 'w-16 h-16' : 'w-10 h-10'
      }`}
    >
      <img
        src="/logo.png"
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
