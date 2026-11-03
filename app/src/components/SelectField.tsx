import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { colors, radius, spacing } from "../theme";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  enabled?: boolean;
}

export function SelectField({ label, value, onChange, options, placeholder, enabled = true }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.pickerBox, !enabled && styles.disabled]}>
        <Picker enabled={enabled} selectedValue={value} onValueChange={(v) => onChange(String(v))}>
          <Picker.Item label={placeholder} value="" color={colors.inkFaint} />
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>
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
  pickerBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    overflow: "hidden",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
