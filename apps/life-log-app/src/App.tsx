import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import LinkButton from "@/components/features/LinkButton"

import { Container } from "@/components/layouts/Container"

export function App() {
  return (
    <Container>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Life Logs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <LinkButton to="/expenses" text="Expenses" />
          <LinkButton to="/words" text="Words" />
          <LinkButton to="/" text="Coming soon..." className="col-span-2" />
        </CardContent>
      </Card>
    </Container>
  )
}

export default App
