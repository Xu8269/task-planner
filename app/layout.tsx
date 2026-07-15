import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header";

export const metadata: Metadata = {
  title: "TaskPlanner",
  description: "任务看板系统",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, background: "#f9fafb", minHeight: "100vh" }}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}