import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';

const FiltroTransacciones: React.FC = () => {
    const { data: session } = useSession();

    const [filterValue, setFilterValue] = useState('');
    const [facturas, setFacturas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacturas = async () => {
            if (!session) {
                console.error('No hay sesión activa');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/facturacion/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${session.user.token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener las facturas');
                }
                const result = await response.json();
                console.log('Facturas obtenidas:', result); // Verifica los datos
                setFacturas(result);
            } catch (error) {
                console.error('Error fetching facturas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacturas();
    }, [session]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    const filteredFacturas = facturas.filter(factura => {
        return (
            (factura.idFactura && factura.idFactura.toString().includes(filterValue)) ||
            (factura.montoBruto && factura.montoBruto.toString().includes(filterValue)) ||
            (factura.conceptoFactura && factura.conceptoFactura.toLowerCase().includes(filterValue.toLowerCase()))
        );
    });

    const displayedFacturas = filteredFacturas.slice(0, 10);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <Typography variant="h5" className="text-green-700 mb-4 font-extrabold">Filtrar Transacciones</Typography>
            <input
                type="text"
                placeholder="Buscar por ID, monto o concepto"
                value={filterValue}
                onChange={handleInputChange}
                className="text-black border p-2 rounded w-full mb-4"
                style={{ borderRadius: '15px' }} // Input redondeado
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead className="bg-green-700  font-extrabold">
                        <TableRow>
                            <TableCell className="text-white font-extrabold text-xl">ID</TableCell>
                            <TableCell className="text-white font-extrabold text-xl">Concepto</TableCell>
                            <TableCell className="text-white font-extrabold text-xl">Monto Bruto</TableCell>
                            <TableCell className="text-white font-extrabold text-xl">ITBIS</TableCell>
                            <TableCell className="text-white font-extrabold text-xl">TOTAL</TableCell>
                            <TableCell className="text-white font-extrabold text-xl">Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedFacturas.length > 0 ? (
                            displayedFacturas.map((factura) => {
                                console.log('Factura:', factura); // Verifica cada factura
                                return (
                                    <TableRow key={factura.idFactura}>
                                        <TableCell>{factura.idFactura}</TableCell>
                                        <TableCell>{factura.conceptoFactura}</TableCell>
                                        <TableCell>RD$ {factura.montoBruto.toLocaleString()}</TableCell>
                                        <TableCell>RD$ {factura.itbis.toLocaleString()}</TableCell>
                                        <TableCell>RD$ {factura.total.toLocaleString()}</TableCell>
                                        <TableCell>{factura.registro ? new Date(factura.registro).toLocaleDateString() : 'N/A'}</TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No se encontraron facturas.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default FiltroTransacciones;