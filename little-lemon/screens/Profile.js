import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import CheckBox from "expo-checkbox";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../components/AuthContext";
import { MaskedTextInput } from "react-native-mask-text";

export default function Profile({ navigation }) {
  const { setLoginState } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
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
    } catch (e) {
      console.error(e);
    }
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

  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      setLoginState(false);
      navigation.navigate("Onboarding");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile</Text>
        {/* Inactive back button */}
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
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
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
        <Button title="Save Changes" onPress={saveProfileData} />
        <Button title="Log Out" onPress={logOut} />
      </View>
    </View>
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
    borderBottomWidth: 1,
    marginBottom: 10,
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
});
