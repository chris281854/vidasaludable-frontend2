// src/app/planes-nutricionales/hooks/useUpdateNutritionEvaluation.ts

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const useDeleteHistorialClinico = () => {
    const { data: session } = useSession(); // Obtener la sesión
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteHistorialClinico = async (historialId: number, data: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/historial-clinico/${historialId}`, {
                method: 'DELETE', // Usar PATCH para actualizar
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.token || ''}`,
                },
                body: JSON.stringify(data), // Asegúrate de enviar los datos correctos
            });

            if (!response.ok) {
                const errorData = await response.json(); // Obtener el mensaje de error del backend
                throw new Error(errorData.message || 'Error al eliminar el Historial Clinico');
            }

            const result = await response.json();
            return result; // Retorna el resultado de la actualización
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Error desconocido');
            } else {
                setError('Error desconocido');
            }
            console.error('Error al eliminar el historial clinico:', error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        } finally {
            setLoading(false);
        }
    };

    return { deleteHistorialClinico, loading, error };
};

export default useDeleteHistorialClinico; // Asegúrate de exportar el hook correctamente