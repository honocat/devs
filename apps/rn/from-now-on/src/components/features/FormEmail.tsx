import { Dispatch, SetStateAction } from "react";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";

interface Props {
  errors: {
    email?: string;
    password?: string;
  };
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
}

export default function FormEmail(props: Props) {
  const { errors, email, setEmail } = props;

  return (
    <FormControl
      isInvalid={!!errors.email}
      isRequired
      size="lg"
      className="mb-4"
    >
      <FormControlLabel>
        <FormControlLabelText>メールアドレス</FormControlLabelText>
      </FormControlLabel>
      <Input>
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
        <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
        <FormControlErrorText>{errors.email}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
