const express = require("express");
const { pacientes } = require("../data/pacientes");

const router = express.Router();

// GET /api/pacientes/:dni
router.get("/:dni", (req, res) => {
  const dni = String(req.params.dni || "").trim();
  const paciente = pacientes.find((p) => p.dni === dni);

  if (!paciente) {
    return res.status(404).json({ error: "No se encontró un paciente con ese DNI." });
  }

  res.json(paciente);
});

module.exports = router;
