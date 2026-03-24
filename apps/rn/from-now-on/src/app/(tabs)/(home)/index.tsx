import { View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import { Container } from "@/src/components/layouts/Container";

export default function HomeIndex() {
  return (
    <Container center>
      <View className="border w-full h-[500px] rounded-3xl"></View>
      <HStack className="w-full mt-4 justify-between">
        <Button size="xl" className="w-[48%]">
          <ButtonText>シャッフル</ButtonText>
        </Button>
        <Button size="xl" className="w-[48%]">
          <ButtonText>決定</ButtonText>
        </Button>
      </HStack>
    </Container>
  );
}
