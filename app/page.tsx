import Link from "next/link";
import connectDB from "@/app/lib/mongodb";
import Task from "@/app/lib/Task";
import FishTank from "@/app/components/FishTank";

export default async function HomePage() {
  await connectDB();
  const [total, todo, doing, done] = await Promise.all([
    Task.countDocuments(),
    Task.countDocuments({ status: "todo" }),
    Task.countDocuments({ status: "doing" }),
    Task.countDocuments({ status: "done" }),
  ]);

  const stats = { total, todo, doing, done };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>仪表盘</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "全部任务", value: stats.total, color: "#3b82f6" },
          { label: "待办", value: stats.todo, color: "#6b7280" },
          { label: "进行中", value: stats.doing, color: "#f59e0b" },
          { label: "已完成", value: stats.done, color: "#10b981" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 14, color: "#6b7280" }}>{item.label}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {stats.total === 0 && (
        <p style={{ color: "#6b7280", fontSize: 16, textAlign: "center", marginTop: 60 }}>
          暂无任务，去
          <Link href="/tasks/new" style={{ color: "#2563eb", marginLeft: 4 }}>创建第一个 →</Link>
        </p>
      )}

      <FishTank />
    </div>
  );
}