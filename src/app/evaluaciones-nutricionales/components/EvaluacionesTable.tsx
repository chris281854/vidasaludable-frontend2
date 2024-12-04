import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Evaluation {
  idEvaluacion: number;
  rup: string; // ID del paciente
  nombre: string;
  apellido: string;
  registro: string; // Fecha de evaluación
  proximaCita: string; // Fecha de la próxima cita
  observaciones: string; // Observaciones
  pesoLb: number; // Peso en libras
  IMC: number; // Índice de Masa Corporal
}

interface EvaluacionesTableProps {
  evaluations: Evaluation[];
}

const EvaluacionesTable: React.FC<EvaluacionesTableProps> = ({ evaluations }) => {
  return (
    <>
      {evaluations.length === 0 ? (
        <div className="text-center text-gray-500">No se encontraron evaluaciones.</div>
      ) : (
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table className="w-full bg-gray-100 text-gray-800 border border-gray-300">
            <TableHead className='text-slate-100'>
              <TableRow className="text-center bg-[#25aa80] ">
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/8">ID Evaluación</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/8">ID Paciente</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Nombre</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Apellido</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Fecha de Evaluación</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Próxima Cita</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Observaciones</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/8">Peso (lb)</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/8">IMC</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.idEvaluacion} className="hover:bg-gray-200 text-center transition duration-200">
                  <TableCell className="py-4 px-4 border-b border-gray-300">{evaluation.idEvaluacion}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{evaluation.rup}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{evaluation.nombre}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{evaluation.apellido}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{new Date(evaluation.registro).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{new Date(evaluation.proximaCita).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{evaluation.observaciones}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{evaluation.pesoLb}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{evaluation.IMC}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default EvaluacionesTable;