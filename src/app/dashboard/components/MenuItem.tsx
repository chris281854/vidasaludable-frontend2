import React from 'react';
import Link from 'next/link';

interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, icon, label }) => (
  <div className="w-full md:w-1/2 lg:w-1/3 p-4">
    <Link href={href} className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[#25aa80] rounded-full flex items-center justify-center mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{label}</h3>
      </div>
      <p className="text-gray-600">Accede a la sección de {label.toLowerCase()} para gestionar la información nutricional.</p>
    </Link>
  </div>
);

export default MenuItem;