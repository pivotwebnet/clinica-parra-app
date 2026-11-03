# Clínica Parra — App móvil

Implementación de la app (React Native + Expo) según la propuesta de interfaz y el estudio de
mercado de Pivot. Sin login: se entra siempre con el documento. Dos módulos — turnos (sacar y
cancelar) y consulta de estudios — más las cinco decisiones del estudio de mercado ya incorporadas:
"quién se atiende" sin cuenta, "primer turno disponible" como opción principal, especialidades
como lista tocable con sinónimos por síntoma, confirmación con dirección/piso/consultorio, y la
consulta de estudios como diferencial frente a la competencia. Las videoconsultas quedan fuera de
esta etapa (ver estudio de mercado §6).

## Estructura

- `server/` — Backend simulado (Express). Datos de pacientes/estudios/turnos en memoria,
  pensado para reemplazarse por la integración real con el HIS/RIS/PACS de la clínica.
- `app/` — App Expo (React Native + TypeScript).

## Cómo correrlo

**1. Backend simulado**

```
cd server
npm install
npm start
```

Queda escuchando en `http://localhost:4000`.

**2. App**

```
cd app
npm install
npm run web      # navegador
npm run android  # emulador/dispositivo Android
npm run ios      # simulador iOS (requiere macOS)
```

- **Web / simulador iOS / emulador Android**: la app usa `localhost:4000` (o `10.0.2.2:4000`
  en el emulador Android) automáticamente.
- **Dispositivo físico con Expo Go**: creá `app/.env` con la IP de LAN de tu PC:
  ```
  EXPO_PUBLIC_API_URL=http://192.168.X.X:4000
  ```

## Datos de prueba

**Pacientes** (DNI — usado tanto para turnos como para estudios):
- `30111222` — Gimenez, Marcela — OSDE 310 — 4 estudios (uno "en preparación")
- `28555444` — Roldan, Hector — IAPOS General — 3 estudios
- `40222333` — Ferreyra, Lucia — Swiss Medical SMG02 — 1 estudio
- `35999888` — Bettinelli, Marcos — Particular — sin estudios cargados
- `22444111` — Weber, Ana — PAMI I — sin estudios cargados

**Estudios**: en "Ver mis estudios" alcanza con el DNI. El número de acceso (p. ej.
`20260828114`) se pide recién al abrir un informe puntual — está en `server/data/estudios.js`
junto a cada estudio.

## Pendiente / próximos pasos

- Reemplazar el backend mock por la integración real con el sistema de turnos y el RIS/PACS.
- Definir con la clínica los controles compensatorios de seguridad (rate limiting ya
  implementado a nivel básico en `/api/estudios` y `/api/estudios/informe`, CAPTCHA, expiración
  de accesos — ver spec §7).
- Videoconsultas: segunda etapa, presupuesto y alcance aparte (identidad del paciente, consentimiento
  informado, receta electrónica Ley 27.553, resguardo de datos Ley 25.326 — ver estudio de mercado §6).
- Ícono, splash screen y nombre definitivo de la app en `app/app.json`.
- Empaquetado para stores (EAS Build) cuando el flujo esté validado con la clínica.
