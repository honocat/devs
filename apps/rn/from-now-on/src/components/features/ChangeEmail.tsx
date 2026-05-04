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

export default function ChangeEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    let newError = "";

    if (!email) {
      newError = "メールアドレスを入力してください";
    } else if (!email.includes("@")) {
      newError = "メールアドレスの形式が不正です";
    }
    // else if (email === user.email) newError = '現在と同じメールアドレスは指定できません'

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
                <Text size="xl">メールアドレス変更</Text>
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
            <Text>新しいメールアドレスを入力してください。</Text>
            <Input className="mt-1">
              <InputField
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="メールアドレス"
                value={email}
                onChangeText={(i) => setEmail(i)}
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
