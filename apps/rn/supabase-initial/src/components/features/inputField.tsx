import { Text, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import { insertNumber } from "@/src/components/features/crudData";

interface Props {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setIsSubmited: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InputField(props: Props) {
  const { count, setCount, setIsSubmited } = props;

  const countUp = () => {
    setCount(count + 1);
  };

  return (
    <View className="bg-white shadow-md p-5 rounded-md">
      <Text className="text-4xl font-bold text-center">{count}</Text>
      <HStack className="mt-4 w-full justify-between">
        <Button onPress={countUp} size="xl" className="mr-4">
          <ButtonText>Press me!</ButtonText>
        </Button>
        <Button
          onPress={async () => {
            await insertNumber(count);
            setIsSubmited(true);
          }}
          size="xl"
        >
          <ButtonText>Submit!</ButtonText>
        </Button>
      </HStack>
    </View>
  );
}
