import React, { useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";

import Home from "./screens/Home";

import HeaderCenter from "./components/HeaderCenter";
import { AuthProvider, useAuth } from "./components/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("./assets/fonts/Karla-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // You can show a loading screen here if you want
  }

  return (
    <AuthProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <Navigation />
      </View>
    </AuthProvider>
  );
}

const Navigation = () => {
  const { loginState } = useAuth();

  if (loginState === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={loginState ? "Home" : "Onboarding"}>
        {loginState ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={({ navigation }) => ({
                headerTitle: () => <HeaderCenter />,
                headerTitleAlign: "center",
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 10,
                      }}
                      source={require("./assets/nurse2.jpg")}
                    />
                  </TouchableOpacity>
                ),
                headerStyle: {
                  backgroundColor: "#f3f3f3",
                },
              })}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{
                headerTitle: () => <HeaderCenter />,
                headerTitleAlign: "center",
                headerRight: () => (
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                    }}
                    source={require("./assets/nurse2.jpg")}
                  />
                ),
                headerStyle: {
                  backgroundColor: "#f3f3f3",
                },
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{
              headerTitle: "WELCOME!",
              headerTitleAlign: "center",
              //headerLeft: () => <HeaderLeft />,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
});
