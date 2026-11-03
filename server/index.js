const express = require("express");
const cors = require("cors");

const pacientesRouter = require("./routes/pacientes");
const estudiosRouter = require("./routes/estudios");
const turnosRouter = require("./routes/turnos");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/pacientes", pacientesRouter);
app.use("/api/estudios", estudiosRouter);
app.use("/api/turnos", turnosRouter);

app.listen(PORT, () => {
  console.log(`Clínica Parra mock API escuchando en http://localhost:${PORT}`);
});
