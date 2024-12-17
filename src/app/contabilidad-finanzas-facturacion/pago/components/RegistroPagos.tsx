import SectionDivider from "@/components/SectionDivider";
import { Alert, Button, Card, CardContent, MenuItem, Snackbar, TextField } from "@mui/material";
import { Box } from "@mui/material";
import { useState } from "react";

enum TipoTransacciones {
    ABONO = 'Abono',
    CANCELACION = 'Cancelación',
    COMPRA = 'Compra',
    DEVOLUCION = 'Devolución',
    DONACION = 'Donación',
    GASTO = 'Gasto',
    INGRESO = 'Ingreso',
    PAGO = 'Pago',
    PRESTAMO = 'Préstamo',
    REEMBOLSO = 'Reembolso',
    RETIRO = 'Retiro',
    TRANSFERENCIA = 'Transferencia',
    VENTA = 'Venta',
}

enum TipoPago {
    EFECTIVO = 'Efectivo',
    TARJETA = 'Tarjeta',
    CHEQUE = 'Cheque',
    TRANSFERENCIA = 'Transferencia',
    PAYPAL = 'PayPal',
    OTRO = 'Otro',
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Aquí puedes agregar la lógica para enviar los datos a la API
        // Por ejemplo, usando fetch para enviar un POST a tu backend

        // Simulación de éxito
        setSnackbarMessage('Pago registrado exitosamente');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };


return(
    <Box sx={{ padding: 2 }}>
    <Card>
        <CardContent>
            <SectionDivider top={0} text={'Datos de pagos de Facturas'} />
        </CardContent>

        <TextField
            select
            label="Tipo de Transacción"
            value={tipoTransaccion}
            onChange={(e) => setTipoTransaccion(e.target.value)}
            fullWidth
            required
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
                />
                 
            <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            />
                           
            <TextField
            select
            label="Método de Pago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            fullWidth
            required
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
            />
                    
                    
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleSubmit}>
            Registrar Pago
            </Button>
            
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                 {snackbarMessage}
               </Alert>
            </Snackbar>

                  </Card>
        </Box>
);

};

export default RegistroPagos;