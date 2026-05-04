import { Alert, StyleSheet, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import CircleButton from "../../components/CircleButton";
import Icon from "../../components/Icon";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView";

import { auth, db } from "../../config";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

function handlePress(id: string, bodyText: string) {
  if (auth.currentUser === null) return;
  const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id);
  setDoc(ref, {
    bodyText,
    updatedAt: Timestamp.fromDate(new Date()),
  })
    .then(() => {
      router.back();
    })
    .catch((error) => {
      console.log(error);
      Alert.alert("更新に失敗しました");
    });
}

export default function Edit() {
  const id = String(useLocalSearchParams().id);
  const [bodyText, setBodyText] = useState("");

  useEffect(() => {
    if (auth.currentUser === null) return;
    const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id);
    getDoc(ref)
      .then((docRef) => {
        const RemoteBodyText = docRef?.data()?.bodyText;
        setBodyText(RemoteBodyText);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          autoFocus
          value={bodyText}
          onChangeText={(text) => {
            setBodyText(text);
          }}
          style={styles.input}
          multiline
        />
      </View>
      <CircleButton
        onPress={() => {
          handlePress(id, bodyText);
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
    flex: 1,
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 32,
    paddingHorizontal: 27,
  },
});
