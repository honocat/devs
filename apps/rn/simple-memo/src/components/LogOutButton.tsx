import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { auth } from "../config";
import { signOut } from "firebase/auth";

function handlePress() {
  signOut(auth)
    .then(() => {
      router.replace("/(auth)/login");
    })
    .catch(() => {
      Alert.alert("ログアウトに失敗しました");
    });
}

export default function LogOutButton() {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>ログアウト</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 24,
    color: "rgba(255,255,255,0.7)",
  },
});
