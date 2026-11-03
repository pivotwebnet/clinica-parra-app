import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Text } from "./Text";
import { colors, fonts, radius, spacing } from "../theme";

interface Props extends TextInputProps {
  label: string;
  prefix?: string;
  helperText?: string;
}

export function TextField({ label, prefix, helperText, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.inkFaint}
          {...rest}
        />
      </View>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.inkFaint,
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  prefix: {
    fontSize: 15,
    color: colors.inkSoft,
    fontWeight: "600",
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
  helper: {
    marginTop: 4,
    fontSize: 12,
    color: colors.inkFaint,
  },
});
