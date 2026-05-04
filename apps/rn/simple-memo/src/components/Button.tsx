import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  label: string;
  onPress?: () => void;
}

export default function Button(props: Props) {
  const { label, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#457FD3",
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 32,
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});
