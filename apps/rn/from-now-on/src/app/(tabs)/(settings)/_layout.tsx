import { Stack } from "expo-router";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: () => <Heading size="2xl">設定</Heading>,
        headerTitleStyle: {
          fontSize: 24,
          color: "rgba(0,0,0,0.85)",
        },
        headerStyle: { backgroundColor: "white" },
        contentStyle: { borderTopWidth: 0, borderTopColor: "rgba(0,0,0,0)" },
        headerBackTitle: "戻る",
      }}
    >
      <Stack.Screen name="index" options={{}}></Stack.Screen>
      <Stack.Screen
        name="account/profile"
        options={{
          headerTitle: "",
          contentStyle: {},
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="card/create"
        options={{ headerTitle: "", contentStyle: {} }}
      ></Stack.Screen>
      <Stack.Screen
        name="card/edit"
        options={{ headerTitle: "", contentStyle: {} }}
      ></Stack.Screen>
    </Stack>
  );
}
