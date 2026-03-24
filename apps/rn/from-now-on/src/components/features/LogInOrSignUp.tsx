import { View } from "react-native";
import { router } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

const handlePress = (type: "login" | "signup") => {
  router.push(`/(auth)/${type}`);
};

export default function LogInOrSignUp() {
  return (
    <View className="bg-white mt-6 p-5 rounded-lg shadow-black shadow">
      <Text size="xl">会員登録はこちら。</Text>
      <HStack className="justify-between mt-2">
        <Button
          size="xl"
          className="w-[48%]"
          onPress={() => handlePress("login")}
        >
          <ButtonText>ログイン</ButtonText>
        </Button>
        <Button
          action="positive"
          size="xl"
          className="w-[48%]"
          onPress={() => handlePress("signup")}
        >
          <ButtonText>会員登録</ButtonText>
        </Button>
      </HStack>
    </View>
  );
}
