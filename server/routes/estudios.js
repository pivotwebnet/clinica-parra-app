const express = require("express");
const PDFDocument = require("pdfkit");
const { estudiosPorDni } = require("../data/estudios");
const { pacientes } = require("../data/pacientes");

const router = express.Router();

// Control de intentos fallidos por IP (control compensatorio ante la ausencia
// de login, ver spec §7 Seguridad). Reinicia cada 15 minutos.
const intentosFallidos = new Map();
const VENTANA_MS = 15 * 60 * 1000;
const MAX_INTENTOS = 5;

function registrarIntento(ip, exito) {
  const ahora = Date.now();
  const entry = intentosFallidos.get(ip);
  if (!entry || ahora - entry.desde > VENTANA_MS) {
    intentosFallidos.set(ip, { count: exito ? 0 : 1, desde: ahora });
    return;
  }
  entry.count = exito ? 0 : entry.count + 1;
}

function bloqueado(ip) {
  const entry = intentosFallidos.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.desde > VENTANA_MS) return false;
  return entry.count >= MAX_INTENTOS;
}

function buscarEstudioPorAcceso(estudioId, numeroAcceso) {
  const numero = String(numeroAcceso || "").trim();
  for (const [dni, estudios] of Object.entries(estudiosPorDni)) {
    const estudio = estudios.find((e) => e.id === estudioId && e.numeroAcceso === numero);
    if (estudio) return { dni, estudio };
  }
  return null;
}

// GET /api/estudios?dni=
// Lista visible solo con el documento. No expone médico, matrícula ni número
// de acceso: esos datos solo se entregan al abrir un informe puntual.
router.get("/", (req, res) => {
  const ip = req.ip;
  if (bloqueado(ip)) {
    return res.status(429).json({ error: "Demasiados intentos. Probá de nuevo en unos minutos." });
  }

  const dni = String(req.query.dni || "").trim();
  if (!dni) {
    return res.status(400).json({ error: "Ingresá tu documento." });
  }

  const paciente = pacientes.find((p) => p.dni === dni);
  const estudios = estudiosPorDni[dni];
  const encontrado = Boolean(paciente && estudios);
  registrarIntento(ip, encontrado);

  if (!encontrado) {
    return res.status(404).json({ error: "No encontramos estudios para ese documento." });
  }

  res.json({
    pacienteNombre: `${paciente.apellido}, ${paciente.nombre}`,
    estudios: estudios.map(({ id, fecha, tipo, servicio, estado, imagenes }) => ({
      id,
      fecha,
      tipo,
      servicio,
      estado,
      imagenes: imagenes || null,
    })),
  });
});

// POST /api/estudios/informe  { estudioId, numeroAcceso }
router.post("/informe", (req, res) => {
  const ip = req.ip;
  if (bloqueado(ip)) {
    return res.status(429).json({ error: "Demasiados intentos. Probá de nuevo en unos minutos." });
  }

  const { estudioId, numeroAcceso } = req.body || {};
  if (!estudioId || !numeroAcceso) {
    return res.status(400).json({ error: "Ingresá el número de acceso." });
  }

  const encontrado = buscarEstudioPorAcceso(estudioId, numeroAcceso);
  registrarIntento(ip, Boolean(encontrado));

  if (!encontrado) {
    return res.status(404).json({ error: "El número de acceso no coincide con este estudio." });
  }

  const { dni, estudio } = encontrado;
  if (estudio.estado !== "listo") {
    return res.status(409).json({ error: "El informe todavía no está disponible." });
  }

  const paciente = pacientes.find((p) => p.dni === dni);

  res.json({
    estudioId: estudio.id,
    pacienteNombre: `${paciente.apellido}, ${paciente.nombre}`,
    dni,
    fecha: estudio.fecha,
    tipo: estudio.tipo,
    servicio: estudio.servicio,
    medico: estudio.medico,
    matricula: estudio.matricula,
    numeroAcceso: estudio.numeroAcceso,
    imagenes: estudio.imagenes || null,
    firmadoEn: estudio.firmadoEn,
    informe: estudio.informe,
  });
});

// GET /api/estudios/pdf/:estudioId?numeroAcceso=
// Genera el PDF del informe (simula el documento del RIS/PACS). Se usa desde
// el botón "Guardar" de la vista de informe, ya validada con número de acceso.
router.get("/pdf/:estudioId", (req, res) => {
  const { numeroAcceso } = req.query;
  const encontrado = buscarEstudioPorAcceso(req.params.estudioId, numeroAcceso);
  if (!encontrado) {
    return res.status(403).json({ error: "Acceso no autorizado a este estudio." });
  }

  const { dni, estudio } = encontrado;
  if (estudio.estado !== "listo") {
    return res.status(409).json({ error: "El informe todavía no está disponible." });
  }
  const paciente = pacientes.find((p) => p.dni === dni);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${estudio.id}.pdf"`);

  const doc = new PDFDocument({ margin: 56 });
  doc.pipe(res);

  doc.fontSize(18).fillColor("#1F6F78").text("Clínica Parra");
  doc.fontSize(11).fillColor("#555").text(`Rafaela, Santa Fe — ${estudio.servicio}`);
  doc.moveDown(1.5);

  doc.fontSize(13).fillColor("#111").text(estudio.tipo);
  doc.moveDown(0.5);

  doc.fontSize(10).fillColor("#333");
  doc.text(`Paciente: ${paciente.apellido}, ${paciente.nombre}`);
  doc.text(`Documento: ${dni}`);
  doc.text(`Fecha: ${estudio.fecha}`);
  doc.text(`N° de acceso: ${estudio.numeroAcceso}`);
  doc.text(`Médico informante: ${estudio.medico} — ${estudio.matricula}`);
  doc.moveDown(1);

  doc.fontSize(11).fillColor("#111").text("Técnica", { underline: true });
  doc.fontSize(10).fillColor("#333").text(estudio.informe.tecnica, { align: "justify" });
  doc.moveDown(0.8);

  doc.fontSize(11).fillColor("#111").text("Hallazgos", { underline: true });
  doc.fontSize(10).fillColor("#333").text(estudio.informe.hallazgos, { align: "justify" });
  doc.moveDown(0.8);

  doc.fontSize(11).fillColor("#111").text("Conclusión", { underline: true });
  doc.fontSize(10).fillColor("#333").text(estudio.informe.conclusion, { align: "justify" });

  doc.moveDown(2);
  doc
    .fontSize(8)
    .fillColor("#888")
    .text("Documento generado con fines de demostración — Clínica Parra (mock).", { align: "center" });

  doc.end();
});

module.exports = router;
