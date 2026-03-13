import { Button } from "@/components/ui/button";

const GenerateButton = ({ generatePass }: { generatePass: () => void }) => {
  return (
    <Button className="w-full" onClick={generatePass}>
      パスワードを生成
    </Button>
  );
};

export default GenerateButton;
