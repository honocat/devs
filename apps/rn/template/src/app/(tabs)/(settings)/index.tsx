import { TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

import { Heading } from "@/components/ui/heading";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import StackLink from "@/src/components/StackLink";

export default function Settings() {
  return (
    <View className="flex-1 p-5 bg-slate-200">
      <View>
        <Heading size="2xl">Settings</Heading>
        <Text size="xl">Personal settings page.</Text>
      </View>
      <View className="mt-4 py-4">
        <StackLink href="/profile" title="Profile" />
        <StackLink href="/changeEmail" title="Change email address" />
        <StackLink href="/changePassword" title="Change password" />
        <StackLink href="/account" title="Account" />
      </View>
    </View>
  );
}
