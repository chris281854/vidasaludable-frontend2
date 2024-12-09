// src/hooks/useSaveNutritionEvaluation.ts
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const useSaveNutritionEvaluation = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveNutritionEvaluation = async (evaluationData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/evaluaciones-nutricionales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token || ''}`,
        },
        body: JSON.stringify(evaluationData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al guardar la evaluación nutricional: ${response.status} ${errorMessage}`);
      }

      const data = await response.json();
      return data; // Retorna los datos de la respuesta si es necesario
    } catch (error) {
      console.error('Error al guardar la evaluación nutricional:', error);
      setError(error instanceof Error ? error.message : 'Error al guardar la evaluación nutricional');
    } finally {
      setLoading(false);
    }
  };

  return { saveNutritionEvaluation, loading, error };
};

export default useSaveNutritionEvaluation;