import React, { useCallback, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";

SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Karla-Regular": require("./assets/fonts/Karla-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  const [initialRoute, setInitialRoute] = useState(null);
  const readInitialLoginState = async () => {
    try {
      const state = await AsyncStorage.getItem("@login");
      if (state !== null) {
        setInitialRoute(state === "true" ? "Onboarding" : "Profile");
        console.log(state);
      } else {
        setInitialRoute("Onboarding");
      }
    } catch (e) {
      console.error(e);
      setInitialRoute("Onboarding");
    }
  };
  const loadingScreen = () => {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  };
  useEffect(() => {
    readInitialLoginState();
  }, []);
  if (initialRoute === null) {
    return null; // ide lehetne a betöltés alatti kezdőképernyő
  }
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            initialParams={{ onDone: readInitialLoginState }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            initialParams={{ onDone: readInitialLoginState }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

    width: "100%",
  },
});
