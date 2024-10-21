import React from 'react';

const FollowUpReminders: React.FC = () => {
  const reminders = [
    { patient: "Miguel Ángel", date: "2023-05-20", reason: "Revisión mensual" },
    { patient: "Isabel Flores", date: "2023-05-22", reason: "Ajuste de dieta" },
    { patient: "Pedro Sánchez", date: "2023-05-25", reason: "Evaluación de progreso" },
  ];

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recordatorios de Seguimiento</h2>
      <ul className="space-y-4">
        {reminders.map((reminder, index) => (
          <li key={index} className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-semibold">{reminder.patient}</p>
              <p className="text-sm text-gray-600">{reminder.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{reminder.date}</p>
              <button className="text-blue-500 hover:underline">Contactar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowUpReminders;