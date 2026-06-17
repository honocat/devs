import { LoaderCircle } from "lucide-react";

export function Spinner() {
    return (
        <div
          className="flex min-h-[50vh] items-center justify-center rounded-lg border border-dashed bg-card/50"
          role="status"
          aria-live="polite"
          aria-label="読み込み中"
        >
          <LoaderCircle className="size-8 animate-spin text-muted-foreground" />
        </div>
    )
}