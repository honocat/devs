import FormAuth from "@/src/components/features/FormAuth";
import { Container } from "@/src/components/layouts/Container";

export default function SignUp() {
  return (
    <Container center>
      <FormAuth type="signup" />
    </Container>
  );
}
