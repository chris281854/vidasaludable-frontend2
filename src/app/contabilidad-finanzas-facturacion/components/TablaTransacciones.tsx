// src/components/TablaTransacciones.tsx

import React from 'react';

const TablaTransacciones: React.FC = () => {
    const transacciones = [
        { id: 1, tipo: 'Cobro', monto: 1000, fecha: '2023-01-01' },
        { id: 2, tipo: 'Pago', monto: 500, fecha: '2023-01-02' },
        // Agrega más transacciones aquí
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold">Transacciones</h2>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Tipo</th>
                        <th className="border px-4 py-2">Monto</th>
                        <th className="border px-4 py-2">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {transacciones.map((transaccion) => (
                        <tr key={transaccion.id}>
                            <td className="border px-4 py-2">{transaccion.id}</td>
                            <td className="border px-4 py-2">{transaccion.tipo}</td>
                            <td className="border px-4 py-2">${transaccion.monto}</td>
                            <td className="border px-4 py-2">{transaccion.fecha}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaTransacciones;