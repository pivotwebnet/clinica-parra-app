const express = require("express");
const {
  especialidades,
  prestadores,
  DIRECCION,
  turnosReservados,
  proximosDiasHabiles,
  horariosDisponibles,
} = require("../data/turnos");

const router = express.Router();

const DIAS_A_OFRECER = 6;

// GET /api/turnos/especialidades
router.get("/especialidades", (req, res) => {
  res.json({ especialidades });
});

// GET /api/turnos/prestadores?especialidad=
router.get("/prestadores", (req, res) => {
  const { especialidad } = req.query;
  const lista = especialidad ? prestadores.filter((p) => p.especialidad === especialidad) : prestadores;
  res.json({ prestadores: lista });
});

// GET /api/turnos/dias?prestadorId=
router.get("/dias", (req, res) => {
  const { prestadorId } = req.query;
  if (!prestadorId) {
    return res.status(400).json({ error: "Falta el prestador." });
  }
  const dias = proximosDiasHabiles(DIAS_A_OFRECER)
    .map((fecha) => ({ fecha, horarios: horariosDisponibles(prestadorId, fecha) }))
    .filter((d) => d.horarios.length > 0);
  res.json({ dias });
});

// GET /api/turnos/primer-disponible?especialidad=
// "Primer turno disponible" como opción principal (ver estudio de mercado §3).
router.get("/primer-disponible", (req, res) => {
  const { especialidad } = req.query;
  if (!especialidad) {
    return res.status(400).json({ error: "Falta la especialidad." });
  }

  const candidatos = prestadores.filter((p) => p.especialidad === especialidad);
  if (candidatos.length === 0) {
    return res.status(404).json({ error: "No hay profesionales para esa especialidad." });
  }

  const dias = proximosDiasHabiles(DIAS_A_OFRECER);
  for (const fecha of dias) {
    for (const prestador of candidatos) {
      const horarios = horariosDisponibles(prestador.id, fecha);
      if (horarios.length > 0) {
        return res.json({
          prestadorId: prestador.id,
          prestadorNombre: prestador.nombre,
          matricula: prestador.matricula,
          especialidad: prestador.especialidad,
          consultorio: prestador.consultorio,
          piso: prestador.piso,
          direccion: DIRECCION,
          fecha,
          horario: horarios[0],
        });
      }
    }
  }
  res.status(404).json({ error: "No hay turnos disponibles en los próximos días." });
});

// POST /api/turnos  { dni, apellido, nombre, edad, sexo, obraSocial, celular, especialidad, prestadorId, fecha, horario }
router.post("/", (req, res) => {
  const { dni, especialidad, prestadorId, fecha, horario } = req.body || {};
  if (!dni || !especialidad || !prestadorId || !fecha || !horario) {
    return res.status(400).json({ error: "Faltan datos obligatorios del turno." });
  }

  const prestador = prestadores.find((p) => p.id === prestadorId);
  if (!prestador) {
    return res.status(404).json({ error: "Profesional no encontrado." });
  }

  if (!horariosDisponibles(prestadorId, fecha).includes(horario)) {
    return res.status(409).json({ error: "Ese horario ya no está disponible. Elegí otro." });
  }

  const turno = {
    id: `TRN-${1000 + turnosReservados.length + 1}`,
    dni: String(dni),
    apellido: req.body.apellido || "",
    nombre: req.body.nombre || "",
    edad: req.body.edad,
    sexo: req.body.sexo,
    obraSocial: req.body.obraSocial || "No tengo",
    celular: req.body.celular || "",
    especialidad,
    prestadorId: prestador.id,
    prestadorNombre: prestador.nombre,
    matricula: prestador.matricula,
    direccion: DIRECCION,
    piso: prestador.piso,
    consultorio: prestador.consultorio,
    fecha,
    horario,
    estado: "confirmado",
    creadoEn: new Date().toISOString(),
  };
  turnosReservados.push(turno);

  res.status(201).json({ turno });
});

// GET /api/turnos?dni=  — turnos vigentes de un paciente, para cancelar.
router.get("/", (req, res) => {
  const dni = String(req.query.dni || "").trim();
  if (!dni) {
    return res.status(400).json({ error: "Falta el DNI." });
  }
  const hoy = new Date().toISOString().slice(0, 10);
  const turnos = turnosReservados
    .filter((t) => t.dni === dni && t.estado !== "cancelado" && t.fecha >= hoy)
    .sort((a, b) => (a.fecha + a.horario).localeCompare(b.fecha + b.horario));
  res.json({ turnos });
});

// DELETE /api/turnos/:id?dni=
router.delete("/:id", (req, res) => {
  const dni = String(req.query.dni || "").trim();
  const turno = turnosReservados.find((t) => t.id === req.params.id);
  if (!turno || turno.dni !== dni) {
    return res.status(404).json({ error: "Turno no encontrado." });
  }
  turno.estado = "cancelado";
  res.json({ turno });
});

module.exports = router;
