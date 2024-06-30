import React from "react";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../components/AuthContext";

function Home({ navigation }) {
  const { loginState, setLoginState } = useAuth();
  return (
    <View>
      <Text style={styles.text}>Welcome to the Little Lemon</Text>
      {loginState ? (
        <Text style={styles.text}>Go to</Text>
      ) : (
        <Text style={styles.text}>Please sign in</Text>
      )}
      {loginState ? (
        <Pressable
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Onboarding")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 40,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    padding: 12,
    textAlign: "center",
    borderColor: "#CBD2D9",
    backgroundColor: "#495E57",
    borderRadius: 10,
    width: 200,
  },
});

export default Home;
