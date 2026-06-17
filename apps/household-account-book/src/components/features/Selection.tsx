import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDown } from "lucide-react"

interface Props {
  selection: string
  setSelection: (selection: string) => void
}

export default function Selection(props: Props) {
  const { selection, setSelection } = props
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{selection} <ChevronDown /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="start">
          <DropdownMenuItem onClick={() => setSelection("費用")}>
            費用
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelection("収益")}>
            収益
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelection("資産")}>
            資産
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelection("負債")}>
            負債
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
