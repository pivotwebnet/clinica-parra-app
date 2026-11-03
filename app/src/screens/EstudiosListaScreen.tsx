import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { Pressable, SectionList, StyleSheet, View } from "react-native";
import { Text } from "../components/Text";
import { Card } from "../components/Card";
import { colors, radius, spacing } from "../theme";
import { EstudioResumen, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EstudiosLista">;

export default function EstudiosListaScreen({ navigation, route }: Props) {
  const { dni, pacienteNombre, estudios } = route.params;

  const secciones = useMemo(() => {
    const ordenados = [...estudios].sort((a, b) => b.fecha.localeCompare(a.fecha));
    const grupos = new Map<string, EstudioResumen[]>();
    for (const estudio of ordenados) {
      const label = mesLabel(estudio.fecha);
      if (!grupos.has(label)) grupos.set(label, []);
      grupos.get(label)!.push(estudio);
    }
    return Array.from(grupos.entries()).map(([title, data]) => ({ title, data }));
  }, [estudios]);

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DNI {formatDni(dni)}</Text>
        <Text style={styles.title}>{pacienteNombre}</Text>
      </View>

      <SectionList
        contentContainerStyle={styles.list}
        sections={secciones}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item }) => (
          <EstudioItem
            estudio={item}
            onPress={() =>
              navigation.navigate("EstudiosNumeroAcceso", {
                estudioId: item.id,
                titulo: item.tipo,
                fecha: item.fecha,
              })
            }
          />
        )}
      />
    </View>
  );
}

function EstudioItem({ estudio, onPress }: { estudio: EstudioResumen; onPress: () => void }) {
  const listo = estudio.estado === "listo";
  return (
    <Pressable onPress={listo ? onPress : undefined} style={({ pressed }) => pressed && listo && styles.pressed}>
      <Card style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardType}>{estudio.tipo}</Text>
          <Text style={styles.cardMeta}>
            {formatFecha(estudio.fecha)} · {estudio.servicio}
            {estudio.imagenes ? ` · ${estudio.imagenes} imágenes` : ""}
          </Text>
          {listo ? (
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
              <Text style={styles.statusListo}>Informe listo</Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <Ionicons name="time-outline" size={14} color={colors.warn} />
              <Text style={styles.statusEnPreparacion}>El informe se publica dentro de las 48 h</Text>
            </View>
          )}
        </View>
        {listo ? <Text style={styles.cardCta}>Ver informe →</Text> : null}
      </Card>
    </Pressable>
  );
}

function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function formatDni(dni: string) {
  return dni.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function mesLabel(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  const label = d.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardType: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  statusListo: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accentStrong,
  },
  statusEnPreparacion: {
    fontSize: 12,
    color: colors.warn,
  },
  cardCta: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.accentStrong,
    marginLeft: spacing.sm,
  },
});
