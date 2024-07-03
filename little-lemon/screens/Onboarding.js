import React, { useState, useCallback, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { useAuth } from "../components/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import logo from "../assets/LLlogo.png";

export default function Onboarding({ navigation }) {
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const { firstName, setFirstName, email, setEmail, setLoginState } = useAuth();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    setLoginState(true);
    await storeLoginInfo(true);
    navigation.navigate("Home");
  };
  const handleClear = async () => {
    await setFirstName("");
    await setEmail("");
  };

  useFocusEffect(
    useCallback(() => {
      setIsFirstNameValid(
        firstName.length > 0 && /^[a-zA-Z ]+$/.test(firstName)
      );
      setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }, [firstName, email])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerLemon}>Little Lemon</Text>
          <Image source={logo} style={styles.logo} />
        </View>

        {!isKeyboardVisible && (
          <View style={styles.heroContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Little Lemon</Text>
              <Text style={styles.headerLocation}>Chicago</Text>
              <Text style={styles.headerText}>
                We are a family owned Mediterranean restaurant, focused on
                traditional recipes served with a modern twist.
              </Text>
            </View>
            <Image
              style={styles.headerImage}
              source={require("../assets/WelcomeHeader.jpg")}
            />
          </View>
        )}
        <ScrollView
          style={styles.inputContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.title}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder=" type your here first name"
            value={firstName}
            onChangeText={validateFirstName}
            maxLength={250}
          />
          <Text style={styles.title}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder=" type here your email"
            value={email}
            onChangeText={validateEmail}
            keyboardType="email-address"
            clearButtonMode="always"
            multiline={false}
            maxLength={250}
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            //disabled={isFirstNameValid || isEmailValid}
            onPress={handleClear}
          >
            <Text
              style={[
                styles.buttonText,
                !firstName && !email && styles.disableButtonText,
              ]}
            >
              Clear
            </Text>
          </Pressable>
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
              NEXT
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
    width: wp("100%"),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp("2%"),
    paddingHorizontal: wp("20%"),
    backgroundColor: "#DEE3E9",
  },
  heroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#495E57",
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 30,
    color: "#F4CE14",
    fontWeight: "bold",
  },
  headerLocation: {
    fontSize: 26,
    color: "#ffffff",
  },
  headerText: {
    fontSize: 14,
    color: "#ffffff",
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  formContainer: {
    backgroundColor: "#CBD2D9",
    flex: 1,
  },
  headerLemon: {
    color: "#495E57",
    fontSize: wp("8%"),
    padding: wp("2%"),
    fontFamily: "Karla-Regular",
  },
  logo: {
    width: wp("12%"),
    height: hp("6%"),
    resizeMode: "contain",
  },
  welcomeTitle: {
    paddingVertical: hp("5%"),
    textAlign: "center",
    paddingTop: hp("7%"),
    paddingBottom: hp("2%"),
    fontSize: wp("8%"),
    color: "#344854",
  },
  title: {
    textAlign: "center",
    fontWeight: "medium",
    fontSize: wp("5%"),
    color: "#344854",
  },
  inputContainer: {
    flex: 1,
    padding: wp("3%"),
  },
  scrollContent: {
    alignItems: "center",
  },
  input: {
    fontSize: wp("5%"),
    padding: wp("1.5%"),
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    marginHorizontal: wp("10%"),
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#344854",
    backgroundColor: "#A7B7AB",
    width: wp("70%"),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    alignItems: "center",
    marginTop: hp("1%"),
    marginBottom: hp("1%"),
    marginHorizontal: 75,
  },
  buttonText: {
    color: "white",
    padding: wp("2%"),
    textAlign: "center",
    borderColor: "#CBD2D9",
    backgroundColor: "#495E57",
    borderRadius: 10,
    width: wp("20%"),
  },
  disableButtonText: {
    color: "#495E57",
    borderWidth: 1,
    backgroundColor: "#F4CE14",
    borderColor: "#495E57",
  },
});
