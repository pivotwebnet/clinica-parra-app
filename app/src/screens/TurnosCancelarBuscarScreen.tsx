import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { api, ApiError } from "../api/client";
import { Card } from "../components/Card";
import { InlineAlert } from "../components/InlineAlert";
import { PrimaryButton } from "../components/PrimaryButton";
import { Text } from "../components/Text";
import { TextField } from "../components/TextField";
import { colors, radius, spacing } from "../theme";
import { RootStackParamList, Turno } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TurnosCancelarBuscar">;

export default function TurnosCancelarBuscarScreen({ navigation }: Props) {
  const [dni, setDni] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<Turno[] | null>(null);

  async function onBuscar() {
    setError(null);
    setTurnos(null);
    setBuscando(true);
    try {
      const data = await api.getTurnosPorDni(dni.trim());
      setTurnos(data.turnos);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.title}>Cancelar un turno</Text>
          <Text style={styles.subtitle}>Ingresá el documento del paciente para ver sus turnos.</Text>

          {error ? <InlineAlert message={error} /> : null}

          <TextField
            label="D.N.I."
            placeholder="Ej: 30111222"
            value={dni}
            onChangeText={setDni}
            keyboardType="number-pad"
            maxLength={9}
          />
          <PrimaryButton
            label="Buscar turnos"
            onPress={onBuscar}
            loading={buscando}
            disabled={dni.trim().length < 6}
          />
        </View>

        {turnos ? (
          turnos.length === 0 ? (
            <Text style={styles.empty}>No hay turnos vigentes para ese documento.</Text>
          ) : (
            <FlatList
              contentContainerStyle={styles.list}
              data={turnos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.navigate("TurnosCancelarConfirmar", { turno: item })}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <Card style={styles.card}>
                    <Text style={styles.cardTitle}>{item.especialidad}</Text>
                    <Text style={styles.cardMeta}>
                      {formatFecha(item.fecha)} · {item.horario} hs · {item.prestadorNombre}
                    </Text>
                  </Card>
                </Pressable>
              )}
            />
          )
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: 14, color: colors.inkSoft, marginTop: 8, marginBottom: spacing.lg, lineHeight: 20 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  pressed: { opacity: 0.85 },
  card: { borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  cardTitle: { fontSize: 15, fontWeight: "700", color: colors.ink },
  cardMeta: { fontSize: 13, color: colors.inkSoft, marginTop: 4 },
  empty: { textAlign: "center", color: colors.inkFaint, marginTop: spacing.lg, paddingHorizontal: spacing.lg },
});
