import { FlatList, StyleSheet, View } from "react-native";
import { router, useNavigation } from "expo-router";

import { useEffect, useState } from "react";

import CircleButton from "../../components/CircleButton";
import Icon from "../../components/Icon";
import MemoListItem from "../../components/MemoListItem";
import LogOutButton from "../../components/LogOutButton";

import { auth, db } from "../../config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import { type Memo } from "../../../types/memo";

function handlePress() {
  router.push("/(memo)/create");
}

export default function List() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <LogOutButton />;
      },
    });
  }, []);

  useEffect(() => {
    if (auth.currentUser === null) return;
    const ref = collection(db, `users/${auth.currentUser.uid}/memos`);
    const q = query(ref, orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteMemos: Memo[] = [];
      snapshot.forEach((doc) => {
        const { bodyText, updatedAt } = doc.data();
        remoteMemos.push({
          id: doc.id,
          bodyText,
          updatedAt,
        });
      });
      setMemos(remoteMemos);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={memos}
        renderItem={({ item }) => {
          return <MemoListItem memo={item} />;
        }}
      />
      <CircleButton onPress={handlePress}>
        <Icon name="plus" size={40} color="#fff" />
      </CircleButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
