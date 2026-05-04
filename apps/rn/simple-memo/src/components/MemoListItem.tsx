import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

import Icon from "./Icon";

import { type Memo } from "../../types/memo";

import { auth, db } from "../config";
import { deleteDoc, doc } from "firebase/firestore";

interface Props {
  memo: Memo;
}

function handlePress(id: string) {
  if (auth.currentUser === null) return;
  const ref = doc(db, `users/${auth.currentUser.uid}/memos`, id);
  Alert.alert("メモを削除します", "よろしいですか？", [
    {
      text: "キャンセル",
    },
    {
      text: "削除",
      style: "destructive",
      onPress: () => {
        deleteDoc(ref).catch(() => {
          Alert.alert("削除に失敗しました");
        });
      },
    },
  ]);
}

export default function MemoListItem(props: Props) {
  const { memo } = props;

  const { bodyText, updatedAt } = memo;
  if (bodyText === null || updatedAt === null) return null;
  const dateString = updatedAt.toDate().toLocaleString("ja-JP");

  return (
    <Link
      href={{
        pathname: "/(memo)/detail",
        params: { id: memo.id },
      }}
      asChild
    >
      <TouchableOpacity style={styles.memoListItem}>
        <View>
          <Text numberOfLines={1} style={styles.memoListItemTitle}>
            {bodyText}
          </Text>
          <Text style={styles.memoListItemDate}>{dateString}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handlePress(memo.id);
          }}
        >
          <Icon name="delete" size={32} color="#b0b0b0" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  memoListItem: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
  },
  memoListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  memoListItemDate: {
    fontSize: 12,
    lineHeight: 16,
    color: "#848484",
  },
});
