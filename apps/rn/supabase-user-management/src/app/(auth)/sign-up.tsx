import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";

import { useAuth } from "@/src/lib/auth/AuthProvider";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function onSubmit() {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!email || !password) {
      setErrorMessage("メールアドレスとパスワードを入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      await signUp({ email, password });
      setSuccessMessage(
        "登録に成功しました。メール確認が必要な場合は確認後にログインしてください。"
      );
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "会員登録に失敗しました。";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-2xl font-semibold">会員登録</Text>

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
      {successMessage ? (
        <Text className="mt-3 text-success-600">{successMessage}</Text>
      ) : null}

      <Pressable
        disabled={submitting}
        onPress={onSubmit}
        className="mt-6 rounded-xl bg-primary-600 px-4 py-3"
      >
        <Text className="text-center font-semibold text-typography-white">
          {submitting ? "登録中..." : "登録"}
        </Text>
      </Pressable>

      <View className="mt-6 flex-row justify-center gap-2">
        <Text className="text-typography-600">すでにアカウントをお持ちの方</Text>
        <Link href={"/(auth)/sign-in" as any} asChild>
          <Pressable>
            <Text className="font-semibold text-primary-600">ログイン</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
