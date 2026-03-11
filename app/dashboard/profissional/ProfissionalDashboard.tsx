"use client";

import { useState } from "react";
import SidebarLayout from "@/components/dashboard/SidebarLayout";

/* ── Nav items ─────────────────────────────────────── */
const NAV = [
  { href: "/dashboard/profissional", label: "Dashboard", icon: <IcDashboard /> },
  { href: "/dashboard/profissional/clientes", label: "Clientes", icon: <IcClients /> },
  { href: "/dashboard/profissional/planos", label: "Planos", icon: <IcPlans /> },
  { href: "/dashboard/profissional/mensagens", label: "Mensagens", icon: <IcMessages /> },
  { href: "/dashboard/profissional/configuracoes", label: "Configurações", icon: <IcSettings /> },
];

/* ── Mock data ─────────────────────────────────────── */
const RECENT_ACTIVITY = [
  { name: "João Silva",   initials: "JS", color: "#498467", action: "Concluiu um treino",         sub: "Hoje às 08h12 · há 45 minutos" },
  { name: "Ana Souza",    initials: "AS", color: "#1C6E8C", action: "Atualizou suas medidas",     sub: "Hoje às 07h30 · há 1h 30min" },
  { name: "Carlos Lima",  initials: "CL", color: "#5fa37e", action: "Enviou uma mensagem",        sub: "Ontem às 22h14 · há 5 horas" },
  { name: "Sara Mendes",  initials: "SM", color: "#2589ae", action: "Registrou refeição",         sub: "Ontem às 21h02 · há 8 horas" },
];

const CLIENTS = [
  { name: "João Silva",    initials: "JS", color: "#498467", status: "ativo",    plan: "Ganho de Massa",   lastCheckin: "Ontem" },
  { name: "Ana Souza",     initials: "AS", color: "#1C6E8C", status: "ativo",    plan: "Perda de Gordura", lastCheckin: "Hoje" },
  { name: "Carlos Lima",   initials: "CL", color: "#5fa37e", status: "pausado",  plan: "Maratona",         lastCheckin: "4 dias atrás" },
  { name: "Sara Mendes",   initials: "SM", color: "#2589ae", status: "ativo",    plan: "Manutenção",       lastCheckin: "Ontem" },
  { name: "Roberto Costa", initials: "RC", color: "#7a94a0", status: "inativo",  plan: "Nenhum",           lastCheckin: "2 sem. atrás" },
];

const STATUS_CFG: Record<string, { label: string; bg: string; text: string }> = {
  ativo:   { label: "Ativo",   bg: "bg-green-pale",   text: "text-green" },
  pausado: { label: "Pausado", bg: "bg-amber-50",     text: "text-amber-600" },
  inativo: { label: "Inativo", bg: "bg-surface",      text: "text-muted" },
};

export default function ProfissionalDashboard() {
  const [search, setSearch] = useState("");

  const filtered = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SidebarLayout navItems={NAV} userRole="profissional" userName="Dr. Marcus Silva" userSub="Nutricionista">

      {/* ── INNER PAGE ── */}
      <div className="px-6 md:px-8 py-6 max-w-[1200px] mx-auto">

        {/* ── TOPBAR ── */}
        <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[26px] text-dark tracking-tight leading-tight">Dashboard Overview</h1>
            <p className="text-[13.5px] text-muted mt-0.5">Bem-vindo, Dr. Marcus. Veja o que está acontecendo hoje.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-[13px] font-semibold text-mid hover:bg-surface transition-all">
              <IcExport className="w-4 h-4" /> Exportar Relatório
            </button>
            <button className="btn-gradient flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold rounded-xl">
              <IcPlus className="w-4 h-4" /> Novo Cliente
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          {[
            { label: "Total de Clientes",   value: "128",  delta: "+4.6%",  up: true,  icon: <IcClients className="w-5 h-5" /> },
            { label: "Planos Ativos",        value: "94",   delta: "+4.3%",  up: true,  icon: <IcPlans className="w-5 h-5" /> },
            { label: "Progresso Médio",      value: "+12%", delta: "+1.9%",  up: true,  icon: <IcTrend className="w-5 h-5" /> },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-border-light rounded-2xl px-5 py-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-pale text-blue">{s.icon}</div>
                <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${s.up ? "text-green bg-green-pale" : "text-red-500 bg-red-50"}`}>
                  {s.delta}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted uppercase tracking-[.05em] mb-0.5">{s.label}</p>
                <p className="font-display text-[28px] text-dark leading-none">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">

          {/* Recent activity */}
          <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border-light">
              <h2 className="text-[15px] font-bold text-dark">Atividade Recente dos Clientes</h2>
            </div>
            <ul className="divide-y divide-border-light">
              {RECENT_ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-surface transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: a.color }}>
                    {a.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-dark leading-tight">
                      <span className="font-bold">{a.name}</span>{" "}
                      <span className="font-normal text-mid">{a.action}</span>
                    </p>
                    <p className="text-[11.5px] text-muted mt-0.5">{a.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3.5 border-t border-border-light">
              <button className="text-[13px] font-semibold text-blue hover:underline">Ver toda atividade</button>
            </div>
          </div>

          {/* Client management table */}
          <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border-light flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-[15px] font-bold text-dark">Gestão de Clientes</h2>
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                  <IcSearch className="w-4 h-4" />
                </span>
                <input
                  type="text" placeholder="Buscar clientes..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-[13px] bg-surface border border-border rounded-xl outline-none focus:border-blue focus:bg-white transition-all w-48"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-surface border-b border-border-light">
                    {["NOME DO CLIENTE","STATUS","PLANO ATUAL","ÚLTIMO CHECK-IN","AÇÃO"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10.5px] font-bold text-muted uppercase tracking-[.05em] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {filtered.map((c, i) => {
                    const st = STATUS_CFG[c.status];
                    return (
                      <tr key={i} className="hover:bg-surface/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                              style={{ background: c.color }}>
                              {c.initials}
                            </div>
                            <span className="font-semibold text-dark">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.status === "ativo" ? "bg-green" : c.status === "pausado" ? "bg-amber-400" : "bg-muted"}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-mid font-medium">{c.plan}</td>
                        <td className="px-5 py-3.5 text-muted">{c.lastCheckin}</td>
                        <td className="px-5 py-3.5">
                          <button className="text-[12.5px] font-bold text-blue hover:underline whitespace-nowrap">Ver Perfil</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-border-light flex items-center justify-between">
              <span className="text-[12px] text-muted">Mostrando {filtered.length} de {CLIENTS.length} clientes</span>
              <div className="flex gap-1">
                {[1,2].map(p => (
                  <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-colors ${p === 1 ? "bg-blue text-white" : "text-muted hover:bg-surface"}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </SidebarLayout>
  );
}

/* ── Icons ─────────────────────────────────────────── */
function IcDashboard({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function IcClients({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IcPlans({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  );
}
function IcMessages({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IcSettings({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
function IcTrend({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}
function IcSearch({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function IcExport({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}
function IcPlus({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
