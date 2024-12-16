// hooks/useNutritionPlan.ts
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Alimento {
  rup: string;
  idPlan: number;
  nombre: string;
  frecuencia: string;
  kilocalorias: string;
  userName: string;
}

interface Recomendacion {
  nombre: string;
  frecuencia: string;
  cantidad: string;
}

interface NutritionPlan {
  nombreMedico: string;
  apellidoMedico: string;
  especialidad: string;
  rup: string;
  objetivoPlan: string;
  funcionIntestinal: string;
  funcionSueno: string;
  ingestaAlcoholica: string;
  nivelAnsiedad: string;
  nivelActividad: string;
  ingestaCalorica: string;
  otrasInformaciones: string;
  observacionesGenerales: string;
  proximaRevision: string; // Fecha en formato ISO string
  registro: string;        // Fecha en formato ISO string
  userName: string;
  desayuno: Alimento[];
  comida: Alimento[];
  cena: Alimento[];
  otrasComidas: Alimento[];
  codigoMedico: number;
  firmadoDigital: boolean;
  fechaFirma: string;
  recomactivida: Recomendacion[];
  recomalimentos: Recomendacion[];
  recomliquido: Recomendacion[];
  recorecomotrasmplan: Recomendacion[];
}

const useNutritionPlan = () => {
  const { data: session } = useSession();
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>({
    nombreMedico: '',
    apellidoMedico: '',
    especialidad: '',
    rup: '',
    objetivoPlan: '',
    funcionIntestinal: '',
    funcionSueno: '',
    ingestaAlcoholica: '',
    nivelAnsiedad: '',
    nivelActividad: '',
    ingestaCalorica: '',
    otrasInformaciones: '',
    observacionesGenerales: '',
    proximaRevision: '',
    registro: '',
    userName: '',
    desayuno: [],
    comida: [],
    cena: [],
    otrasComidas: [],
    codigoMedico: 0,
    firmadoDigital: false,
    fechaFirma: '',
    recomactivida: [],
    recomalimentos: [],
    recomliquido: [],
    recorecomotrasmplan: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any) => {
    let error = '';
    if (typeof value === 'string' && value.trim().length < 3) {
      error = 'Debe tener al menos 3 caracteres';
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNutritionPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    // Validar campos de texto
    Object.keys(nutritionPlan).forEach(key => {
      const value = nutritionPlan[key as keyof NutritionPlan];
      if (typeof value === 'string' && value.trim().length < 3) {
        newErrors[key] = 'Debe tener al menos 3 caracteres';
      }
    });

    // Validar que los campos de arreglos no estén vacíos
    if (nutritionPlan.desayuno.length === 0) {
      newErrors.desayuno = 'Debe agregar al menos un desayuno';
    }
    if (nutritionPlan.comida.length === 0) {
      newErrors.comida = 'Debe agregar al menos una comida';
    }
    if (nutritionPlan.cena.length === 0) {
      newErrors.cena = 'Debe agregar al menos una cena';
    }
    if (nutritionPlan.otrasComidas.length === 0) {
      newErrors.otrasComidas = 'Debe agregar al menos una otra comida';
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      console.error('Hay errores en el formulario', newErrors);
      return;
    }

    try {
      if (!session) {
        console.error('No session found');
        return;
      }

     // console.log('Datos a enviar:', JSON.stringify(nutritionPlan)); // Imprimir el cuerpo
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/planes-nutricionales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(nutritionPlan),
      });

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al guardar los datos');
      }

      console.log('Datos guardados:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      throw error;
    }
  };

  const handleClear = () => {
    setNutritionPlan({
      nombreMedico: '',
      apellidoMedico: '',
      especialidad: '',
      rup: '',
      objetivoPlan: '',
      funcionIntestinal: '',
      funcionSueno: '',
      ingestaAlcoholica: '',
      nivelAnsiedad: '',
      nivelActividad: '',
      ingestaCalorica: '',
      otrasInformaciones: '',
      observacionesGenerales: '',
      proximaRevision: '',
      registro: '',
      userName: '',
      desayuno: [],
      comida: [],
      cena: [],
      otrasComidas: [],
      recomactivida: [],
      recomalimentos: [],
      recomliquido: [],
      recorecomotrasmplan: [],
      codigoMedico: 0,
      firmadoDigital: false,
      fechaFirma: '',
    });
    setErrors({});
  };

  return {
    nutritionPlan,
    setNutritionPlan,
    errors,
    handleInputChange,
    handleSubmit,
    handleClear,
  };
};

export default useNutritionPlan;