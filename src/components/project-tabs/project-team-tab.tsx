"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Mail, Phone, UserPlus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProjectTeamTabProps {
  project: any
  onManageTeam: () => void
}

export function ProjectTeamTab({ project, onManageTeam }: ProjectTeamTabProps) {
  // 이미지에 맞는 팀원 데이터
  const teamMembers = [
    {
      id: "1",
      name: "김지영",
      role: "프로젝트 매니저",
      image: "/diverse-avatars.png",
      email: "jiyoung.kim@example.com",
      phone: "010-1234-5678",
      tasks: 8,
      completed: 5,
      lastActive: "10분 전 활동",
      workload: 8,
    },
    {
      id: "2",
      name: "이민수",
      role: "개발자",
      image: "/diverse-avatars.png",
      email: "minsu.lee@example.com",
      phone: "010-2345-6789",
      tasks: 6,
      completed: 3,
      lastActive: "30분 전 활동",
      workload: 6,
    },
    {
      id: "3",
      name: "박성준",
      role: "디자이너",
      image: "/diverse-avatars.png",
      email: "sungjun.park@example.com",
      phone: "010-3456-7890",
      tasks: 4,
      completed: 2,
      lastActive: "1시간 전 활동",
      workload: 4,
    },
    {
      id: "4",
      name: "최유진",
      role: "마케팅 전문가",
      image: "/diverse-avatars.png",
      email: "yujin.choi@example.com",
      phone: "010-4567-8901",
      tasks: 3,
      completed: 1,
      lastActive: "2시간 전 활동",
      workload: 3,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">팀 멤버</h2>
        <Button onClick={onManageTeam}>
          <UserPlus className="h-4 w-4 mr-2" />
          멤버 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 sm:mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{member.phone}</span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">작업</span>
                <span className="font-medium">
                  {member.completed}/{member.tasks} 완료
                </span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex justify-end">
              <span className="text-sm text-gray-500">{member.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">팀 활동</h2>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">작업 할당</span>
          <span className="text-sm font-medium">이번 주</span>
        </div>

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{member.name}</span>
                <span className="ml-auto text-sm text-gray-500">{member.workload} 작업</span>
              </div>
              <Progress value={member.workload * 10} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
