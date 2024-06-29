// HeaderCenter.js
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderCenter = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Image
        style={{ width: 30, height: 30 }}
        source={require("../assets/LLlogo.png")}
      />
    </TouchableOpacity>
  );
};

export default HeaderCenter;
