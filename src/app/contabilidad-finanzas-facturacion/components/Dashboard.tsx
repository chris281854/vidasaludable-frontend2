// src/components/Dashboard.tsx

import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react';
import { AiOutlineDollar, AiOutlineCreditCard, AiOutlineBank } from 'react-icons/ai'; // Importar iconos
import { motion } from 'framer-motion'; // Importar framer-motion para animaciones

const Dashboard: React.FC = () => {
    return (
        <ProtectedRoute>
            <div className="mt-20">
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-xl font-extrabold text-green-800">Dashboard</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <motion.div
                            className="bg-green-600 p-4 rounded-lg flex items-center transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }} // Animación al pasar el mouse
                        >
                            <AiOutlineDollar size={30} className="text-white mr-2" />
                            <div>
                                <h3 className="text-white font-bold">Total Cuentas por Cobrar</h3>
                                <p className="text-white">$10,000</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="bg-red-600 p-4 rounded-lg flex items-center transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }} // Animación al pasar el mouse
                        >
                            <AiOutlineCreditCard size={30} className="text-white mr-2" />
                            <div>
                                <h3 className="text-white font-bold">Total Cuentas por Pagar</h3>
                                <p className="text-white">$5,000</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="bg-blue-600 p-4 rounded-lg flex items-center transition-transform transform hover:scale-105"
                            whileHover={{ scale: 1.05 }} // Animación al pasar el mouse
                        >
                            <AiOutlineBank size={30} className="text-white mr-2" />
                            <div>
                                <h3 className="text-white font-bold">Balance Total</h3>
                                <p className="text-white">$5,000</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;