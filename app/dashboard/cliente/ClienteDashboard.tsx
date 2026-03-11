"use client";

import { useState } from "react";
import SidebarLayout from "@/components/dashboard/SidebarLayout";

/* ── Nav ───────────────────────────────────────────── */
const NAV = [
  { href: "/dashboard/cliente",              label: "Dashboard",    icon: <IcDashboard /> },
  { href: "/dashboard/cliente/treinos",      label: "Treinos",      icon: <IcWorkout /> },
  { href: "/dashboard/cliente/nutricao",     label: "Nutrição",     icon: <IcNutrition /> },
  { href: "/dashboard/cliente/mensagens",    label: "Mensagens",    icon: <IcMessages /> },
  { href: "/dashboard/cliente/configuracoes",label: "Configurações",icon: <IcSettings /> },
];

/* ── Mock assessments ──────────────────────────────── */
const ASSESSMENTS = [
  { date: "24 Mai, 2024", type: "Avaliação Regular",    measuredBy: "Dra. Ana Lima",  weight: "55,2 kg", mood: 4, status: "revisado",   flagged: false },
  { date: "17 Mai, 2024", type: "Avaliação Regular",    measuredBy: "Dra. Ana Lima",  weight: "65,8 kg", mood: 3, status: "revisado",   flagged: false },
  { date: "10 Mai, 2024", type: "Tape & Plicômetro",    measuredBy: "Dra. Ana Lima",  weight: "68,1 kg", mood: 2, status: "sinalizado", flagged: true  },
];

const STATUS_CFG: Record<string, { bg: string; text: string }> = {
  revisado:   { bg: "bg-green-pale",  text: "text-green"  },
  sinalizado: { bg: "bg-amber-50",    text: "text-amber-600" },
  pendente:   { bg: "bg-surface",     text: "text-muted"  },
};

/* ── Macro progress helper ─────────────────────────── */
function MacroBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-[11.5px] mb-1">
        <span className="font-semibold text-mid">{label}</span>
        <span className="text-muted">{value}g</span>
      </div>
      <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── Sparkline mini chart ──────────────────────────── */
function SparkBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-1 h-10">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${(v / max) * 100}%`, background: color, opacity: i === values.length - 1 ? 1 : 0.4 }} />
      ))}
    </div>
  );
}

