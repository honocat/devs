import { View } from "react-native";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}

export default function Container(props: Props) {
  const { children, className, center } = props;
  const containerStyle = `flex-1 px-4 ${center ? "items-center justify-center" : ""}`;
  return <View className={twMerge(containerStyle, className)}>{children}</View>;
}
