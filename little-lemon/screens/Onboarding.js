import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
//import { Card } from "react-native-elements";
import { useAuth } from "../components/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import logo from "../assets/LLlogo.png";

export default function Onboarding({ navigation }) {
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const {
    firstName,
    setFirstName,
    email,
    setEmail,
    loginState,
    setLoginState,
  } = useAuth();

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

  const storeLoginInfo = async (info) => {
    try {
      await AsyncStorage.setItem("@login", info.toString());
      console.log("state from onboarding", loginState);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    setLoginState(true);
    await storeLoginInfo(true);
    navigation.navigate("Home");
  };

  useFocusEffect(
    useCallback(() => {
      setIsFirstNameValid(
        firstName.length > 0 && /^[a-zA-Z ]+$/.test(firstName)
      );
      setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }, [firstName, email])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Little Lemon</Text>
          <Image source={logo} style={styles.logo} />
        </View>

        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.welcomeTitle}>Let us get to know You</Text>
        </KeyboardAvoidingView>
        <View style={{ backgroundColor: "#CBD2D9" }}>
          <Text style={styles.title}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your first name"
            value={firstName}
            onChangeText={validateFirstName}
            maxLength={250}
          />
          <Text style={styles.title}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@email.com"
            value={email}
            onChangeText={validateEmail}
            keyboardType="email-address"
            clearButtonMode="always"
            multiline={false}
            maxLength={250}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            disabled={!isFirstNameValid || !isEmailValid}
            onPress={handleLogin}
          >
            <Text
              style={[
                styles.buttonText,
                (!isFirstNameValid || !isEmailValid) &&
                  styles.disableButtonText,
              ]}
            >
              Log in
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 80,
    backgroundColor: "#DEE3E9",
  },
  formContainer: {
    backgroundColor: "#CBD2D9",
    flex: 1,
  },
  headerText: {
    color: "#495E57",
    fontSize: 30,
    padding: 20,
    fontFamily: "Karla-Regular",
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
    fontWeight: "medium",
    fontSize: 36,
    color: "#344854",
  },
  input: {
    padding: 10,
    margin: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#344854",
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
  disableButtonText: {
    color: "gray",
    backgroundColor: "#F4CE14",
  },
});
