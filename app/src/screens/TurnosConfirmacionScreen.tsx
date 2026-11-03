import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, spacing } from "../theme";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TurnosConfirmacion">;

export default function TurnosConfirmacionScreen({ navigation, route }: Props) {
  const { turno } = route.params;

  return (
    <View style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓</Text>
        </View>
        <Text style={styles.title}>Turno confirmado</Text>
        <Text style={styles.subtitle}>Guardá el número de turno como comprobante.</Text>

        <Card style={styles.card}>
          <Row label="N° de turno" value={turno.id} />
          <Row label="Paciente" value={`${turno.apellido}, ${turno.nombre}`} />
          <Row label="Especialidad" value={turno.especialidad} />
          <Row label="Profesional" value={`${turno.prestadorNombre} — ${turno.matricula}`} />
          <Row label="Fecha y horario" value={`${formatFecha(turno.fecha)} · ${turno.horario} hs`} />
          <Row label="Dirección" value={turno.direccion} />
          <Row label="Piso y consultorio" value={`${turno.piso} · ${turno.consultorio}`} last />
        </Card>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Volver al inicio" onPress={() => navigation.popToTop()} />
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
  title: { fontSize: 24, fontWeight: "800", color: colors.ink },
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
});
