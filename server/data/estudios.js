// Estudios de prueba organizados por DNI (igual que /api/pacientes), para que
// "Ver mis estudios" se consulte solo con el documento. El número de acceso
// de cada estudio se guarda aparte y recién se valida al abrir un informe
// puntual (ver propuesta de interfaz §3 y estudio de mercado §5).
const estudiosPorDni = {
  "30111222": [
    {
      id: "EST-1001",
      numeroAcceso: "20260828114",
      fecha: "2026-08-28",
      tipo: "Ecografía abdominal",
      servicio: "Servicio de Imágenes",
      medico: "Dra. Analía Ruiz Díaz",
      matricula: "M.P. 12.487",
      estado: "listo",
      imagenes: 14,
      firmadoEn: "2026-08-29T09:12:00",
      informe: {
        tecnica:
          "Se explora el abdomen con transductor convexo de 3,5 MHz, en ayunas, en cortes longitudinales y transversales.",
        hallazgos:
          "Hígado de tamaño y ecoestructura conservados, sin lesiones focales. Vía biliar intra y extrahepática no dilatada. Vesícula de paredes finas, sin litiasis en su interior. Páncreas y bazo sin particularidades. Ambos riñones de tamaño y morfología conservados, sin dilatación pielocalicial ni imágenes litiásicas. Vejiga de paredes regulares.",
        conclusion: "Ecografía abdominal dentro de límites normales.",
      },
    },
    {
      id: "EST-1002",
      numeroAcceso: "20260821740",
      fecha: "2026-08-21",
      tipo: "Laboratorio · Hemograma",
      servicio: "Extracción 07:40",
      medico: "Dr. Peralta",
      matricula: "M.P. 9.873",
      estado: "listo",
      firmadoEn: "2026-08-21T14:30:00",
      informe: {
        tecnica: "Hemograma completo con recuento diferencial.",
        hallazgos: "Serie roja, blanca y plaquetaria dentro de valores de referencia.",
        conclusion: "Hemograma sin alteraciones significativas.",
      },
    },
    {
      id: "EST-1003",
      numeroAcceso: "20260830221",
      fecha: "2026-08-30",
      tipo: "Radiografía de tórax",
      servicio: "Servicio de Imágenes",
      medico: "Dra. Analía Ruiz Díaz",
      matricula: "M.P. 12.487",
      estado: "en_preparacion",
    },
    {
      id: "EST-1004",
      numeroAcceso: "20260712089",
      fecha: "2026-07-12",
      tipo: "Electrocardiograma",
      servicio: "Consultorios externos",
      medico: "Dr. Molina",
      matricula: "M.P. 8.654",
      estado: "listo",
      firmadoEn: "2026-07-12T11:05:00",
      informe: {
        tecnica: "ECG de 12 derivaciones en reposo.",
        hallazgos: "Ritmo sinusal, frecuencia cardíaca 72 lpm. Sin alteraciones de la repolarización.",
        conclusion: "Electrocardiograma dentro de límites normales.",
      },
    },
  ],
  "28555444": [
    {
      id: "EST-2001",
      numeroAcceso: "20260801556",
      fecha: "2026-08-01",
      tipo: "Tomografía de cráneo",
      servicio: "Servicio de Imágenes",
      medico: "Dra. Analía Ruiz Díaz",
      matricula: "M.P. 12.487",
      estado: "listo",
      imagenes: 32,
      firmadoEn: "2026-08-01T16:20:00",
      informe: {
        tecnica: "TC de cráneo sin contraste endovenoso, cortes axiales.",
        hallazgos:
          "No se observan lesiones ocupantes de espacio. Sistema ventricular de tamaño y topografía habituales.",
        conclusion: "Tomografía de cráneo sin hallazgos patológicos.",
      },
    },
    {
      id: "EST-2002",
      numeroAcceso: "20260620774",
      fecha: "2026-06-20",
      tipo: "Radiografía de columna lumbar",
      servicio: "Servicio de Imágenes",
      medico: "Dra. Analía Ruiz Díaz",
      matricula: "M.P. 12.487",
      estado: "listo",
      firmadoEn: "2026-06-20T12:40:00",
      informe: {
        tecnica: "Radiografía de columna lumbosacra, frente y perfil.",
        hallazgos: "Rectificación de la lordosis lumbar. No se observan lesiones líticas ni blásticas.",
        conclusion: "Rectificación lumbar, sin otros hallazgos.",
      },
    },
    {
      id: "EST-2003",
      numeroAcceso: "20260311932",
      fecha: "2026-03-11",
      tipo: "Radiografía de rodilla derecha",
      servicio: "Servicio de Imágenes",
      medico: "Dra. Analía Ruiz Díaz",
      matricula: "M.P. 12.487",
      estado: "listo",
      firmadoEn: "2026-03-11T10:15:00",
      informe: {
        tecnica: "Radiografía de rodilla derecha, frente y perfil.",
        hallazgos: "Espacios articulares conservados. No se observan signos de fractura reciente.",
        conclusion: "Sin hallazgos agudos.",
      },
    },
  ],
  "40222333": [
    {
      id: "EST-3001",
      numeroAcceso: "20260815903",
      fecha: "2026-08-15",
      tipo: "Ecografía tiroidea",
      servicio: "Servicio de Imágenes",
      medico: "Dra. Analía Ruiz Díaz",
      matricula: "M.P. 12.487",
      estado: "listo",
      imagenes: 6,
      firmadoEn: "2026-08-15T13:05:00",
      informe: {
        tecnica: "Ecografía de glándula tiroides con transductor lineal de alta frecuencia.",
        hallazgos: "Glándula tiroides de tamaño y ecoestructura conservados. No se observan nódulos.",
        conclusion: "Ecografía tiroidea sin hallazgos patológicos.",
      },
    },
  ],
};

module.exports = { estudiosPorDni };
