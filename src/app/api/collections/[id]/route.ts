import { NextResponse } from "next/server"
import { serverFetchAPI } from "@/lib/api"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // 백엔드 API 호출
    const response = await serverFetchAPI(`/collections/${id}`, {
      method: "DELETE",
    })

    console.log('response ===> ', response)

    return NextResponse.json({ success: true, data: response }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}