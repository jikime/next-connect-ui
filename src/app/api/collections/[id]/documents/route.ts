import { NextResponse } from "next/server"
import { serverFetchAPI } from "@/lib/api"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log('params ===> ', { id })
  try {
    // 백엔드 API 호출
    const response = await serverFetchAPI(`/collections/${id}/documents`, {
      method: "GET",
    })

    return NextResponse.json({ success: true, data: response }, { status: 201 })
  } catch (error: any) {
    console.log('error ===> 11111', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

