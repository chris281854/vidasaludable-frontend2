import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const TablaTransacciones: React.FC = () => {
    const { data: session } = useSession(); // Obtén la sesión
    const [transacciones, setTransacciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contabilidad-finanzas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${session?.user.token}`,
                        // Agrega aquí cualquier encabezado adicional que necesites, como autorización
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las transacciones');
                }

                const data = await response.json();
                setTransacciones(data);
            } catch (error) {
                console.error('Error fetching transacciones:', error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransacciones();
    }, []); // Se ejecuta una vez al montar el componente

    if (loading) {
        return <div>Cargando...</div>; // Mensaje de carga
    }

    if (error) {
        return <div>Error: {error}</div>; // Mensaje de error
    }

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
                        <th className="border px-4 py-2">Descripción</th>
                        <th className="border px-4 py-2">Método de Pago</th>
                        <th className="border px-4 py-2">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {transacciones.map((transaccion) => (
                        <tr key={transaccion.id}>
                            <td className="border px-4 py-2">{transaccion.id}</td>
                            <td className="border px-4 py-2">{transaccion.tipo}</td>
                            <td className="border px-4 py-2">${transaccion.monto.toLocaleString()}</td>
                            <td className="border px-4 py-2">{new Date(transaccion.fecha).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{transaccion.descripcion}</td>
                            <td className="border px-4 py-2">{transaccion.metodoPago}</td>
                            <td className="border px-4 py-2">{transaccion.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaTransacciones;