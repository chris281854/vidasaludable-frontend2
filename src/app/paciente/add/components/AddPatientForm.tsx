import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';

const EditPatientForm: React.FC = () => {
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    patientId: '',
    email: '',
    birthDate: '',
    gender: '',
    registrationDate: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Datos guardados:', patientData);
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPatientData({
      firstName: '',
      lastName: '',
      phone: '',
      patientId: '',
      email: '',
      birthDate: '',
      gender: '',
      registrationDate: '',
      address: '',
    });
  };

  const InputField = ({ name, label, type = 'text' }: { name: keyof typeof patientData; label: string; type?: string }) => (
    <div className="relative">
      <input
        type={type}
        name={name}
        id={name}
        value={patientData[name]}
        onChange={handleChange}
        className="w-full h-12 bg-[#f0f0f0] rounded-[15px] px-4 pt-5 pb-2 text-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#00A896] peer font-semibold"
        placeholder=" "
      />
      <label
        htmlFor={name}
        className="absolute text-[#00A896] text-lg font-bold font-['DM Sans'] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
      <div className="w-full bg-black rounded-[30px] mb-8 p-3">
        <h2 className="text-white text-xl font-bold font-['DM Sans']">Datos generales del paciente</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-8">
        <InputField name="firstName" label="Nombre del paciente" />
        <InputField name="lastName" label="Apellido del paciente" />
        <InputField name="phone" label="Teléfono" type="tel" />
        <InputField name="patientId" label="Registro Único de Paciente" />
      </div>

      <div className="w-full bg-black rounded-[30px] mb-8 p-3">
        <h2 className="text-white text-xl font-bold font-['DM Sans']">Datos complementarios del paciente</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-8">
        <InputField name="email" label="Email del paciente" type="email" />
        <InputField name="birthDate" label="Fecha de nacimiento" type="date" />
        <div className="relative">
          <select
            name="gender"
            id="gender"
            value={patientData.gender}
            onChange={handleChange}
            className="w-full h-12 bg-[#f0f0f0] rounded-[15px] px-4 pt-5 pb-2 text-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#00A896] appearance-none peer font-semibold"
          >
            <option value=""></option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
          <label
            htmlFor="gender"
            className="absolute text-[#00A896] text-lg font-bold font-['DM Sans'] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Sexo
          </label>
        </div>
        <InputField name="registrationDate" label="Fecha de Registro" type="date" />
      </div>

      <InputField name="address" label="Dirección" />

      <div className="flex justify-between mt-10">
        <button
          type="submit"
          disabled={isLoading}
          className="w-[180px] h-12 bg-[#00A896] rounded-[90px] text-center text-white text-lg font-bold font-['DM Sans'] flex items-center justify-center"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <FaSave className="mr-2" />
              Guardar
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-[180px] h-12 bg-transparent border-2 border-[#00A896] text-[#00A896] rounded-[90px] text-center text-lg font-bold font-['DM Sans']"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};

export default EditPatientForm;