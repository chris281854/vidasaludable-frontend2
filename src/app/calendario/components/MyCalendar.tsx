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

  interface Patient {
    nombre: string;
    apellido: string;
  }

  interface Appointment {
    id: string;
    rup: string;
    title: string;
    start: string;
    estado: string;
    paciente: Patient;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [appointmentsForDate, setAppointmentsForDate] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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
        estado: string; id: number; fechaCita: string; horaCita: string; rup: string; paciente?: { nombre: string; apellido: string }
      }) => ({
        id: appointment.id.toString(),
        rup: appointment.rup,
        start: `${appointment.fechaCita}T${appointment.horaCita}`,
        estado: appointment.estado,
        paciente: appointment.paciente || { nombre: 'Desconocido', apellido: '' },
        title: `${appointment.paciente?.nombre || 'Desconocido'} (${appointment.rup})`,
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setSnackbarMessage('Error al cargar las citas');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const deleteAppointment = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cita-pac/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token || ''}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbarMessage(`Error al eliminar la cita: ${errorData.message}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
      setSnackbarMessage('Cita eliminada con éxito');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setSnackbarMessage('Error al eliminar la cita');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const addAppointment = async () => {
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

    const formattedDateTime = `${newAppointment.date}T${newAppointment.time}:00`;

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
          rup: newAppointment.rup,
          start: formattedDateTime,
          estado: savedAppointment.estado,
          paciente: { nombre: newAppointment.title, apellido: '' },
          title: `${newAppointment.title} (${newAppointment.rup})`,
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
    const clickedDate = info.dateStr;
    const appointmentsOnDate = appointments.filter((appt) => appt.start.startsWith(clickedDate));

    if (appointmentsOnDate.length > 0) {
      setAppointmentsForDate(appointmentsOnDate);
      setModalOpen(true);
    } else {
      setSnackbarMessage('No hay citas programadas para esta fecha.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    setAppointmentsForDate([]);
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
            InputProps={{ 
              style: { color: '#2e7d32' },
              inputProps: { min: new Date().toISOString().split("T")[0] } // Establecer la fecha mínima como hoy
            }}
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
                    <Typography variant="body1" style={{ color: '#2e7d32' }}>{appointment.paciente.nombre} {appointment.paciente.apellido}</Typography>
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

      <div className="bg-green-700"> 
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={appointments}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventContent={(eventInfo) => {
            const appointment = appointments.find(app => app.id === eventInfo.event.id);
            return (
              <div className="p-1 text-xs">
                <div><strong>RUP:</strong> {appointment?.rup}</div>
                <div><strong>Paciente:</strong> {appointment?.paciente.nombre}</div>
                <div><strong>Hora:</strong> {eventInfo.event.start?.toLocaleTimeString()}</div>
                <div><strong>Estado:</strong> {appointment?.estado}</div>
              </div>
            );
          }}
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkText="más"
          moreLinkClick="popover"
        />
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Paper style={{ padding: '20px', margin: '100px auto', maxWidth: '400px' }}>
          <Typography variant="h6" style={{ color: '#2e7d32' }}>Detalles de la Cita</Typography>
          {selectedAppointment && (
            <>
              <Typography variant="body1">RUP: {selectedAppointment.rup}</Typography>
              <Typography variant="body1">Nombre: {selectedAppointment.paciente.nombre} {selectedAppointment.paciente.apellido}</Typography>
              <Typography variant="body1">Fecha: {selectedAppointment.start.split('T')[0]}</Typography>
              <Typography variant="body1">Hora: {selectedAppointment.start.split('T')[1]}</Typography>
            </>
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