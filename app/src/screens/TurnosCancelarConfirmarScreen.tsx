import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../components/Text";
import { api, ApiError } from "../api/client";
import { Card } from "../components/Card";
import { InlineAlert } from "../components/InlineAlert";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, spacing } from "../theme";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TurnosCancelarConfirmar">;

export default function TurnosCancelarConfirmarScreen({ navigation, route }: Props) {
  const { turno } = route.params;
  const [cancelando, setCancelando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelado, setCancelado] = useState(false);

  async function onCancelar() {
    setError(null);
    setCancelando(true);
    try {
      await api.cancelarTurno(turno.id, turno.dni);
      setCancelado(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setCancelando(false);
    }
  }

  if (cancelado) {
    return (
      <View style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓</Text>
          </View>
          <Text style={styles.title}>Turno cancelado</Text>
          <Text style={styles.subtitle}>Ya avisamos al servicio. Podés sacar otro turno cuando quieras.</Text>
        </View>
        <View style={styles.footer}>
          <PrimaryButton label="Volver al inicio" onPress={() => navigation.popToTop()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>¿Cancelar este turno?</Text>
        <Text style={styles.subtitle}>Esta acción no se puede deshacer.</Text>

        {error ? <InlineAlert message={error} /> : null}

        <Card style={styles.card}>
          <Row label="Paciente" value={`${turno.apellido}, ${turno.nombre}`} />
          <Row label="Especialidad" value={turno.especialidad} />
          <Row label="Profesional" value={turno.prestadorNombre} />
          <Row label="Fecha y horario" value={`${formatFecha(turno.fecha)} · ${turno.horario} hs`} last />
        </Card>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Cancelar turno" onPress={onCancelar} loading={cancelando} />
        <View style={{ height: spacing.sm }} />
        <PrimaryButton label="Volver" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, justifyContent: "space-between" },
  content: { padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: 14, color: colors.inkSoft, marginTop: 6, marginBottom: spacing.lg },
  card: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: 13, color: colors.inkSoft },
  rowValue: { fontSize: 13, color: colors.ink, fontWeight: "700" },
  footer: { padding: spacing.lg },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  badgeText: { fontSize: 26, color: colors.accentStrong, fontWeight: "800" },
});
