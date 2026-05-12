import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface Props {
  to: string
  text: string
  className?: string
}

export default function LinkButton(props: Props) {
  const { to, text, className } = props
  return (
    <Link to={to} className={`h-30 w-full ${className ? className : ""}`}>
      <Button variant="outline" className="h-full w-full">
        {text}
      </Button>
    </Link>
  )
}
