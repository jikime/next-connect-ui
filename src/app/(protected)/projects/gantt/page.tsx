"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Filter, Download, Share2, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { GanttChart, type Task } from "@/components/gantt-chart"
import { CreateTaskModal } from "@/components/modals/create-task-modal"
import { TaskDetailModal } from "@/components/modals/task-detail-modal"
import { useToast } from "@/hooks/use-toast"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function ProjectGanttPage() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("1") // 기본값으로 첫 번째 프로젝트 선택
  const [tasks, setTasks] = useState<Task[]>([])
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)
  const [taskDetailModalOpen, setTaskDetailModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  // 프로젝트 목록 가져오기
  useEffect(() => {
    // 실제 구현에서는 API 호출
    setTimeout(() => {
      const sampleProjects = [
        {
          id: "1",
          name: "웹사이트 리디자인",
          startDate: "2025-05-01",
          endDate: "2025-06-15",
        },
        {
          id: "2",
          name: "모바일 앱 개발",
          startDate: "2025-05-15",
          endDate: "2025-07-30",
        },
        {
          id: "3",
          name: "마케팅 캠페인",
          startDate: "2025-06-01",
          endDate: "2025-08-10",
        },
      ]

      setProjects(sampleProjects)

      // 기본 프로젝트의 작업 데이터 로드
      loadTasksForProject("1")
    }, 1000)
  }, [])

  // 프로젝트 변경 시 작업 데이터 로드
  const loadTasksForProject = (projectId: string) => {
    setIsLoading(true)
    setSelectedProjectId(projectId)

    // 실제 구현에서는 API 호출
    setTimeout(() => {
      // 프로젝트별 샘플 작업 데이터
      const projectTasks: Record<string, Task[]> = {
        "1": [
          {
            id: "1",
            title: "요구사항 분석",
            startDate: "2025-05-01",
            endDate: "2025-05-05",
            progress: 100,
            status: "완료",
            assignee: {
              id: "1",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "2",
            title: "디자인 시안 작업",
            startDate: "2025-05-06",
            endDate: "2025-05-15",
            progress: 80,
            status: "진행 중",
            assignee: {
              id: "2",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
            dependencies: ["1"],
          },
          {
            id: "3",
            title: "프론트엔드 개발",
            startDate: "2025-05-10",
            endDate: "2025-05-25",
            progress: 60,
            status: "진행 중",
            assignee: {
              id: "3",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            dependencies: ["2"],
          },
          {
            id: "4",
            title: "백엔드 API 개발",
            startDate: "2025-05-10",
            endDate: "2025-05-30",
            progress: 40,
            status: "진행 중",
            assignee: {
              id: "4",
              name: "정백엔드",
              image: "/abstract-profile.png",
            },
            dependencies: ["1"],
          },
          {
            id: "5",
            title: "통합 테스트",
            startDate: "2025-05-26",
            endDate: "2025-06-05",
            progress: 0,
            status: "대기 중",
            assignee: {
              id: "3",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            dependencies: ["3", "4"],
          },
          {
            id: "6",
            title: "사용자 테스트",
            startDate: "2025-06-06",
            endDate: "2025-06-10",
            progress: 0,
            status: "계획",
            assignee: {
              id: "1",
              name: "박기획",
              image: "/abstract-profile.png",
            },
            dependencies: ["5"],
          },
          {
            id: "7",
            title: "최종 배포",
            startDate: "2025-06-11",
            endDate: "2025-06-15",
            progress: 0,
            status: "계획",
            assignee: {
              id: "4",
              name: "정백엔드",
              image: "/abstract-profile.png",
            },
            dependencies: ["6"],
          },
        ],
        "2": [
          {
            id: "1",
            title: "앱 기획",
            startDate: "2025-05-15",
            endDate: "2025-05-25",
            progress: 100,
            status: "완료",
            assignee: {
              id: "1",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "2",
            title: "UI/UX 디자인",
            startDate: "2025-05-26",
            endDate: "2025-06-15",
            progress: 70,
            status: "진행 중",
            assignee: {
              id: "2",
              name: "김디자인",
              image: "/abstract-profile.png",
            },
            dependencies: ["1"],
          },
          {
            id: "3",
            title: "iOS 개발",
            startDate: "2025-06-10",
            endDate: "2025-07-10",
            progress: 30,
            status: "진행 중",
            assignee: {
              id: "5",
              name: "최모바일",
              image: "/abstract-profile.png",
            },
            dependencies: ["2"],
          },
          {
            id: "4",
            title: "Android 개발",
            startDate: "2025-06-10",
            endDate: "2025-07-15",
            progress: 20,
            status: "진행 중",
            assignee: {
              id: "6",
              name: "한안드로이드",
              image: "/abstract-profile.png",
            },
            dependencies: ["2"],
          },
          {
            id: "5",
            title: "테스트 및 QA",
            startDate: "2025-07-16",
            endDate: "2025-07-25",
            progress: 0,
            status: "계획",
            assignee: {
              id: "7",
              name: "임테스터",
              image: "/abstract-profile.png",
            },
            dependencies: ["3", "4"],
          },
          {
            id: "6",
            title: "앱 출시",
            startDate: "2025-07-26",
            endDate: "2025-07-30",
            progress: 0,
            status: "계획",
            assignee: {
              id: "5",
              name: "최모바일",
              image: "/abstract-profile.png",
            },
            dependencies: ["5"],
          },
        ],
        "3": [
          {
            id: "1",
            title: "마케팅 전략 수립",
            startDate: "2025-06-01",
            endDate: "2025-06-10",
            progress: 90,
            status: "진행 중",
            assignee: {
              id: "8",
              name: "한마케팅",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "2",
            title: "콘텐츠 제작",
            startDate: "2025-06-11",
            endDate: "2025-06-30",
            progress: 50,
            status: "진행 중",
            assignee: {
              id: "9",
              name: "김콘텐츠",
              image: "/abstract-profile.png",
            },
            dependencies: ["1"],
          },
          {
            id: "3",
            title: "SNS 캠페인",
            startDate: "2025-07-01",
            endDate: "2025-07-20",
            progress: 0,
            status: "계획",
            assignee: {
              id: "8",
              name: "한마케팅",
              image: "/abstract-profile.png",
            },
            dependencies: ["2"],
          },
          {
            id: "4",
            title: "광고 집행",
            startDate: "2025-07-10",
            endDate: "2025-07-31",
            progress: 0,
            status: "계획",
            assignee: {
              id: "10",
              name: "박광고",
              image: "/abstract-profile.png",
            },
            dependencies: ["2"],
          },
          {
            id: "5",
            title: "성과 분석",
            startDate: "2025-08-01",
            endDate: "2025-08-10",
            progress: 0,
            status: "계획",
            assignee: {
              id: "8",
              name: "한마케팅",
              image: "/abstract-profile.png",
            },
            dependencies: ["3", "4"],
          },
        ],
      }

      setTasks(projectTasks[projectId] || [])
      setIsLoading(false)
    }, 800)
  }

  // 현재 선택된 프로젝트 정보
  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  // 작업 클릭 핸들러
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskDetailModalOpen(true)
  }

  // 작업 추가 핸들러
  const handleAddTask = () => {
    setCreateTaskModalOpen(true)
  }

  // 작업 업데이트 핸들러
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

    // 실제 구현에서는 API 호출
  }

  // 작업 삭제 핸들러
  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))

    // 실제 구현에서는 API 호출
  }

  // 간트 차트 내보내기
  const handleExportGantt = () => {
    toast({
      title: "간트 차트 내보내기",
      description: "간트 차트가 PDF로 내보내기 되었습니다.",
    })
  }

  // 간트 차트 공유
  const handleShareGantt = () => {
    toast({
      title: "간트 차트 공유",
      description: "간트 차트 공유 링크가 생성되었습니다.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">대시보드</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/projects">프로젝트</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>간트 차트</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/projects">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">간트 차트</h1>
          </div>
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            작업 추가
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <Button
              key={project.id}
              variant={selectedProjectId === project.id ? "default" : "outline"}
              onClick={() => loadTasksForProject(project.id)}
            >
              {project.name}
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            필터
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportGantt}>
            <Download className="h-4 w-4 mr-1" />
            내보내기
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareGantt}>
            <Share2 className="h-4 w-4 mr-1" />
            공유
          </Button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">간트 차트를 불러오는 중...</div>
        ) : (
          <GanttChart
            projectId={selectedProjectId}
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      <CreateTaskModal
        open={createTaskModalOpen}
        onOpenChange={setCreateTaskModalOpen}
        projectId={selectedProjectId}
        onTaskCreated={(newTask) => {
          // 실제 구현에서는 API 응답으로 받은 작업 데이터를 사용
          const task: Task = {
            id: `task-${Date.now()}`,
            title: newTask.title,
            startDate: newTask.startDate || new Date().toISOString().split("T")[0],
            endDate: newTask.dueDate || new Date().toISOString().split("T")[0],
            progress: 0,
            status: "계획",
            assignee: {
              id: newTask.assigneeId || "1",
              name: newTask.assigneeName || "미배정",
              image: "/abstract-profile.png",
            },
          }

          setTasks((prevTasks) => [...prevTasks, task])

          toast({
            title: "작업 추가 완료",
            description: `${task.title} 작업이 추가되었습니다.`,
          })
        }}
      />

      <TaskDetailModal
        open={taskDetailModalOpen}
        onOpenChange={setTaskDetailModalOpen}
        taskId={selectedTaskId}
        onTaskUpdated={(updatedTask) => {
          // 작업 업데이트 시 간트 차트 데이터도 업데이트
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id
                ? {
                    ...task,
                    title: updatedTask.title,
                    status: updatedTask.status,
                    progress: updatedTask.progress || task.progress,
                    startDate: updatedTask.startDate || task.startDate,
                    endDate: updatedTask.dueDate || task.endDate,
                    assignee: {
                      id: updatedTask.assigneeId || task.assignee.id,
                      name: updatedTask.assigneeName || task.assignee.name,
                      image: task.assignee.image,
                    },
                  }
                : task,
            ),
          )
        }}
        onTaskDeleted={(taskId) => {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
        }}
      />
    </div>
  )
}
