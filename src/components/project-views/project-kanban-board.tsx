"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, AlertCircle, MoreHorizontal, Plus } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { TaskDetailModal } from "@/components/modals/task-detail-modal"
import { CreateTaskModal } from "@/components/modals/create-task-modal"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  assignee?: {
    id: string
    name: string
    image?: string
  }
}

interface ProjectKanbanBoardProps {
  projectId: string
}

export function ProjectKanbanBoard({ projectId }: ProjectKanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false)
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)
  const [initialTaskStatus, setInitialTaskStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)

        // 더미 데이터 사용
        const dummyTasks = [
          // 할 일 (To Do)
          {
            id: "1",
            title: "사용자 테스트 계획",
            description: "사용자 테스트 방법론 및 참가자 모집 계획 수립",
            status: "todo",
            priority: "high",
            dueDate: "2023-12-05",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "2",
            title: "API 문서화",
            description: "RESTful API 엔드포인트 문서화",
            status: "todo",
            priority: "low",
            dueDate: "2023-12-08",
            assignee: {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
          },

          // 진행 중 (In Progress)
          {
            id: "3",
            title: "디자인 검토",
            description: "웹사이트 리뉴얼 디자인 검토 및 피드백",
            status: "in-progress",
            priority: "high",
            dueDate: "2023-11-25",
            assignee: {
              id: "1",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "4",
            title: "로그인 기능 구현",
            description: "사용자 인증 및 로그인 기능 개발",
            status: "in-progress",
            priority: "medium",
            dueDate: "2023-11-30",
            assignee: {
              id: "2",
              name: "이개발",
              image: "/abstract-profile.png",
            },
          },

          // 검토 중 (In Review)
          {
            id: "5",
            title: "랜딩 페이지 디자인",
            description: "웹사이트 랜딩 페이지 디자인 및 레이아웃",
            status: "review",
            priority: "medium",
            dueDate: "2023-11-22",
            assignee: {
              id: "1",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
          },

          // 완료 (Done)
          {
            id: "6",
            title: "요구사항 분석",
            description: "사용자 요구사항 수집 및 분석",
            status: "done",
            priority: "high",
            dueDate: "2023-11-15",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "7",
            title: "프로젝트 계획",
            description: "프로젝트 일정 및 리소스 계획 수립",
            status: "done",
            priority: "medium",
            dueDate: "2023-11-10",
            assignee: {
              id: "3",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
        ]

        setTasks(dummyTasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
        toast.error("작업을 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [projectId])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return format(date, "yyyy-MM-dd", { locale: ko })
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "높음":
        return <Badge variant="destructive">긴급</Badge>
      case "medium":
      case "중간":
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            보통
          </Badge>
        )
      case "low":
      case "낮음":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            낮음
          </Badge>
        )
      default:
        return <Badge variant="outline">보통</Badge>
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setTaskDetailModalOpen(true)
  }

  const handleAddTask = (status: string) => {
    setInitialTaskStatus(status)
    setCreateTaskModalOpen(true)
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
    setCreateTaskModalOpen(false)
    toast.success("작업이 성공적으로 생성되었습니다.")
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    toast.success("작업이 성공적으로 업데이트되었습니다.")
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  const columns = [
    { id: "todo", title: "할 일", tasks: getTasksByStatus("todo") },
    { id: "in-progress", title: "진행 중", tasks: getTasksByStatus("in-progress") },
    { id: "review", title: "검토 중", tasks: getTasksByStatus("review") },
    { id: "done", title: "완료", tasks: getTasksByStatus("done") },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">{column.title}</h3>
            <Badge variant="outline">{column.tasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleTaskClick(task)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(task.priority)}
                        <button
                          className="text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            // 추가 옵션 메뉴 처리
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(task.dueDate)}
                      </div>
                      {task.assignee && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.image || "/placeholder.svg"} alt={task.assignee.name} />
                          <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {column.tasks.length === 0 && (
              <div className="border border-dashed rounded-md p-3 text-center text-sm text-muted-foreground">
                작업 없음
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => handleAddTask(column.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              작업 추가
            </Button>
          </div>
        </div>
      ))}

      {/* 작업 상세 모달 */}
      {selectedTask && (
        <TaskDetailModal
          open={taskDetailModalOpen}
          onOpenChange={setTaskDetailModalOpen}
          task={selectedTask}
          projectId={projectId}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* 작업 생성 모달 */}
      <CreateTaskModal
        open={createTaskModalOpen}
        onOpenChange={setCreateTaskModalOpen}
        projectId={projectId}
        initialStatus={initialTaskStatus || "todo"}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  )
}
