import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface Historial {
  idHistorial: number;
  rup: string; // ID del paciente
  nombre: string;
  apellido: string;
  registro: string; // Fecha de evaluación
  proximaCita: string; // Fecha de la próxima cita
  observaciones: string; // Observaciones
  conclusionesMedicas: string; // Asegúrate de que este campo esté disponible
}

interface HistorialTableProps {
  historial: Historial[];
}

const HistorialTable: React.FC<HistorialTableProps> = ({ historial }) => {
  return (
    <>
      {historial.length === 0 ? (
        <div className="text-center text-green-800">No se encontraron historiles Clinicos para mostrar.</div>
      ) : (
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table className="w-full bg-gray-100 text-gray-800 border border-gray-300">
            <TableHead className='text-slate-100'>
              <TableRow className="text-center bg-[#25aa80] ">
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/8">ID Historial</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/8">ID Paciente</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Nombre</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Apellido</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Fecha de Evaluación</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Próxima Cita</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/4">Observaciones</TableCell>
                <TableCell className="py-4 px-4 border-b border-gray-300 font-bold text-white w-1/8">Conclusiones Clinicas</TableCell>
 
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map((historial) => (
                <TableRow key={historial.idHistorial} className="hover:bg-gray-200 text-center transition duration-200">
                  <TableCell className="py-4 px-4 border-b border-gray-300">{historial.idHistorial}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{historial.rup}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{historial.nombre}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{historial.apellido}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{new Date(historial.registro).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{new Date(historial.proximaCita).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{historial.observaciones}</TableCell>
                  <TableCell className="py-4 px-4 border-b border-gray-300">{historial.conclusionesMedicas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default HistorialTable;