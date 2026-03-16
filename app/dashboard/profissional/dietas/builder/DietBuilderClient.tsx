"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Logo from "@/components/ui/Logo";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
interface FoodItem {
  id: string;
  name: string;
  brand: string | null;
  amount: string;
  unit: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
}

interface FatSecretResult {
  id: string;
  name: string;
  brand: string | null;
  type: string;
  serving: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  id: string;
  name: string;
  icon: string;
  foods: FoodItem[];
  coachNote: string;
  collapsed: boolean;
}

interface Substitution {
  id: string;
  category: string;
}

interface Plan {
  clientName: string;
  planName: string;
  targetKcal: number;
  targetP: number;
  targetC: number;
  targetF: number;
  meals: Meal[];
  clientInstructions: string;
  substitutions: Substitution[];
}

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2, 9); }

function totalNutrients(meals: Meal[]) {
  return meals.flatMap(m => m.foods).reduce(
    (acc, f) => ({ kcal: acc.kcal + f.kcal, p: acc.p + f.p, c: acc.c + f.c, f: acc.f + f.f }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
}

function mealTotals(meal: Meal) {
  return meal.foods.reduce(
    (acc, f) => ({ kcal: acc.kcal + f.kcal, p: acc.p + f.p, c: acc.c + f.c, f: acc.f + f.f }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
}

function parseServing(serving: string): { amount: string; unit: string } {
  const m = serving.match(/^([\d./]+)\s*(.*)$/);
  if (!m) return { amount: "100", unit: "g" };
  return { amount: m[1], unit: m[2].trim() || "g" };
}

/* ═══════════════════════════════════════════════════════
   FATSECRET SEARCH HOOK  (debounced, 420ms)
═══════════════════════════════════════════════════════ */
function useFatSecretSearch() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<FatSecretResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [devMode, setDevMode] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string) => {
    setQuery(q);
    setError(null);
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/fatsecret?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        if (data.devError) { setDevMode(true); setError(data.devError); setResults([]); }
        else if (data.error) { setError(data.error); setResults([]); }
        else { setDevMode(false); setResults(data.results ?? []); }
      } catch { setError("Falha na conexão"); setResults([]); }
      finally { setLoading(false); }
    }, 420);
  }, []);

  const clear = useCallback(() => {
    setQuery(""); setResults([]); setError(null); setLoading(false);
  }, []);

  return { query, results, loading, error, devMode, search, clear };
}

