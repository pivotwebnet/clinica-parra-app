// Datos de prueba. En producción esto vendría del HIS de la clínica.
const pacientes = [
  {
    dni: "30111222",
    apellido: "Gimenez",
    nombre: "Marcela Alejandra",
    edad: 41,
    sexo: "F",
    obraSocial: "OSDE",
    plan: "310",
  },
  {
    dni: "28555444",
    apellido: "Roldan",
    nombre: "Hector Daniel",
    edad: 54,
    sexo: "M",
    obraSocial: "IAPOS",
    plan: "General",
  },
  {
    dni: "40222333",
    apellido: "Ferreyra",
    nombre: "Lucia Belen",
    edad: 25,
    sexo: "F",
    obraSocial: "Swiss Medical",
    plan: "SMG02",
  },
  {
    dni: "35999888",
    apellido: "Bettinelli",
    nombre: "Marcos Ezequiel",
    edad: 30,
    sexo: "M",
    obraSocial: "Particular",
    plan: "-",
  },
  {
    dni: "22444111",
    apellido: "Weber",
    nombre: "Ana Sofia",
    edad: 63,
    sexo: "F",
    obraSocial: "PAMI",
    plan: "I",
  },
];

module.exports = { pacientes };
