export interface DetallePaciente {
    objetivo: string;
    motivo: string;
  }
  
  export interface Patient {
    rup: string;
    nombre: string;
    apellido: string;
    sexo: string;
    ciudad: string;
    nacimiento: string;
    registro: string;
    email: string;
    detallePaciente?: DetallePaciente;
  }
  
  export interface FormData {
    analiticas: string;
    observaciones: string;
    conclusionMedica: string;
    requiereEvaluacion: string;
    prioridad: string;
    codigoMedico: string;
    nombreMedico: string;
    apellidoMedico: string;
    especialidad: string;
    firmaDigital: boolean;
    firmadoPor: string;
    fechaFirma: string;
    resultados: string;
    observacionesPrioridad: string;
    fechaDiagnostico: string;
    fechaProximaRevision: string;
    rupPaciente: string;
    nombrePaciente: string;
    apellidoPaciente: string;
    ciudadPaciente: string;
    fechaRegistro: string | null;
    objetivoConsulta: string;
  }
  
  export interface DiagnosticoResponse {
    id: string;
    analiticas: string;
    observaciones: string;
    conclusionMedica: string;
    seguimiento: boolean;
    prioridad: string;
    idMedico: number;
    medico?: {
      nombre: string;
      apellido: string;
      especialidad: string;
    };
    firmadoPor: string;
    fechaFirma: string;
    resultados: string;
    observacionesPriodidad: string;
    fechaDiagnostico: string;
    proximaVisita: string;
    rup: string;
    paciente?: {
      nombre: string;
      apellido: string;
      ciudad: string;
      fechaRegistro: string;
      objetivoConsulta: string;
    };
  }