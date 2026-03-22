import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index"></NativeTabs.Trigger>
      <NativeTabs.Trigger name="index"></NativeTabs.Trigger>
    </NativeTabs>
  );
}
