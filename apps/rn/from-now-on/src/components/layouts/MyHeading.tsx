import { Heading } from "@/components/ui/heading";

interface Props {
  title: string;
}

export function MyHeading(props: Props) {
  const { title } = props;
  return (
    <Heading size="xl" className="">
      {title}
    </Heading>
  );
}
