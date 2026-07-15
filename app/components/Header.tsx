"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "仪表盘" },
    { href: "/tasks", label: "任务看板" },
    { href: "/tasks/new", label: "新建任务" },
  ];

  return (
    <header style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 24px", background: "#fff" }}>
      <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>TaskPlanner</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              textDecoration: "none",
              color: pathname === link.href ? "#2563eb" : "#6b7280",
              fontWeight: pathname === link.href ? 600 : 400,
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}