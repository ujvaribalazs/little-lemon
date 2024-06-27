import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Profile({ navigation }) {
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
  },
  buttonContainer: {},
  buttonText: {
    color: "#344854",
    padding: 12,

    textAlign: "center",
    marginLeft: 200,
    marginRight: 50,
    marginTop: 60,
    marginBottom: 40,

    borderColor: "#CBD2D9",
    backgroundColor: "#CBD2D9",
    borderRadius: 5,
  },
  disableButtonText: {
    padding: 12,
    color: "white",
  },
});
