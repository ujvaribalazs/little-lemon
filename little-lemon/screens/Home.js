import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../components/AuthContext";

function Home({ navigation }) {
  const { loginState, setLoginState } = useAuth();
  return (
    <View>
      <Text>Home Screen</Text>
      {loginState ? (
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate("Profile")}
        />
      ) : (
        <Button
          title="Go to Onboarding"
          onPress={() => navigation.navigate("Onboarding")}
        />
      )}
    </View>
  );
}

export default Home;
