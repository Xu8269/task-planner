"use client";

import TaskCard from "./TaskCard";

type Task = {
  _id: string;
  title: string;
  content: string;
  status: "todo" | "doing" | "done";
  priority: "normal" | "important" | "urgent";
  deadline?: string;
  createdAt: string;
};

const statusConfig: Record<string, { label: string; bg: string }> = {
  todo:  { label: "待办", bg: "#f3f4f6" },
  doing: { label: "进行中", bg: "#fef3c7" },
  done:  { label: "已完成", bg: "#d1fae5" },
};

export default function TaskBoard({ taskList, refresh }: { taskList: Task[]; refresh: () => void }) {
  const columns = ["todo", "doing", "done"] as const;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: 24 }}>
      {columns.map((status) => {
        const tasks = taskList.filter((t) => t.status === status);
        const cfg = statusConfig[status];

        return (
          <div key={status} style={{ background: cfg.bg, borderRadius: 10, padding: 16, minHeight: 300 }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, display: "flex", justifyContent: "space-between" }}>
              {cfg.label}
              <span style={{ fontSize: 14, color: "#6b7280" }}>{tasks.length}</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onRefresh={refresh} />
              ))}
              {tasks.length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", marginTop: 40 }}>暂无任务</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}