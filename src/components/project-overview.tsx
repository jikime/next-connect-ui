import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProjectOverview() {
  const projects = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>프로젝트 개요</CardTitle>
        <CardDescription>현재 진행 중인 프로젝트 상태</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{project.name}</div>
                  <div className="text-sm text-muted-foreground">{project.description}</div>
                </div>
                <Badge variant={project.status === "진행 중" ? "default" : "secondary"}>{project.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>진행률: {project.progress}%</span>
                <span>•</span>
                <span>마감일: {new Date(project.dueDate).toLocaleDateString("ko-KR")}</span>
              </div>
              <Progress value={project.progress} className="h-2" />
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.map((member, i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-background">
                      <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-sm font-medium">{project.members.length} 명의 팀원</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
