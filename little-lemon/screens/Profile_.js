import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../components/AuthContext";

export default function Profile({ navigation }) {
  const { loginState, setLoginState } = useAuth();

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem("@login");
      setLoginState(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!loginState) {
      navigation.navigate("Onboarding");
    }
  }, [loginState]);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text}>Profile Screen</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={logOut}>
          <Text style={styles.buttonText}>Log out...</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    marginTop: 30,
  },
  buttonContainer: {},
  buttonText: {
    color: "#344854",
    padding: 12,
    textAlign: "center",
    marginTop: 60,
    marginBottom: 40,
    marginHorizontal: 30,
    borderColor: "#CBD2D9",
    backgroundColor: "#CBD2D9",
    borderRadius: 5,
  },
  disableButtonText: {
    padding: 12,
    color: "white",
  },
});
