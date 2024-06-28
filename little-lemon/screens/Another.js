import React from "react";
import { View, Text, Button } from "react-native";

function Another({ navigation }) {
  const { loginState, setLoginState } = useAuth();
  return (
    <View>
      <Text>Another Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile")}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

export default Another;
