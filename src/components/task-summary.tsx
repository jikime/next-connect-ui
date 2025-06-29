import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

export function TaskSummary() {
  const taskStats = [
    {
      title: "완료된 작업",
      value: 24,
      icon: CheckCircle2,
      color: "text-green-500",
      change: "+5",
    },
    {
      title: "진행 중인 작업",
      value: 13,
      icon: Clock,
      color: "text-blue-500",
      change: "-2",
    },
    {
      title: "지연된 작업",
      value: 5,
      icon: AlertCircle,
      color: "text-red-500",
      change: "+1",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>작업 요약</CardTitle>
        <CardDescription>이번 주 작업 현황</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {taskStats.map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`rounded-full p-2 ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{stat.title}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
              <div className={`text-sm ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
