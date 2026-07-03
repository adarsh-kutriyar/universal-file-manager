import React from "react";
import {
  View,
  Button,
} from "react-native";

export default function LoginScreen({
  onLogin,
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Login Test"
        onPress={onLogin}
      />
    </View>
  );
}