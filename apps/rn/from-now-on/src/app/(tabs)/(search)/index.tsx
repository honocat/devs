import { Stack } from "expo-router";

import { Container } from "@/src/components/layouts/Container";

export default function SearchIndex() {
  return (
    <Container>
      <Stack.SearchBar
        placement="automatic"
        placeholder="Search"
        onChangeText={() => {}}
      />
    </Container>
  );
}
