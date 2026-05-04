import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const PassLength = ({
  length,
  setLength,
  generatePass,
}: {
  length: number;
  setLength: React.Dispatch<React.SetStateAction<number>>;
  generatePass: () => void;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>パスワードの長さ: {length}</Label>
        <span className="text-sm text-gray-500">8-32文字</span>
      </div>
      <Slider
        defaultValue={[length]}
        max={32}
        min={8}
        step={1}
        onValueChange={(e) => {
          if (e[0] !== undefined) {
            setLength(e[0]);
            generatePass();
          }
        }}
      />
    </div>
  );
};

export default PassLength;
