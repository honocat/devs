import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ title: "Settings", headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="changeEmail"
        options={{
          title: "Change Email",
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          title: "Change Password",
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Account",
        }}
      />
    </Stack>
  );
}
