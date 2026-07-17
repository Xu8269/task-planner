import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.path) revalidatePath(body.path);
    return NextResponse.json({ code: 200 });
  } catch {
    return NextResponse.json({ code: 400, msg: "无效请求" }, { status: 400 });
  }
}
