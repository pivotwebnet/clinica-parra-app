export interface Paciente {
  dni: string;
  apellido: string;
  nombre: string;
  edad: number;
  sexo: string;
  obraSocial: string;
  plan: string;
}

export interface Especialidad {
  nombre: string;
  sinonimos: string[];
}

export interface Prestador {
  id: string;
  nombre: string;
  matricula: string;
  especialidad: string;
  consultorio: string;
  piso: string;
}

export interface PrimerDisponible {
  prestadorId: string;
  prestadorNombre: string;
  matricula: string;
  especialidad: string;
  consultorio: string;
  piso: string;
  direccion: string;
  fecha: string;
  horario: string;
}

export interface DiaDisponible {
  fecha: string;
  horarios: string[];
}

export interface NuevoTurno {
  dni: string;
  apellido: string;
  nombre: string;
  edad: number;
  sexo: string;
  obraSocial: string;
  celular: string;
  especialidad: string;
  prestadorId: string;
  fecha: string;
  horario: string;
}

export interface Turno extends NuevoTurno {
  id: string;
  prestadorNombre: string;
  matricula: string;
  direccion: string;
  piso: string;
  consultorio: string;
  estado: string;
  creadoEn: string;
}

export type EstadoEstudio = "listo" | "en_preparacion";

export interface EstudioResumen {
  id: string;
  fecha: string;
  tipo: string;
  servicio: string;
  estado: EstadoEstudio;
  imagenes: number | null;
}

export interface AccesoEstudiosResponse {
  pacienteNombre: string;
  estudios: EstudioResumen[];
}

export interface InformeEstudio {
  estudioId: string;
  pacienteNombre: string;
  dni: string;
  fecha: string;
  tipo: string;
  servicio: string;
  medico: string;
  matricula: string;
  numeroAcceso: string;
  imagenes: number | null;
  firmadoEn: string;
  informe: {
    tecnica: string;
    hallazgos: string;
    conclusion: string;
  };
}

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  EstudiosAcceso: undefined;
  EstudiosLista: {
    dni: string;
    pacienteNombre: string;
    estudios: EstudioResumen[];
  };
  EstudiosNumeroAcceso: {
    estudioId: string;
    titulo: string;
    fecha: string;
  };
  EstudiosInforme: {
    informe: InformeEstudio;
  };
  TurnosQuien: undefined;
  TurnosEspecialidad: {
    paciente: Paciente;
    celular: string;
    obraSocial: string;
  };
  TurnosHorario: {
    paciente: Paciente;
    celular: string;
    obraSocial: string;
    especialidad: string;
  };
  TurnosConfirmacion: {
    turno: Turno;
  };
  TurnosCancelarBuscar: undefined;
  TurnosCancelarConfirmar: {
    turno: Turno;
  };
};
