import { StyleSheet, Text, View } from "react-native";

export default function email() {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Email</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainText: {
    color: "#555",
    fontSize: 60,
    fontWeight: "bold",
  },
});
