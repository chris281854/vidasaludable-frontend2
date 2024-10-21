import React, { useState } from 'react';

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);

  const calculateBMI = () => {
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height) / 100; // convert cm to m
      const bmiValue = weightNum / (heightNum * heightNum);
      setBMI(Math.round(bmiValue * 10) / 10);
    }
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculadora de IMC</h2>
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Altura (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={calculateBMI}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Calcular IMC
        </button>
        {bmi !== null && (
          <div className="text-center">
            <p className="text-xl font-bold">Tu IMC es: {bmi}</p>
            <p className="text-sm text-gray-600">
              {bmi < 18.5 ? 'Bajo peso' :
               bmi < 25 ? 'Peso normal' :
               bmi < 30 ? 'Sobrepeso' : 'Obesidad'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;