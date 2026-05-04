import { useState } from "react";

import { View } from "react-native";
import { Link, router } from "expo-router";

import { AlertCircleIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

export default function LogIn() {
  const [isInvalid, setIsInvalid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(email: string, password: string) {
    if (password.length < 8) return setIsInvalid(true);
    // log in processing
    router.replace("/(home)");
  }

  return (
    <View className="flex-1 items-center justify-center bg-slate-200 px-12">
      <View className="bg-white w-full rounded-md p-4">
        <FormControl isInvalid={isInvalid} size="md" className="">
          <Heading>Welcome back!</Heading>
          <View className="mt-4">
            <FormControlLabel>
              <FormControlLabelText>Email address</FormControlLabelText>
            </FormControlLabel>
            <Input className="mt-1" size="md">
              <InputField
                type="text"
                placeholder="Email address"
                value={email}
                onChangeText={(input) => setEmail(input)}
                autoCapitalize="none"
              />
            </Input>
          </View>
          <View className="mt-2">
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="mt-1" size="md">
              <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChangeText={(input) => setPassword(input)}
                autoCapitalize="none"
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Must be at least 8 characters.
              </FormControlHelperText>
            </FormControlHelper>
          </View>
          <FormControlError>
            <FormControlErrorIcon
              as={AlertCircleIcon}
              className="text-red-500"
            />
            <FormControlErrorText className="text-red-500">
              At least 8 characters are required.
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <Button
          className="mt-4"
          onPress={() => {
            handleSubmit(email, password);
          }}
        >
          <ButtonText>Submit</ButtonText>
        </Button>
        <HStack className="mt-4">
          <Text className="mr-2">Not registered?</Text>
          <Link href="/signup" replace>
            <LinkText>Sign up here!</LinkText>
          </Link>
        </HStack>
      </View>
    </View>
  );
}
