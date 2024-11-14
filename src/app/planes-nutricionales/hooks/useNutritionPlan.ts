// hooks/useNutritionPlan.ts
import { useState } from 'react';

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

const useNutritionPlan = (p0: (prev: any) => any) => {
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

  const handleSubmit = async (token: string) => {
    const newErrors = Object.keys(nutritionPlan).reduce((acc, key) => {
      const value = nutritionPlan[key as keyof NutritionPlan];
      const error = typeof value === 'string' && value.trim().length < 3
        ? 'Debe tener al menos 3 caracteres'
        : '';
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
      return data;
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
