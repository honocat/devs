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
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmedPassword: string;
  setConfirmedPassword: Dispatch<SetStateAction<string>>;
  signup: boolean;
}

export default function FormPassword(props: Props) {
  const {
    errors,
    password,
    setPassword,
    confirmedPassword,
    setConfirmedPassword,
    signup,
  } = props;

  return (
    <FormControl
      isInvalid={!!errors.password}
      isRequired
      size="lg"
      className="mb-4"
    >
      <FormControlLabel>
        <FormControlLabelText>パスワード</FormControlLabelText>
      </FormControlLabel>
      <Input>
        <InputField
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          placeholder="パスワード"
          value={password}
          onChangeText={(i) => setPassword(i)}
          type="password"
        />
      </Input>
      {signup ? (
        <Input className="mt-2">
          <InputField
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            placeholder="パスワード（確認用）"
            value={confirmedPassword}
            onChangeText={(i) => setConfirmedPassword(i)}
            type="password"
          />
        </Input>
      ) : (
        <></>
      )}
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{errors.password}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
