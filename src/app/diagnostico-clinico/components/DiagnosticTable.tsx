import React from 'react';

interface DiagnosticoClinico {
  paciente_id: number;
  paciente_rup: string;
  paciente_nombre: string;
  paciente_apellido: string;
  diagnosticoclinico_conclusiones_medicas: string;
  diagnosticoclinico_prioridad_diagnostico: 'ALTA' | 'MEDIA' | 'BAJA';
  diagnosticoclinico_fecha_diagnostico: string;
}

interface DiagnosticTableProps {
  diagnosticos: DiagnosticoClinico[];
}

const DiagnosticTable: React.FC<DiagnosticTableProps> = ({ diagnosticos }) => {
  const getPriorityColor = (prioridad: string) => {
    switch (prioridad?.toUpperCase()) {
      case 'ALTA':
        return 'text-red-600 font-bold';
      case 'MEDIA':
        return 'text-yellow-600 font-bold';
      case 'BAJA':
        return 'text-green-600 font-bold';
      default:
        return '';
    }
  };

  if (!diagnosticos || diagnosticos.length === 0) {
    return <div className="text-center text-gray-500">No se encontraron diagnósticos clínicos.</div>;
  }

  return (
    <table className="min-w-full bg-gray-100 text-gray-800 border border-gray-300">
      <thead className='text-slate-100'>
        <tr className="text-center bg-[#25aa80]">
          <th className="py-4 px-4 border-b border-gray-300">RUP</th>
          <th className="py-4 px-4 border-b border-gray-300">Nombre</th>
          <th className="py-4 px-4 border-b border-gray-300">Apellido</th>
          <th className="py-4 px-4 border-b border-gray-300">Conclusiones Médicas</th>
          <th className="py-4 px-4 border-b border-gray-300">Prioridad</th>
          <th className="py-4 px-4 border-b border-gray-300">Fecha de Diagnóstico</th>
        </tr>
      </thead>
      <tbody>
        {diagnosticos.map((diagnostico) => (
          <tr 
            key={`${diagnostico.paciente_id}-${diagnostico.paciente_rup}`}
            className="hover:bg-gray-200 text-center transition duration-200"
          >
            <td className="py-4 px-4 border-b border-gray-300">
              {diagnostico.paciente_rup || 'N/A'}
            </td>
            <td className="py-4 px-4 border-b border-gray-300">
              {diagnostico.paciente_nombre || 'N/A'}
            </td>
            <td className="py-4 px-4 border-b border-gray-300">
              {diagnostico.paciente_apellido || 'N/A'}
            </td>
            <td className="py-4 px-4 border-b border-gray-300">
              {diagnostico.diagnosticoclinico_conclusiones_medicas || 'N/A'}
            </td>
            <td className={`py-4 px-4 border-b border-gray-300 ${getPriorityColor(diagnostico.diagnosticoclinico_prioridad_diagnostico)}`}>
              {diagnostico.diagnosticoclinico_prioridad_diagnostico || 'N/A'}
            </td>
            <td className="py-4 px-4 border-b border-gray-300">
              {diagnostico.diagnosticoclinico_fecha_diagnostico ? 
                new Date(diagnostico.diagnosticoclinico_fecha_diagnostico).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DiagnosticTable;