import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";

import { useAuth } from "@/src/lib/auth/AuthProvider";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit() {
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage("メールアドレスとパスワードを入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      await signIn({ email, password });
    } catch (e) {
      const message = e instanceof Error ? e.message : "ログインに失敗しました。";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-2xl font-semibold">ログイン</Text>

      <View className="mt-6 gap-3">
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          keyboardType="email-address"
          placeholder="メールアドレス"
          value={email}
          onChangeText={setEmail}
          className="rounded-xl border border-outline-200 bg-background-0 px-4 py-3 text-typography-900"
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          placeholder="パスワード"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="rounded-xl border border-outline-200 bg-background-0 px-4 py-3 text-typography-900"
        />
      </View>

      {errorMessage ? (
        <Text className="mt-3 text-error-600">{errorMessage}</Text>
      ) : null}

      <Pressable
        disabled={submitting}
        onPress={onSubmit}
        className="mt-6 rounded-xl bg-primary-600 px-4 py-3"
      >
        <Text className="text-center font-semibold text-typography-white">
          {submitting ? "ログイン中..." : "ログイン"}
        </Text>
      </Pressable>

      <View className="mt-6 flex-row justify-center gap-2">
        <Text className="text-typography-600">アカウントをお持ちでない方</Text>
        <Link href={"/(auth)/sign-up" as any} asChild>
          <Pressable>
            <Text className="font-semibold text-primary-600">会員登録</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
