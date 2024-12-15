// src/hooks/useSaveHistorialClinico.ts

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const useSaveHistorialClinico = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const saveHistorialClinico = async (data: any) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
    
        try {
            if (!session) {
                throw new Error('User is not authenticated');
            }
    
            console.log('Datos a enviar:', data); // Agrega este log para verificar los datos
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/historial-clinico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`,
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error de respuesta:', errorData); // Agrega este log para ver la respuesta de error
                throw new Error(errorData.message || 'Error al guardar el historial clínico');
            }
            
            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return { saveHistorialClinico, loading, error, success };
};

export default useSaveHistorialClinico;