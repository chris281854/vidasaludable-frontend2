// interfaces.ts
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
    detallepaciente?: DetallePaciente[];
}