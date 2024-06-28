import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Profile({ route, navigation }) {
  const { onDone } = route.params;
  const logOut = async () => {
    try {
      await AsyncStorage.setItem("@login", "false");
      onDone(); // Hívja meg a callbacket az adatmentés után
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text}>Profile Screen</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("Onboarding");
          }}
        >
          <Text style={styles.buttonText}>Back to Onboaarding</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            logOut();
          }}
        >
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
