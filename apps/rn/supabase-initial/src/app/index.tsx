import { useEffect, useState } from "react";
import { View } from "react-native";

import {
  fetchMyNumberRows,
  type MyNumberRows,
} from "../components/features/crudData";

import Container from "@/src/components/layouts/Container";
import InputField from "@/src/components/features/inputField";
import DataList from "@/src/components/features/dataList";

import { Divider } from "@/components/ui/divider";

export default function RootIndex() {
  const [numbers, setNumbers] = useState<MyNumberRows[]>([]);
  const [count, setCount] = useState(0);
  const [isSubmited, setIsSubmited] = useState(false);

  console.log("loaded");

  useEffect(() => {
    const run = async () => {
      setNumbers(await fetchMyNumberRows());
    };
    run();
    if (isSubmited) setIsSubmited(false);
  }, [isSubmited]);

  return (
    <Container className="pt-32">
      <InputField
        count={count}
        setCount={setCount}
        setIsSubmited={setIsSubmited}
      />
      <Divider className="my-6" />
      <View className="flex-1 w-full">
        <DataList numbers={numbers} />
      </View>
    </Container>
  );
}
