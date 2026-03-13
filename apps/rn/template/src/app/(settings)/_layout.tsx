import { Stack } from "expo-router";

export default function settingsLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="email"
        options={{
          title: "Email",
        }}
      />
    </Stack>
  );
}
