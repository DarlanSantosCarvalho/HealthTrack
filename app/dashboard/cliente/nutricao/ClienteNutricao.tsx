"use client";

import { useState } from "react";
import SidebarLayout from "@/components/dashboard/SidebarLayout";

/* ── Nav ───────────────────────────────────────────────── */
const NAV = [
  { href: "/dashboard/cliente",               label: "Dashboard",    icon: <IcDashboard /> },
  { href: "/dashboard/cliente/treinos",       label: "Treinos",      icon: <IcDumbbell /> },
  { href: "/dashboard/cliente/nutricao",      label: "Nutrição",     icon: <IcLeaf /> },
  { href: "/dashboard/cliente/mensagens",     label: "Mensagens",    icon: <IcMessages /> },
  { href: "/dashboard/cliente/configuracoes", label: "Configurações",icon: <IcSettings /> },
];

/* ── Types ─────────────────────────────────────────────── */
interface LoggedFood { id: string; name: string; amount: string; unit: string; kcal: number; p: number; c: number; f: number; checked: boolean }
interface Meal { id: string; name: string; icon: string; targetKcal: number; foods: LoggedFood[] }

/* ── Data ──────────────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2, 9); }

const INITIAL_MEALS: Meal[] = [
  {
    id: "cafe", name: "Café da Manhã", icon: "☀️", targetKcal: 550,
    foods: [
      { id: uid(), name: "Ovo Inteiro",      amount: "3",   unit: "unid.", kcal: 234, p: 18, c: 3,  f: 15, checked: true  },
      { id: uid(), name: "Pão Integral",     amount: "2",   unit: "fatias",kcal: 160, p: 8,  c: 30, f: 2,  checked: true  },
      { id: uid(), name: "Abacate",          amount: "100", unit: "g",     kcal: 160, p: 2,  c: 9,  f: 15, checked: true  },
      { id: uid(), name: "Café sem açúcar",  amount: "200", unit: "ml",    kcal: 4,   p: 0,  c: 1,  f: 0,  checked: true  },
    ],
  },
  {
    id: "almoco", name: "Almoço", icon: "🍽️", targetKcal: 750,
    foods: [
      { id: uid(), name: "Frango Grelhado",  amount: "180", unit: "g",     kcal: 297, p: 56, c: 0,  f: 7,  checked: true  },
      { id: uid(), name: "Arroz Cozido",     amount: "150", unit: "g",     kcal: 195, p: 4,  c: 42, f: 0,  checked: true  },
      { id: uid(), name: "Brócolis Cozido",  amount: "100", unit: "g",     kcal: 35,  p: 2,  c: 7,  f: 0,  checked: true  },
      { id: uid(), name: "Azeite de Oliva",  amount: "10",  unit: "ml",    kcal: 88,  p: 0,  c: 0,  f: 10, checked: true  },
    ],
  },
  {
    id: "lanche", name: "Lanche da Tarde", icon: "🥤", targetKcal: 350,
    foods: [
      { id: uid(), name: "Whey Protein",     amount: "30",  unit: "g",     kcal: 120, p: 24, c: 3,  f: 2,  checked: false },
      { id: uid(), name: "Banana",           amount: "1",   unit: "unid.", kcal: 89,  p: 1,  c: 23, f: 0,  checked: false },
      { id: uid(), name: "Pasta Amendoim",   amount: "20",  unit: "g",     kcal: 119, p: 5,  c: 4,  f: 10, checked: false },
    ],
  },
  {
    id: "jantar", name: "Jantar", icon: "🌙", targetKcal: 600,
    foods: [
      { id: uid(), name: "Filé de Tilápia",  amount: "200", unit: "g",     kcal: 256, p: 52, c: 0,  f: 6,  checked: false },
      { id: uid(), name: "Batata Doce",      amount: "200", unit: "g",     kcal: 172, p: 4,  c: 40, f: 0,  checked: false },
      { id: uid(), name: "Espinafre Cru",    amount: "80",  unit: "g",     kcal: 18,  p: 2,  c: 3,  f: 0,  checked: false },
    ],
  },
];

const TARGETS = { kcal: 2200, p: 180, c: 220, f: 65 };

const WEEK_DATA = [
  { day: "Seg", kcal: 2150, target: 2200 },
  { day: "Ter", kcal: 2320, target: 2200 },
  { day: "Qua", kcal: 1980, target: 2200 },
  { day: "Qui", kcal: 2200, target: 2200 },
  { day: "Sex", kcal: 2100, target: 2200 },
  { day: "Sáb", kcal: 558,  target: 2200 },
  { day: "Dom", kcal: 0,    target: 2200 },
];

/* ════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════ */
export default function ClienteNutricao() {
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [water, setWater] = useState(5); // 250ml glasses
  const [waterTarget] = useState(8);
  const [tab, setTab] = useState<"hoje" | "plano" | "semana">("hoje");
  const [expandedMeal, setExpandedMeal] = useState<string | null>("cafe");

  /* ── Totals (only checked items) ── */
  const checkedFoods = meals.flatMap(m => m.foods.filter(f => f.checked));
  const totals = checkedFoods.reduce(
    (acc, f) => ({ kcal: acc.kcal + f.kcal, p: acc.p + f.p, c: acc.c + f.c, f: acc.f + f.f }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );

  function toggleFood(mealId: string, foodId: string) {
    setMeals(ms => ms.map(m => m.id !== mealId ? m : {
      ...m, foods: m.foods.map(f => f.id !== foodId ? f : { ...f, checked: !f.checked }),
    }));
  }

  /* ── Macro ring segments ── */
  const totalMacroKcal = totals.p * 4 + totals.c * 4 + totals.f * 9;
  const pPct = totalMacroKcal > 0 ? (totals.p * 4 / totalMacroKcal) * 100 : 33;
  const cPct = totalMacroKcal > 0 ? (totals.c * 4 / totalMacroKcal) * 100 : 33;
  const fPct = totalMacroKcal > 0 ? (totals.f * 9 / totalMacroKcal) * 100 : 34;

  const kcalPct = Math.min(100, Math.round((totals.kcal / TARGETS.kcal) * 100));

  return (
    <SidebarLayout navItems={NAV} userRole="cliente" userName="Ana Souza" userSub="Pro Fita">
      <div className="px-5 md:px-7 py-6 max-w-[1100px] mx-auto space-y-5 animate-fade-up">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-[26px] text-dark tracking-tight">Minha Nutrição</h1>
            <p className="text-[13.5px] text-muted mt-0.5">Plano: Perda de Gordura & Ganho de Massa · Nutricionista: Dra. Ana Lima</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-muted bg-white border border-border-light px-3.5 py-2 rounded-xl">
              📅 Quarta, 05 Jun 2024
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex bg-white border border-border-light rounded-2xl p-1 gap-1 w-fit shadow-sm">
          {(["hoje","plano","semana"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-[13px] font-semibold capitalize transition-all ${tab === t ? "bg-green text-white shadow-sm" : "text-muted hover:text-dark"}`}>
              {t === "hoje" ? "Hoje" : t === "plano" ? "Plano Completo" : "Semana"}
            </button>
          ))}
        </div>

        {/* ══════ TAB: HOJE ══════ */}
        {tab === "hoje" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

            {/* Left: meal log */}
            <div className="space-y-4">

              {/* Kcal progress card */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="text-[15px] font-bold text-dark">Consumo de Hoje</h2>
                  <span className={`text-[12px] font-bold px-3 py-1.5 rounded-full ${kcalPct >= 100 ? "bg-red-50 text-red-500" : kcalPct >= 80 ? "bg-green-pale text-green" : "bg-blue-pale text-blue"}`}>
                    {kcalPct}% da meta
                  </span>
                </div>

                {/* Macro donut + bars */}
                <div className="flex items-center gap-6 flex-wrap">
                  {/* Donut ring */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#edf4f7" strokeWidth="10"/>
                      {/* Protein arc */}
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#498467" strokeWidth="10"
                        strokeDasharray={`${2*Math.PI*32 * pPct/100} ${2*Math.PI*32}`}
                        strokeDashoffset="0" strokeLinecap="butt"/>
                      {/* Carbs arc */}
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#f59e0b" strokeWidth="10"
                        strokeDasharray={`${2*Math.PI*32 * cPct/100} ${2*Math.PI*32}`}
                        strokeDashoffset={`-${2*Math.PI*32 * pPct/100}`} strokeLinecap="butt"/>
                      {/* Fat arc */}
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#ef4444" strokeWidth="10"
                        strokeDasharray={`${2*Math.PI*32 * fPct/100} ${2*Math.PI*32}`}
                        strokeDashoffset={`-${2*Math.PI*32 * (pPct+cPct)/100}`} strokeLinecap="butt"/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[16px] font-display font-bold text-dark leading-tight">{totals.kcal}</span>
                      <span className="text-[10px] text-muted">kcal</span>
                    </div>
                  </div>

                  {/* Macro bars */}
                  <div className="flex-1 space-y-2.5 min-w-[200px]">
                    {[
                      { label: "Proteína",     value: totals.p, target: TARGETS.p, unit: "g", color: "#498467", dot: "bg-green"       },
                      { label: "Carboidratos", value: totals.c, target: TARGETS.c, unit: "g", color: "#f59e0b", dot: "bg-amber-400"   },
                      { label: "Gordura",      value: totals.f, target: TARGETS.f, unit: "g", color: "#ef4444", dot: "bg-red-400"     },
                    ].map(m => {
                      const pct = Math.min(100, Math.round((m.value / m.target) * 100));
                      const over = m.value > m.target;
                      return (
                        <div key={m.label}>
                          <div className="flex items-center justify-between text-[12px] mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.dot}`}/>
                              <span className="font-semibold text-mid">{m.label}</span>
                            </div>
                            <span className={`font-bold ${over ? "text-red-500" : "text-dark"}`}>
                              {m.value}<span className="text-muted font-normal">/{m.target}{m.unit}</span>
                            </span>
                          </div>
                          <div className="h-2 bg-border-light rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: over ? "#ef4444" : m.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Kcal remaining */}
                  <div className="text-center flex-shrink-0">
                    <p className="text-[28px] font-display text-dark leading-tight">{Math.max(0, TARGETS.kcal - totals.kcal)}</p>
                    <p className="text-[11.5px] text-muted font-medium">kcal restantes</p>
                    <div className="mt-2 h-1.5 w-20 bg-border-light rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${kcalPct}%`, background: kcalPct >= 100 ? "#ef4444" : "linear-gradient(90deg,#498467,#1C6E8C)" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals */}
              {meals.map(meal => {
                const mTotals = meal.foods.filter(f => f.checked).reduce(
                  (a, f) => ({ kcal: a.kcal + f.kcal, p: a.p + f.p, c: a.c + f.c, f: a.f + f.f }),
                  { kcal: 0, p: 0, c: 0, f: 0 }
                );
                const expanded = expandedMeal === meal.id;
                const allDone  = meal.foods.every(f => f.checked);
                const someDone = meal.foods.some(f => f.checked);

                return (
                  <div key={meal.id}
                    className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm transition-all ${allDone ? "border-green/25" : someDone ? "border-amber-200" : "border-border-light"}`}>

                    {/* Meal header */}
                    <button
                      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface/40 transition-colors"
                      onClick={() => setExpandedMeal(expanded ? null : meal.id)}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{meal.icon}</span>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-[14.5px] font-bold text-dark">{meal.name}</p>
                            {allDone && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-pale text-green">✓ Concluído</span>}
                          </div>
                          <p className="text-[12px] text-muted">{mTotals.kcal} kcal · P {mTotals.p}g · C {mTotals.c}g · G {mTotals.f}g</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Mini progress */}
                        <div className="hidden sm:flex items-center gap-1.5">
                          <div className="w-20 h-1.5 bg-border-light rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.round((mTotals.kcal / meal.targetKcal) * 100))}%`, background: "#498467" }} />
                          </div>
                          <span className="text-[11px] text-muted">{meal.targetKcal} kcal</span>
                        </div>
                        <IcChevron className={`w-4 h-4 text-muted transition-transform ${expanded ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {/* Food list */}
                    {expanded && (
                      <div className="px-5 pb-4 animate-fade-up">
                        <div className="divide-y divide-border-light">
                          {meal.foods.map(food => (
                            <div key={food.id}
                              className={`flex items-center gap-3 py-3 transition-all rounded-xl px-1 ${food.checked ? "opacity-100" : "opacity-60"}`}>
                              {/* Checkbox */}
                              <button onClick={() => toggleFood(meal.id, food.id)}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  food.checked ? "bg-green border-green text-white" : "border-border bg-white hover:border-green/50"
                                }`}>
                                {food.checked && <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                              </button>

                              <div className="flex-1 min-w-0">
                                <p className={`text-[13.5px] font-semibold leading-tight ${food.checked ? "text-dark" : "text-mid"}`}>{food.name}</p>
                                <p className="text-[11.5px] text-muted">{food.amount} {food.unit}</p>
                              </div>

                              {/* Macros */}
                              <div className="hidden sm:flex items-center gap-3 text-[12px] font-semibold flex-shrink-0">
                                <span className="text-green">{food.p}g P</span>
                                <span className="text-amber-500">{food.c}g C</span>
                                <span className="text-red-400">{food.f}g G</span>
                                <span className="text-dark font-bold w-12 text-right">{food.kcal} kcal</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Meal total row */}
                        <div className="flex items-center justify-between pt-3 border-t border-border-light mt-1 px-1">
                          <span className="text-[11.5px] font-bold text-muted uppercase tracking-wide">Total da refeição</span>
                          <div className="flex items-center gap-3 text-[12px] font-bold">
                            <span className="text-green">{mTotals.p}g P</span>
                            <span className="text-amber-500">{mTotals.c}g C</span>
                            <span className="text-red-400">{mTotals.f}g G</span>
                            <span className="text-dark">{mTotals.kcal} kcal</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">

              {/* Water tracker */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-dark flex items-center gap-2">
                    💧 Hidratação
                  </h3>
                  <span className="text-[12px] font-bold text-blue">{water * 250}ml / {waterTarget * 250}ml</span>
                </div>
                {/* Glass grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Array(waterTarget).fill(0).map((_, i) => (
                    <button key={i} onClick={() => setWater(i < water ? i : i + 1)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xl transition-all border-2 ${
                        i < water
                          ? "bg-blue-pale border-blue/30 text-blue scale-100"
                          : "bg-surface border-border-light text-border hover:border-blue/30 hover:bg-blue-pale/30"
                      }`}>
                      <span className={i < water ? "opacity-100" : "opacity-30"}>💧</span>
                    </button>
                  ))}
                </div>
                <div className="h-2 bg-border-light rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 bg-blue"
                    style={{ width: `${Math.min(100, (water / waterTarget) * 100)}%` }} />
                </div>
                <p className="text-[11.5px] text-muted text-center mt-2">
                  {water >= waterTarget ? "🎉 Meta atingida!" : `${waterTarget - water} copo${waterTarget - water !== 1 ? "s" : ""} restante${waterTarget - water !== 1 ? "s" : ""}`}
                </p>
              </div>

              {/* Daily summary */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-dark mb-4">Resumo Diário</h3>
                <div className="space-y-3">
                  {[
                    { label: "Calorias",    consumed: totals.kcal, target: TARGETS.kcal, unit: "kcal", color: "#1C6E8C" },
                    { label: "Proteína",    consumed: totals.p,    target: TARGETS.p,    unit: "g",    color: "#498467" },
                    { label: "Carboidratos",consumed: totals.c,    target: TARGETS.c,    unit: "g",    color: "#f59e0b" },
                    { label: "Gordura",     consumed: totals.f,    target: TARGETS.f,    unit: "g",    color: "#ef4444" },
                  ].map(m => {
                    const pct  = Math.min(100, Math.round((m.consumed / m.target) * 100));
                    const over = m.consumed > m.target;
                    return (
                      <div key={m.label} className="flex items-center gap-3">
                        <span className="text-[12px] font-semibold text-muted w-24 flex-shrink-0">{m.label}</span>
                        <div className="flex-1 h-2 bg-border-light rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: over ? "#ef4444" : m.color }} />
                        </div>
                        <span className={`text-[11.5px] font-bold w-14 text-right flex-shrink-0 ${over ? "text-red-500" : "text-dark"}`}>
                          {m.consumed}/{m.target}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coach note */}
              <div className="bg-blue-pale/60 border border-blue/15 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IcInfo className="w-4 h-4 text-blue flex-shrink-0" />
                  <span className="text-[12.5px] font-bold text-blue">Nota da Nutricionista</span>
                </div>
                <p className="text-[12.5px] text-mid leading-relaxed">
                  Ótimo progresso! Lembre-se de consumir a proteína após o treino. Tente adicionar mais vegetais no jantar para atingir a meta de fibras.
                </p>
              </div>

              {/* Substitutions */}
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
                <h3 className="text-[13.5px] font-bold text-dark mb-3 flex items-center gap-2">
                  <IcSwap className="w-4 h-4 text-green" /> Substituições Permitidas
                </h3>
                <div className="space-y-2">
                  {[
                    { cat: "Carboidratos", items: ["Arroz → Quinoa","Batata Doce → Mandioca","Pão → Tapioca"] },
                    { cat: "Proteínas",    items: ["Frango → Peixe","Whey → Caseína","Ovo → Cottage"] },
                  ].map(s => (
                    <div key={s.cat}>
                      <p className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1.5">{s.cat}</p>
                      {s.items.map(item => (
                        <div key={item} className="flex items-center gap-2 py-1">
                          <span className="w-1 h-1 rounded-full bg-green flex-shrink-0" />
                          <span className="text-[12.5px] text-mid">{item}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ══════ TAB: PLANO COMPLETO ══════ */}
        {tab === "plano" && (
          <div className="space-y-4">
            {/* Plan header */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h2 className="text-[15px] font-bold text-dark">Perda de Gordura & Ganho de Massa</h2>
                  <p className="text-[12.5px] text-muted">Plano prescrito por Dra. Ana Lima · Atualizado em 24 Out 2023</p>
                </div>
                <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-[12.5px] font-semibold text-mid hover:bg-surface transition-all">
                  <IcDownload className="w-3.5 h-3.5" /> Baixar PDF
                </button>
              </div>
              {/* Target macros */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Calorias diárias", value: "2.200 kcal", icon: "🔥", bg: "bg-blue-pale",  text: "text-blue"        },
                  { label: "Proteína",          value: "180g / dia", icon: "💪", bg: "bg-green-pale", text: "text-green"       },
                  { label: "Carboidratos",      value: "220g / dia", icon: "⚡", bg: "bg-amber-50",   text: "text-amber-600"  },
                  { label: "Gordura",           value: "65g / dia",  icon: "🥑", bg: "bg-red-50",     text: "text-red-400"    },
                ].map((m, i) => (
                  <div key={i} className={`${m.bg} rounded-xl p-3.5 border border-border-light`}>
                    <span className="text-lg">{m.icon}</span>
                    <p className={`text-[16px] font-display font-bold mt-1 ${m.text}`}>{m.value}</p>
                    <p className="text-[11px] font-semibold text-muted mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Full meal plan */}
            {INITIAL_MEALS.map((meal, mi) => {
              const mt = meal.foods.reduce((a, f) => ({ kcal: a.kcal + f.kcal, p: a.p + f.p, c: a.c + f.c, f: a.f + f.f }), { kcal: 0, p: 0, c: 0, f: 0 });
              return (
                <div key={meal.id} className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{meal.icon}</span>
                      <div>
                        <p className="text-[14.5px] font-bold text-dark">{meal.name}</p>
                        <p className="text-[12px] text-muted">{mt.kcal} kcal · P {mt.p}g · C {mt.c}g · G {mt.f}g</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-3 divide-y divide-border-light">
                    {meal.foods.map((food, fi) => (
                      <div key={fi} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-[13.5px] font-semibold text-dark">{food.name}</p>
                          <p className="text-[12px] text-muted">{food.amount} {food.unit}</p>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] font-semibold">
                          <span className="text-green hidden sm:inline">{food.p}g P</span>
                          <span className="text-amber-500 hidden sm:inline">{food.c}g C</span>
                          <span className="text-red-400 hidden sm:inline">{food.f}g G</span>
                          <span className="text-dark font-bold">{food.kcal} kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════ TAB: SEMANA ══════ */}
        {tab === "semana" && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5">

            {/* Weekly chart */}
            <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
              <h2 className="text-[15px] font-bold text-dark mb-5">Calorias da Semana</h2>
              <div className="flex items-end gap-3 h-40 mb-3">
                {WEEK_DATA.map((d, i) => {
                  const pct = d.kcal > 0 ? (d.kcal / d.target) * 100 : 0;
                  const over = d.kcal > d.target;
                  const isToday = i === 5;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                      {d.kcal > 0 && (
                        <span className="text-[10px] font-bold text-muted">{d.kcal}</span>
                      )}
                      <div className="w-full flex flex-col justify-end rounded-lg overflow-hidden" style={{ height: "100px" }}>
                        {d.kcal > 0 ? (
                          <div className="w-full rounded-lg transition-all"
                            style={{
                              height: `${Math.min(100, pct)}%`,
                              background: over
                                ? "#ef4444"
                                : isToday
                                  ? "linear-gradient(180deg,#498467,#1C6E8C)"
                                  : "#d8e6eb",
                              opacity: d.kcal === 0 ? 0.2 : 1,
                            }} />
                        ) : (
                          <div className="w-full h-1 rounded-lg bg-border-light" />
                        )}
                      </div>
                      <span className={`text-[11px] font-bold ${isToday ? "text-blue" : "text-muted"}`}>{d.day}</span>
                      {isToday && <span className="text-[9px] font-bold text-blue">Hoje</span>}
                    </div>
                  );
                })}
              </div>
              {/* Target line label */}
              <div className="flex items-center gap-2 justify-end mt-2">
                <div className="w-6 h-0.5 bg-green/50 border-t-2 border-dashed border-green" />
                <span className="text-[11.5px] text-muted">Meta: 2.200 kcal</span>
              </div>
            </div>

            {/* Weekly stats */}
            <div className="space-y-4">
              <div className="bg-white border border-border-light rounded-2xl p-5 shadow-sm">
                <h3 className="text-[13.5px] font-bold text-dark mb-4">Média da Semana</h3>
                <div className="space-y-3">
                  {[
                    { label: "Calorias médias", value: "2.150 kcal", delta: "-50 kcal", ok: true  },
                    { label: "Adesão ao plano",  value: "71%",        delta: "5/7 dias", ok: true  },
                    { label: "Proteína média",   value: "172g",       delta: "-8g meta", ok: false },
                    { label: "Hidratação média", value: "1.800ml",    delta: "-700ml",   ok: false },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                      <span className="text-[12.5px] text-mid font-medium">{s.label}</span>
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-dark">{s.value}</p>
                        <p className={`text-[11px] font-semibold ${s.ok ? "text-green" : "text-amber-500"}`}>{s.delta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coach weekly feedback */}
              <div className="bg-green-pale border border-green/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">👩‍⚕️</span>
                  <span className="text-[12.5px] font-bold text-green">Feedback Semanal</span>
                </div>
                <p className="text-[12.5px] text-mid leading-relaxed">
                  Boa semana! Você esteve dentro das calorias na maioria dos dias. Foco na proteína nos próximos 7 dias — tente chegar a 180g/dia.
                </p>
                <p className="text-[11px] text-muted mt-2">— Dra. Ana Lima · 01 Jun 2024</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}

/* ── Icons ─────────────────────────────────────────────── */
function IcDashboard()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function IcDumbbell()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6.5 6.5h11M6.5 17.5h11M4 10h2v4H4zM18 10h2v4h-2z"/><rect x="6" y="8" width="12" height="8" rx="2"/></svg> }
function IcLeaf()       { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 22 L16 8"/><path d="M8.5 3.5c2 0 5.5.5 8 3s3 6 3 8.5c-2.5 0-6-.5-8.5-3S8.5 6 8.5 3.5z"/></svg> }
function IcMessages()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function IcSettings()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> }
function IcChevron({ className = "w-4 h-4" }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg> }
function IcDownload({ className = "w-4 h-4" }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function IcInfo({ className = "w-4 h-4" }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> }
function IcSwap({ className = "w-4 h-4" }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> }
