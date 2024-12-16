// src/components/FiltroTransacciones.tsx

import React from 'react';

const FiltroTransacciones: React.FC = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold">Filtrar Transacciones</h2>
            <input
                type="text"
                placeholder="Buscar por ID o monto"
                className="border p-2 rounded w-full"
            />
        </div>
    );
};

export default FiltroTransacciones;