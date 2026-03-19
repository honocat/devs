import { StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";

import { useState } from "react";

import CircleButton from "../../components/CircleButton";
import Icon from "../../components/Icon";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";

import { auth, db } from "../../config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function handlePress(bodyText: string) {
  if (auth.currentUser === null) return;
  const ref = collection(db, `users/${auth.currentUser.uid}/memos`);

  addDoc(ref, {
    bodyText,
    updatedAt: Timestamp.fromDate(new Date()),
  })
    .then((docRef) => {
      console.log("success", docRef.id);
      router.back();
    })
    .catch((error) => {
      console.log(error);
    });
}

export default function Create() {
  const [bodyText, setBodyText] = useState("");
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={bodyText}
          onChangeText={(input) => setBodyText(input)}
          style={styles.input}
          multiline
          autoFocus
        />
      </View>
      <CircleButton
        onPress={() => {
          handlePress(bodyText);
        }}
        style={{ bottom: 50 }}
      >
        <Icon name="check" size={40} color="#fff" />
      </CircleButton>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    paddingVertical: 32,
    paddingHorizontal: 27,
    flex: 1,
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
  },
});
