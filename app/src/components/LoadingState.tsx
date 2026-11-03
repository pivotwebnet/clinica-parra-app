import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { colors, spacing } from "../theme";

export function LoadingState({ label }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="small" color={colors.accent} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  label: {
    fontSize: 14,
    color: colors.inkSoft,
  },
});
