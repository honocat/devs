import { TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

interface Props {
  href: string;
  title: string;
}

export default function StackLink(props: Props) {
  const { href, title } = props;
  return (
    <Link href={href} asChild>
      <TouchableOpacity className="flex-row items-center justify-between bg-white mb-2 p-4 border border-typography-400 rounded-xl">
        <View className="">
          <Text size="xl" bold>
            {title}
          </Text>
        </View>
        <Icon as={ArrowRightIcon} className="text-typography-700" />
      </TouchableOpacity>
    </Link>
  );
}
