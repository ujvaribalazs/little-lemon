import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Button,
  Pressable,
  //KeyboardAvoidingView,
  //Platform,
} from "react-native";
import logo from "../assets/LLlogo.png";
import { useState } from "react";

export default function Onboarding() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateFirstName = (text) => {
    const isValid = text.length > 0 && /^[a-zA-Z ]+$/.test(text);
    setIsFirstNameValid(isValid);
    setFirstName(text);
  };

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(text);
    setIsEmailValid(isValid);
    setEmail(text);
  };
  return (
    <View style={styles.container}>
      //behavior={Platform.OS === "ios" ? "padding" : "height"}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Little Lemon</Text>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.welcomeTitle}>Let us get to know You</Text>
        <Text style={styles.title}>First Name</Text>
        <TextInput
          style={styles.email}
          placeholder="Your first name "
          value={firstName}
          onChangeText={validateFirstName}
          maxlength={250}
        />
        <Text style={styles.title}>Email</Text>
        <TextInput
          style={styles.email}
          placeholder="hello@email.com"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          clearButtonMode="always"
          multiline={true}
          maxlength={250}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          disabled={!isFirstNameValid || !isEmailValid}
          //onPress={() => {
          //  Alert.alert("Thanks for subscribing, stay tuned!");
          //}}
        >
          <Text style={[styles.buttonText, !email && styles.disableButtonText]}>
            NEXT
          </Text>
        </Pressable>
        {/* <Button
       //   style={styles.buttonText}
          title="Next"
          onPress={() => {
            
          }}
          //disabled={!isFirstNameValid || !isEmailValid}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use all available space
    paddingHorizontal: 0, // Ensure no horizontal padding
    //backgroundColor: "pink",
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    flex: 0.1,
    paddingHorizontal: 80,
    backgroundColor: "#DEE3E9",
  },
  formContainer: {
    backgroundColor: "#CBD2D9",
    flex: 0.6,
  },
  headerText: {
    color: "#495E57", //#485D56
    fontSize: 30,
    padding: 20,
    fontFamily: "Karla-Regular",

    //fontFamily: "Karla-Regular",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  welcomeTitle: {
    paddingVertical: 40,
    textAlign: "center",
    paddingTop: 60,
    paddingBottom: 80,
    fontSize: 36,
    color: "#344854",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 36,
    color: "#344854",
  },
  email: {
    padding: 10,
    margin: 20,
    //width: "85%",
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#344854",
  },
  buttonContainer: {
    flex: 0.3,
  },
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
    //backgroundColor: "green",
    padding: 12,
  },
});
