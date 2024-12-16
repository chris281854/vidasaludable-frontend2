// src/hooks/useFetchEvaluacion.ts

import { useState, useEffect } from 'react';

// Define la estructura de los datos que esperas recibir de la API
interface Paciente {
    id: number;
    rup: string;
    nombre: string;
    apellido: string;
    sexo: string;
    ciudad: string;
    nacimiento: string;
    registro: string;
    estado: string;
    email: string;
    // Agrega otros campos según sea necesario
}

interface Historial {
    idHistorial: number;
    rup: string;
    objetivo: string;
    motivoConsulta: string;
    alergias: string;
    antecedentesPersonales: string;
    antecedentesFamiliares: string;
    peso: number;
    medicamentos: string;
    analiticas: string;
    resultados: string;
    tratamientos: string;
    observaciones: string;
    diagnosticoClinico: string;
    taGlicemiaSat: string;
    analiticasComplementarias: string;
    funcionSueno: string;
    nivelActividad: string;
    estadoFisico: string;
    nivelesAnciedad: string;
    otrasInformaciones: string;
    proximaCita: string;
    registro: string;
    modificacion: string;
    userName: string;
    paciente: Paciente; // Incluye el objeto paciente
}

const useFetchEvaluacion = (idHistorial: number | null) => {
    const [data, setData] = useState<Historial | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvaluacion = async () => {
            setLoading(true);
            setError(null);

            try {
                if (idHistorial) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/historial-clinico/${idHistorial}`); // Cambia esta URL según tu API
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de la evaluación');
                    }
                    const result: Historial = await response.json();
                    setData(result);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluacion();
    }, [idHistorial]);

    return { data, loading, error };
};

export default useFetchEvaluacion;