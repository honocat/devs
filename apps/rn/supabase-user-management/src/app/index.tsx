import { Redirect } from "expo-router";

import { useAuth } from "@/src/lib/auth/AuthProvider";

export default function RootIndex() {
  const { loading, session } = useAuth();
  if (loading) return null;
  if (!session) return <Redirect href={"/(auth)/sign-in" as any} />;
  return <Redirect href={"/(tabs)" as any} />;
}
