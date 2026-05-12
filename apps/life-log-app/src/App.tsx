import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import LinkButton from "@/components/features/LinkButton"

import { Container } from "@/components/layouts/Container"

export function App() {
  return (
    <Container>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-bold">ライフログアプリ</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <LinkButton to="/expenses" text="家計簿" />
          <LinkButton to="/words" text="語句" />
          <LinkButton to="/" text="開発中..." className="col-span-2" />
        </CardContent>
      </Card>
    </Container>
  )
}

export default App
