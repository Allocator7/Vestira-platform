// Test file to verify all imports work
import Screen from "@/components/Screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestImports() {
  return (
    <Screen>
      <Card>
        <CardHeader>
          <CardTitle>Test Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="test">Test Input</Label>
          <Input id="test" placeholder="Test" />
          <Button>Test Button</Button>
        </CardContent>
      </Card>
    </Screen>
  )
}
