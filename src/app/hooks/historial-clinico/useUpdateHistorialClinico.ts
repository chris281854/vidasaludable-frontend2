// src/app/planes-nutricionales/hooks/useUpdateNutritionEvaluation.ts

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const useUpdateHistorialClinico = () => {
    const { data: session } = useSession(); // Obtener la sesión
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateHistorialClinico = async (historialId: number, data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/historial-clinico/${historialId}`, {
                method: 'PATCH', // Usar PATCH para actualizar
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.token || ''}`,
                },
                body: JSON.stringify(data), // Asegúrate de enviar los datos correctos
            });

            if (!response.ok) {
                const errorData = await response.json(); // Obtener el mensaje de error del backend
                throw new Error(errorData.message || 'Error al actualizar el historial clinico');
            }

            const result = await response.json();
            return result; // Retorna el resultado de la actualización
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Error desconocido');
            } else {
                setError('Error desconocido');
            }
            console.error('Error al actualiar el historial clinico:', error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        } finally {
            setLoading(false);
        }
    };

    return { updateHistorialClinico, loading, error };
};

export default useUpdateHistorialClinico; // Asegúrate de exportar el hook correctamente