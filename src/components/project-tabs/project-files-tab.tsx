import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FileText,
  ImageIcon,
  File,
  Download,
  Share2,
  MoreHorizontal,
  Search,
  Filter,
  Upload,
  FileIcon,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectFilesTabProps {
  project: any
}

export function ProjectFilesTab({ project }: ProjectFilesTabProps) {
  // 파일 아이콘 선택 함수
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["png", "jpg", "jpeg", "gif", "svg"].includes(extension || "")) {
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />
    } else if (["doc", "docx", "txt", "pdf", "md"].includes(extension || "")) {
      return <FileText className="h-5 w-5 text-muted-foreground" />
    } else {
      return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  // 파일 목록 데이터
  const files = [
    {
      name: "프로젝트 계획서.docx",
      size: "2.4 MB",
      date: "2023-11-10",
      user: "김지영",
      type: "document",
    },
    {
      name: "디자인 가이드.pdf",
      size: "5.8 MB",
      date: "2023-11-15",
      user: "박성준",
      type: "document",
    },
    {
      name: "로고 디자인.png",
      size: "1.2 MB",
      date: "2023-11-18",
      user: "박성준",
      type: "image",
    },
    {
      name: "사용자 요구사항.xlsx",
      size: "1.8 MB",
      date: "2023-11-08",
      user: "이민수",
      type: "document",
    },
    {
      name: "API 문서.md",
      size: "0.5 MB",
      date: "2023-11-20",
      user: "이민수",
      type: "document",
    },
    {
      name: "웹사이트 목업.png",
      size: "3.2 MB",
      date: "2023-11-17",
      user: "박성준",
      type: "image",
    },
    {
      name: "배경 이미지.jpg",
      size: "4.5 MB",
      date: "2023-11-12",
      user: "박성준",
      type: "image",
    },
    {
      name: "아이콘 세트.svg",
      size: "0.8 MB",
      date: "2023-11-14",
      user: "박성준",
      type: "image",
    },
    {
      name: "데이터베이스 스키마.sql",
      size: "0.3 MB",
      date: "2023-11-19",
      user: "이민수",
      type: "other",
    },
    {
      name: "배포 스크립트.sh",
      size: "0.1 MB",
      date: "2023-11-16",
      user: "이민수",
      type: "other",
    },
  ]

  // 파일 유형별 필터링
  const documentFiles = files.filter((file) => file.type === "document")
  const imageFiles = files.filter((file) => file.type === "image")
  const otherFiles = files.filter((file) => file.type === "other")

  // 그리드 카드 렌더링 함수
  const renderGridCards = (fileList: typeof files) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {fileList.map((file, index) => (
        <div key={index} className="bg-muted/20 rounded-lg overflow-hidden border">
          <div className="flex items-center justify-center h-32 sm:h-40 bg-muted/30">
            {file.type === "image" ? (
              <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
            ) : file.type === "document" ? (
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
            ) : (
              <FileIcon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
            )}
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="font-medium truncate text-sm sm:text-base">{file.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs sm:text-sm text-muted-foreground">{file.size}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{file.date}</div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1">
                <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
                  <AvatarImage src="/diverse-avatars.png" alt={file.user} />
                  <AvatarFallback>{file.user[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate max-w-[80px]">{file.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7">
                  <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 hidden sm:flex">
                  <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7">
                  <MoreHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* 상단 필터 및 검색 영역 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="모든 파일" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 파일</SelectItem>
              <SelectItem value="documents">문서</SelectItem>
              <SelectItem value="images">이미지</SelectItem>
              <SelectItem value="others">기타</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="latest">
            <SelectTrigger className="w-full sm:w-[100px]">
              <SelectValue placeholder="최신순" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="size">크기순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="파일 검색..." className="pl-9 w-full sm:w-[250px]" />
          </div>

          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">필터</span>
          </Button>

          <Button className="flex-shrink-0">
            <Upload className="h-4 w-4 mr-2" />
            파일 업로드
          </Button>
        </div>
      </div>

      {/* 파일 유형 탭 */}
      <div className="overflow-x-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 min-w-[500px]">
            <TabsTrigger
              value="all"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              모든 파일
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              문서
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              이미지
            </TabsTrigger>
            <TabsTrigger
              value="others"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              기타
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 pt-4">
            {/* 파일 목록 테이블 */}
            <div className="border rounded-md overflow-hidden overflow-x-auto">
              {/* 테이블 헤더 */}
              <div className="grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 border-b font-medium text-xs sm:text-sm min-w-[700px]">
                <div className="col-span-6 sm:col-span-5">이름</div>
                <div className="col-span-2 hidden sm:block">크기</div>
                <div className="col-span-3 sm:col-span-2">수정일</div>
                <div className="col-span-2 hidden sm:block">수정자</div>
                <div className="col-span-3 sm:col-span-1 text-right">작업</div>
              </div>

              {/* 파일 목록 */}
              {files.map((file, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 border-b last:border-b-0 hover:bg-muted/20 items-center min-w-[700px]"
                >
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                    {getFileIcon(file.name)}
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="col-span-2 text-muted-foreground hidden sm:block">{file.size}</div>
                  <div className="col-span-3 sm:col-span-2 text-muted-foreground text-xs sm:text-sm">{file.date}</div>
                  <div className="col-span-2 flex items-center gap-2 hidden sm:flex">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/diverse-avatars.png" alt={file.user} />
                      <AvatarFallback>{file.user[0]}</AvatarFallback>
                    </Avatar>
                    <span>{file.user}</span>
                  </div>
                  <div className="col-span-3 sm:col-span-1 flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">다운로드</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hidden sm:flex">
                      <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">공유</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                      <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="sr-only">더 보기</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-0 pt-4">
            <h2 className="text-xl font-semibold mb-4">문서</h2>
            {renderGridCards(documentFiles)}
          </TabsContent>

          <TabsContent value="images" className="mt-0 pt-4">
            <h2 className="text-xl font-semibold mb-4">이미지</h2>
            {renderGridCards(imageFiles)}
          </TabsContent>

          <TabsContent value="others" className="mt-0 pt-4">
            <h2 className="text-xl font-semibold mb-4">기타</h2>
            {renderGridCards(otherFiles)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
