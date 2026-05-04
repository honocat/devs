import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";

import { Icon, ChevronRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const accordionStyle =
  "w-full flex-row justify-between items-center focus:outline-none data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed data-[focus-visible=true]:bg-background-50 py-3 px-4";

export default function CreateCard() {
  return (
    <Link asChild href="/card/create" className={accordionStyle}>
      <TouchableOpacity>
        <Text size="xl">カード新規作成</Text>
        <Icon as={ChevronRightIcon} />
      </TouchableOpacity>
    </Link>
  );
}
