import "react-native-url-polyfill/auto";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { AuthProvider, useAuth } from "@/src/lib/auth/AuthProvider";

function AuthGate() {
  const { loading, session } = useAuth();
  const segments = useSegments() as unknown as string[];
  const router = useRouter();
  const firstSegment = segments[0] ?? "";

  useEffect(() => {
    if (loading) return;
    if (!firstSegment) return;

    const inAuthGroup = firstSegment === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/sign-in" as any);
      return;
    }

    if (session && inAuthGroup) {
      router.replace("/(tabs)" as any);
    }
  }, [loading, session, router, firstSegment]);

  return null;
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="system">
      <AuthProvider>
        <AuthGate />
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </AuthProvider>
    </GluestackUIProvider>
  );
}
