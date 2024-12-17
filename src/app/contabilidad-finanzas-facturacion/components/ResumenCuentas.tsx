'use client';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TableSortLabel,
} from '@mui/material';

interface Cuenta {
    id: string; // Asegúrate de que haya un ID único para cada cuenta
    montoBruto: number;
    itbis: number;
    montoNeto: number;
    tipoFactura: string;
    tipoConsulta: string;
    aseguradora: string;
    registro: string; // Cambiado a 'fechaRegistro'
    observacion?: string; // Agregado para observaciones, si es necesario
    paciente: {
        rup: string; // Cambiado a 'rup' para reflejar la estructura de la API
        nombre: string; // Cambiado a 'nombre' para reflejar la estructura de la API
    };
}

const ResumenCuentas: React.FC = () => {
    
    const { data: session } = useSession();
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!session) {
            console.error('No session found');
            
            return;
        }

        const fetchCuentas = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/facturacion/cuentasporcobrar/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.user.token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    throw new Error('Error al obtener las cuentas por cobrar');
                }

                const data = await response.json();
                setCuentas(data);
            } catch (error) {
                console.error('Error fetching cuentas:', error);
                setError((error as Error).message);
            }
        };

        fetchCuentas();
    }, [session]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <Typography variant="h5" component="h2" className="text-green-600 font-bold mb-4">
                Resumen de Cuentas
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead className="bg-green-500">
                        <TableRow>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Rup</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Nombre del Paciente</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Monto Bruto</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">ITBIS</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Monto Neto</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Tipo de Factura</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Tipo de Consulta</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Aseguradora</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Fecha</TableSortLabel></TableCell>
                            <TableCell><TableSortLabel className="text-white font-extrabold text-xl">Observación</TableSortLabel></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cuentas.length > 0 ? (
                            cuentas.map((cuenta) => (
                                <TableRow key={cuenta.id} hover>
                                    <TableCell>{cuenta.paciente.rup}</TableCell>
                                    <TableCell>{cuenta.paciente.nombre}</TableCell>
                                    <TableCell>${cuenta.montoBruto ? cuenta.montoBruto.toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell>${cuenta.itbis ? cuenta.itbis.toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell>${cuenta.montoNeto ? cuenta.montoNeto.toLocaleString() : 'N/A'}</TableCell>
                                    <TableCell>{cuenta.tipoFactura}</TableCell>
                                    <TableCell>{cuenta.tipoConsulta}</TableCell>
                                    <TableCell>{cuenta.aseguradora}</TableCell>
                                    <TableCell>{new Date(cuenta.registro).toLocaleDateString()}</TableCell> {/* Formateo de fecha */}
                                    <TableCell>
                                        {cuenta.observacion || 'N/A'}
                                        {cuenta.tipoFactura === 'A CREDITO' && (
                                            <div className="font-extrabold text-sm flex items-center mt-2 text-yellow-600">
                                                <AiOutlineInfoCircle className="mr-3 size-6" />
                                                <span>Esta factura es a crédito.</span>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center">No hay cuentas por cobrar disponibles.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ResumenCuentas;