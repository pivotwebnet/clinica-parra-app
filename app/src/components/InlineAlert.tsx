import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { colors, radius, spacing } from "../theme";

export function InlineAlert({ message, tone = "critical" }: { message: string; tone?: "critical" | "warn" }) {
  const isWarn = tone === "warn";
  return (
    <View style={[styles.wrap, isWarn ? styles.warn : styles.critical]}>
      <Text style={[styles.text, { color: isWarn ? colors.warn : colors.critical }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  critical: {
    backgroundColor: colors.criticalSoft,
  },
  warn: {
    backgroundColor: colors.warnSoft,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
});
