// components/EventModal.js
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import { TextField, Button, Typography } from '@mui/material';

const EventModal = ({ open, onClose, onAdd, onUpdate, onDelete, event }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setStart(event.start);
            setEnd(event.end);
        } else {
            setTitle('');
            setStart(new Date());
            setEnd(new Date());
        }
    }, [event]);

    const handleSubmit = () => {
        const newEvent = {
            id: event ? event.id : Date.now(),
            title,
            start,
            end,
            color: '#3174ad', // Color de la cita
        };

        if (event) {
            onUpdate(newEvent);
        } else {
            onAdd(newEvent);
        }
        onClose();
    };

    const handleDelete = () => {
        if (event) {
            onDelete(event.id);
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ padding: '20px', background: 'white', borderRadius: '8px', width: '400px', margin: 'auto', marginTop: '100px' }}>
                <Typography variant="h6" gutterBottom>
                    {event ? 'Editar Cita' : 'Agregar Cita'}
                </Typography>
                <TextField
                    label="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Inicio"
                    type="datetime-local"
                    value={start.toISOString().slice(0, 16)}
                    onChange={(e) => setStart(new Date(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Fin"
                    type="datetime-local"
                    value={end.toISOString().slice(0, 16)}
                    onChange={(e) => setEnd(new Date(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginRight: '10px' }}>
                    {event ? 'Actualizar' : 'Agregar'}
                </Button>
                {event && (
                    <Button onClick={handleDelete} variant="outlined" color="secondary">
                        Eliminar
                    </Button>
                )}
            </div>
        </Modal>
    );
};

export default EventModal;