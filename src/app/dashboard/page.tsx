 'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MenuItem from '../../app/dashboard/components/MenuItem';
import PatientGoalTracker from '../../app/dashboard/components/PatientGoalTracker';
import BMICalculator from '../../app/dashboard/components/BMICalculator';
import FollowUpReminders from '../../app/dashboard/components/FollowUpReminders';

const NutritionMenu: React.FC = () => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const user = {
    name: "Dr. María García",
    role: "Nutricionista Senior",
    avatar: "/avatar.jpg",
    email: "maria.garcia@nutricion.com",
    lastLogin: "2023-05-18 09:30",
    patientsToday: 8,
    nextAppointment: { time: "14:30", patient: "Juan Pérez" }
  };

  const notifications = [
    { id: 1, message: "Nuevo paciente registrado: Laura Martínez" },
    { id: 2, message: "Recordatorio: Actualizar plan nutricional de Juan Pérez" },
    { id: 3, message: "Resultado de laboratorio disponible para Carlos Ruiz" },
  ];

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de búsqueda aquí
    console.log("Buscando:", searchTerm);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#25aa80] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sistema de Nutrición</h1>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="py-2 px-4 pr-10 rounded-full text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <button
              onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
              className="relative p-2 rounded-full hover:bg-[#1e8f6e] transition duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {notifications.length}
                </span>
              )}
            </button>
            <Image src={user.avatar} alt="Avatar" width={40} height={40} className="rounded-full" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm">{user.role}</p>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8">
        {isNotificationPanelOpen && (
          <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4">Notificaciones</h3>
            {notifications.map((notification) => (
              <div key={notification.id} className="mb-2 p-2 bg-gray-100 rounded">
                {notification.message}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex items-center mb-4">
            <Image src={user.avatar} alt="Avatar" width={80} height={80} className="rounded-full mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.role}</p>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Último acceso: {user.lastLogin}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Pacientes atendidos hoy: {user.patientsToday}</p>
              <p className="font-semibold">Próxima cita: {user.nextAppointment.time} - {user.nextAppointment.patient}</p>
            </div>
            <div className="text-right">
              <Link href="/agenda" className="bg-[#25aa80] text-white px-4 py-2 rounded-full hover:bg-[#1e8f6e] transition duration-300">
                Ver agenda completa
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Acceso rápido</h2>
        <div className="flex flex-wrap -mx-4">
          <MenuItem
            href="/paciente"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            label="Pacientes"
          />
          <MenuItem
            href="/diagnostico-clinico"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            label="Diagnóstico"
          />
          <MenuItem
            href="/plan-nutricional"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            label="Plan Nutricional"
          />
          <MenuItem
            href="/proyecciones"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
            label="Proyecciones"
          />
          <MenuItem
            href="/evaluaciones"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Evaluaciones"
          />
          <MenuItem
            href="/historial-clinico"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Historial Clínico"
          />
          <MenuItem
            href="/ajustes"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Ajustes"
          />
          <MenuItem
            href="/reportes"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            label="Reportes"
          />
          <MenuItem
            href="/parametrizacion"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>}
            label="Parametrización"
          />
          <MenuItem
            href="/novedades"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            label="Novedades"
          />
          <MenuItem
            href="/calendario"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            label="Calendario"
          />
       <MenuItem
            href="/contabilidad"
            icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            }
            label="Contabilidad y Facturación"
            />
          </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Acceso rápido</h2>
        <div className="flex flex-wrap -mx-4">
          {/* ... (mantener los MenuItems como están) ... */}
        </div>
    
        <PatientGoalTracker />
        <BMICalculator />
        <FollowUpReminders />

        {/* Consejo Nutricional del Día */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Consejo Nutricional del Día</h2>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-700">
              "Incorpora más alimentos ricos en omega-3 en tu dieta, como pescado azul, nueces y semillas de chía. 
              Estos ácidos grasos son esenciales para la salud cardiovascular y cerebral."
            </p>
          </div>
          <Link href="/consejos" className="mt-4 inline-block text-[#25aa80] hover:underline">
            Ver más consejos
          </Link>
        </div>

        {/* Artículos Recientes */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Artículos Recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Los beneficios de la dieta mediterránea', date: '15 May 2023' },
              { title: 'Cómo leer etiquetas nutricionales correctamente', date: '10 May 2023' },
            ].map((article, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.date}</p>
                <Link href={`/articulos/${index}`} className="mt-2 inline-block text-[#25aa80] hover:underline">
                  Leer más
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Progreso de Objetivos Mensuales */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Progreso de Objetivos Mensuales</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-[#25aa80]">Nuevos pacientes</span>
                <span className="text-sm font-medium text-[#25aa80]">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-[#25aa80] h-2.5 rounded-full" style={{width: '70%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-600">Consultas realizadas</span>
                <span className="text-sm font-medium text-blue-600">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Chat flotante */}
      <div className="fixed bottom-4 right-4">
        {isChatOpen ? (
          <div className="bg-white rounded-lg shadow-lg w-80">
            <div className="bg-[#25aa80] text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-bold">Chat de soporte</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-64 overflow-y-auto p-4">
              {chatMessages.map((message, index) => (
                <div key={index} className="mb-2">
                  <p className="bg-gray-100 p-2 rounded-lg inline-block">{message}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#25aa80]"
                />
                <button
                  type="submit"
                  className="bg-[#25aa80] text-white px-4 py-2 rounded-r-lg hover:bg-[#1e8f6e] transition duration-300"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-[#25aa80] text-white p-4 rounded-full shadow-lg hover:bg-[#1e8f6e] transition duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Sistema de Nutrición. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default NutritionMenu;