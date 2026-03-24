import { useState } from "react";
import { router } from "expo-router";

import {
  Accordion,
  AccordionContent,
  AccordionIcon,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import {
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    let newError = "";

    if (!password) {
      newError = "パスワードを入力してください";
    } else if (password.length < 8) {
      newError = "8文字以上入力してください";
    } else if (password !== confirmedPassword) {
      newError = "パスワードが一致しません";
    }
    // else if (password === user.password) newError = '同じパスワードが指定できません'

    setError(newError);
    return newError.length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    router.replace("/(auth)/login");
  };

  return (
    <Accordion size="md" variant="unfilled" type="multiple">
      <AccordionItem value="a">
        <AccordionTrigger>
          {({ isExpanded }: { isExpanded?: boolean }) => {
            return (
              <>
                <Text size="xl">パスワード変更</Text>
                {isExpanded ? (
                  <AccordionIcon as={ChevronDownIcon} />
                ) : (
                  <AccordionIcon as={ChevronRightIcon} />
                )}
              </>
            );
          }}
        </AccordionTrigger>
        <FormControl isInvalid={!!error}>
          <AccordionContent>
            <Text>現在のパスワードを入力してください。</Text>
            <Input className="mt-1">
              <InputField
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                placeholder="現在のパスワード"
                value={password}
                onChangeText={(i) => setPassword(i)}
                type="password"
              />
            </Input>
            <Text className="mt-2">新しいパスワードを入力してください。</Text>
            <Input className="mt-1">
              <InputField
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                placeholder="新しいパスワード"
                value={confirmedPassword}
                onChangeText={(i) => setConfirmedPassword(i)}
                type="password"
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>{error}</FormControlErrorText>
            </FormControlError>

            <Button
              action="positive"
              className="mt-2 w-fit"
              onPress={handleSubmit}
            >
              <ButtonText>変更</ButtonText>
            </Button>
          </AccordionContent>
        </FormControl>
      </AccordionItem>
    </Accordion>
  );
}
