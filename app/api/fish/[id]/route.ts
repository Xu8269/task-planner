import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Fish from "@/app/lib/Fish";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const fish = await Fish.findByIdAndUpdate(id, body, { new: true });
  if (!fish) {
    return NextResponse.json({ code: 400, msg: "鱼不存在" }, { status: 400 });
  }
  return NextResponse.json({ code: 200, data: fish });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await Fish.findByIdAndDelete(id);
  return NextResponse.json({ code: 200, msg: "deleted" });
}