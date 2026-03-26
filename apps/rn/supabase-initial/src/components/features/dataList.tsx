import {
  type MyNumberRows,
  formatDate,
} from "@/src/components/features/crudData";

import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";

interface Props {
  numbers: MyNumberRows[];
}

export default function DataList(props: Props) {
  const { numbers } = props;

  return (
    <View className="flex-1 w-full px-12">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {numbers.map((item, index) => (
          <View key={item.id} className="w-full">
            <Text size="2xl">Number: {item.number}</Text>
            <View className="w-fit">
              <HStack className="justify-between">
                <Text>{formatDate(item.created_at)}</Text>
                <Divider orientation="vertical" className="mx-4" />
                <Text>ID: {item.id}</Text>
              </HStack>
            </View>
            {numbers.length - index > 1 ? <Divider className="my-4" /> : <></>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
