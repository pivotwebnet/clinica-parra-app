import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Text } from "../components/Text";
import { api } from "../api/client";
import { Card } from "../components/Card";
import { InlineAlert } from "../components/InlineAlert";
import { LoadingState } from "../components/LoadingState";
import { TextField } from "../components/TextField";
import { colors, radius, spacing } from "../theme";
import { Especialidad, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TurnosEspecialidad">;

export default function TurnosEspecialidadScreen({ navigation, route }: Props) {
  const { paciente, celular, obraSocial } = route.params;
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    api
      .getEspecialidades()
      .then((data) => setEspecialidades(data.especialidades))
      .catch(() => setError("No se pudieron cargar las especialidades."))
      .finally(() => setCargando(false));
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return especialidades;
    return especialidades.filter(
      (e) => e.nombre.toLowerCase().includes(q) || e.sinonimos.some((s) => s.toLowerCase().includes(q))
    );
  }, [especialidades, busqueda]);

  function onElegir(especialidad: string) {
    navigation.navigate("TurnosHorario", { paciente, celular, obraSocial, especialidad });
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.paso}>PASO 2 DE 3</Text>
        <Text style={styles.title}>¿Qué necesitás?</Text>
        <Text style={styles.subtitle}>Elegí la especialidad o contanos qué te pasa.</Text>

        <TextField
          label="Buscar"
          placeholder="Ej: piel, corazón, rodilla…"
          value={busqueda}
          onChangeText={setBusqueda}
          autoCapitalize="none"
        />
        {error ? <InlineAlert message={error} /> : null}
        {cargando ? <LoadingState label="Cargando especialidades…" /> : null}
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={cargando ? [] : filtradas}
        keyExtractor={(item) => item.nombre}
        renderItem={({ item }) => (
          <Pressable onPress={() => onElegir(item.nombre)} style={({ pressed }) => pressed && styles.pressed}>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardCta}>→</Text>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          !cargando ? (
            <Text style={styles.empty}>No encontramos ninguna especialidad para "{busqueda}".</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { padding: spacing.lg, paddingBottom: 0 },
  paso: { fontSize: 11, fontWeight: "700", color: colors.accent, letterSpacing: 0.8 },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.inkSoft, marginTop: 8, marginBottom: spacing.lg, lineHeight: 20 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  pressed: { opacity: 0.85 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
  cardCta: { fontSize: 16, fontWeight: "700", color: colors.accentStrong },
  empty: { textAlign: "center", color: colors.inkFaint, marginTop: spacing.lg, paddingHorizontal: spacing.lg },
});
