import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { api, ApiError } from "../api/client";
import { Card } from "../components/Card";
import { InlineAlert } from "../components/InlineAlert";
import { LoadingState } from "../components/LoadingState";
import { PrimaryButton } from "../components/PrimaryButton";
import { Text } from "../components/Text";
import { colors, radius, spacing } from "../theme";
import { DiaDisponible, Prestador, PrimerDisponible, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TurnosHorario">;

export default function TurnosHorarioScreen({ navigation, route }: Props) {
  const { paciente, celular, obraSocial, especialidad } = route.params;

  const [modo, setModo] = useState<"primero" | "manual">("primero");

  const [primerDisponible, setPrimerDisponible] = useState<PrimerDisponible | null>(null);
  const [cargandoPrimero, setCargandoPrimero] = useState(true);
  const [errorPrimero, setErrorPrimero] = useState<string | null>(null);

  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [dias, setDias] = useState<DiaDisponible[]>([]);
  const [fecha, setFecha] = useState<string | null>(null);
  const [horario, setHorario] = useState<string | null>(null);
  const [cargandoManual, setCargandoManual] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPrimerDisponible(especialidad)
      .then(setPrimerDisponible)
      .catch((e) => setErrorPrimero(e instanceof ApiError ? e.message : "No hay turnos disponibles."))
      .finally(() => setCargandoPrimero(false));
  }, [especialidad]);

  function onElegirProfesional() {
    setModo("manual");
    if (prestadores.length === 0) {
      setCargandoManual(true);
      api
        .getPrestadores(especialidad)
        .then((data) => setPrestadores(data.prestadores))
        .catch(() => setError("No se pudieron cargar los profesionales."))
        .finally(() => setCargandoManual(false));
    }
  }

  function onElegirPrestador(p: Prestador) {
    setPrestador(p);
    setFecha(null);
    setHorario(null);
    setDias([]);
    setCargandoManual(true);
    api
      .getDias(p.id)
      .then((data) => setDias(data.dias))
      .catch(() => setError("No se pudieron cargar los días disponibles."))
      .finally(() => setCargandoManual(false));
  }

  async function onConfirmar() {
    const payload =
      modo === "primero" && primerDisponible
        ? { prestadorId: primerDisponible.prestadorId, fecha: primerDisponible.fecha, horario: primerDisponible.horario }
        : prestador && fecha && horario
          ? { prestadorId: prestador.id, fecha, horario }
          : null;

    if (!payload) return;

    setError(null);
    setEnviando(true);
    try {
      const { turno } = await api.crearTurno({
        dni: paciente.dni,
        apellido: paciente.apellido,
        nombre: paciente.nombre,
        edad: paciente.edad,
        sexo: paciente.sexo,
        obraSocial,
        celular,
        especialidad,
        ...payload,
      });
      navigation.navigate("TurnosConfirmacion", { turno });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  const horariosDelDia = dias.find((d) => d.fecha === fecha)?.horarios ?? [];
  const puedeConfirmar =
    (modo === "primero" && Boolean(primerDisponible)) ||
    (modo === "manual" && Boolean(prestador && fecha && horario));

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
      <Text style={styles.paso}>PASO 3 DE 3</Text>
      <Text style={styles.title}>Elegir horario</Text>
      <Text style={styles.subtitle}>{especialidad}</Text>

      {error ? <InlineAlert message={error} /> : null}

      {modo === "primero" ? (
        <>
          {cargandoPrimero ? (
            <LoadingState label="Buscando el primer turno disponible…" />
          ) : errorPrimero ? (
            <InlineAlert message={errorPrimero} />
          ) : primerDisponible ? (
            <Card style={styles.destacado}>
              <Text style={styles.destacadoEyebrow}>PRIMER TURNO DISPONIBLE</Text>
              <Text style={styles.destacadoFecha}>
                {formatFechaLarga(primerDisponible.fecha)} · {primerDisponible.horario} hs
              </Text>
              <Text style={styles.destacadoPrestador}>
                {primerDisponible.prestadorNombre} — {primerDisponible.matricula}
              </Text>
              <Text style={styles.destacadoLugar}>
                {primerDisponible.consultorio} · {primerDisponible.piso}
              </Text>
            </Card>
          ) : null}

          <Pressable onPress={onElegirProfesional} style={styles.linkWrap}>
            <Text style={styles.link}>Elegir profesional y horario</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.sectionLabel}>Profesional</Text>
          {cargandoManual && prestadores.length === 0 ? (
            <LoadingState label="Cargando profesionales…" />
          ) : null}
          <View style={styles.chipWrap}>
            {prestadores.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => onElegirPrestador(p)}
                style={[styles.chip, prestador?.id === p.id && styles.chipActive]}
              >
                <Text style={[styles.chipText, prestador?.id === p.id && styles.chipTextActive]}>
                  {p.nombre}
                </Text>
              </Pressable>
            ))}
          </View>

          {prestador ? (
            <>
              <Text style={styles.sectionLabel}>Día</Text>
              {cargandoManual && dias.length === 0 ? <LoadingState label="Cargando días disponibles…" /> : null}
              <View style={styles.chipWrap}>
                {dias.map((d) => (
                  <Pressable
                    key={d.fecha}
                    onPress={() => {
                      setFecha(d.fecha);
                      setHorario(null);
                    }}
                    style={[styles.chip, fecha === d.fecha && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, fecha === d.fecha && styles.chipTextActive]}>
                      {formatFechaCorta(d.fecha)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {fecha ? (
            <>
              <Text style={styles.sectionLabel}>Horario</Text>
              <View style={styles.chipWrap}>
                {horariosDelDia.map((h) => (
                  <Pressable
                    key={h}
                    onPress={() => setHorario(h)}
                    style={[styles.chip, horario === h && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, horario === h && styles.chipTextActive]}>{h}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          <Pressable onPress={() => setModo("primero")} style={styles.linkWrap}>
            <Text style={styles.link}>Volver al primer turno disponible</Text>
          </Pressable>
        </>
      )}

      <View style={{ height: spacing.md }} />
      <PrimaryButton
        label="Confirmar turno"
        onPress={onConfirmar}
        loading={enviando}
        disabled={!puedeConfirmar}
      />
    </ScrollView>
  );
}

function formatFechaLarga(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const label = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatFechaCorta(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  paso: { fontSize: 11, fontWeight: "700", color: colors.accent, letterSpacing: 0.8 },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.inkSoft, marginTop: 4, marginBottom: spacing.lg },
  destacado: { marginBottom: spacing.md, backgroundColor: colors.accentSoft, borderColor: colors.accent },
  destacadoEyebrow: { fontSize: 11, fontWeight: "700", color: colors.accentStrong, letterSpacing: 0.8 },
  destacadoFecha: { fontSize: 18, fontWeight: "800", color: colors.ink, marginTop: 6 },
  destacadoPrestador: { fontSize: 14, color: colors.ink, marginTop: 6, fontWeight: "600" },
  destacadoLugar: { fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  linkWrap: { alignItems: "center", marginVertical: spacing.md },
  link: { fontSize: 13, fontWeight: "700", color: colors.accentStrong },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.ink },
  chipTextActive: { color: "#fff" },
});
