// Profile.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import CheckBox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../components/AuthContext";
import { MaskedTextInput } from "react-native-mask-text";
import nurseImage from "../assets/nurse2.jpg"; // Import the default image

export default function Profile({ navigation }) {
  const {
    loginState,
    setLoginState,
    firstName,
    setFirstName,
    email,
    setEmail,
  } = useAuth();
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(
    Image.resolveAssetSource(nurseImage).uri
  ); // Initialize with default image URI
  const [emailNotifications, setEmailNotifications] = useState({
    promo: false,
    updates: false,
  });

  useEffect(() => {
    const loadProfileData = async () => {
      const storedFirstName = await AsyncStorage.getItem("firstName");
      const storedLastName = await AsyncStorage.getItem("lastName");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
      const storedAvatar = await AsyncStorage.getItem("avatar");
      const storedEmailNotifications = await AsyncStorage.getItem(
        "emailNotifications"
      );

      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
      if (storedAvatar) setAvatar(storedAvatar);
      if (storedEmailNotifications)
        setEmailNotifications(JSON.parse(storedEmailNotifications));
    };

    loadProfileData();
  }, []);

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem("firstName", firstName);
      await AsyncStorage.setItem("lastName", lastName);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("phoneNumber", phoneNumber);
      await AsyncStorage.setItem("avatar", avatar);
      await AsyncStorage.setItem(
        "emailNotifications",
        JSON.stringify(emailNotifications)
      );
      Alert.alert("Success", "Profile data saved successfully.");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save profile data.");
    }
  };

  const validateAndSaveProfileData = () => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    saveProfileData();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.uri);
    }
  };

  useEffect(() => {
    if (!loginState) {
      navigation.navigate("Onboarding");
      console.log("loginState :", loginState);
    }
  }, [loginState]);

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      setLoginState(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Profile</Text>
          <Button title="Back" disabled />
        </View>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.avatarInitials}>
                  {firstName.charAt(0)}
                  {lastName.charAt(0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <Text>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text>Phone Number</Text>
          <MaskedTextInput
            style={styles.input}
            mask="(999) 999-9999"
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <View style={styles.checkboxContainer}>
            <Text>Email Notifications</Text>
            <View style={styles.checkbox}>
              <Text>Promotions</Text>
              <CheckBox
                value={emailNotifications.promo}
                onValueChange={(newValue) =>
                  setEmailNotifications((prevState) => ({
                    ...prevState,
                    promo: newValue,
                  }))
                }
              />
            </View>
            <View style={styles.checkbox}>
              <Text>Updates</Text>
              <CheckBox
                value={emailNotifications.updates}
                onValueChange={(newValue) =>
                  setEmailNotifications((prevState) => ({
                    ...prevState,
                    updates: newValue,
                  }))
                }
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={validateAndSaveProfileData}
          >
            <Text>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLogout} onPress={logOut}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 40,
    color: "white",
  },
  formContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    borderColor: "lightgrey",
    borderRadius: 7,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: "#495E57",
  },
  checkboxContainer: {
    marginVertical: 20,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonSave: {
    backgroundColor: "#FECE14",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonLogout: {
    backgroundColor: "#495E57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
  },
});
