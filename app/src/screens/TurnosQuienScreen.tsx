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
import { Card } from "../components/Card";
import { InlineAlert } from "../components/InlineAlert";
import { PrimaryButton } from "../components/PrimaryButton";
import { SelectField } from "../components/SelectField";
import { Text } from "../components/Text";
import { TextField } from "../components/TextField";
import { OBRAS_SOCIALES } from "../constants";
import { colors, spacing } from "../theme";
import { Paciente, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "TurnosQuien">;

export default function TurnosQuienScreen({ navigation }: Props) {
  const [dni, setDni] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [celular, setCelular] = useState("");
  const [obraSocial, setObraSocial] = useState("");

  async function onBuscar() {
    setError(null);
    setPaciente(null);
    setBuscando(true);
    try {
      const data = await api.getPaciente(dni.trim());
      setPaciente(data);
      setObraSocial(data.obraSocial || "No tengo");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ocurrió un error inesperado.");
    } finally {
      setBuscando(false);
    }
  }

  function onNoSoyYo() {
    setPaciente(null);
    setDni("");
    setCelular("");
    setObraSocial("");
  }

  function onContinuar() {
    if (!paciente) return;
    navigation.navigate("TurnosEspecialidad", {
      paciente,
      celular: celular.trim(),
      obraSocial: obraSocial || "No tengo",
    });
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
        <Text style={styles.paso}>PASO 1 DE 3</Text>
        <Text style={styles.title}>¿Quién se atiende?</Text>
        <Text style={styles.subtitle}>
          Buscamos la ficha en la clínica con el documento del paciente. Podés sacar el turno
          para vos o para otra persona: solo cargá su documento.
        </Text>

        {error ? <InlineAlert message={error} /> : null}

        <TextField
          label="D.N.I."
          placeholder="Ej: 30111222"
          value={dni}
          onChangeText={setDni}
          keyboardType="number-pad"
          maxLength={9}
          editable={!paciente}
        />
        {!paciente ? (
          <PrimaryButton label="Buscar" onPress={onBuscar} loading={buscando} disabled={dni.trim().length < 6} />
        ) : null}

        {paciente ? (
          <>
            <Card style={styles.pacienteCard}>
              <View style={styles.pacienteRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pacienteNombre}>
                    {paciente.apellido}, {paciente.nombre}
                  </Text>
                  <Text style={styles.pacienteMeta}>
                    {paciente.edad} años · {paciente.sexo === "F" ? "Femenino" : "Masculino"}
                  </Text>
                </View>
                <Pressable onPress={onNoSoyYo}>
                  <Text style={styles.noSoyYo}>No soy yo</Text>
                </Pressable>
              </View>
              <Text style={styles.pacienteHelper}>
                Si los datos no coinciden, se corrigen en Admisión el día del turno.
              </Text>
            </Card>

            <TextField
              label="Celular"
              placeholder="Ej: 03492 15-640218"
              value={celular}
              onChangeText={setCelular}
              keyboardType="phone-pad"
              helperText="Te mandamos el turno por mensaje y te avisamos si el profesional cambia el horario."
            />

            <SelectField
              label="Obra social (si tenés)"
              value={obraSocial}
              onChange={setObraSocial}
              options={OBRAS_SOCIALES}
              placeholder="No tengo"
            />
            <Text style={styles.obraSocialHelper}>
              La atención es gratuita igual. El dato lo usa la clínica para recuperar costos con la
              obra social.
            </Text>

            <View style={{ height: spacing.sm }} />
            <PrimaryButton
              label="Elegir especialidad"
              onPress={onContinuar}
              disabled={celular.trim().length < 6}
            />
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  paso: { fontSize: 11, fontWeight: "700", color: colors.accent, letterSpacing: 0.8 },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink, marginTop: 4 },
  subtitle: { fontSize: 14, color: colors.inkSoft, marginTop: 8, marginBottom: spacing.lg, lineHeight: 20 },
  pacienteCard: { marginTop: spacing.lg, marginBottom: spacing.md },
  pacienteRow: { flexDirection: "row", alignItems: "flex-start" },
  pacienteNombre: { fontSize: 16, fontWeight: "700", color: colors.ink },
  pacienteMeta: { fontSize: 13, color: colors.inkSoft, marginTop: 2 },
  noSoyYo: { fontSize: 13, fontWeight: "700", color: colors.accentStrong },
  pacienteHelper: { fontSize: 12, color: colors.inkFaint, marginTop: spacing.sm, lineHeight: 16 },
  obraSocialHelper: {
    fontSize: 12,
    color: colors.inkFaint,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
});
