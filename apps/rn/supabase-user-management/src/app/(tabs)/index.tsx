import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/src/lib/auth/AuthProvider";

export default function TabsIndex() {
  const { user, signOut } = useAuth();

  async function onSignOut() {
    try {
      await signOut();
    } catch (e) {
      // no-op (minimal)
      console.warn(e);
    }
  }

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-2xl font-semibold">Home</Text>
      <Text className="mt-2 text-typography-700">
        {user?.email ? `Signed in as: ${user.email}` : "Signed in"}
      </Text>

      <Pressable
        onPress={onSignOut}
        className="mt-6 rounded-xl bg-background-0 px-4 py-3"
      >
        <Text className="text-center font-semibold text-primary-600">
          ログアウト
        </Text>
      </Pressable>
    </View>
  );
}