/* ═══════════════════════════════════════════════════════
   INITIAL STATE
═══════════════════════════════════════════════════════ */
function makeInitialPlan(): Plan {
  return {
    clientName: "Ana Souza", planName: "Perda de Gordura & Ganho de Massa",
    targetKcal: 2200, targetP: 180, targetC: 220, targetF: 65,
    clientInstructions: "",
    substitutions: [
      { id: uid(), category: "Lista de Carboidratos" },
      { id: uid(), category: "Fontes de Proteína"    },
    ],
    meals: [
      {
        id: uid(), name: "Café da Manhã", icon: "☀️", collapsed: false,
        coachNote: "Substitua os ovos por 200g de Iogurte Grego se preferir.",
        foods: [
          { id: uid(), name: "Ovo Inteiro",  brand: null, amount: "3",   unit: "unid.", kcal: 234, p: 18, c: 3,  f: 15 },
          { id: uid(), name: "Pão Integral", brand: null, amount: "2",   unit: "fatias",kcal: 160, p: 8,  c: 30, f: 2  },
          { id: uid(), name: "Abacate",      brand: null, amount: "100", unit: "g",     kcal: 160, p: 2,  c: 9,  f: 15 },
        ],
      },
      { id: uid(), name: "Almoço", icon: "🍽️", collapsed: false, coachNote: "", foods: [] },
      { id: uid(), name: "Jantar", icon: "🌙",  collapsed: false, coachNote: "", foods: [] },
    ],
  };
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function DietBuilderClient() {
  const [plan, setPlan]                         = useState<Plan>(makeInitialPlan);
  const [addingTo, setAddingTo]                 = useState<string | null>(null);
  const [savedMsg, setSavedMsg]                 = useState(false);
  const [publishedMsg, setPublishedMsg]         = useState(false);
  const [showPlanSettings, setShowPlanSettings] = useState(false);
  const fs = useFatSecretSearch();
  const totals = totalNutrients(plan.meals);

  // Close dropdown on outside click
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) fs.clear();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [fs]);

  /* ── Meals ── */
  const addMeal = () => {
    const icons = ["🌅","🥗","🍱","🥤","🌃","🍎"];
    setPlan(p => ({ ...p, meals: [...p.meals, { id: uid(), name: `Refeição ${p.meals.length + 1}`, icon: icons[p.meals.length % icons.length], collapsed: false, coachNote: "", foods: [] }] }));
  };
  const removeMeal = (id: string) => {
    setPlan(p => ({ ...p, meals: p.meals.filter(m => m.id !== id) }));
    if (addingTo === id) { setAddingTo(null); fs.clear(); }
  };
  const updateMealName = (id: string, name: string) =>
    setPlan(p => ({ ...p, meals: p.meals.map(m => m.id === id ? { ...m, name } : m) }));
  const toggleMeal = (id: string) =>
    setPlan(p => ({ ...p, meals: p.meals.map(m => m.id === id ? { ...m, collapsed: !m.collapsed } : m) }));
  const updateNote = (id: string, note: string) =>
    setPlan(p => ({ ...p, meals: p.meals.map(m => m.id === id ? { ...m, coachNote: note } : m) }));

  /* ── Foods ── */
  const addFood = (mealId: string, r: FatSecretResult) => {
    const { amount, unit } = parseServing(r.serving);
    const item: FoodItem = { id: uid(), name: r.name, brand: r.brand, amount, unit, kcal: r.kcal, p: r.protein, c: r.carbs, f: r.fat };
    setPlan(p => ({ ...p, meals: p.meals.map(m => m.id === mealId ? { ...m, foods: [...m.foods, item] } : m) }));
    fs.clear();
  };
  const removeFood = (mealId: string, foodId: string) =>
    setPlan(p => ({ ...p, meals: p.meals.map(m => m.id !== mealId ? m : { ...m, foods: m.foods.filter(f => f.id !== foodId) }) }));
  const updateFoodField = (mealId: string, foodId: string, field: "amount" | "unit", value: string) =>
    setPlan(p => ({ ...p, meals: p.meals.map(m => m.id !== mealId ? m : { ...m, foods: m.foods.map(f => f.id !== foodId ? f : { ...f, [field]: value }) }) }));

  /* ── Substitutions ── */
  const addSubstitution = () =>
    setPlan(p => ({ ...p, substitutions: [...p.substitutions, { id: uid(), category: "Nova Categoria" }] }));
  const updateSub = (id: string, category: string) =>
    setPlan(p => ({ ...p, substitutions: p.substitutions.map(s => s.id === id ? { ...s, category } : s) }));

  const handleSave    = () => { setSavedMsg(true);    setTimeout(() => setSavedMsg(false),    2200); };
  const handlePublish = () => { setPublishedMsg(true); setTimeout(() => setPublishedMsg(false),2200); };

  const startAdding = (mealId: string) => {
    if (addingTo === mealId) { setAddingTo(null); fs.clear(); return; }
    setAddingTo(mealId); fs.clear();
  };

  /* ─────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* ══ TOP NAV ══ */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-7 h-[58px] bg-white border-b border-border-light gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Logo variant="light" size="sm" />
          <div className="h-5 w-px bg-border hidden sm:block" />
          <nav className="hidden sm:flex items-center gap-5 text-[13px] font-semibold">
            <span className="text-muted hover:text-dark cursor-pointer transition-colors">Clientes</span>
            <span className="text-blue border-b-2 border-blue pb-px cursor-pointer">Planos Alimentares</span>
            <span className="text-muted hover:text-dark cursor-pointer transition-colors">Treinos</span>
            <span className="text-muted hover:text-dark cursor-pointer transition-colors">Relatórios</span>
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          {(savedMsg || publishedMsg) && (
            <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full animate-fade-up ${publishedMsg ? "bg-green-pale text-green" : "bg-blue-pale text-blue"}`}>
              {publishedMsg ? "✓ Plano publicado!" : "✓ Rascunho salvo!"}
            </span>
          )}
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white text-[13px] font-bold text-mid hover:bg-surface transition-all">
            <IcSave className="w-3.5 h-3.5" /> Salvar Rascunho
          </button>
          <button onClick={handlePublish}
            className="btn-gradient flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-xl">
            <IcSend className="w-3.5 h-3.5" /> Publicar Plano
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>DM</div>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="flex flex-1 min-h-0">

        {/* ═════ LEFT: FOOD DATABASE / FATSECRET ═════ */}
        <aside ref={sidebarRef}
          className="hidden lg:flex flex-col w-[260px] xl:w-[280px] flex-shrink-0 bg-white border-r border-border-light relative">

          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-border-light">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-muted uppercase tracking-[.07em]">Base de Alimentos</p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-green bg-green-pale px-2 py-0.5 rounded-full border border-green/20">
                <IcAPI className="w-3 h-3" /> FatSecret
              </span>
            </div>

            {/* Search input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                {fs.loading ? <Spinner /> : <IcSearch className="w-3.5 h-3.5 text-muted" />}
              </span>
              <input
                type="text"
                placeholder="Buscar alimentos..."
                value={fs.query}
                onChange={e => fs.search(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-[13px] bg-surface border border-border rounded-xl outline-none focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10 transition-all placeholder:text-muted"
                autoComplete="off"
              />
              {fs.query && (
                <button onClick={fs.clear}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-dark p-0.5 transition-colors">
                  <IcX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Loading skeleton */}
            {fs.loading && (
              <div className="mt-2 space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-10 bg-surface rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.2 }} />
                ))}
              </div>
            )}

            {/* No results */}
            {!fs.loading && fs.query.length >= 2 && fs.results.length === 0 && !fs.error && (
              <p className="text-[12px] text-muted mt-2.5 text-center">
                Nenhum resultado para <strong>"{fs.query}"</strong>
              </p>
            )}

            {/* Error */}
            {fs.error && !fs.devMode && (
              <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1.5">
                <span>⚠️</span> {fs.error}
              </p>
            )}

            {/* Dev mode warning */}
            {fs.devMode && (
              <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-[11.5px] font-bold text-amber-700 mb-1.5">⚙️ Credenciais não configuradas</p>
                <p className="text-[11px] text-amber-600 leading-snug mb-2">Crie o arquivo <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> na raiz do projeto:</p>
                <pre className="bg-dark text-green-pale rounded-lg p-2.5 text-[10px] font-mono leading-loose overflow-x-auto">{`FATSECRET_CLIENT_ID=seu_id\nFATSECRET_CLIENT_SECRET=seu_secret`}</pre>
                <a href="https://platform.fatsecret.com" target="_blank" rel="noopener noreferrer"
                  className="block mt-2 text-[11px] font-semibold text-blue hover:underline">
                  → Criar conta no FatSecret Platform
                </a>
              </div>
            )}

            {/* ─── RESULTS DROPDOWN ─── */}
            {!fs.loading && fs.results.length > 0 && (
              <div className="mt-2.5 border border-border rounded-2xl overflow-hidden shadow-lg bg-white z-20 relative">
                {/* Header */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-surface border-b border-border-light">
                  <span className="text-[10.5px] font-bold text-muted uppercase tracking-wide">
                    {fs.results.length} resultado{fs.results.length !== 1 ? "s" : ""}
                  </span>
                  {!addingTo && (
                    <span className="text-[10.5px] text-amber-600 font-semibold">
                      ↓ Selecione uma refeição primeiro
                    </span>
                  )}
                  {addingTo && (
                    <span className="flex items-center gap-1 text-[10.5px] font-semibold text-blue">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                      Adicionando a: {plan.meals.find(m => m.id === addingTo)?.name}
                    </span>
                  )}
                </div>

                {/* Result items */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-border-light">
                  {fs.results.map((r, idx) => (
                    <button
                      key={r.id}
                      onClick={() => addingTo && addFood(addingTo, r)}
                      disabled={!addingTo}
                      className={`w-full text-left px-3.5 py-3 transition-all group ${
                        addingTo
                          ? "hover:bg-blue-pale cursor-pointer active:bg-blue/10"
                          : "opacity-50 cursor-not-allowed"
                      }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {/* Type badge */}
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {r.type === "Brand" ? (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-blue-pale text-blue uppercase tracking-wide">Marca</span>
                            ) : (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-green-pale text-green uppercase tracking-wide">Genérico</span>
                            )}
                          </div>
                          <p className="text-[13px] font-semibold text-dark group-hover:text-blue leading-tight truncate">
                            {r.name}
                          </p>
                          {r.brand && <p className="text-[11px] text-muted truncate">{r.brand}</p>}
                          <p className="text-[11.5px] text-muted mt-0.5">
                            {r.serving} · <span className="font-bold text-dark">{r.kcal} kcal</span>
                          </p>
                        </div>
                        {/* Macro pills column */}
                        <div className="flex flex-col items-end gap-0.5 flex-shrink-0 pt-0.5">
                          <span className="text-[10.5px] font-bold text-green bg-green-pale px-1.5 py-0.5 rounded-full">P {r.protein}g</span>
                          <span className="text-[10.5px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">C {r.carbs}g</span>
                          <span className="text-[10.5px] font-bold text-red-400 bg-red-50 px-1.5 py-0.5 rounded-full">G {r.fat}g</span>
                        </div>
                      </div>
                      {addingTo && (
                        <p className="text-[10.5px] text-blue/70 font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          + Adicionar ao {plan.meals.find(m => m.id === addingTo)?.name}
                        </p>
                      )}
                    </button>
                  ))}
                </div>

                {/* FatSecret attribution (required) */}
                <div className="px-3.5 py-2 border-t border-border-light bg-surface flex items-center justify-center gap-1.5">
                  <IcAPI className="w-3 h-3 text-green" />
                  <span className="text-[10px] text-muted">Powered by FatSecret</span>
                </div>
              </div>
            )}
          </div>

          {/* Active meal indicator */}
          <div className="px-4 py-3 border-b border-border-light">
            {addingTo ? (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-pale border border-blue/20 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-blue animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted">Adicionando a:</p>
                  <p className="text-[12.5px] font-bold text-blue truncate">{plan.meals.find(m => m.id === addingTo)?.name}</p>
                </div>
                <button onClick={() => { setAddingTo(null); fs.clear(); }}
                  className="text-blue/60 hover:text-blue transition-colors flex-shrink-0">
                  <IcX className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 p-2.5 bg-surface rounded-xl border border-border-light">
                <span className="text-base flex-shrink-0">💡</span>
                <p className="text-[11.5px] text-muted leading-snug">
                  Clique em <span className="font-semibold text-mid">+ Adicionar Alimento</span> em uma refeição, depois busque acima.
                </p>
              </div>
            )}
          </div>

          {/* Empty search state */}
          {!fs.query && (
            <div className="flex-1 flex flex-col items-center justify-center px-5 text-center gap-3 py-8">
              <div className="w-14 h-14 rounded-2xl bg-surface border-2 border-dashed border-border flex items-center justify-center text-2xl">🔍</div>
              <div>
                <p className="text-[13px] font-semibold text-mid mb-1.5">Busca em tempo real</p>
                <p className="text-[12px] text-muted leading-relaxed">
                  Digite um alimento acima para buscar no banco de dados FatSecret com mais de <strong className="text-mid">1 milhão de itens.</strong>
                </p>
              </div>
            </div>
          )}

          {/* Create custom food */}
          <div className="p-3 border-t border-border-light mt-auto">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border text-[12.5px] font-semibold text-muted hover:border-green hover:text-green hover:bg-green-pale transition-all">
              <IcPlus className="w-3.5 h-3.5" /> Criar Alimento Personalizado
            </button>
          </div>
        </aside>

        {/* ═════ CENTER: BUILDER CANVAS ═════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Client bar */}
          <div className="flex items-center justify-between px-5 md:px-7 py-3.5 bg-white border-b border-border-light gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>AS</div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-display text-[20px] text-dark tracking-tight">{plan.clientName}</h1>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-pale text-green border border-green/20">Cliente Ativo</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <input value={plan.planName} onChange={e => setPlan(p => ({ ...p, planName: e.target.value }))}
                    className="text-[12.5px] text-muted bg-transparent border-b border-transparent hover:border-border focus:border-blue outline-none transition-colors" />
                  <span className="text-[11.5px] text-muted">· Criado em 24 Out 2023</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowPlanSettings(v => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all ${showPlanSettings ? "bg-blue text-white" : "border border-border text-mid hover:bg-surface"}`}>
              <IcSettings className="w-3.5 h-3.5" /> Config. do Plano
            </button>
          </div>

          {/* Plan settings panel */}
          {showPlanSettings && (
            <div className="px-5 md:px-7 py-4 bg-blue-pale/40 border-b border-blue/10 animate-fade-up">
              <div className="flex items-center gap-5 flex-wrap">
                <p className="text-[12px] font-bold text-blue uppercase tracking-wide">Metas Diárias</p>
                {([
                  { label: "Calorias (kcal)", key: "targetKcal" },
                  { label: "Proteína (g)",    key: "targetP"    },
                  { label: "Carboidratos (g)",key: "targetC"    },
                  { label: "Gordura (g)",     key: "targetF"    },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label className="block text-[10.5px] font-bold text-muted uppercase tracking-wide mb-1">{f.label}</label>
                    <input type="number" value={plan[f.key]}
                      onChange={e => setPlan(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                      className="w-24 px-3 py-1.5 text-[13px] font-bold text-dark bg-white border border-border rounded-xl outline-none focus:border-blue transition-all text-center" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Macro progress bars */}
          <div className="px-5 md:px-7 py-4 bg-white border-b border-border-light">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Calorias",     value: totals.kcal, target: plan.targetKcal, unit: "kcal", color: "#1C6E8C", icon: "🔥" },
                { label: "Proteína",     value: totals.p,    target: plan.targetP,    unit: "g",    color: "#498467", icon: "💪" },
                { label: "Carboidratos", value: totals.c,    target: plan.targetC,    unit: "g",    color: "#f59e0b", icon: "⚡" },
                { label: "Gordura",      value: totals.f,    target: plan.targetF,    unit: "g",    color: "#ef4444", icon: "🥑" },
              ].map(m => {
                const pct  = Math.min(100, Math.round((m.value / m.target) * 100));
                const over = m.value > m.target;
                return (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-mid">{m.icon} {m.label}</span>
                      <span className={`text-[12px] font-bold ${over ? "text-red-500" : "text-dark"}`}>
                        {m.value}<span className="text-muted font-normal text-[11px]">/{m.target}{m.unit}</span>
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
          </div>

          {/* Meals canvas */}
          <div className="flex-1 overflow-y-auto px-5 md:px-7 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-dark">Estrutura Diária de Refeições</h2>
              <button onClick={addMeal}
                className="flex items-center gap-1.5 text-[13px] font-bold text-blue hover:text-blue-light transition-colors">
                <span className="w-5 h-5 rounded-full border-2 border-blue flex items-center justify-center text-[13px] font-bold leading-none">+</span>
                Nova Refeição
              </button>
            </div>

            {plan.meals.map(meal => (
              <MealCard
                key={meal.id}
                meal={meal}
                isAddingTo={addingTo === meal.id}
                onToggleAdd={() => startAdding(meal.id)}
                onRemove={() => removeMeal(meal.id)}
                onRename={n => updateMealName(meal.id, n)}
                onToggleCollapse={() => toggleMeal(meal.id)}
                onUpdateNote={n => updateNote(meal.id, n)}
                onRemoveFood={fid => removeFood(meal.id, fid)}
                onFieldChange={(fid, field, val) => updateFoodField(meal.id, fid, field, val)}
              />
            ))}

            {/* Bottom panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border-light">
                  <IcNote className="w-4 h-4 text-blue" />
                  <h3 className="text-[13.5px] font-bold text-dark">Instruções ao Cliente</h3>
                </div>
                <div className="p-4">
                  <textarea rows={4} value={plan.clientInstructions}
                    onChange={e => setPlan(p => ({ ...p, clientInstructions: e.target.value }))}
                    placeholder="Adicione orientações gerais, hidratação, metas ou timing de suplementos..."
                    className="w-full text-[12.5px] text-mid bg-surface border border-border rounded-xl px-3 py-2.5 outline-none focus:border-blue focus:bg-white transition-all resize-none placeholder:text-muted" />
                </div>
              </div>
              <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border-light">
                  <IcSwap className="w-4 h-4 text-green" />
                  <h3 className="text-[13.5px] font-bold text-dark">Substituições Permitidas</h3>
                </div>
                <div className="p-4 space-y-2">
                  {plan.substitutions.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-1.5">
                      <input value={s.category} onChange={e => updateSub(s.id, e.target.value)}
                        className="text-[13px] font-medium text-dark bg-transparent border-b border-transparent hover:border-border focus:border-blue outline-none transition-colors flex-1 mr-3" />
                      <button className="text-[12px] font-bold text-blue hover:underline whitespace-nowrap">Gerenciar</button>
                    </div>
                  ))}
                  <button onClick={addSubstitution}
                    className="flex items-center gap-1.5 text-[12.5px] font-semibold text-green hover:text-green-light transition-colors mt-2">
                    <IcPlus className="w-3.5 h-3.5" /> Nova Categoria
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═════ RIGHT PANEL ═════ */}
        <aside className="hidden xl:flex flex-col w-[220px] flex-shrink-0 bg-white border-l border-border-light">
          <div className="px-4 pt-5 pb-4 border-b border-border-light">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[.07em] mb-4">Cumprimento da Meta</p>
            <div className="space-y-3.5">
              {[
                { label: "Kcal Restantes", value: Math.max(0, plan.targetKcal - totals.kcal), unit: "kcal", color: "#1C6E8C", pct: Math.min(100, Math.round((totals.kcal / plan.targetKcal) * 100)) },
                { label: "P Restante",     value: Math.max(0, plan.targetP - totals.p),        unit: "g",    color: "#498467", pct: Math.min(100, Math.round((totals.p    / plan.targetP)    * 100)) },
                { label: "C Restante",     value: Math.max(0, plan.targetC - totals.c),        unit: "g",    color: "#f59e0b", pct: Math.min(100, Math.round((totals.c    / plan.targetC)    * 100)) },
                { label: "G Restante",     value: Math.max(0, plan.targetF - totals.f),        unit: "g",    color: "#ef4444", pct: Math.min(100, Math.round((totals.f    / plan.targetF)    * 100)) },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="font-semibold text-mid">{m.label}</span>
                    <span className="font-bold text-dark">{m.value}{m.unit}</span>
                  </div>
                  <div className="h-1.5 bg-border-light rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 border-b border-border-light space-y-1.5">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[.07em] mb-3">Ações Rápidas</p>
            {[
              { label: "Copiar de Modelo", sub: "Importar plano anterior",     icon: <IcCopy /> },
              { label: "Exportar PDF",      sub: "Gerar relatório do cliente",  icon: <IcPDF  /> },
              { label: "Compartilhar Link", sub: "Enviar link de acesso",       icon: <IcShare/> },
            ].map(a => (
              <button key={a.label} className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-surface text-left transition-all group">
                <div className="w-7 h-7 rounded-lg bg-blue-pale flex items-center justify-center text-blue flex-shrink-0 group-hover:bg-blue group-hover:text-white transition-all">
                  {a.icon}
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-dark leading-tight">{a.label}</p>
                  <p className="text-[11px] text-muted">{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="m-3 p-3.5 rounded-xl bg-green-pale border border-green/15 mt-auto">
            <div className="flex items-center gap-2 mb-1.5">
              <IcTip className="w-4 h-4 text-green flex-shrink-0" />
              <span className="text-[12px] font-bold text-green">Pro Tip</span>
            </div>
            <p className="text-[11.5px] text-mid leading-relaxed">
              Adicionar listas de substituição <strong className="font-semibold text-green">aumenta a adesão do cliente em 24% em média.</strong>
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MEAL CARD
═══════════════════════════════════════════════════════ */
interface MealCardProps {
  meal: Meal;
  isAddingTo: boolean;
  onToggleAdd: () => void;
  onRemove: () => void;
  onRename: (n: string) => void;
  onToggleCollapse: () => void;
  onUpdateNote: (n: string) => void;
  onRemoveFood: (id: string) => void;
  onFieldChange: (foodId: string, field: "amount" | "unit", value: string) => void;
}

function MealCard({ meal, isAddingTo, onToggleAdd, onRemove, onRename, onToggleCollapse, onUpdateNote, onRemoveFood, onFieldChange }: MealCardProps) {
  const mt = mealTotals(meal);
  const [showNote, setShowNote] = useState(!!meal.coachNote);

  return (
    <div className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${isAddingTo ? "border-blue shadow-blue/10 shadow-lg" : "border-border-light hover:border-border"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onToggleCollapse} className="text-muted hover:text-dark transition-colors flex-shrink-0">
            <IcChevron className={`w-4 h-4 transition-transform duration-200 ${meal.collapsed ? "-rotate-90" : ""}`} />
          </button>
          <span className="text-lg leading-none flex-shrink-0">{meal.icon}</span>
          <input value={meal.name} onChange={e => onRename(e.target.value)}
            className="text-[15px] font-bold text-dark bg-transparent outline-none border-b border-transparent hover:border-border focus:border-blue transition-colors min-w-0 flex-1" />
          <span className="text-[12px] text-muted hidden sm:inline flex-shrink-0">· {mt.kcal} kcal</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <button onClick={() => setShowNote(v => !v)}
            className={`p-1.5 rounded-lg transition-all ${showNote ? "bg-blue-pale text-blue" : "text-muted hover:bg-surface hover:text-blue"}`}>
            <IcNote className="w-3.5 h-3.5" />
          </button>
          <button onClick={onRemove}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all">
            <IcTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!meal.collapsed && (
        <>
          {/* Food table */}
          {meal.foods.length > 0 && (
            <div className="px-5 pb-1">
              <div className="grid grid-cols-[1fr_100px_38px_38px_38px_52px_28px] gap-2 px-2 pb-2 border-b border-border-light">
                {["ALIMENTO","QTD","P","C","G","KCAL",""].map((h, i) => (
                  <span key={i} className="text-[10px] font-bold text-muted uppercase tracking-wide">{h}</span>
                ))}
              </div>
              <div className="divide-y divide-border-light">
                {meal.foods.map(food => (
                  <div key={food.id}
                    className="grid grid-cols-[1fr_100px_38px_38px_38px_52px_28px] gap-2 items-center py-2.5 px-2 group hover:bg-surface/60 rounded-xl transition-colors">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-dark truncate">{food.name}</p>
                      {food.brand && <p className="text-[10.5px] text-muted truncate">{food.brand}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <input value={food.amount} onChange={e => onFieldChange(food.id, "amount", e.target.value)}
                        className="w-11 px-1.5 py-1 text-[12.5px] font-semibold text-dark bg-surface border border-border rounded-lg outline-none focus:border-blue transition-all text-center" />
                      <input value={food.unit} onChange={e => onFieldChange(food.id, "unit", e.target.value)}
                        className="w-9 py-1 text-[10.5px] text-muted bg-transparent outline-none border-b border-transparent hover:border-border focus:border-blue transition-colors truncate text-center" />
                    </div>
                    <span className="text-[12.5px] font-semibold text-green">{food.p}g</span>
                    <span className="text-[12.5px] font-semibold text-amber-500">{food.c}g</span>
                    <span className="text-[12.5px] font-semibold text-red-400">{food.f}g</span>
                    <span className="text-[12.5px] font-bold text-dark">{food.kcal}</span>
                    <button onClick={() => onRemoveFood(food.id)}
                      className="p-1 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                      <IcX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Totals */}
              <div className="grid grid-cols-[1fr_100px_38px_38px_38px_52px_28px] gap-2 items-center py-2 px-2 border-t border-border-light">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wide">Total</span>
                <span />
                <span className="text-[12px] font-bold text-green">{mt.p}g</span>
                <span className="text-[12px] font-bold text-amber-500">{mt.c}g</span>
                <span className="text-[12px] font-bold text-red-400">{mt.f}g</span>
                <span className="text-[12px] font-bold text-dark">{mt.kcal}</span>
                <span />
              </div>
            </div>
          )}

          {/* Empty */}
          {meal.foods.length === 0 && (
            <p className="text-center text-[13px] text-muted py-6">Nenhum alimento adicionado ainda.</p>
          )}

          {/* Add button */}
          <div className="px-5 pb-4 mt-1">
            <button onClick={onToggleAdd}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-[13px] font-semibold transition-all ${
                isAddingTo
                  ? "border-blue bg-blue-pale text-blue"
                  : "border-border text-muted hover:border-blue hover:text-blue hover:bg-blue-pale/30"
              }`}>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold leading-none text-[13px] transition-all ${isAddingTo ? "border-blue bg-blue text-white" : "border-current"}`}>
                {isAddingTo ? "×" : "+"}
              </span>
              {isAddingTo ? "Ativo — busque na barra lateral ←" : `Adicionar Alimento ao ${meal.name}`}
            </button>
          </div>

          {/* Coach note */}
          {showNote && (
            <div className="mx-5 mb-4 animate-fade-up">
              <div className="flex items-start gap-2.5 p-3.5 bg-blue-pale/60 border border-blue/15 rounded-xl">
                <IcTip className="w-4 h-4 text-blue flex-shrink-0 mt-0.5" />
                <textarea value={meal.coachNote} onChange={e => onUpdateNote(e.target.value)}
                  placeholder="Nota do profissional para o cliente sobre esta refeição..."
                  rows={2}
                  className="flex-1 text-[12.5px] text-mid bg-transparent outline-none resize-none placeholder:text-muted" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════ */
function Spinner() {
  return <svg className="w-3.5 h-3.5 animate-spin text-blue" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>;
}

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
function IcAPI({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>;
}
function IcSearch({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>;
}
function IcX({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>;
}
function IcSave({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>;
}
function IcSend({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>;
}
function IcSettings({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>;
}
function IcNote({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>
  </svg>;
}
function IcTrash({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>;
}
function IcChevron({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>;
}
function IcPlus({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>;
}
function IcTip({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>;
}
function IcSwap({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>;
}
function IcCopy({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>;
}
function IcPDF({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>;
}
function IcShare({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>;
}
