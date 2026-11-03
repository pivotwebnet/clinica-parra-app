import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { Text } from "../components/Text";
import { colors, spacing } from "../theme";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.content}>
        {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
        <Image source={require("../../assets/logo-parra.webp")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.subtitle}>Rafaela, Santa Fe</Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Iniciar" onPress={() => navigation.replace("Home")} />
        <Text style={styles.footnote}>
          No hay que crear usuario ni recordar contraseña. Todo se hace con tu documento.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 280,
    aspectRatio: 1059 / 462,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.inkSoft,
    marginTop: spacing.lg,
    letterSpacing: 0.4,
  },
  footer: {
    paddingBottom: spacing.lg,
  },
  footnote: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: "center",
    lineHeight: 17,
  },
});
