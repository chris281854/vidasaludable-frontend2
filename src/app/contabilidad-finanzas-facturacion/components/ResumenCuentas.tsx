// src/components/ResumenCuentas.tsx

import React from 'react';

const ResumenCuentas: React.FC = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold">Resumen de Cuentas</h2>
            <div className="flex justify-between">
                <div>
                    <h3 className="font-bold">Cuentas por Cobrar</h3>
                    <p>$10,000</p>
                </div>
                <div>
                    <h3 className="font-bold">Cuentas por Pagar</h3>
                    <p>$5,000</p>
                </div>
            </div>
        </div>
    );
};

export default ResumenCuentas;