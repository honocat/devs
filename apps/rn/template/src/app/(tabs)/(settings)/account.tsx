import { useState } from "react";

import { View } from "react-native";
import { router } from "expo-router";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

function handlePress() {
  router.replace("/(auth)/login");
}

export default function Account() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  function handleOpen() {
    setShowAlertDialog(true);
  }
  function handleClose() {
    setShowAlertDialog(false);
  }

  return (
    <View className="flex-1 items-center justify-center bg-slate-200">
      <Text size="2xl" bold>
        Account settings
      </Text>
      <Button action="negative" className="mt-2" onPress={handleOpen}>
        <ButtonText>Log out</ButtonText>
      </Button>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-800">ログアウトします</Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-2">
            <Text size="xl">よろしいですか？</Text>
          </AlertDialogBody>
          <AlertDialogFooter className="mt-4">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>キャンセル</ButtonText>
            </Button>
            <Button onPress={handlePress} size="sm">
              <ButtonText>ログアウト</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
