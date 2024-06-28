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
  const [loginState, setLoginState] = useState(false);

  const loadingScreen = () => {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  };

  const readLoginState = async () => {
    try {
      const state = await AsyncStorage.getItem("@login");
      if (state !== null) {
        setLoginState(true);
        console.log(state);
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
  if (loginState === null) {
    return loadingScreen; // ide lehetne a betöltés alatti kezdőképernyő
  }
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {loginState ? (
            <>
              <Stack.Screen
                name="Profile"
                component={Profile}
                initialParams={{ onDone: readLoginState }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                initialParams={{ onDone: readLoginState }}
              />
              <Stack.Screen
                name="Another"
                component={Another}
                initialParams={{ onDone: readLoginState }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                initialParams={{ onDone: readLoginState }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                initialParams={{ onDone: readLoginState }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                initialParams={{ onDone: readLoginState }}
              />
            </>
          )}
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
