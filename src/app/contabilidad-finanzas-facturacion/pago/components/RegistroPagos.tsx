import ProtectedRoute from "@/components/ProtectedRoute";
import SectionDivider from "@/components/SectionDivider";
import { Alert, Button, Card, CardContent, MenuItem, Snackbar, TextField, Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

enum TipoTransacciones {
    ABONO = 'ABONO',
    CANCELACION = 'CANCELACION',
    COMPRA = 'COMPRA',
    DEVOLUCION = 'DEVOLUCION',
    DONACION = 'DONACION',
    GASTO = 'GASTO',
    INGRESO = 'INGRESO',
    PAGO = 'PAGO',
    PRESTAMO = 'PRESTAMO',
    REEMBOLSO = 'REEMBOLSO',
    RETIRO = 'RETIRO',
    TRANSFERENCIA = 'TRANSFERENCIA',
    VENTA = 'VENTA',
}

enum TipoPago {
    EFECTIVO = 'EFECTIVO',
    TARJETA = 'TARJETA',
    CHEQUE = 'CHEQUE',
    TRANSFERENCIA = 'TRANSFERENCIA',
    PAYPAL = 'PAYPAL',
    OTRO = 'OTROS',
}

const RegistroPagos = () => {
    const [tipoTransaccion, setTipoTransaccion] = useState('');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [idFactura, setIdFactura] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ruta-a-tu-api`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                const result = await response.json();
                // Transformar los datos para el gráfico
                const transformedData = result.map(item => ({
                    name: item.metodoPago,
                    value: item.monto,
                }));
                setData(transformedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setSnackbarMessage('Error al cargar los datos para el gráfico');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchData();
    }, []); // Se ejecuta una vez al montar el componente

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Aquí puedes agregar la lógica para enviar los datos a la API

        // Simulación de éxito
        setSnackbarMessage('Pago registrado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <ProtectedRoute>
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <SectionDivider top={0} text={'Datos de pagos de Facturas'} />
                                <TextField
                                    select
                                    label="Tipo de Transacción"
                                    value={tipoTransaccion}
                                    onChange={(e) => setTipoTransaccion(e.target.value)}
                                    fullWidth
                                    required
                                    InputProps={{
                                        style: { borderRadius: '20px', marginBottom: 30 },
                                    }}
                                    variant="outlined"
                                >
                                    {Object.values(TipoTransacciones).map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Monto de Transacción"
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    fullWidth
                                    required
                                    InputProps={{
                                        style: { borderRadius: '20px', marginBottom: 30 },
                                    }}
                                    variant="outlined"
                                />

                                <TextField
                                    label="Descripción"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                    InputProps={{
                                        style: { borderRadius: '20px', marginBottom: 30 },
                                    }}
                                    variant="outlined"
                                />

                                <TextField
                                    select
                                    label="Método de Pago"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    fullWidth
                                    required
                                    InputProps={{
                                        style: { borderRadius: '20px', marginBottom: 30 },
                                    }}
                                    variant="outlined"
                                >
                                    {Object.values(TipoPago).map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="ID de Factura"
                                    value={idFactura}
                                    onChange={(e) => setIdFactura(e.target.value)}
                                    fullWidth
                                    required
                                    InputProps={{
                                        style: { borderRadius: '20px', marginBottom: 30 },
                                    }}
                                    variant="outlined"
                                />

                                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleSubmit}>
                                    Registrar Pago
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    Detalles de la Factura
                                </Typography>
                                <Typography variant="body2">
                                    ID de Factura: {idFactura || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Monto: ${monto || '0.00'}
                                </Typography>
                                <Typography variant="body2">
                                    Método de Pago: {metodoPago || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Tipo de Transacción: {tipoTransaccion || 'N/A'}
                                </Typography>

                                <Box sx={{ marginTop: 2 }}>
                                    <Typography variant="h6">Gráficos</Typography>
                                    <PieChart width={300} height={200}>
                                        <Pie
                                            data={data}
                                            cx={150}
                                            cy={100}
                                            labelLine={false}
                                            label={entry => entry.name}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </ProtectedRoute>
    );
};

export default RegistroPagos;