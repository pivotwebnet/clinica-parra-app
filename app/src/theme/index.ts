// Paleta alineada a la spec funcional (App Clínica Parra).
export const colors = {
  bg: "#F3F6F6",
  surface: "#FFFFFF",
  ink: "#16211F",
  inkSoft: "#516360",
  inkFaint: "#7D8B89",
  line: "#D9E2E1",
  accent: "#1F6F78",
  accentSoft: "#E4F0EF",
  accentStrong: "#154F56",
  warn: "#8A5F17",
  warnSoft: "#FBF1DE",
  critical: "#A8362F",
  criticalSoft: "#FBEAE8",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
};

export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
};

export const typography = {
  display: { fontSize: 26, fontWeight: "700" as const, color: colors.ink },
  title: { fontSize: 20, fontWeight: "700" as const, color: colors.ink },
  subtitle: { fontSize: 15, fontWeight: "600" as const, color: colors.inkSoft },
  body: { fontSize: 15, fontWeight: "400" as const, color: colors.ink },
  label: { fontSize: 12, fontWeight: "600" as const, color: colors.inkFaint, letterSpacing: 0.4 },
  mono: { fontSize: 14, fontWeight: "500" as const, color: colors.ink },
};
