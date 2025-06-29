"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, CalendarClock, Clock, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

interface TaskListProps {
  onTaskClick?: (taskId: string) => void
}

export function TaskList({ onTaskClick }: TaskListProps) {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "사용자 인터뷰 진행",
      description: "주요 사용자 5명과 인터뷰 진행",
      priority: "높음",
      status: "할 일",
      dueDate: "2025-05-25",
      completed: false,
      assignee: {
        name: "박기획",
        image: "/abstract-profile.png",
      },
    },
    {
      id: "4",
      title: "로그인 페이지 구현",
      description: "소셜 로그인 포함",
      priority: "높음",
      status: "진행 중",
      dueDate: "2025-05-20",
      completed: false,
      assignee: {
        name: "이개발",
        image: "/abstract-profile.png",
      },
    },
    {
      id: "6",
      title: "대시보드 UI 디자인",
      description: "데이터 시각화 컴포넌트 포함",
      priority: "중간",
      status: "검토 중",
      dueDate: "2025-05-18",
      completed: false,
      assignee: {
        name: "김디자인",
        image: "/abstract-profile.png",
      },
    },
    {
      id: "2",
      title: "디자인 시스템 문서화",
      description: "컴포넌트 가이드라인 작성",
      priority: "중간",
      status: "할 일",
      dueDate: "2025-05-30",
      completed: false,
      assignee: {
        name: "김디자인",
        image: "/abstract-profile.png",
      },
    },
    {
      id: "5",
      title: "API 엔드포인트 개발",
      description: "사용자 관리 API 구현",
      priority: "중간",
      status: "진행 중",
      dueDate: "2025-05-22",
      completed: false,
      assignee: {
        name: "정백엔드",
        image: "/abstract-profile.png",
      },
    },
    {
      id: "7",
      title: "요구사항 분석",
      description: "주요 기능 및 사용자 요구사항 정리",
      priority: "높음",
      status: "완료",
      dueDate: "2025-05-10",
      completed: true,
      assignee: {
        name: "박기획",
        image: "/abstract-profile.png",
      },
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음":
        return "bg-red-500"
      case "중간":
        return "bg-yellow-500"
      case "낮음":
        return "bg-green-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "할 일":
        return <Badge variant="outline">할 일</Badge>
      case "진행 중":
        return <Badge>진행 중</Badge>
      case "검토 중":
        return <Badge variant="secondary">검토 중</Badge>
      case "완료":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            완료
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { icon: AlertCircle, text: "기한 초과", color: "text-red-500" }
    } else if (diffDays <= 3) {
      return { icon: Clock, text: "곧 마감", color: "text-yellow-500" }
    } else {
      return {
        icon: CalendarClock,
        text: new Date(dueDate).toLocaleDateString("ko-KR"),
        color: "text-muted-foreground",
      }
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed, status: !task.completed ? "완료" : "할 일" } : task,
      ),
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const dueStatus = getDueDateStatus(task.dueDate)
        const DueIcon = dueStatus.icon

        return (
          <Card key={task.id} className="p-4 transition-all hover:shadow-md">
            <div className="flex items-start gap-4">
              <Checkbox
                id={`task-${task.id}`}
                className="mt-1"
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
              />
              <div className="flex-1 space-y-2 cursor-pointer" onClick={() => onTaskClick?.(task.id)}>
                <div className="flex items-start justify-between">
                  <div>
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-base font-medium hover:underline ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                    <p className={`text-sm ${task.completed ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                      {task.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {getStatusBadge(task.status)}
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <span>{task.priority}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DueIcon className={`h-3.5 w-3.5 ${dueStatus.color}`} />
                    <span className={dueStatus.color}>{dueStatus.text}</span>
                  </div>
                </div>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.assignee.image || "/placeholder.svg"} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
