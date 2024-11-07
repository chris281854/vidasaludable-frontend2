import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DetallePaciente {
  objetivo: string;
  observaciones: string;
  funcionIntestinal: string;
  funcionSueno: string;
  nivelActividad: string;
  ingestaCalorica: string;
  nivelesAnsiedad: string;
  otrasInformaciones: string;
}

interface FormContextType {
  detallepaciente: DetallePaciente;
  setDetallepaciente: React.Dispatch<React.SetStateAction<DetallePaciente>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [detallepaciente, setDetallepaciente] = useState<DetallePaciente>({
    objetivo: '',
    observaciones: '',
    funcionIntestinal: '',
    funcionSueno: '',
    nivelActividad: '',
    ingestaCalorica: '',
    nivelesAnsiedad: '',
    otrasInformaciones: '',
  });

  return (
    <FormContext.Provider value={{ detallepaciente, setDetallepaciente }}>
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