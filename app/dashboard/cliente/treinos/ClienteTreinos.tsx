"use client";

import { useState } from "react";
import SidebarLayout from "@/components/dashboard/SidebarLayout";

/* ── Nav (same as ClienteDashboard) ───────────────────── */
const NAV = [
  { href: "/dashboard/cliente",               label: "Dashboard",    icon: <IcDashboard /> },
  { href: "/dashboard/cliente/treinos",       label: "Treinos",      icon: <IcDumbbell /> },
  { href: "/dashboard/cliente/nutricao",      label: "Nutrição",     icon: <IcNutrition /> },
  { href: "/dashboard/cliente/mensagens",     label: "Mensagens",    icon: <IcMessages /> },
  { href: "/dashboard/cliente/configuracoes", label: "Configurações",icon: <IcSettings /> },
];

/* ── Types ─────────────────────────────────────────────── */
interface SetLog { sets: number; reps: string; weight: string; done: boolean }
interface Exercise { name: string; category: string; sets: SetLog[]; notes?: string }
interface WorkoutDay { id: string; label: string; shortLabel: string; isRest: boolean; exercises: Exercise[]; done: boolean }

/* ── Data ──────────────────────────────────────────────── */
const PLAN_DAYS: WorkoutDay[] = [
  {
    id: "d1", label: "Peito & Tríceps", shortLabel: "Dia 1", isRest: false, done: true,
    exercises: [
      { name: "Supino Reto com Barra",       category: "Peito",   sets: [{ sets:4, reps:"8-10", weight:"80kg", done:true }, { sets:4, reps:"8-10", weight:"80kg", done:true }, { sets:4, reps:"8-10", weight:"75kg", done:true }, { sets:4, reps:"8-10", weight:"75kg", done:true }] },
      { name: "Supino Inclinado Halteres",   category: "Peito",   sets: [{ sets:3, reps:"10-12", weight:"28kg", done:true }, { sets:3, reps:"10-12", weight:"28kg", done:true }, { sets:3, reps:"10-12", weight:"26kg", done:true }] },
      { name: "Crossover no Cabo",           category: "Peito",   sets: [{ sets:3, reps:"12-15", weight:"15kg", done:true }, { sets:3, reps:"12-15", weight:"15kg", done:true }, { sets:3, reps:"12-15", weight:"15kg", done:true }] },
      { name: "Tríceps Corda",               category: "Tríceps", sets: [{ sets:4, reps:"12",    weight:"25kg", done:true }, { sets:4, reps:"12",    weight:"25kg", done:true }, { sets:4, reps:"12",    weight:"22kg", done:true }, { sets:4, reps:"12",    weight:"22kg", done:true }] },
      { name: "Tríceps Testa",               category: "Tríceps", sets: [{ sets:3, reps:"10-12", weight:"20kg", done:true }, { sets:3, reps:"10-12", weight:"20kg", done:true }, { sets:3, reps:"10-12", weight:"20kg", done:true }] },
    ],
  },
  {
    id: "d2", label: "Costas & Bíceps", shortLabel: "Dia 2", isRest: false, done: true,
    exercises: [
      { name: "Puxada Frontal",              category: "Costas",  sets: [{ sets:4, reps:"8-10", weight:"65kg", done:true }, { sets:4, reps:"8-10", weight:"65kg", done:true }, { sets:4, reps:"8-10", weight:"60kg", done:true }, { sets:4, reps:"8-10", weight:"60kg", done:true }] },
      { name: "Remada Curvada com Barra",    category: "Costas",  sets: [{ sets:4, reps:"8-10", weight:"70kg", done:true }, { sets:4, reps:"8-10", weight:"70kg", done:true }, { sets:4, reps:"8-10", weight:"65kg", done:true }, { sets:4, reps:"8-10", weight:"65kg", done:true }] },
      { name: "Rosca Direta com Barra",      category: "Bíceps",  sets: [{ sets:3, reps:"10-12", weight:"30kg", done:true }, { sets:3, reps:"10-12", weight:"30kg", done:true }, { sets:3, reps:"10-12", weight:"30kg", done:true }] },
      { name: "Rosca Alternada",             category: "Bíceps",  sets: [{ sets:3, reps:"12",    weight:"14kg", done:true }, { sets:3, reps:"12",    weight:"14kg", done:true }, { sets:3, reps:"12",    weight:"12kg", done:true }] },
    ],
  },
  {
    id: "d3", label: "Descanso Ativo", shortLabel: "Dia 3", isRest: true, done: true,
    exercises: [],
  },
  {
    id: "d4", label: "Pernas & Glúteos", shortLabel: "Dia 4", isRest: false, done: false,
    exercises: [
      { name: "Agachamento com Barra",       category: "Pernas",  sets: [{ sets:4, reps:"8-10", weight:"90kg", done:true  }, { sets:4, reps:"8-10", weight:"90kg", done:true  }, { sets:4, reps:"8-10", weight:"85kg", done:false }, { sets:4, reps:"8-10", weight:"85kg", done:false }], notes: "Manter joelhos alinhados" },
      { name: "Leg Press 45°",               category: "Pernas",  sets: [{ sets:4, reps:"10-12", weight:"160kg", done:true  }, { sets:4, reps:"10-12", weight:"160kg", done:true  }, { sets:4, reps:"10-12", weight:"150kg", done:false }, { sets:4, reps:"10-12", weight:"150kg", done:false }] },
      { name: "Cadeira Extensora",           category: "Pernas",  sets: [{ sets:3, reps:"12-15", weight:"45kg", done:false }, { sets:3, reps:"12-15", weight:"45kg", done:false }, { sets:3, reps:"12-15", weight:"45kg", done:false }] },
      { name: "Mesa Flexora",                category: "Pernas",  sets: [{ sets:3, reps:"12",    weight:"35kg", done:false }, { sets:3, reps:"12",    weight:"35kg", done:false }, { sets:3, reps:"12",    weight:"35kg", done:false }] },
      { name: "Panturrilha em Pé",           category: "Pernas",  sets: [{ sets:4, reps:"15-20", weight:"60kg", done:false }, { sets:4, reps:"15-20", weight:"60kg", done:false }, { sets:4, reps:"15-20", weight:"60kg", done:false }, { sets:4, reps:"15-20", weight:"60kg", done:false }] },
    ],
  },
  {
    id: "d5", label: "Ombros & Core",   shortLabel: "Dia 5", isRest: false, done: false,
    exercises: [
      { name: "Desenvolvimento com Barra",   category: "Ombros",  sets: [{ sets:4, reps:"8-10", weight:"50kg", done:false }, { sets:4, reps:"8-10", weight:"50kg", done:false }, { sets:4, reps:"8-10", weight:"48kg", done:false }, { sets:4, reps:"8-10", weight:"48kg", done:false }] },
      { name: "Elevação Lateral",            category: "Ombros",  sets: [{ sets:3, reps:"12-15", weight:"10kg", done:false }, { sets:3, reps:"12-15", weight:"10kg", done:false }, { sets:3, reps:"12-15", weight:"10kg", done:false }] },
      { name: "Prancha Abdominal",           category: "Core",    sets: [{ sets:3, reps:"60s",   weight:"—",    done:false }, { sets:3, reps:"60s",   weight:"—",    done:false }, { sets:3, reps:"60s",   weight:"—",    done:false }] },
      { name: "Russian Twist",               category: "Core",    sets: [{ sets:3, reps:"20",    weight:"8kg",  done:false }, { sets:3, reps:"20",    weight:"8kg",  done:false }, { sets:3, reps:"20",    weight:"8kg",  done:false }] },
    ],
  },
  {
    id: "d6", label: "Descanso Total",  shortLabel: "Dia 6", isRest: true,  done: false,
    exercises: [],
  },
];

