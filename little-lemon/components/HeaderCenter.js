import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const HeaderCenter = () => {
  const navigation = useNavigation();
  const route = useRoute();

  if (route.name === "Profile") {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image
          style={{ width: 30, height: 30 }}
          source={require("../assets/LLlogo.png")}
        />
      </TouchableOpacity>
    );
  } else if (route.name === "Home") {
    return (
      <Image
        style={{ width: 120, height: 30 }}
        source={require("../assets/longLLlogo.jpg")}
      />
    );
  } else {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image
          style={{ width: 30, height: 30 }}
          source={require("../assets/LLlogo.png")}
        />
      </TouchableOpacity>
    );
  }
};

export default HeaderCenter;
