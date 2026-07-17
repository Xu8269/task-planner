"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearDoneButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClear = async () => {
    if (!confirm("确定要清除所有已完成的任务吗？此操作不可撤销。")) return;
    setLoading(true);
    await fetch("/api/tasks/clear-done", { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleClear}
      disabled={loading}
      style={{
        padding: "6px 16px", fontSize: 13,
        background: loading ? "#d1d5db" : "#fee2e2",
        color: "#dc2626", border: "none", borderRadius: 6,
        cursor: loading ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {loading ? "清除中..." : "一键清理已完成"}
    </button>
  );
}