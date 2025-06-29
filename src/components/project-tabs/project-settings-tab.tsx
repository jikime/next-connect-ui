"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"

interface ProjectSettingsTabProps {
  project: any
}

export function ProjectSettingsTab({ project }: ProjectSettingsTabProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date("2023-11-20"))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date("2023-12-20"))

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Tabs defaultValue="일반" className="w-full">
          <TabsList className="grid min-w-[600px] grid-cols-5 mb-6">
            <TabsTrigger value="일반">일반</TabsTrigger>
            <TabsTrigger value="팀 및 권한">팀 및 권한</TabsTrigger>
            <TabsTrigger value="알림">알림</TabsTrigger>
            <TabsTrigger value="통합">통합</TabsTrigger>
            <TabsTrigger value="위험 영역">위험 영역</TabsTrigger>
          </TabsList>

          <TabsContent value="일반" className="space-y-6">
            <div className="bg-card rounded-lg border p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-1">프로젝트 정보</h3>
                <p className="text-sm text-muted-foreground mb-4">프로젝트의 기본 정보를 관리합니다.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">프로젝트 이름</label>
                  <Input defaultValue="제품 로드맵" className="w-full" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">프로젝트 설명</label>
                  <textarea
                    className="w-full p-3 rounded-md border border-input bg-transparent min-h-[120px]"
                    defaultValue="2024년 제품 개발 로드맵 수립"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">시작일</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {startDate ? format(startDate, "yyyy. MM. dd.", { locale: ko }) : <span>날짜 선택</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">마감일</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          {endDate ? format(endDate, "yyyy. MM. dd.", { locale: ko }) : <span>날짜 선택</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">상태</label>
                    <Select defaultValue="기획 단계">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="기획 단계">기획 단계</SelectItem>
                        <SelectItem value="진행 중">진행 중</SelectItem>
                        <SelectItem value="검토 중">검토 중</SelectItem>
                        <SelectItem value="완료">완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">우선순위</label>
                    <Select defaultValue="중간">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="우선순위 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="낮음">낮음</SelectItem>
                        <SelectItem value="중간">중간</SelectItem>
                        <SelectItem value="높음">높음</SelectItem>
                        <SelectItem value="긴급">긴급</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="default" className="bg-black text-white hover:bg-gray-800">
                변경사항 저장
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="팀 및 권한">
            <div className="bg-card rounded-lg border p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-1">팀 및 권한</h3>
                <p className="text-sm text-muted-foreground mb-4">프로젝트 팀원 및 권한을 관리합니다.</p>

                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">이름</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">역할</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">권한</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 bg-black text-white">
                              <AvatarFallback>KJ</AvatarFallback>
                            </Avatar>
                            <span>김지영</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Select defaultValue="프로젝트 매니저">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="역할 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="프로젝트 매니저">프로젝트 매니저</SelectItem>
                              <SelectItem value="개발자">개발자</SelectItem>
                              <SelectItem value="디자이너">디자이너</SelectItem>
                              <SelectItem value="마케팅 전문가">마케팅 전문가</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <Select defaultValue="관리">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="권한 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="관리">관리</SelectItem>
                              <SelectItem value="편집">편집</SelectItem>
                              <SelectItem value="보기">보기</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            제거
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 bg-black text-white">
                              <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <span>박성준</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Select defaultValue="디자이너">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="역할 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="프로젝트 매니저">프로젝트 매니저</SelectItem>
                              <SelectItem value="개발자">개발자</SelectItem>
                              <SelectItem value="디자이너">디자이너</SelectItem>
                              <SelectItem value="마케팅 전문가">마케팅 전문가</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <Select defaultValue="관리">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="권한 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="관리">관리</SelectItem>
                              <SelectItem value="편집">편집</SelectItem>
                              <SelectItem value="보기">보기</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            제거
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <Button variant="default" className="w-full bg-gray-900 hover:bg-black">
                    <Plus className="h-4 w-4 mr-2" />
                    팀원 추가
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="알림">
            <div className="bg-card rounded-lg border p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-1">알림 설정</h3>
                <p className="text-sm text-muted-foreground mb-4">프로젝트 알림 설정을 관리합니다.</p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium mb-3">이메일 알림</h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">작업 업데이트</p>
                          <p className="text-sm text-muted-foreground">
                            작업이 생성, 수정 또는 완료될 때 알림을 받습니다.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">멘션</p>
                          <p className="text-sm text-muted-foreground">새 댓글이 추가될 때 알림을 받습니다.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">마일스톤</p>
                          <p className="text-sm text-muted-foreground">
                            마일스톤이 완료되거나 변경될 때 알림을 받습니다.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">팀 변경</p>
                          <p className="text-sm text-muted-foreground">팀원이 추가되거나 제거될 때 알림을 받습니다.</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-medium mb-3">앱 내 알림</h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">작업 업데이트</p>
                          <p className="text-sm text-muted-foreground">
                            작업이 생성, 수정 또는 완료될 때 알림을 받습니다.
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">멘션</p>
                          <p className="text-sm text-muted-foreground">새 댓글이 추가될 때 알림을 받습니다.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">댓글</p>
                          <p className="text-sm text-muted-foreground">댓글이나 작업에서 멘션될 때 알림을 받습니다.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">마감일 알림</p>
                          <p className="text-sm text-muted-foreground">작업 마감일이 다가올 때 알림을 받습니다.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="default" className="bg-black text-white hover:bg-gray-800">
                변경사항 저장
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="통합">
            <div className="bg-card rounded-lg border p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-1">통합 설정</h3>
                <p className="text-sm text-muted-foreground mb-4">외부 서비스와의 통합을 관리합니다.</p>

                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">서비스</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">설명</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">GitHub</td>
                        <td className="py-3 px-4">코드 저장소와 이슈 추적 연동</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">
                            연결
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Slack</td>
                        <td className="py-3 px-4">프로젝트 알림 및 업데이트</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">
                            연결
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Google Drive</td>
                        <td className="py-3 px-4">문서 및 파일 통합</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">
                            연결
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Figma</td>
                        <td className="py-3 px-4">디자인 파일 연동</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">
                            연결
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="위험 영역">
            <div className="bg-card rounded-lg border p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-1">위험 영역</h3>
                <p className="text-sm text-muted-foreground mb-4">프로젝트에 대한 위험한 작업을 수행합니다.</p>

                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                    <div>
                      <h4 className="text-red-600 font-medium mb-1">프로젝트 보관</h4>
                      <p className="text-sm text-red-600">
                        프로젝트를 보관하면 활성 프로젝트 목록에서 제거되지만 데이터는 유지됩니다. 나중에 복원할 수
                        있습니다.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                    >
                      프로젝트 보관
                    </Button>
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                    <div>
                      <h4 className="text-red-600 font-medium mb-1">프로젝트 삭제</h4>
                      <p className="text-sm text-red-600">
                        프로젝트를 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.
                      </p>
                    </div>
                    <Button variant="destructive">프로젝트 삭제</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Trash2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}
