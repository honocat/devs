import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const GeneratedPass = ({ pass }: { pass: string }) => {
  return (
    <div className="relative">
      <Input type="text" value={pass} readOnly className="pr-20" />
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto py-1"
        onClick={() => {
          navigator.clipboard.writeText(pass);
          toast("パスワードをコピーしました");
        }}
      >
        コピー
      </Button>
    </div>
  );
};

export default GeneratedPass;
