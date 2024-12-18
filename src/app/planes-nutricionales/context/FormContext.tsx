import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Alimento {
  nombre: string;
  frecuencia: string;
  kilocalorias: string;
}

interface Recomendacion {
  nombre: string;
  frecuencia: string;
  cantidad: string;
}


interface PlanesNutricionales {
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
  cena: Alimento[];
  otrasComidas: Alimento[];
  merienda: Alimento[];
  recomactivida: Recomendacion[];
  recomalimentos: Recomendacion[];
  recomliquido: Recomendacion[];
  recorecomotrasmplan: Recomendacion[];
}

interface FormContextType {
  planesNutrionales: PlanesNutricionales;
  setNutritionPlan: React.Dispatch<React.SetStateAction<PlanesNutricionales>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Agregar handleInputChange
  errors: Record<string, string>; // Agregar errors
  handleClear: () => void; // Agregar handleClear
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nutritionPlan, setNutritionPlan] = useState<PlanesNutricionales>({
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
    recomactivida: [],
    recomalimentos: [],
    recomliquido: [],
    recorecomotrasmplan: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({}); // Estado para errores

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNutritionPlan(prev => ({ ...prev, [name]: value }));
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
      recomactivida: [],
      recomalimentos: [],
      recomliquido: [],
      recorecomotrasmplan: [],
    });
  };

  // console.log('Estado del detallepaciente:', nutritionPlan); // Debugging
  //   console.log('FormProvider montado');

  return (
    <FormContext.Provider value={{ planesNutrionales: nutritionPlan, setNutritionPlan, handleInputChange, errors, handleClear }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};