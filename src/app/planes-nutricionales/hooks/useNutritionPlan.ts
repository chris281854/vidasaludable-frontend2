// hooks/useNutritionPlan.ts
import { useState } from 'react';

interface Alimento {
  nombre: string;
  frecuencia: string;
  kilocalorias: string;
  firmadoDigital: boolean;
}

interface recomendaciones {
  actividadFisica: string;
  frecActividadFisica: string;
  consumoLiquido: string;
  frecConsumoLiquido: string;
  alimentosEvitar: string;
  otrasRecomendaciones: string;
}


interface medico {
  codigoMedico: number;
   
}

interface NutritionPlan {
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
  proximaRevision: string;
  registro: string;
  userName: string;
  desayuno: Alimento[];
  comida: Alimento[];
  cena:Alimento[];
  otrasComidas: Alimento[];
  merienda: Alimento[];
  recomplan: recomendaciones[],
  codigoMedico: number;
  firmadoDigital: boolean
}

const useNutritionPlan = () => {
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>({
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
    merienda: [],
    recomplan: [],
    codigoMedico: 0,
    firmadoDigital: false
 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    if (value.trim().length < 3) {
      error = 'Debe tener al menos 3 caracteres';
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Cambiando ${name} a ${value}`); // Debugging
    setNutritionPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (token: string) => {
    const newErrors = Object.keys(nutritionPlan).reduce((acc, key) => {
      const value = nutritionPlan[key as keyof NutritionPlan];
      const error = typeof value === 'string' ? validateField(key, value) : '';
      return { ...acc, [key]: error };
    }, {} as Record<string, string>);

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      console.error('Hay errores en el formulario');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/planes-nutricionales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nutritionPlan),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }

      const data = await response.json();
      console.log('Datos guardados:', data);
      return data; // Retorna los datos guardados si es necesario
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  };

  const handleClear = () => {
    setNutritionPlan({
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
      merienda: [],
      recomplan: [],
      codigoMedico: 0,
      firmadoDigital: false
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