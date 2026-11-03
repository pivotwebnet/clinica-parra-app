import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../components/Text";
import { api } from "../api/client";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, spacing } from "../theme";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EstudiosInforme">;

export default function EstudiosInformeScreen({ navigation, route }: Props) {
  const { informe } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: informe.tipo });
  }, [navigation, informe.tipo]);

  function onGuardar() {
    Linking.openURL(api.pdfUrl(informe.estudioId, informe.numeroAcceso));
  }

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.letterhead}>
          <Text style={styles.hospital}>Clínica Parra</Text>
          <Text style={styles.servicio}>{informe.servicio}</Text>
        </View>

        <View style={styles.infoGrid}>
          <InfoCell label="Paciente" value={informe.pacienteNombre} />
          <InfoCell label="Documento" value={formatDni(informe.dni)} />
          <InfoCell label="Fecha" value={formatFecha(informe.fecha)} />
          <InfoCell label="N° de acceso" value={informe.numeroAcceso} />
        </View>

        <Section title="Técnica" text={informe.informe.tecnica} />
        <Section title="Hallazgos" text={informe.informe.hallazgos} />
        <Section title="Conclusión" text={informe.informe.conclusion} />

        <View style={styles.firma}>
          <Text style={styles.firmaNombre}>{informe.medico}</Text>
          <Text style={styles.firmaMatricula}>{informe.matricula}</Text>
          {informe.firmadoEn ? (
            <Text style={styles.firmaFecha}>
              Firmado digitalmente el {formatFechaHora(informe.firmadoEn)}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {informe.imagenes ? (
          <Text style={styles.imagenes}>{informe.imagenes} imágenes</Text>
        ) : (
          <View />
        )}
        <View style={{ width: 160 }}>
          <PrimaryButton label="Guardar" onPress={onGuardar} />
        </View>
      </View>
    </View>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatFechaHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDni(dni: string) {
  return dni.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { padding: spacing.lg },
  letterhead: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  hospital: { fontSize: 18, fontWeight: "800", color: colors.accentStrong },
  servicio: { fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.lg },
  infoCell: { width: "50%", marginBottom: spacing.sm },
  infoLabel: { fontSize: 11, fontWeight: "700", color: colors.inkFaint, textTransform: "uppercase" },
  infoValue: { fontSize: 14, color: colors.ink, marginTop: 2, fontWeight: "600" },
  section: { marginBottom: spacing.md },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.ink,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionText: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  firma: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  firmaNombre: { fontSize: 14, fontWeight: "700", color: colors.ink },
  firmaMatricula: { fontSize: 12, color: colors.inkSoft, marginTop: 2 },
  firmaFecha: { fontSize: 11, color: colors.inkFaint, marginTop: 6 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  imagenes: { fontSize: 13, fontWeight: "700", color: colors.inkSoft },
});
