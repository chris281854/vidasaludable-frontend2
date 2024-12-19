'use client';
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, TextField, Typography, Paper, Snackbar, Modal, SnackbarCloseReason } from '@mui/material';
import { useSession } from 'next-auth/react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MyCalendar = () => {
  const { data: session } = useSession();

  interface Appointment {
    id: string;
    rup: string;
    title: string; // Este campo se usará para el RUP
    start: string;
    estado: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    date: '',
    time: '',
    rup: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');

  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentsForDate, setAppointmentsForDate] = useState<Appointment[]>([]); // Para almacenar citas de la fecha seleccionada

  // Función para obtener citas desde la API
  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cita-pac`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token || ''}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener los datos');

      const data = await response.json();

      const formattedAppointments = data.map((appointment: {
          estado: string; id: number; patient: string; fechaCita: string; horaCita: string; rup: string 
      }) => ({
        id: appointment.id.toString(),
        title: appointment.rup, // Cambiar a RUP
        start: `${appointment.fechaCita}T${appointment.horaCita}`, // Combinar fecha y hora
        estado: appointment.estado,
        rup: appointment.rup, // Asegúrate de que 'rup' esté presente en la respuesta
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
  };

  const addAppointment = async () => {
    // Validación de campos requeridos
    if (!newAppointment.title) {
      setSnackbarMessage('Por favor, completa el nombre del paciente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!newAppointment.date) {
      setSnackbarMessage('Por favor, completa todos los campos: La Fecha no puede ser vacía.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!newAppointment.time) {
      setSnackbarMessage('Por favor, completa todos los campos: La hora no puede ser vacía.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Combinar la fecha y la hora en un formato ISO 8601
    const formattedDateTime = `${newAppointment.date}T${newAppointment.time}:00`; // Formato YYYY-MM-DDTHH:mm:ss

    const newEvent = {
      rup: newAppointment.rup,
      fechaCita: newAppointment.date,
      horaCita: formattedDateTime,
      estadoCita: 'AGENDADA',
      userName: session?.user?.name,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cita-pac`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token || ''}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbarMessage(`Error al agregar la cita: ${errorData.message.join(', ')}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const savedAppointment = await response.json();
      setAppointments((prev) => [
        ...prev,
        {
          id: savedAppointment.id.toString(),
          title: newAppointment.rup, // Guardar el RUP ingresado
          start: formattedDateTime,
          estado: savedAppointment.estado,
          rup: newAppointment.rup,
        } as Appointment,
      ]);

      setNewAppointment({ title: '', date: '', time: '', rup: '' });
      setSnackbarMessage('Cita agregada con éxito.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding appointment:', error);
      setSnackbarMessage('Error al agregar la cita.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event: Event | React.SyntheticEvent<any, Event>, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleEventClick = (info: any) => {
    const clickedEvent = info.event;
    const appointment = appointments.find(appt => appt.id === clickedEvent.id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setModalOpen(true);
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr; // Obtener la fecha clickeada
    const appointmentsOnDate = appointments.filter((appt) => appt.start.startsWith(clickedDate)); // Filtrar citas por fecha

    if (appointmentsOnDate.length > 0) {
      setAppointmentsForDate(appointmentsOnDate); // Establecer citas para la fecha seleccionada
      setModalOpen(true); // Abrir el modal
    } else {
      setSnackbarMessage('No hay citas programadas para esta fecha.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    setAppointmentsForDate([]); // Limpiar citas para la fecha seleccionada
  };

  return (
    <div className="p-8" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh' }}>
      <Paper elevation={3} className="mb-6 p-4" style={{ backgroundColor: '#c8e6c9' }}>
        <Typography variant="h6" className="mb-2" style={{ color: '#2e7d32' }}>Agregar Nueva Cita</Typography>
        <div className="flex flex-col gap-2">
          <TextField
            variant="outlined"
            name="rup"
            value={newAppointment.rup}
            onChange={handleInputChange}
            placeholder="Rup del Paciente"
            InputProps={{ style: { color: '#2e7d32' } }}
            InputLabelProps={{ style: { color: '#2e7d32' } }}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            name="title"
            value={newAppointment.title}
            onChange={handleInputChange}
            placeholder="Nombre del Paciente"
            InputProps={{ style: { color: '#2e7d32' } }}
            InputLabelProps={{ style: { color: '#2e7d32' } }}
            className="bg-white"
          />
          <TextField
            variant="outlined"
            name="date"
            value={newAppointment.date}
            onChange={handleInputChange}
            type="date"
            className="bg-white"
            InputProps={{ style: { color: '#2e7d32' } }}
            InputLabelProps={{ style: { color: '#2e7d32' } }}
          />
          <TextField
            variant="outlined"
            name="time"
            value={newAppointment.time}
            onChange={handleInputChange}
            type="time"
            InputProps={{ style: { color: '#2e7d32' } }}
            InputLabelProps={{ style: { color: '#2e7d32' } }}
            className="bg-white"
          />
          <Button
            onClick={addAppointment}
            variant="contained"
            style={{ backgroundColor: '#4caf50', color: 'white' }}
            className="hover:bg-green-600 transition"
          >
            Agregar Cita
          </Button>
        </div>
      </Paper>

      <Paper elevation={3} className="mb-6 p-4" style={{ backgroundColor: '#c8e6c9' }}>
        <Typography variant="h6" className="mb-2" style={{ color: '#2e7d32' }}>Citas Programadas</Typography>
        <div className="flex flex-col gap-4">
          {appointments.length === 0 ? (
            <Typography variant="body1" style={{ color: '#2e7d32' }}>No hay citas programadas.</Typography>
          ) : (
            appointments.map((appointment) => (
              <Paper key={appointment.id} className="p-4" style={{ backgroundColor: '#a5d6a7' }}>
                <div className="flex justify-between">
                  <div>
                    <Typography variant="body1" style={{ color: '#2e7d32' }}>{appointment.rup}</Typography>
                    <Typography variant="body1" style={{ color: '#2e7d32' }}>{appointment.title}</Typography>
                    <Typography variant="body2" style={{ color: '#2e7d32' }}>Fecha: {appointment.start.split('T')[0]}</Typography>
                    <Typography variant="body2" style={{ color: '#2e7d32' }}>Hora: {appointment.start.split('T')[1]}</Typography>
                    <Typography variant="body2" style={{ color: '#2e7d32' }}>Estado: {appointment.estado}</Typography>
                  </div>
                  <Button
                    onClick={() => deleteAppointment(appointment.id)}
                    variant="contained"
                    style={{ backgroundColor: '#f44336', color: 'white' }}
                  >
                    Eliminar
                  </Button>
                </div>
              </Paper>
            ))
          )}
        </div>
      </Paper>
      <div> 
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={appointments}
          eventClick={handleEventClick} // Manejar clic en el evento
          dateClick={handleDateClick} // Manejar clic en el día
        />
      

      {/* Snackbar para mostrar mensajes */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal para mostrar detalles de las citas en la fecha seleccionada */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper style={{ padding: '20px', margin: '100px auto', maxWidth: '400px' }}>
          <Typography variant="h6" style={{ color: '#2e7d32' }}>Citas para la Fecha Seleccionada</Typography>
          {appointmentsForDate.length > 0 ? (
            appointmentsForDate.map((appointment) => (
              <div key={appointment.id}>
                <Typography variant="body1">RUP: {appointment.rup}</Typography>
                <Typography variant="body1">Nombre: {appointment.title}</Typography>
                <Typography variant="body1">Fecha: {appointment.start.split('T')[0]}</Typography>
                <Typography variant="body1">Hora: {appointment.start.split('T')[1]}</Typography>
                <hr />
              </div>
            ))
          ) : (
            <Typography variant="body1">No hay citas programadas para esta fecha.</Typography>
          )}
          <Button onClick={handleCloseModal} variant="contained" style={{ backgroundColor: '#4caf50', color: 'white', marginTop: '10px' }}>
            Cerrar
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default MyCalendar;