export default function ClienteDashboard() {
  const [photoTab, setPhotoTab] = useState<"frente" | "lateral" | "costas">("frente");

  return (
    <SidebarLayout navItems={NAV} userRole="cliente" userName="Ana Souza" userSub="Pro Fita">

      <div className="px-5 md:px-7 py-6 max-w-[1100px] mx-auto space-y-6">

        {/* ── PROFILE HEADER ── */}
        <div className="bg-white border border-border-light rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex items-start gap-4 flex-wrap">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>
              AS
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-[22px] text-dark tracking-tight leading-tight">Ana Souza</h1>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                  <IcCalendar className="w-3.5 h-3.5" /> Ativa desde Jan 2023
                </span>
                <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                  <span className="w-2 h-2 rounded-full bg-green animate-pulse" /> Última atividade: há 2 horas
                </span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2.5">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-mid hover:bg-surface transition-all">
                <IcEdit className="w-4 h-4" /> Editar Perfil
              </button>
              <button className="btn-gradient flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold rounded-xl">
                <IcMessage className="w-4 h-4" /> Mensagem
              </button>
            </div>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Peso Atual",    value: "65,2 kg", delta: "-2,4",  up: false, color: "text-green", icon: <IcWeight className="w-5 h-5" />, spark: [68,67.5,67,66.5,66,65.8,65.2] },
            { label: "Meta de Peso", value: "60,0 kg",  delta: null,    up: null,  color: "text-blue",  icon: <IcTarget className="w-5 h-5" />, spark: [] },
            { label: "% Gordura",    value: "18,4%",    delta: "+1,0%", up: true,  color: "text-amber-600", icon: <IcFlame className="w-5 h-5" />, spark: [22,21,20,19.5,19,18.7,18.4] },
          ].map((m, i) => (
            <div key={i} className="bg-white border border-border-light rounded-2xl px-5 py-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-pale flex items-center justify-center text-blue">{m.icon}</div>
                {m.delta && (
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${!m.up ? "bg-green-pale text-green" : "bg-amber-50 text-amber-600"}`}>
                    {m.delta}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-[.05em] mb-0.5">{m.label}</p>
              <p className={`font-display text-[26px] leading-none mb-3 ${m.color}`}>{m.value}</p>
              {m.spark.length > 0 && (
                <SparkBar values={m.spark} color={i === 0 ? "#498467" : "#d97706"} />
              )}
            </div>
          ))}
        </div>

        {/* ── PHYSICAL PROGRESS ── */}
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-dark">Progresso Físico</h2>
            <button className="text-[13px] font-semibold text-blue hover:underline">Ver Galeria Completa</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border-light">

            {/* Photo comparison */}
            <div className="p-6">
              <h3 className="text-[13px] font-bold text-mid uppercase tracking-[.04em] mb-4">Comparação Lado a Lado</h3>
              {/* Tabs */}
              <div className="flex bg-surface border border-border-light rounded-xl p-1 gap-1 mb-4 w-fit">
                {(["frente","lateral","costas"] as const).map(t => (
                  <button key={t} onClick={() => setPhotoTab(t)}
                    className={`px-3 py-1.5 rounded-[9px] text-[12px] font-semibold capitalize transition-all ${
                      photoTab === t ? "bg-white shadow-sm text-dark" : "text-muted hover:text-dark"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
              {/* Photo slots */}
              <div className="grid grid-cols-2 gap-3">
                {["Antes (72,9 kg)", "Atual (65,2 kg)"].map((label, i) => (
                  <div key={i} className="relative">
                    <div className="aspect-[3/4] rounded-xl bg-surface border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                      {/* Placeholder silhouette */}
                      <div className="flex flex-col items-center gap-2 text-border">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-1.5 flex justify-center">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        i === 1 ? "bg-blue text-white" : "bg-surface text-muted border border-border"
                      }`}>
                        {label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight & fat trend */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-mid uppercase tracking-[.04em]">Peso & % Gordura</h3>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <span className="w-2.5 h-1.5 rounded-full bg-blue" /> Peso
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <span className="w-2.5 h-1.5 rounded-full bg-green" /> Gordura
                  </span>
                </div>
              </div>
              {/* Chart bars */}
              <div className="flex items-end justify-between gap-1 h-32 mb-3">
                {[
                  { w: 72, f: 24 }, { w: 70, f: 22 }, { w: 68, f: 21 },
                  { w: 67, f: 20 }, { w: 66, f: 19 }, { w: 65.2, f: 18.4 },
                ].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-t-sm transition-all"
                        style={{ height: `${(d.w / 80) * 80}px`, background: i === 5 ? "#1C6E8C" : "rgba(28,110,140,.25)", borderRadius:"4px 4px 0 0" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10.5px] text-muted font-medium">
                {["Jan","Fev","Mar","Abr","Mai","Jun"].map(m => <span key={m}>{m}</span>)}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: "Perda total",  value: "6,8 kg",  icon: "📉" },
                  { label: "Meta restante",value: "5,2 kg",  icon: "🎯" },
                  { label: "Estimativa",   value: "11 sem.", icon: "📅" },
                ].map((s, i) => (
                  <div key={i} className="text-center bg-surface rounded-xl p-2.5 border border-border-light">
                    <p className="text-base mb-0.5">{s.icon}</p>
                    <p className="text-[13px] font-bold text-dark">{s.value}</p>
                    <p className="text-[10.5px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTIVE PLANS ── */}
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-dark">Planos Ativos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border-light">

            {/* Nutrition plan */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center">
                    <IcNutrition className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-dark">Cetogênica Cutting 2.0</p>
                    <p className="text-[12px] text-muted">Atualizado há 4 dias</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-pale text-green">Ativo</span>
              </div>

              <div className="bg-surface rounded-xl px-4 py-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-mid">Calorias Diárias</span>
                  <span className="text-[14px] font-bold text-dark">1.850 kcal</span>
                </div>
                <div className="h-2 bg-border-light rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full" style={{ width:"72%", background:"linear-gradient(90deg,#498467,#1C6E8C)" }} />
                </div>
                <div className="space-y-1.5">
                  <MacroBar label="Proteína" value={148} max={200} color="#498467" />
                  <MacroBar label="Gordura"  value={78}  max={100} color="#1C6E8C" />
                  <MacroBar label="Carboidratos" value={32} max={150} color="#5fa37e" />
                </div>
              </div>

              <div className="flex gap-2.5">
                <button className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-mid hover:bg-surface transition-all">Editar Plano</button>
                <button className="flex-1 py-2.5 rounded-xl border border-blue text-[13px] font-semibold text-blue hover:bg-blue-pale transition-all">Ver Detalhes</button>
              </div>
            </div>

            {/* Workout plan */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-pale flex items-center justify-center">
                    <IcWorkout className="w-5 h-5 text-blue" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-dark">Hipertrofia Split (4 Dias)</p>
                    <p className="text-[12px] text-muted">Foco: Massa Muscular / Força</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-pale text-blue">Ativo</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Frequência", value: "4 sessões/sem." },
                  { label: "Concluídas", value: "12 / 30 sessões" },
                ].map((s, i) => (
                  <div key={i} className="bg-surface rounded-xl px-3 py-3 border border-border-light">
                    <p className="text-[10.5px] font-bold text-muted uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-[14px] font-bold text-dark">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[12px] mb-1.5">
                  <span className="font-semibold text-mid">Progresso do ciclo</span>
                  <span className="text-muted">40%</span>
                </div>
                <div className="h-2 bg-border-light rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:"40%", background:"linear-gradient(90deg,#1C6E8C,#498467)" }} />
                </div>
              </div>

              <div className="flex gap-2.5">
                <button className="flex-1 py-2.5 rounded-xl border border-border text-[13px] font-semibold text-mid hover:bg-surface transition-all">Ajustar Pesos</button>
                <button className="flex-1 py-2.5 rounded-xl border border-blue text-[13px] font-semibold text-blue hover:bg-blue-pale transition-all">Ver Cronograma</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── HISTORY & ASSESSMENTS ── */}
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border-light flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-[15px] font-bold text-dark">Histórico & Avaliações</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-[12.5px] font-semibold text-mid hover:bg-surface transition-all">
                <IcDownload className="w-3.5 h-3.5" /> Exportar PDF
              </button>
              <button className="btn-gradient flex items-center gap-1.5 px-3.5 py-2 text-[12.5px] font-bold rounded-xl">
                <IcPlus className="w-3.5 h-3.5" /> Adicionar Check-in
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-surface border-b border-border-light">
                  {["DATA","TIPO DE AVALIAÇÃO","PESO","HUMOR/ENERGIA","STATUS","AÇÕES"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10.5px] font-bold text-muted uppercase tracking-[.05em] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {ASSESSMENTS.map((a, i) => {
                  const st = STATUS_CFG[a.status];
                  return (
                    <tr key={i} className="hover:bg-surface/60 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-dark">{a.date}</p>
                        <p className="text-[11.5px] text-muted">{a.measuredBy}</p>
                      </td>
                      <td className="px-5 py-4 text-mid font-medium">{a.type}</td>
                      <td className="px-5 py-4 font-bold text-dark">{a.weight}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-0.5">
                          {Array(5).fill(0).map((_, j) => (
                            <span key={j} className={`text-sm ${j < a.mood ? "text-amber-400" : "text-border"}`}>★</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-[11.5px] font-bold px-2.5 py-1 rounded-full capitalize ${st.bg} ${st.text}`}>
                          {a.flagged && <span className="text-amber-500">⚑</span>}
                          {a.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="p-1.5 rounded-lg hover:bg-surface transition-colors text-muted hover:text-blue">
                          <IcEye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3.5 border-t border-border-light text-center">
            <button className="text-[13px] font-semibold text-blue hover:underline">Mostrar Histórico Completo</button>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

/* ── Icons ─────────────────────────────────────────── */
function IcDashboard({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>;
}
function IcWorkout({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M6.5 6.5h11M6.5 17.5h11M4 10h2v4H4zM18 10h2v4h-2z"/><rect x="6" y="8" width="12" height="8" rx="2"/>
  </svg>;
}
function IcNutrition({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
    <path d="M12 6c-1.5 2-2 4-2 6s.5 4 2 6"/><path d="M12 6c1.5 2 2 4 2 6s-.5 4-2 6"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
  </svg>;
}
function IcMessages({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>;
}
function IcSettings({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>;
}
function IcCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>;
}
function IcEdit({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>;
}
function IcMessage({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>;
}
function IcWeight({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="5" r="3"/>
    <path d="M6.5 8a6.5 6.5 0 0 0-4.46 11.37A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.46-3.37A6.5 6.5 0 0 0 17.5 8"/>
  </svg>;
}
function IcTarget({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>;
}
function IcFlame({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>;
}
function IcDownload({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>;
}
function IcPlus({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>;
}
function IcEye({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>;
}
