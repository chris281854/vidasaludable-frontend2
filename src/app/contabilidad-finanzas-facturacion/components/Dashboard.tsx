import React, { useEffect, useState } from 'react';
import { AiOutlineDollar, AiOutlineCreditCard, AiOutlineBank } from 'react-icons/ai';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSession } from 'next-auth/react'; // Asegúrate de importar useSession

const Dashboard: React.FC = () => {
    const { data: session } = useSession(); // Obtén la sesión
    const [totales, setTotales] = useState({
        totalCuentasPorCobrar: 0,
        totalCuentasPorPagar: 10, // Valor estático de 10
        balanceTotal: 0,
    });
    const [error, setError] = useState<string | null>(null); // Estado para manejar errores

    useEffect(() => {
        const fetchTotales = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/facturacion/totales`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${session?.user.token}`,
                    },
                });

                if (!response.ok) {
                    // Captura el error de la respuesta
                    const errorData = await response.json();
                    console.error('Error response:', errorData); // Log para depuración

                    // Mostrar el error en la UI
                    if (response.status === 500) {
                        setError(`Error del servidor: ${errorData.message || 'Error interno en el servidor'}`);
                    } else {
                        setError(errorData.message || 'Error desconocido al obtener los totales');
                    }
                    return;
                }

                const data = await response.json();
                console.log(data); // Verifica la respuesta de la API

                // Asegúrate de que los valores sean números
                const totalCuentasPorCobrar = data.totalCuentasPorCobrar || 0;

                setTotales((prevState) => ({
                    ...prevState,
                    totalCuentasPorCobrar,
                    balanceTotal: totalCuentasPorCobrar - 10, // Calcula el balance total
                }));
            } catch (error) {
                console.error('Error fetching totals:', error);
                setError('Error al obtener los totales');
            }
        };

        if (session) {
            fetchTotales();
        }
    }, [session]);

    return (
        <ProtectedRoute>
            <div className="mt-20">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-xl font-extrabold text-green-800">Dashboard</h2>
                    {error && <p className="text-red-500">{error}</p>} {/* Mostrar mensaje de error si existe */}
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            className="bg-green-600 p-4 rounded-lg flex items-center transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                        >
                            <AiOutlineDollar size={30} className="text-white mr-2" />
                            <div>
                                <h3 className="text-white font-bold">Total Cuentas por Cobrar</h3>
                                <p className="text-white">${totales.totalCuentasPorCobrar.toLocaleString()}</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="bg-red-600 p-4 rounded-lg flex items-center transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                        >
                            <AiOutlineCreditCard size={30} className="text-white mr-2" />
                            <div>
                                <h3 className="text-white font-bold">Total Cuentas por Pagar</h3>
                                <p className="text-white">${totales.totalCuentasPorPagar.toLocaleString()}</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="bg-blue-600 p-4 rounded-lg flex items-center transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                        >
                            <AiOutlineBank size={30} className="text-white mr-2" />
                            <div>
                                <h3 className="text-white font-bold">Balance Total</h3>
                                <p className="text-white">${totales.balanceTotal.toLocaleString()}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;
