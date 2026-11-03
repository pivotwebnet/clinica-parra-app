import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../components/Text";
import { api, ApiError } from "../api/client";
import { InlineAlert } from "../components/InlineAlert";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextField } from "../components/TextField";
import { colors, spacing } from "../theme";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EstudiosAcceso">;

export default function EstudiosAccesoScreen({ navigation }: Props) {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onIngresar() {
    setError(null);
    setLoading(true);
    try {
      const data = await api.getEstudios(dni.trim());
      navigation.navigate("EstudiosLista", {
        dni: dni.trim(),
        pacienteNombre: data.pacienteNombre,
        estudios: data.estudios,
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ver mis estudios</Text>
        <Text style={styles.subtitle}>
          Ingresá tu documento. Vas a ver la lista de tus estudios; el número de acceso del
          comprobante se pide recién al abrir cada informe.
        </Text>

        {error ? <InlineAlert message={error} /> : null}

        <TextField
          label="D.N.I."
          placeholder="Ej: 30111222"
          value={dni}
          onChangeText={setDni}
          keyboardType="number-pad"
          maxLength={9}
        />

        <View style={{ height: spacing.sm }} />
        <PrimaryButton
          label="Ver mis estudios"
          onPress={onIngresar}
          loading={loading}
          disabled={dni.trim().length < 6}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: 14, color: colors.inkSoft, marginTop: 8, marginBottom: spacing.lg, lineHeight: 20 },
});
