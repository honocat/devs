import FormAuth from "@/src/components/features/FormAuth";
import { Container } from "@/src/components/layouts/Container";

export default function LogIn() {
  return (
    <Container center>
      <FormAuth type="login" />
    </Container>
  );
}
