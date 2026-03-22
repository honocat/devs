import { Redirect } from "expo-router";

export default function Index() {
  // const user = ...
  // if (!user)
  return <Redirect href="/(auth)/login" />;
  // return <Redirect href="/(tabs)/(home)" />;
}
