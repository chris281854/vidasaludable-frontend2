import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const TablaTransacciones: React.FC = () => {
    const { data: session } = useSession(); // Obtén la sesión
    const [transacciones, setTransacciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        const fetchTransacciones = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contabilidad-finanzas`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${session?.user.token}`,
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
    }, [session]); // Se ejecuta una vez al montar el componente

    if (loading) {
        return <div>Cargando...</div>; // Mensaje de carga
    }

    if (error) {
        return <div>Error: {error}</div>; // Mensaje de error
    }

    // Filtrar las transacciones según el valor del input
    const filteredTransacciones = transacciones.filter(transaccion => {
        return (
            transaccion.tipo.toLowerCase().includes(filterValue.toLowerCase()) ||
            transaccion.descripcion.toLowerCase().includes(filterValue.toLowerCase())
        );
    });

    // Limitar a 5 registros
    const displayedTransacciones = filteredTransacciones.slice(0, 5);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl text-green-700 font-extrabold">Transacciones</h2>
            <input
                type="text"
                placeholder="Filtrar por tipo o descripción"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="text-black border p-2 rounded mb-4 w-full"
                style={{ borderRadius: '15px' }} // Input redondeado

            />
            {displayedTransacciones.length === 0 && filterValue ? (
                <div className="text-green-800 font-extrabold">No se encontraron transacciones que coincidan con el filtro.</div>
            ) : (
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="bg-green-700 text-xl font-extrabold text-white round">ID</th>
                            <th className="bg-green-700 text-xl font-extrabold text-white ">Tipo</th>
                            <th className="bg-green-700 text-xl font-extrabold text-white ">Monto</th>
                            <th className="bg-green-700 text-xl font-extrabold text-white ">Fecha</th>
                            <th className="bg-green-700 text-xl font-extrabold text-white ">Descripción</th>
                            <th className="bg-green-700 text-xl font-extrabold text-white ">Método de Pago</th>
                            <th className="bg-green-700 text-xl font-extrabold text-white ">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTransacciones.map((transaccion) => (
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
            )}
        </div>
    );
};

export default TablaTransacciones;