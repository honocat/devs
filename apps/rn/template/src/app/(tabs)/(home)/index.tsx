import { View } from "react-native";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function Home() {
  return (
    <View className="flex-1 p-5 bg-slate-200">
      <View>
        <Heading size="2xl">Home</Heading>
        <Text size="xl">App home</Text>
      </View>
    </View>
  );
}
