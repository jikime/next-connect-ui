"use client"

import { ResourceAllocationRecommendations } from "@/components/resource-allocation/resource-allocation-recommendations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectResourcesTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>리소스 할당 최적화</CardTitle>
          <CardDescription>AI가 분석한 최적의 리소스 할당 방안을 확인하고 적용하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recommendations">
            <TabsList>
              <TabsTrigger value="recommendations">추천 할당</TabsTrigger>
              <TabsTrigger value="current">현재 할당</TabsTrigger>
              <TabsTrigger value="history">할당 이력</TabsTrigger>
            </TabsList>
            <TabsContent value="recommendations" className="pt-4">
              <ResourceAllocationRecommendations projectId={project.id} />
            </TabsContent>
            <TabsContent value="current" className="pt-4">
              <div className="text-center text-muted-foreground py-8">현재 할당된 리소스 정보가 표시됩니다.</div>
            </TabsContent>
            <TabsContent value="history" className="pt-4">
              <div className="text-center text-muted-foreground py-8">리소스 할당 이력이 표시됩니다.</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
