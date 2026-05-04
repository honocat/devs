import { useEffect } from "react";

import { View } from "react-native";
import { useNavigation } from "expo-router";

import { Container } from "@/src/components/layouts/Container";
import { MyHeading } from "@/src/components/layouts/MyHeading";

import ChangeEmail from "@/src/components/features/ChangeEmail";
import ChangePassword from "@/src/components/features/ChangePassword";
import ChangeProfile from "@/src/components/features/ChangeProfile";
import CreateCard from "@/src/components/features/CreateCard";
import EditCards from "@/src/components/features/EditCards";
import LogInOrSignUp from "@/src/components/features/LogInOrSignUp";

export default function SettingsIndex() {
  // session
  //const user = "current user";
  const user = undefined;

  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      navigation.setOptions({
        contentStyle: {},
      });
    } else {
      navigation.setOptions({
        contentStyle: { borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0)" },
      });
    }
  }, []);

  return (
    <Container>
      {user ? <View></View> : <LogInOrSignUp />}

      {user ? (
        <View className="mt-6 mx-auto w-[90%]">
          <View className="mb-6">
            <MyHeading title="アカウント" />
            <ChangeProfile />
            <ChangeEmail />
            <ChangePassword />
          </View>
          <View>
            <MyHeading title="カード" />
            <CreateCard />
            <EditCards />
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </Container>
  );
}
