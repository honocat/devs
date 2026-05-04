import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const PassOptions = ({
  options,
  setOptions,
}: {
  options: {
    num: boolean;
    sym: boolean;
    low: boolean;
    upp: boolean;
  };
  setOptions: React.Dispatch<
    React.SetStateAction<{
      num: boolean;
      sym: boolean;
      low: boolean;
      upp: boolean;
    }>
  >;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="numbers">数字を含める</Label>
        <Switch
          defaultChecked
          id="numbers"
          onCheckedChange={() => {
            setOptions({
              ...options,
              num: !options.num,
            });
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="symbols">記号を含める</Label>
        <Switch
          defaultChecked
          id="symbols"
          onCheckedChange={() => {
            setOptions({
              ...options,
              sym: !options.sym,
            });
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="lowercase">小文字を含める</Label>
        <Switch
          defaultChecked
          id="lowercase"
          onCheckedChange={() => {
            setOptions({
              ...options,
              low: !options.low,
            });
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="uppercase">大文字を含める</Label>
        <Switch
          defaultChecked
          id="uppercase"
          onCheckedChange={() => {
            setOptions({
              ...options,
              upp: !options.upp,
            });
          }}
        />
      </div>
    </div>
  );
};

export default PassOptions;
