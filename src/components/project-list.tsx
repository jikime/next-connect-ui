"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface ProjectListProps {
  onProjectClick?: (projectId: string) => void
}

export function ProjectList({ onProjectClick }: ProjectListProps) {
  const projects = [
    {
      id: "1",
      name: "웹사이트 리디자인",
      description: "회사 웹사이트 디자인 및 기능 개선",
      progress: 75,
      status: "진행 중",
      dueDate: "2025-06-15",
      members: [
        {
          name: "김디자인",
          image: "/abstract-profile.png",
        },
        {
          name: "이개발",
          image: "/abstract-profile.png",
        },
        {
          name: "박기획",
          image: "/abstract-profile.png",
        },
      ],
    },
    {
      id: "2",
      name: "모바일 앱 개발",
      description: "iOS 및 Android용 모바일 앱 개발",
      progress: 45,
      status: "진행 중",
      dueDate: "2025-07-30",
      members: [
        {
          name: "최모바일",
          image: "/abstract-profile.png",
        },
        {
          name: "정백엔드",
          image: "/abstract-profile.png",
        },
      ],
    },
    {
      id: "3",
      name: "마케팅 캠페인",
      description: "신제품 출시 마케팅 캠페인",
      progress: 20,
      status: "시작됨",
      dueDate: "2025-08-10",
      members: [
        {
          name: "한마케팅",
          image: "/abstract-profile.png",
        },
      ],
    },
    {
      id: "4",
      name: "API 개발",
      description: "외부 서비스 연동을 위한 API 개발",
      progress: 90,
      status: "검토 중",
      dueDate: "2025-05-30",
      members: [
        {
          name: "정백엔드",
          image: "/abstract-profile.png",
        },
        {
          name: "이개발",
          image: "/abstract-profile.png",
        },
      ],
    },
    {
      id: "5",
      name: "디자인 시스템",
      description: "제품 전반에 걸친 디자인 시스템 구축",
      progress: 60,
      status: "진행 중",
      dueDate: "2025-06-30",
      members: [
        {
          name: "김디자인",
          image: "/abstract-profile.png",
        },
      ],
    },
  ]

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onProjectClick?.(project.id)}
        >
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={project.status === "진행 중" ? "default" : "secondary"}>{project.status}</Badge>
                <span>마감일: {new Date(project.dueDate).toLocaleDateString("ko-KR")}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>진행률</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden flex-col items-end md:flex">
                <div className="flex -space-x-2">
                  {project.members.map((member, i) => (
                    <Avatar key={i} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="mt-1 text-xs text-muted-foreground">{project.members.length} 명의 팀원</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
