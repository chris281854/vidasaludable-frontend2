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

interface Evaluacion {
    idEvaluacion: number;
    rup: string;
    objetivo: string;
    motivoConsulta: string;
    alergias: string;
    antecedentes: string;
    medicamentos: string;
    analiticas: string;
    tratamientos: string;
    observaciones: string;
    funcionIntestital: string;
    funcionSueno: string;
    nivelActividad: string;
    ingestaAlcoholica: string;
    nivelesAnciedad: string;
    otrasInformaciones: string;
    tallaMt: number;
    tallaCm: number;
    tallaPie: number;
    tallaPgs: number;
    pesoLb: number;
    tallaKg: number;
    indiceCadera: number;
    indiceCintura: number;
    IMC: number;
    porcientoGrasa: number;
    grasaViceral: number;
    pesoGraso: number;
    metabolismo: number;
    pesoMagro: number;
    diagnosticoNutricional: string;
    conclusionMedica: string;
    idMedico: number;
    analiticasRecomendadas: string;
    liquidoRecomendado: string;
    farmacos: string;
    otrasRecomendaciones: string;
    proximaCita: string;
    registro: string;
    modificacion: string;
    userName: string;
    paciente: Paciente; // Incluye el objeto paciente
}

const useFetchEvaluacion = (idEvaluacion: number | null) => {
    const [data, setData] = useState<Evaluacion | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvaluacion = async () => {
            setLoading(true);
            setError(null);

            try {
                if (idEvaluacion) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/evaluaciones-nutricionales/${idEvaluacion}`); // Cambia esta URL según tu API
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de la evaluación');
                    }
                    const result: Evaluacion = await response.json();
                    setData(result);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchEvaluacion();
    }, [idEvaluacion]);

    return { data, loading, error };
};

export default useFetchEvaluacion;