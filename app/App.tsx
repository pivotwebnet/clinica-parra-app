import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "./src/theme";
import { RootStackParamList } from "./src/types";

import EstudiosAccesoScreen from "./src/screens/EstudiosAccesoScreen";
import EstudiosInformeScreen from "./src/screens/EstudiosInformeScreen";
import EstudiosListaScreen from "./src/screens/EstudiosListaScreen";
import EstudiosNumeroAccesoScreen from "./src/screens/EstudiosNumeroAccesoScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TurnosCancelarBuscarScreen from "./src/screens/TurnosCancelarBuscarScreen";
import TurnosCancelarConfirmarScreen from "./src/screens/TurnosCancelarConfirmarScreen";
import TurnosConfirmacionScreen from "./src/screens/TurnosConfirmacionScreen";
import TurnosEspecialidadScreen from "./src/screens/TurnosEspecialidadScreen";
import TurnosHorarioScreen from "./src/screens/TurnosHorarioScreen";
import TurnosQuienScreen from "./src/screens/TurnosQuienScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontWeight: "700" },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />

          <Stack.Screen
            name="EstudiosAcceso"
            component={EstudiosAccesoScreen}
            options={{ title: "Mis estudios" }}
          />
          <Stack.Screen name="EstudiosLista" component={EstudiosListaScreen} options={{ title: "Estudios" }} />
          <Stack.Screen
            name="EstudiosNumeroAcceso"
            component={EstudiosNumeroAccesoScreen}
            options={{ title: "Abrir informe" }}
          />
          <Stack.Screen
            name="EstudiosInforme"
            component={EstudiosInformeScreen}
            options={{ title: "Informe" }}
          />

          <Stack.Screen name="TurnosQuien" component={TurnosQuienScreen} options={{ title: "Sacar turno" }} />
          <Stack.Screen
            name="TurnosEspecialidad"
            component={TurnosEspecialidadScreen}
            options={{ title: "Sacar turno" }}
          />
          <Stack.Screen name="TurnosHorario" component={TurnosHorarioScreen} options={{ title: "Sacar turno" }} />
          <Stack.Screen
            name="TurnosConfirmacion"
            component={TurnosConfirmacionScreen}
            options={{ title: "Confirmación", headerBackVisible: false }}
          />

          <Stack.Screen
            name="TurnosCancelarBuscar"
            component={TurnosCancelarBuscarScreen}
            options={{ title: "Cancelar turno" }}
          />
          <Stack.Screen
            name="TurnosCancelarConfirmar"
            component={TurnosCancelarConfirmarScreen}
            options={{ title: "Cancelar turno" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
