import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius, spacing } from "../theme";
import { RootStackParamList } from "../types";

type IconName = keyof typeof Ionicons.glyphMap;

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CLÍNICA PARRA</Text>
        <Text style={styles.title}>Rafaela, Santa Fe</Text>
        <Text style={styles.subtitle}>¿Qué necesitás hacer? Todo se hace con tu documento.</Text>
      </View>

      <View style={styles.actions}>
        <OptionCard
          icon="calendar-outline"
          eyebrow="Turnos"
          title="Sacar un turno"
          description="Elegí especialidad, día y horario."
          onPress={() => navigation.navigate("TurnosQuien")}
        />
        <OptionCard
          icon="document-text-outline"
          eyebrow="Estudios"
          title="Ver mis estudios"
          description="Informes y resultados de laboratorio e imágenes."
          onPress={() => navigation.navigate("EstudiosAcceso")}
        />
        <OptionCard
          icon="close-circle-outline"
          eyebrow="Turnos"
          title="Cancelar un turno"
          description="Buscá tu turno por documento y cancelalo."
          onPress={() => navigation.navigate("TurnosCancelarBuscar")}
        />
      </View>

      <Text style={styles.footnote}>
        No hay que crear usuario ni recordar contraseña. No guardamos nada en el teléfono: al
        cerrar la app se termina la sesión.
      </Text>
    </SafeAreaView>
  );
}

function OptionCard({
  icon,
  eyebrow,
  title,
  description,
  onPress,
}: {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.iconBadge}>
        <Ionicons name={icon} size={22} color={colors.accentStrong} />
      </View>
      <Text style={styles.cardEyebrow}>{eyebrow}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <Text style={styles.cardCta}>Continuar →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
  },
  cardPressed: {
    opacity: 0.85,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
  cardCta: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.accentStrong,
    marginTop: spacing.md,
  },
  footnote: {
    marginTop: "auto",
    marginBottom: spacing.lg,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: "center",
    lineHeight: 17,
  },
});
