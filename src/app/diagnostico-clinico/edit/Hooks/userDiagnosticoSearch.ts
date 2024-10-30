import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FormData } from '../types/diagnosticos'; // Define tus tipos

interface UseDiagnosticoSearchProps {
  onSuccess: (data: any) => void;
  onError: (message: string) => void;
  resetForm: () => void;
}

export const useDiagnosticoSearch = ({ 
  onSuccess, 
  onError, 
  resetForm 
}: UseDiagnosticoSearchProps) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const searchDiagnostico = async (id: string) => {
    if (!session?.user?.token) {
      onError('No hay sesión activa');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/diagnostico-clinico/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Diagnóstico no encontrado');
      }

      const data = await response.json();
      onSuccess(data);
    } catch (error) {
      console.error('Error al buscar el diagnóstico:', error);
      onError('Error al buscar el diagnóstico');
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return {
    searchDiagnostico,
    loading
  };
};