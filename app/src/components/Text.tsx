import React from "react";
import { StyleSheet, Text as RNText, TextProps } from "react-native";
import { fonts } from "../theme";

const FONT_BY_WEIGHT: Record<string, string> = {
  "400": fonts.regular,
  normal: fonts.regular,
  "500": fonts.medium,
  "600": fonts.semiBold,
  "700": fonts.bold,
  bold: fonts.bold,
  "800": fonts.extraBold,
};

export function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  const fontFamily = FONT_BY_WEIGHT[String(flat.fontWeight ?? "400")] ?? fonts.regular;
  return <RNText {...props} style={[style, { fontFamily, fontWeight: "normal" }]} />;
}
