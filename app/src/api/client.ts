import { Platform } from "react-native";
import type {
  AccesoEstudiosResponse,
  DiaDisponible,
  Especialidad,
  InformeEstudio,
  NuevoTurno,
  Paciente,
  PrimerDisponible,
  Prestador,
  Turno,
} from "../types";

// El emulador de Android no puede resolver "localhost" hacia la PC host,
// usa el alias especial 10.0.2.2. iOS/web sí resuelven localhost directo.
// Para un dispositivo físico con Expo Go, definir EXPO_PUBLIC_API_URL
// con la IP de LAN de la PC (ej: http://192.168.1.50:4000) en app/.env.
const FALLBACK_HOST = Platform.select({ android: "10.0.2.2", default: "localhost" });

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${FALLBACK_HOST}:4000`;

class ApiError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verificá tu conexión o intentá más tarde."
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `Ocurrió un error (${res.status}).`);
  }
  return res.json();
}

export const api = {
  getPaciente: (dni: string) => request<Paciente>(`/api/pacientes/${encodeURIComponent(dni)}`),

  getEstudios: (dni: string) =>
    request<AccesoEstudiosResponse>(`/api/estudios?dni=${encodeURIComponent(dni)}`),

  abrirInforme: (estudioId: string, numeroAcceso: string) =>
    request<InformeEstudio>(`/api/estudios/informe`, {
      method: "POST",
      body: JSON.stringify({ estudioId, numeroAcceso }),
    }),

  pdfUrl: (estudioId: string, numeroAcceso: string) =>
    `${API_BASE_URL}/api/estudios/pdf/${encodeURIComponent(estudioId)}` +
    `?numeroAcceso=${encodeURIComponent(numeroAcceso)}`,

  getEspecialidades: () => request<{ especialidades: Especialidad[] }>(`/api/turnos/especialidades`),

  getPrestadores: (especialidad: string) =>
    request<{ prestadores: Prestador[] }>(
      `/api/turnos/prestadores?especialidad=${encodeURIComponent(especialidad)}`
    ),

  getDias: (prestadorId: string) =>
    request<{ dias: DiaDisponible[] }>(`/api/turnos/dias?prestadorId=${encodeURIComponent(prestadorId)}`),

  getPrimerDisponible: (especialidad: string) =>
    request<PrimerDisponible>(
      `/api/turnos/primer-disponible?especialidad=${encodeURIComponent(especialidad)}`
    ),

  crearTurno: (payload: NuevoTurno) =>
    request<{ turno: Turno }>(`/api/turnos`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getTurnosPorDni: (dni: string) =>
    request<{ turnos: Turno[] }>(`/api/turnos?dni=${encodeURIComponent(dni)}`),

  cancelarTurno: (id: string, dni: string) =>
    request<{ turno: Turno }>(
      `/api/turnos/${encodeURIComponent(id)}?dni=${encodeURIComponent(dni)}`,
      { method: "DELETE" }
    ),
};

export { ApiError };
