import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Link, useRouter } from "expo-router";

import FormEmail from "@/src/components/features/FormEmail";
import FormPassword from "@/src/components/features/FormPassword";

import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon, ArrowLeftIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

interface Props {
  type: "login" | "signup";
}

export default function FormAuth(props: Props) {
  const { type } = props;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!email.includes("@")) {
      newErrors.email = "メールアドレスの形式が不正です";
    }
    if (!password) {
      newErrors.password = "パスワードを入力してください";
    } else if (password.length < 8) {
      newErrors.password = "8文字以上入力してください";
    } else if (type === "signup" && password !== confirmedPassword) {
      newErrors.password = "パスワードが一致しません";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (type === "login") {
      // login processing
      console.log("login", email, password);
    } else if (type === "signup") {
      // confirm password
      // signup processing
      console.log("signup", email, password);
    } else {
      console.log("error");
    }

    router.replace("/(tabs)/(home)");
  };

  const handleBackHome = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/(home)");
  };

  return (
    <View className="w-4/5 bg-white py-4 px-4 rounded-xl shadow-md">
      <Heading size="lg" className="mb-4">
        {type === "login" ? "ログイン" : "会員登録"}
      </Heading>
      <FormEmail errors={errors} email={email} setEmail={setEmail} />
      <FormPassword
        errors={errors}
        password={password}
        setPassword={setPassword}
        confirmedPassword={confirmedPassword}
        setConfirmedPassword={setConfirmedPassword}
        signup={type === "signup"}
      />

      {type === "login" ? (
        <View className="mb-4">
          <HStack className="mb-2">
            <Text className="mr-1">パスワードを忘れた場合は</Text>
            <Link href="" asChild>
              <TouchableOpacity>
                <Text bold className="text-blue-500">
                  こちら
                </Text>
              </TouchableOpacity>
            </Link>
          </HStack>
          <HStack>
            <Text>会員登録がまだの場合は</Text>
            <Link href="/(auth)/signup" asChild replace>
              <TouchableOpacity>
                <Text bold className="text-blue-500">
                  こちら
                </Text>
              </TouchableOpacity>
            </Link>
          </HStack>
        </View>
      ) : (
        <View className="mb-4">
          <HStack>
            <Text>会員登録がお済みの場合は</Text>
            <Link href="/(auth)/login" asChild replace>
              <TouchableOpacity>
                <Text bold className="text-blue-500">
                  こちら
                </Text>
              </TouchableOpacity>
            </Link>
          </HStack>
        </View>
      )}

      <Button
        onPress={handleSubmit}
        className="mb-4"
        action={`${type === "signup" ? "positive" : "primary"}`}
      >
        <ButtonText>{type === "login" ? "ログイン" : "登録"}</ButtonText>
      </Button>

      <Divider className="mb-4" />

      <View className="mb-4">
        <Text size="lg" bold>
          Google
        </Text>
        <Text size="lg" bold>
          Apple
        </Text>
      </View>

      <View>
        <TouchableOpacity onPress={handleBackHome}>
          <HStack className="items-center">
            <Icon as={ArrowLeftIcon} className="mr-2" />
            <Text size="md" bold>
              ホームへ戻る
            </Text>
          </HStack>
        </TouchableOpacity>
      </View>
    </View>
  );
}
