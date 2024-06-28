import React from "react";
import { View, Text, Button } from "react-native";

function Another({ navigation }) {
  return (
    <View>
      <Text>Another Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}

export default Another;
