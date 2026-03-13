import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

const toProfile = () => {
  router.push("/profile");
};
const toEmail = () => {
  router.push("/email");
};

export default function settingsIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Settings</Text>
      <TouchableOpacity onPress={toProfile} style={styles.linkContaier}>
        <View>
          <Text style={styles.subText}>Profile</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={toEmail} style={styles.linkContaier}>
        <View>
          <Text style={styles.subText}>Email</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    justifyContent: "center",
    marginHorizontal: "auto",
  },
  mainText: {
    color: "#555",
    fontSize: 60,
    fontWeight: "bold",
  },
  subText: {
    color: "#555",
    fontSize: 20,
  },
  linkContaier: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
  },
});
