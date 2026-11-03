import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { api, ApiError } from "../api/client";
import { InlineAlert } from "../components/InlineAlert";
import { PrimaryButton } from "../components/PrimaryButton";
import { Text } from "../components/Text";
import { TextField } from "../components/TextField";
import { colors, spacing } from "../theme";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EstudiosNumeroAcceso">;

export default function EstudiosNumeroAccesoScreen({ navigation, route }: Props) {
  const { estudioId, titulo, fecha } = route.params;
  const [numeroAcceso, setNumeroAcceso] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ayuda, setAyuda] = useState(false);

  async function onAbrir() {
    setError(null);
    setLoading(true);
    try {
      const informe = await api.abrirInforme(estudioId, numeroAcceso.trim());
      navigation.navigate("EstudiosInforme", { informe });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.subtitle}>{formatFecha(fecha)}</Text>

        {error ? <InlineAlert message={error} /> : null}

        <TextField
          label="Número de acceso"
          placeholder="Ej. 20260828114"
          helperText="Está en el comprobante que te dieron el día del estudio, arriba del código de barras."
          value={numeroAcceso}
          onChangeText={setNumeroAcceso}
          keyboardType="number-pad"
        />

        <View style={{ height: spacing.sm }} />
        <PrimaryButton
          label="Abrir informe"
          onPress={onAbrir}
          loading={loading}
          disabled={numeroAcceso.trim().length < 5}
        />

        <Pressable onPress={() => setAyuda((v) => !v)} style={styles.linkWrap}>
          <Text style={styles.link}>Perdí el comprobante</Text>
        </Pressable>
        {ayuda ? (
          <InlineAlert
            tone="warn"
            message="Pedí que te lo reimpriman en el mostrador del servicio donde te hiciste el estudio."
          />
        ) : null}
      </ScrollView>
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
  title: { fontSize: 20, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: 13, color: colors.inkSoft, marginTop: 4, marginBottom: spacing.lg },
  linkWrap: { marginTop: spacing.md, alignItems: "center" },
  link: { fontSize: 13, fontWeight: "700", color: colors.accentStrong },
});
