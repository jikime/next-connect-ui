"use client"

import { useState, useEffect } from "react"
import { GanttChart, type Task } from "@/components/gantt-chart"

interface TaskGanttViewProps {
  projectId: string
  onTaskClick?: (taskId: string) => void
  onAddTask?: () => void
  onUpdateTask?: (task: Task) => void
  onDeleteTask?: (taskId: string) => void
}

export function TaskGanttView({ 
  projectId, 
  onTaskClick, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask 
}: TaskGanttViewProps) {
  const [ganttTasks, setGanttTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGanttTasks = async () => {
      setLoading(true)
      
      // 프로젝트별 간트 작업 데이터 생성
      const getTasksForProject = (projectId: string): Task[] => {
        if (projectId === "3") {
          // 프로젝트 #3: 모바일 앱 개발
          return [
            {
              id: "3-1",
              title: "앱 아키텍처 설계",
              description: "React Native 기반 앱 아키텍처 설계",
              startDate: "2025-06-20",
              endDate: "2025-06-25",
              progress: 100,
              status: "완료",
              priority: "high",
              type: "task",
              assignee: {
                id: "1",
                name: "박설계",
                image: "/abstract-profile.png",
              },
            },
            {
              id: "3-2",
              title: "UI 컴포넌트 라이브러리",
              description: "재사용 가능한 UI 컴포넌트 개발",
              startDate: "2025-06-23",
              endDate: "2025-06-30",
              progress: 80,
              status: "진행 중",
              priority: "high",
              type: "task",
              assignee: {
                id: "2",
                name: "김모바일",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-1"],
            },
            {
              id: "3-3",
              title: "사용자 인증 기능",
              description: "로그인, 회원가입, 소셜 로그인",
              startDate: "2025-06-24",
              endDate: "2025-06-28",
              progress: 90,
              status: "진행 중",
              priority: "high",
              type: "task",
              assignee: {
                id: "3",
                name: "이백엔드",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-1"],
            },
            {
              id: "3-4",
              title: "메인 화면 개발",
              description: "홈 화면 및 네비게이션 구현",
              startDate: "2025-06-25",
              endDate: "2025-06-29",
              progress: 60,
              status: "진행 중",
              priority: "medium",
              type: "task",
              assignee: {
                id: "2",
                name: "김모바일",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-2"],
            },
            {
              id: "3-5",
              title: "데이터 관리 시스템",
              description: "Redux 상태 관리 및 API 연동",
              startDate: "2025-06-26",
              endDate: "2025-06-30",
              progress: 45,
              status: "진행 중",
              priority: "high",
              type: "task",
              assignee: {
                id: "4",
                name: "정개발",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-3"],
            },
            {
              id: "3-6",
              title: "푸시 알림 시스템",
              description: "Firebase 기반 푸시 알림 구현",
              startDate: "2025-06-27",
              endDate: "2025-07-02",
              progress: 20,
              status: "지연",
              priority: "medium",
              type: "task",
              assignee: {
                id: "3",
                name: "이백엔드",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-3"],
            },
            {
              id: "3-7",
              title: "오프라인 모드",
              description: "로컬 저장소 및 동기화 기능",
              startDate: "2025-06-28",
              endDate: "2025-07-03",
              progress: 30,
              status: "진행 중",
              priority: "medium",
              type: "task",
              assignee: {
                id: "4",
                name: "정개발",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-5"],
            },
            {
              id: "3-8",
              title: "성능 최적화",
              description: "앱 로딩 속도 및 메모리 최적화",
              startDate: "2025-07-01",
              endDate: "2025-07-05",
              progress: 0,
              status: "대기 중",
              priority: "high",
              type: "task",
              assignee: {
                id: "5",
                name: "최최적화",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-4", "3-5"],
            },
            {
              id: "3-9",
              title: "테스트 자동화",
              description: "유닛 테스트 및 E2E 테스트 구축",
              startDate: "2025-07-02",
              endDate: "2025-07-08",
              progress: 0,
              status: "계획",
              priority: "medium",
              type: "task",
              assignee: {
                id: "6",
                name: "한테스터",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-8"],
            },
            {
              id: "3-10",
              title: "앱스토어 준비",
              description: "앱스토어 등록 및 메타데이터 준비",
              startDate: "2025-07-06",
              endDate: "2025-07-12",
              progress: 0,
              status: "계획",
              priority: "high",
              type: "task",
              assignee: {
                id: "7",
                name: "박마케터",
                image: "/abstract-profile.png",
              },
              dependencies: ["3-8"],
            },
          ]
        }
        
        // 기본 프로젝트 데이터
        return [
          {
            id: "1",
            title: "요구사항 분석",
            description: "프로젝트 요구사항 수집 및 분석",
            startDate: "2025-06-01",
            endDate: "2025-06-05",
            progress: 100,
            status: "완료",
            priority: "high",
            type: "task",
            assignee: {
              id: "1",
              name: "박기획",
              image: "/abstract-profile.png",
            },
          },
          {
            id: "2",
            title: "UI/UX 디자인",
            description: "사용자 인터페이스 및 경험 디자인",
            startDate: "2025-06-06",
            endDate: "2025-06-15",
            progress: 85,
            status: "진행 중",
            priority: "high",
            type: "task",
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
            description: "React 컴포넌트 및 페이지 개발",
            startDate: "2025-06-16",
            endDate: "2025-06-30",
            progress: 35,
            status: "진행 중",
            priority: "medium",
            type: "task",
            assignee: {
              id: "3",
              name: "이개발",
              image: "/abstract-profile.png",
            },
            dependencies: ["2"],
          },
        ]
      }
      
      const tasks = getTasksForProject(projectId)
      setGanttTasks(tasks)
      setLoading(false)
    }

    fetchGanttTasks()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">간트 차트를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <GanttChart
        projectId={projectId}
        tasks={ganttTasks}
        onTaskClick={onTaskClick}
        onAddTask={onAddTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  )
}