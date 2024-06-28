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
import Another from "./screens/Another";
import Home from "./screens/Home";
import { AuthProvider } from "./components/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Karla-Regular": require("./assets/fonts/Karla-Regular.ttf"),
  });

  // When the component first mounts, it ensures that the splash screen does not auto-hide by calling SplashScreen.preventAutoHideAsync().
  // This is crucial for showing the splash screen until the fonts are loaded or an error occurs.
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  // This ensures that the splash screen is hidden once the necessary resources (fonts) are ready
  //  or if there's an error that prevents the resources from loading.
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const [loginState, setLoginState] = useState(null);

  const loadingScreen = () => {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  };

  const readLoginState = async () => {
    try {
      const state = await AsyncStorage.getItem("@login");
      if (state !== null) {
        setLoginState(true);
        console.log("state from readLoginState", state);
      } else {
        setLoginState(false);
      }
    } catch (e) {
      console.error(e);
      setLoginState(false);
    }
  };

  useEffect(() => {
    readLoginState();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    return (
      <View style={styles.container}>
        <Text>Error loading fonts</Text>
      </View>
    );
  }

  if (loginState === null) {
    return loadingScreen();
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />

            {loginState ? (
              <>
                <Stack.Screen name="Another" component={Another} />
              </>
            ) : (
              <>
                <Stack.Screen name="Onboarding" component={Onboarding} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
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
