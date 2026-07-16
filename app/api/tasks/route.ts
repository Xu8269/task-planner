import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Task from "@/app/lib/Task";

export async function GET() {
  await connectDB();
  const tasks = await Task.aggregate([
    {
      $addFields: {
        sortPriority: {
          $switch: {
            branches: [
              { case: { $eq: ["$priority", "urgent"] }, then: 1 },
              { case: { $eq: ["$priority", "important"] }, then: 2 },
              { case: { $eq: ["$priority", "normal"] }, then: 3 },
            ],
            default: 4,
          },
        },
      },
    },
    { $sort: { sortPriority: 1, deadline: 1 } },
  ]);
  return NextResponse.json({ code: 200, data: tasks });
 }

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ code: 400, msg: "标题不能为空" }, { status: 400 });
  }

  const task = await Task.create({
    title: body.title.trim(),
    content: body.content || "",
    priority: body.priority || "normal",
    deadline: body.deadline || undefined,
  });

  return NextResponse.json({ code: 200, data: task });
}