const HISTORY = [
  { date: "Seg, 3 Jun",  day: "Peito & Tríceps", duration: "52 min", volume: "8.240 kg", sets: 17, pr: true  },
  { date: "Ter, 4 Jun",  day: "Costas & Bíceps", duration: "48 min", volume: "7.100 kg", sets: 14, pr: false },
  { date: "Qua, 5 Jun",  day: "Descanso Ativo",  duration: "30 min", volume: "—",        sets: 0,  pr: false },
  { date: "Qui, 6 Jun",  day: "Pernas & Glúteos",duration: "—",      volume: "—",        sets: 0,  pr: false },
];

/* ── Helpers ───────────────────────────────────────────── */
const CAT_COLOR: Record<string, string> = {
  Peito: "#1C6E8C", Costas: "#498467", Pernas: "#f59e0b",
  Ombros: "#8b5cf6", Bíceps: "#ec4899", Tríceps: "#06b6d4", Core: "#64748b",
};

const CAT_BG: Record<string, string> = {
  Peito: "bg-blue-pale", Costas: "bg-green-pale", Pernas: "bg-amber-50",
  Ombros: "bg-violet-50", Bíceps: "bg-pink-50", Tríceps: "bg-cyan-50", Core: "bg-slate-50",
};

/* ════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════ */
export default function ClienteTreinos() {
  const [activeDay, setActiveDay] = useState(3); // D4 = hoje
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<"plano" | "historico" | "progresso">("plano");
  const [timer, setTimer] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const day = PLAN_DAYS[activeDay];

  /* ── Set toggle ── */
  function toggleSet(exIdx: number, setIdx: number) {
    const key = `${activeDay}-${exIdx}-${setIdx}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function setDone(exIdx: number, setIdx: number) {
    const key = `${activeDay}-${exIdx}-${setIdx}`;
    return completedSets[key] ?? day.exercises[exIdx]?.sets[setIdx]?.done ?? false;
  }

  /* ── Progress data ── */
  const totalSets   = day.exercises.reduce((a, e) => a + e.sets.length, 0);
  const doneSets    = day.exercises.reduce((a, e, ei) =>
    a + e.sets.filter((_, si) => setDone(ei, si)).length, 0);
  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  const weekDone = PLAN_DAYS.filter(d => d.done).length;
  const weekTotal = PLAN_DAYS.length;

  return (
    <SidebarLayout navItems={NAV} userRole="cliente" userName="Ana Souza" userSub="Pro Fita">
      <div className="px-5 md:px-7 py-6 max-w-[1100px] mx-auto space-y-5 animate-fade-up">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-[26px] text-dark tracking-tight leading-tight">Meus Treinos</h1>
            <p className="text-[13.5px] text-muted mt-0.5">Hipertrofia Split · 4 dias/semana · Personal: Dr. Marcus Silva</p>
          </div>
          {/* Rest timer chip */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border font-semibold text-[13px] transition-all cursor-pointer select-none ${timerActive ? "border-blue bg-blue text-white" : "border-border bg-white text-mid hover:bg-surface"}`}
              onClick={() => setTimerActive(v => !v)}>
              <IcTimer className="w-4 h-4" />
              {timerActive ? "Temporizador ativo" : "Iniciar descanso"}
              {timerActive && <span className="font-mono ml-1">1:30</span>}
            </div>
          </div>
        </div>

        {/* ── Weekly overview cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sessões semana",  value: `${weekDone}/${weekTotal}`,  icon: "📅", color: "text-blue",    bg: "bg-blue-pale"  },
            { label: "Volume total",    value: "15.340 kg",                  icon: "🏋️", color: "text-green",   bg: "bg-green-pale" },
            { label: "Tempo médio",     value: "50 min",                     icon: "⏱️", color: "text-mid",     bg: "bg-surface"    },
            { label: "Sequência",       value: "6 dias 🔥",                  icon: "⚡", color: "text-amber-600",bg: "bg-amber-50"  },
          ].map((c, i) => (
            <div key={i} className="bg-white border border-border-light rounded-2xl p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center text-lg mb-3`}>{c.icon}</div>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wide mb-0.5">{c.label}</p>
              <p className={`text-[20px] font-display leading-tight ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex bg-white border border-border-light rounded-2xl p-1 gap-1 w-fit shadow-sm">
          {(["plano","historico","progresso"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-[13px] font-semibold capitalize transition-all ${tab === t ? "bg-blue text-white shadow-sm" : "text-muted hover:text-dark"}`}>
              {t === "plano" ? "Plano Atual" : t === "historico" ? "Histórico" : "Progressão"}
            </button>
          ))}
        </div>

        {/* ══════════════ TAB: PLANO ══════════════ */}
        {tab === "plano" && (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">

            {/* Day selector */}
            <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3.5 border-b border-border-light">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wide">Semana Atual</p>
              </div>
              <div className="p-2 space-y-1">
                {PLAN_DAYS.map((d, i) => (
                  <button key={d.id} onClick={() => setActiveDay(i)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                      activeDay === i ? "bg-blue text-white" : "hover:bg-surface text-dark"
                    }`}>
                    {/* Status dot */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all ${
                      activeDay === i ? "bg-white/20 text-white" :
                      d.done ? "bg-green-pale text-green" :
                      i === 3 ? "bg-blue-pale text-blue" :
                      "bg-surface text-muted"
                    }`}>
                      {d.done ? "✓" : i === 3 ? "→" : `D${i+1}`}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[12.5px] font-bold leading-tight truncate ${activeDay === i ? "text-white" : "text-dark"}`}>{d.label}</p>
                      <p className={`text-[11px] leading-tight ${activeDay === i ? "text-white/70" : "text-muted"}`}>
                        {d.isRest ? "Descanso" : `${d.exercises.length} exercícios`}
                      </p>
                    </div>
                    {i === 3 && !d.done && activeDay !== i && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue text-white flex-shrink-0">Hoje</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Workout detail */}
            <div className="space-y-4">

              {/* Day header */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h2 className="font-display text-[20px] text-dark">{day.label}</h2>
                      {day.done && <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-pale text-green">Concluído ✓</span>}
                      {!day.done && !day.isRest && <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-pale text-blue">Em andamento</span>}
                    </div>
                    <p className="text-[13px] text-muted">
                      {day.isRest ? "Recuperação ativa — caminhada leve ou alongamento" :
                        `${day.exercises.length} exercícios · ~${day.exercises.length * 12} min`}
                    </p>
                  </div>

                  {/* Progress ring */}
                  {!day.isRest && (
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#edf4f7" strokeWidth="5" />
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#1C6E8C" strokeWidth="5"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
                            strokeLinecap="round" className="transition-all duration-700" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-dark">{pct}%</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-dark">{doneSets}/{totalSets}</p>
                        <p className="text-[11.5px] text-muted">séries feitas</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {!day.isRest && (
                  <div className="mt-4 h-2 bg-border-light rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: "linear-gradient(90deg,#498467,#1C6E8C)" }} />
                  </div>
                )}
              </div>

              {/* Rest day */}
              {day.isRest && (
                <div className="bg-white border border-border-light rounded-2xl p-10 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-3xl mx-auto mb-4">😴</div>
                  <h3 className="text-[16px] font-bold text-dark mb-2">Dia de Descanso</h3>
                  <p className="text-[13.5px] text-muted max-w-sm mx-auto">Aproveite para recuperar. Uma caminhada leve de 20-30 minutos pode ajudar na recuperação muscular.</p>
                  <div className="mt-5 flex justify-center gap-3">
                    {["🧘 Alongamento","🚶 Caminhada","💆 Massagem"].map(a => (
                      <span key={a} className="text-[12px] font-semibold px-3 py-1.5 bg-surface border border-border rounded-full text-mid">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercises */}
              {!day.isRest && day.exercises.map((ex, ei) => (
                <div key={ei} className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
                  {/* Exercise header */}
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border-light">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${CAT_BG[ex.category] ?? "bg-surface"}`}>
                      <IcDumbbell className="w-4 h-4" style={{ color: CAT_COLOR[ex.category] ?? "#7a94a0" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14.5px] font-bold text-dark">{ex.name}</p>
                      <p className="text-[11.5px] text-muted">{ex.category} · {ex.sets.length} séries</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0"
                      style={{ background: `${CAT_COLOR[ex.category]}18`, color: CAT_COLOR[ex.category] }}>
                      {ex.category}
                    </span>
                  </div>

                  {/* Sets table */}
                  <div className="px-5 py-3">
                    {/* Header */}
                    <div className="grid grid-cols-[40px_1fr_80px_80px_50px] gap-2 pb-2 border-b border-border-light mb-1">
                      {["SÉRIE","REPS","PESO","DESCANSO",""].map((h, i) => (
                        <span key={i} className="text-[10px] font-bold text-muted uppercase tracking-wide">{h}</span>
                      ))}
                    </div>
                    {ex.sets.map((s, si) => {
                      const done = setDone(ei, si);
                      return (
                        <div key={si}
                          className={`grid grid-cols-[40px_1fr_80px_80px_50px] gap-2 items-center py-2.5 rounded-xl px-1 transition-all ${done ? "bg-green-pale/60" : "hover:bg-surface/60"}`}>
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold ${done ? "bg-green text-white" : "bg-surface text-muted"}`}>{si + 1}</span>
                          <span className="text-[13.5px] font-semibold text-dark">{s.reps}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13.5px] font-bold text-dark">{s.weight}</span>
                          </div>
                          <span className="text-[12.5px] text-muted">90s</span>
                          {/* Done toggle */}
                          <button onClick={() => toggleSet(ei, si)}
                            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                              done ? "bg-green border-green text-white" : "border-border bg-white text-transparent hover:border-green/50"
                            }`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Note */}
                  {ex.notes && (
                    <div className="mx-5 mb-4 flex items-start gap-2 px-3.5 py-2.5 bg-amber-50 border border-amber-200/60 rounded-xl">
                      <span className="text-amber-500 flex-shrink-0 mt-0.5">💡</span>
                      <p className="text-[12.5px] text-amber-800 font-medium">{ex.notes}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Finish button */}
              {!day.isRest && (
                <button className="btn-gradient w-full py-3.5 text-[14px] font-bold rounded-2xl flex items-center justify-center gap-2.5">
                  <IcCheck className="w-5 h-5" /> Finalizar Treino — {day.label}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ TAB: HISTÓRICO ══════════════ */}
        {tab === "historico" && (
          <div className="space-y-4">
            <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-dark">Histórico de Treinos</h2>
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-[12.5px] font-semibold text-mid hover:bg-surface transition-all">
                  <IcDownload className="w-3.5 h-3.5" /> Exportar
                </button>
              </div>
              <div className="divide-y divide-border-light">
                {HISTORY.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-surface/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${h.sets > 0 ? "bg-blue-pale" : "bg-surface"}`}>
                      {h.sets > 0 ? <IcDumbbell className="w-5 h-5 text-blue" /> : <span className="text-lg">😴</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[13.5px] font-bold text-dark">{h.day}</p>
                        {h.pr && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">🏆 PR</span>}
                      </div>
                      <p className="text-[12px] text-muted">{h.date}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-right flex-shrink-0">
                      {h.sets > 0 && <>
                        <div><p className="text-[13px] font-bold text-dark">{h.duration}</p><p className="text-[11px] text-muted">Duração</p></div>
                        <div><p className="text-[13px] font-bold text-dark">{h.volume}</p><p className="text-[11px] text-muted">Volume</p></div>
                        <div><p className="text-[13px] font-bold text-dark">{h.sets}</p><p className="text-[11px] text-muted">Séries</p></div>
                      </>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ TAB: PROGRESSÃO ══════════════ */}
        {tab === "progresso" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Supino Reto",          records: [65,70,72,75,78,80,80], unit: "kg", pr: "80 kg" },
              { name: "Agachamento",          records: [75,80,83,85,88,90,90], unit: "kg", pr: "90 kg" },
              { name: "Puxada Frontal",       records: [52,55,57,60,62,65,65], unit: "kg", pr: "65 kg" },
              { name: "Desenvolvimento",      records: [38,40,42,44,46,50,50], unit: "kg", pr: "50 kg" },
            ].map((ex, i) => {
              const max = Math.max(...ex.records);
              return (
                <div key={i} className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-bold text-dark">{ex.name}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                      🏆 PR: {ex.pr}
                    </span>
                  </div>
                  {/* Bar chart */}
                  <div className="flex items-end gap-1.5 h-20 mb-3">
                    {ex.records.map((v, ri) => (
                      <div key={ri} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-sm transition-all"
                          style={{ height: `${(v / max) * 100}%`, background: ri === ex.records.length - 1 ? "linear-gradient(180deg,#498467,#1C6E8C)" : "#d8e6eb", borderRadius: "3px 3px 0 0" }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10.5px] text-muted font-medium">
                    {["S1","S2","S3","S4","S5","S6","S7"].map(w => <span key={w}>{w}</span>)}
                  </div>
                  {/* Trend */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[12px] font-bold text-green">
                      +{ex.records[ex.records.length-1] - ex.records[0]}{ex.unit} desde o início
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}

/* ── Icons ─────────────────────────────────────────────── */
function IcDashboard() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function IcDumbbell({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) { return <svg className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6.5 6.5h11M6.5 17.5h11M4 10h2v4H4zM18 10h2v4h-2z"/><rect x="6" y="8" width="12" height="8" rx="2"/></svg> }
function IcNutrition() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 6c-1.5 2-2 4-2 6s.5 4 2 6"/><path d="M12 6c1.5 2 2 4 2 6s-.5 4-2 6"/><line x1="2" y1="12" x2="22" y2="12"/></svg> }
function IcMessages() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function IcSettings() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IcTimer({ className = "w-4 h-4" }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> }
function IcCheck({ className = "w-4 h-4" }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> }
function IcDownload({ className = "w-4 h-4" }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
