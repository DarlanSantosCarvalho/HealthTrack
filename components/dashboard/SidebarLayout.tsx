"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userRole: "profissional" | "cliente";
  userName: string;
  userSub: string;
}

export default function SidebarLayout({ children, navItems, userRole, userName, userSub }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface">

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col w-60
        bg-white border-r border-border-light
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border-light h-[60px]">
          <Logo variant="light" size="sm" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-blue text-white shadow-sm"
                    : "text-mid hover:bg-surface hover:text-dark"
                }`}>
                <span className={active ? "text-white" : "text-muted"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 border-t border-border-light">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>
              {userName.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-dark truncate leading-tight">{userName}</p>
              <p className="text-[11px] text-muted truncate">{userSub}</p>
            </div>
            <svg className="w-3.5 h-3.5 text-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-dark/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border-light h-[60px]">
          <button onClick={() => setMobileOpen(true)} className="text-mid p-1.5 rounded-lg hover:bg-surface">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Logo variant="light" size="sm" />
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
            style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>
            {userName[0]}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
