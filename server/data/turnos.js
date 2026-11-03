const especialidades = [
  { nombre: "Clínica Médica", sinonimos: ["fiebre", "chequeo", "control", "malestar general"] },
  { nombre: "Cardiología", sinonimos: ["corazón", "presión", "pecho", "palpitaciones"] },
  { nombre: "Traumatología", sinonimos: ["hueso", "fractura", "golpe", "rodilla", "espalda", "tobillo"] },
  { nombre: "Ginecología", sinonimos: ["embarazo", "papanicolau", "control ginecológico"] },
  { nombre: "Pediatría", sinonimos: ["niño", "niña", "bebé", "vacunas"] },
  { nombre: "Dermatología", sinonimos: ["piel", "lunar", "granos", "alergia en la piel"] },
  { nombre: "Oftalmología", sinonimos: ["ojos", "vista", "anteojos"] },
  { nombre: "Diagnóstico por Imágenes", sinonimos: ["radiografía", "ecografía", "estudio", "placa", "tomografía"] },
];

// Un único prestador por especialidad alcanza para el mock; matrícula, piso y
// consultorio se usan para completar la confirmación del turno (ver estudio
// de mercado §5: "la confirmación incluye dirección, piso y consultorio").
const prestadores = [
  { id: "PR-01", nombre: "Dr. Aguilar", matricula: "M.P. 10.221", especialidad: "Traumatología", consultorio: "Consultorio 4", piso: "1° piso" },
  { id: "PR-02", nombre: "Dra. Analía Ruiz Díaz", matricula: "M.P. 12.487", especialidad: "Diagnóstico por Imágenes", consultorio: "Consultorio 2", piso: "Planta baja" },
  { id: "PR-03", nombre: "Dr. Peralta", matricula: "M.P. 9.873", especialidad: "Clínica Médica", consultorio: "Consultorio 7", piso: "1° piso" },
  { id: "PR-04", nombre: "Dra. Fernández", matricula: "M.P. 12.310", especialidad: "Ginecología", consultorio: "Consultorio 9", piso: "2° piso" },
  { id: "PR-05", nombre: "Dr. Molina", matricula: "M.P. 8.654", especialidad: "Cardiología", consultorio: "Consultorio 3", piso: "1° piso" },
  { id: "PR-06", nombre: "Dra. Ibarra", matricula: "M.P. 13.092", especialidad: "Pediatría", consultorio: "Consultorio 11", piso: "2° piso" },
  { id: "PR-07", nombre: "Dra. Correa", matricula: "M.P. 13.550", especialidad: "Dermatología", consultorio: "Consultorio 5", piso: "1° piso" },
  { id: "PR-08", nombre: "Dr. Lanza", matricula: "M.P. 14.220", especialidad: "Oftalmología", consultorio: "Consultorio 6", piso: "1° piso" },
];

const DIRECCION = "Bv. Roca 2456, Rafaela";

const HORARIOS_BASE = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

// Turnos reservados en memoria (se reinicia al reiniciar el server).
const turnosReservados = [];

function proximosDiasHabiles(cantidad) {
  const dias = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1); // desde mañana
  while (dias.length < cantidad) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      dias.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias;
}

function horariosDisponibles(prestadorId, fecha) {
  const ocupados = new Set(
    turnosReservados
      .filter((t) => t.prestadorId === prestadorId && t.fecha === fecha && t.estado !== "cancelado")
      .map((t) => t.horario)
  );
  return HORARIOS_BASE.filter((h) => !ocupados.has(h));
}

module.exports = {
  especialidades,
  prestadores,
  DIRECCION,
  turnosReservados,
  proximosDiasHabiles,
  horariosDisponibles,
};
