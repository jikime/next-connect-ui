import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/charts"

export function ProjectStats() {
  return (
    <Card className="col-span-3 lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>프로젝트 통계</CardTitle>
        <CardDescription>프로젝트 진행 상황 및 완료율</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="progress">진행 상황</TabsTrigger>
            <TabsTrigger value="completion">완료율</TabsTrigger>
          </TabsList>
          <TabsContent value="progress">
            <LineChart />
          </TabsContent>
          <TabsContent value="completion">
            <BarChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
