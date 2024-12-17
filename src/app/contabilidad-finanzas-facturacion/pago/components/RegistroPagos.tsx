import ProtectedRoute from "@/components/ProtectedRoute";
import SectionDivider from "@/components/SectionDivider";
import { Alert, Button, Card, CardContent, MenuItem, Snackbar, TextField, Box, Grid, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit'; // Asegúrate de tener este ícono instalado
import { useSession } from "next-auth/react";
import router from "next/router";
import { useState } from "react";
import jsPDF from 'jspdf';

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
    const { data: session } = useSession();

    const [tipoTransaccion, setTipoTransaccion] = useState('');
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [idFactura, setIdFactura] = useState('');
    
    interface Paciente {
        nombre?: string;
        apellido?: string;
        rup?: string;
        aseguradora?: string;
    }
    
    const [paciente, setPaciente] = useState<Paciente>({}); // Estado para almacenar la información del paciente
    
    interface Medico {
        idMedico?: string;
        nombre?: string;
        especialidad?: string;
    }

    const [medico, setMedico] = useState<Medico>({}); // Estado para almacenar la información del médico
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [isEditing, setIsEditing] = useState(true); // Estado para controlar la edición
    const [openModal, setOpenModal] = useState(false); // Estado para controlar el modal

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // Crear el objeto de datos a enviar
        const dataToSend = {
            tipo: tipoTransaccion,
            idFactura: parseInt(idFactura), // Asegúrate de que sea un número
            monto: parseFloat(monto), // Asegúrate de que sea un número
            fecha: new Date().toISOString(), // Fecha actual en formato ISO
            descripcion: descripcion,
            metodoPago: metodoPago,
            userName: session?.user?.name || '', // Nombre del usuario de la sesión
            estado: 'Activo' // Puedes ajustar esto según sea necesario
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contabilidad-finanzas`,  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token || ''}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Obtener el mensaje de error del servidor
                throw new Error(errorData.message || 'Error al registrar el pago');
            }

            // Simulación de éxito
            setSnackbarMessage('Pago registrado exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // Generar PDF después de un registro exitoso
            generatePDF();

            // Limpiar los campos después de un registro exitoso
            handleClean();
        } catch (error) {
            setSnackbarMessage((error as Error).message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF('p', 'pt', 'a5'); // Cambiar a tamaño A5
    
        // Título
        doc.setFontSize(20);
        doc.setTextColor(40, 87, 141); // Color azul
        doc.text("Recibo de Pago", 40, 40);
    
        // Información del Paciente
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Color negro
        doc.text(`Nombre del Paciente: ${paciente.nombre || 'N/A'}`, 40, 80);
        doc.text(`Apellido: ${paciente.apellido || 'N/A'}`, 40, 100);
        doc.text(`RUP: ${paciente.rup || 'N/A'}`, 40, 120);
        doc.text(`Aseguradora: ${paciente.aseguradora || 'N/A'}`, 40, 140);
    
        // Información del Pago
        doc.setTextColor(40, 87, 141); // Color azul
        doc.text(`ID de Factura: ${idFactura || 'N/A'}`, 40, 180);
        doc.text(`Tipo de Transacción: ${tipoTransaccion || 'N/A'}`, 40, 200);
        doc.text(`Descripción: ${descripcion || 'N/A'}`, 40, 220);
        doc.text(`Método de Pago: ${metodoPago || 'N/A'}`, 40, 240);
        doc.text(`Monto: $${monto || '0.00'}`, 40, 260);
        doc.text(`Fecha de Pago: ${new Date().toLocaleDateString()}`, 40, 280);
    
        // Línea de separación
        doc.setLineWidth(1);
        doc.setDrawColor(40, 87, 141); // Color azul
        doc.line(40, 300, 570, 300); // Línea horizontal
    
        // Resumen
        doc.setFontSize(14);
        doc.setTextColor(40, 87, 141); // Color azul
        doc.text("Resumen de Pago", 40, 320);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Color negro
        doc.text(`Total: $${monto || '0.00'}`, 40, 340);
    
        // Guardar el PDF
        doc.save("recibo_pago.pdf");
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleClean = () => {
        // Limpiar todos los campos
        setTipoTransaccion('');
        setMonto('');
        setDescripcion('');
        setMetodoPago('');
        setIdFactura('');
        setPaciente({}); // Limpiar información del paciente
        setMedico({}); // Limpiar información del médico
        setIsEditing(true); // Volver a habilitar la edición
    };

    const handleKeyPress = async (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            // Verificar si hay sesión antes de buscar la factura
            if (!session) {
                console.error('No session found');
                router.push("/login");
                return; // Salir de la función si no hay sesión
            }
            // Realizar la búsqueda de la factura
            await fetchInvoiceData(idFactura);
        }
    };

    const fetchInvoiceData = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/facturacion/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.token || ''}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos de la factura');
            }
            const data = await response.json();

            // Asignar los valores correctos de acuerdo a la estructura de datos
            setMonto(data.total); // Total de la factura
            setDescripcion(data.conceptoFactura); // Concepto de la factura
            setTipoTransaccion(data.tipoFactura); // Tipo de factura
            setMetodoPago(data.tipoConsulta); // Tipo de consulta
            setIdFactura(data.idFactura.toString()); // ID de la factura como string
            setPaciente(data.paciente); // Almacenar la información del paciente
            
            // Asegúrate de que la información del médico esté en el objeto de datos
            setMedico({
                idMedico: data.idMedico, // Asegúrate de que este campo esté disponible
                nombre: data.medico?.nombre, // Asegúrate de que el nombre esté disponible
                especialidad: data.medico?.especialidad // Asegúrate de que la especialidad esté disponible
            });

            setSnackbarMessage('Datos de la factura cargados exitosamente');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setIsEditing(false); // Deshabilitar la edición después de cargar los datos
        } catch (error) {
            setSnackbarMessage((error as Error).message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleEditClick = (field: 'idFactura' | 'monto') => {
        setOpenModal(true);
    };

    const handleModalClose = (confirm: boolean) => {
        setOpenModal(false);
        if (confirm) {
            setIsEditing(true); // Habilitar la edición si el usuario confirma
        }
    };

    return (
        <ProtectedRoute>
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <SectionDivider top={0} text={'Datos de pagos de Facturas'} />
                                
                                <TextField
                                    label="ID de Factura"
                                    value={idFactura}
                                    onChange={(e) => setIdFactura(e.target.value)}
                                    onKeyPress={handleKeyPress} // Agregar el manejador de eventos
                                    fullWidth
                                    required
                                    disabled={!isEditing} // Deshabilitar si no está en modo de edición
                                    InputProps={{
                                        style: { borderRadius: '20px', marginBottom: 30 },
                                        endAdornment: (
                                            <IconButton color="success" onClick={() => handleEditClick('idFactura')} disabled={isEditing}>
                                                <EditIcon />
                                            </IconButton>
                                        ),
                                    }}
                                    variant="outlined"
                                />
                                
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
                                    disabled={!isEditing} // Deshabilitar si no está en modo de edición
                                    InputProps={{
                                        style: { borderRadius: '20px', marginBottom: 30 },
                                        endAdornment: (
                                            <IconButton color="success" onClick={() => handleEditClick('monto')} disabled={isEditing}>
                                                <EditIcon />
                                            </IconButton>
                                        ),
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
                                
                                <div className="flex justify-center"> 
                                <Button type="submit" variant="contained" color="primary" style={{ borderRadius: '20px',marginTop: '30px' }} onClick={handleSubmit}>
                                    Registrar Pago
                                </Button>

                                <Button variant="outlined" color="secondary" style={{borderRadius: '20px', marginTop: '30px', marginLeft: '10px'  }} onClick={handleClean}>
                                    Limpiar
                                </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="success" variant="h6" component="h2" gutterBottom>
                                    Resumen de pago
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
                                    <div style={{ height: '200px', backgroundColor: '#f0f0f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="body2">Gráfico de transacciones aquí</Typography>
                                    </div>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Información del Paciente */}
                        <Card sx={{ marginTop: 2 }}>
                            <CardContent>
                                <Typography color="primary" variant="h6" component="h2" gutterBottom>
                                    Información del Paciente
                                </Typography>
                                <Typography variant="body2">
                                    Nombre: {paciente.nombre || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Apellido: {paciente.apellido || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    RUP: {paciente.rup || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Fecha de Consulta: {new Date().toLocaleDateString() || 'N/A'} {/* Cambia esto si tienes la fecha de consulta */}
                                </Typography>
                                <Typography variant="body2">
                                    Aseguradora: {paciente.aseguradora || 'N/A'}
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Información del Médico */}
                        <Card sx={{ marginTop: 2 }}>
                            <CardContent>
                                <Typography color="primary" variant="h6" component="h2" gutterBottom>
                                    Información del Médico
                                </Typography>
                                <Typography variant="body2">
                                    ID Médico: {medico.idMedico || 'N/A'}
                                </Typography>
                                <Typography variant="body2">
                                    Nombre Médico: {medico.nombre || 'N/A'} {/* Asegúrate de que el nombre esté disponible en los datos */}
                                </Typography>
                                <Typography variant="body2">
                                    Especialidad: {medico.especialidad || 'N/A'} {/* Asegúrate de que la especialidad esté disponible en los datos */}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Modal de Confirmación */}
                <Dialog open={openModal} onClose={() => handleModalClose(false)}>
                    <DialogTitle>Confirmación</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Para evitar inconsistencias, se recomienda no modificar estos campos. ¿Desea continuar?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleModalClose(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={() => handleModalClose(true)} color="primary">
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ProtectedRoute>
    );
};

export default RegistroPagos;