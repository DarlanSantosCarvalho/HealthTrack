"use client";

import { useState, useId } from "react";
import Logo from "@/components/ui/Logo";

/* ─────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────── */
interface ExerciseSet {
  sets: string;
  reps: string;
  weight: string;
  rest: string;
  tempo: string;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: ExerciseSet;
  notes: string;
}

interface WorkoutDay {
  id: string;
  label: string;
  isRest: boolean;
  exercises: Exercise[];
}

/* ─────────────────────────────────────────────────────
   EXERCISE LIBRARY DATA
───────────────────────────────────────────────────── */
const LIBRARY: Record<string, string[]> = {
  Peito: [
    "Supino Reto com Barra","Supino Inclinado com Halteres","Crucifixo Reto",
    "Crossover no Cabo","Flexão de Braço","Pec Deck","Supino Declinado",
  ],
  Costas: [
    "Puxada Frontal","Remada Curvada","Remada Unilateral","Pull-up / Barra Fixa",
    "Remada na Máquina","Pullover","Levantamento Terra",
  ],
  Pernas: [
    "Agachamento com Barra","Leg Press 45°","Cadeira Extensora","Mesa Flexora",
    "Afundo com Halteres","Panturrilha em Pé","Agachamento Goblet",
    "Cadeira Adutora","Stiff com Halteres",
  ],
  Ombros: [
    "Desenvolvimento com Barra","Elevação Lateral","Elevação Frontal",
    "Desenvolvimento Arnold","Remada Alta","Face Pull","Crucifixo Invertido",
  ],
  Bíceps: [
    "Rosca Direta com Barra","Rosca Alternada","Rosca Concentrada",
    "Rosca Martelo","Rosca 21","Rosca no Cabo",
  ],
  Tríceps: [
    "Tríceps Corda","Tríceps Testa","Mergulho no Banco",
    "Tríceps Francês","Tríceps no Pulley Alto","Kickback",
  ],
  Core: [
    "Prancha","Crunch Abdominal","Abdominal Bicicleta","Russian Twist",
    "Elevação de Pernas","Abdominal Oblíquo","Hollow Hold",
  ],
};

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  Peito:   <IcChest />,
  Costas:  <IcBack />,
  Pernas:  <IcLegs />,
  Ombros:  <IcShoulder />,
  Bíceps:  <IcArm />,
  Tríceps: <IcArm />,
  Core:    <IcCore />,
};

const CATEGORY_COUNT: Record<string, number> = Object.fromEntries(
  Object.entries(LIBRARY).map(([k, v]) => [k, v.length])
);

/* ─────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────── */
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function makeExercise(name: string, cat: string): Exercise {
  return {
    id: uid(),
    name,
    category: cat,
    notes: "",
    sets: { sets: "3", reps: "10-12", weight: "", rest: "60", tempo: "2-0-2" },
  };
}

function calcDuration(days: WorkoutDay[]): string {
  const active = days.filter(d => !d.isRest);
  const total = active.reduce((acc, d) => acc + d.exercises.length * 4, 0);
  return total > 0 ? `~${total} min` : "—";
}

function calcIntensity(days: WorkoutDay[]): string {
  const count = days.flatMap(d => d.exercises).length;
  if (count === 0) return "—";
  if (count <= 4) return "Leve";
  if (count <= 8) return "Média";
  if (count <= 12) return "Média-Alta";
  return "Alta";
}

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────── */
export default function WorkoutBuilderClient() {
  const [activeDay, setActiveDay] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [planName, setPlanName] = useState("Hipertrofia Split 2.0");
  const [savedMsg, setSavedMsg] = useState(false);
  const [publishedMsg, setPublishedMsg] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const [days, setDays] = useState<WorkoutDay[]>([
    {
      id: uid(), label: "Dia 1: Peito & Tríceps", isRest: false,
      exercises: [
        makeExercise("Supino Reto com Barra", "Peito"),
        makeExercise("Tríceps Corda", "Tríceps"),
      ],
    },
    { id: uid(), label: "Dia 2: Costas & Bíceps", isRest: false, exercises: [] },
    { id: uid(), label: "Dia 3: Descanso",        isRest: true,  exercises: [] },
    { id: uid(), label: "Dia 4: Pernas",          isRest: false, exercises: [] },
  ]);

  const current = days[activeDay];

  /* ── Day operations ── */
  function addDay() {
    const idx = days.length + 1;
    setDays(prev => [
      ...prev,
      { id: uid(), label: `Dia ${idx}: Novo Dia`, isRest: false, exercises: [] },
    ]);
    setActiveDay(days.length);
  }

  function renameDay(val: string) {
    setDays(prev => prev.map((d, i) => i === activeDay ? { ...d, label: val } : d));
  }

  function toggleRest() {
    setDays(prev => prev.map((d, i) =>
      i === activeDay ? { ...d, isRest: !d.isRest, exercises: [] } : d
    ));
  }

  /* ── Exercise operations ── */
  function addExercise(name: string, cat: string) {
    setDays(prev => prev.map((d, i) =>
      i === activeDay
        ? { ...d, exercises: [...d.exercises, makeExercise(name, cat)] }
        : d
    ));
  }

  function removeExercise(exId: string) {
    setDays(prev => prev.map((d, i) =>
      i === activeDay
        ? { ...d, exercises: d.exercises.filter(e => e.id !== exId) }
        : d
    ));
  }

  function updateField(exId: string, field: keyof ExerciseSet, value: string) {
    setDays(prev => prev.map((d, i) =>
      i === activeDay
        ? { ...d, exercises: d.exercises.map(e =>
            e.id === exId ? { ...e, sets: { ...e.sets, [field]: value } } : e
          )}
        : d
    ));
  }

  function updateNotes(exId: string, value: string) {
    setDays(prev => prev.map((d, i) =>
      i === activeDay
        ? { ...d, exercises: d.exercises.map(e =>
            e.id === exId ? { ...e, notes: value } : e
          )}
        : d
    ));
  }

  /* ── Drag reorder ── */
  function moveUp(idx: number) {
    if (idx === 0) return;
    setDays(prev => prev.map((d, di) => {
      if (di !== activeDay) return d;
      const arr = [...d.exercises];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return { ...d, exercises: arr };
    }));
  }

  function moveDown(idx: number) {
    setDays(prev => prev.map((d, di) => {
      if (di !== activeDay) return d;
      if (idx >= d.exercises.length - 1) return d;
      const arr = [...d.exercises];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return { ...d, exercises: arr };
    }));
  }

  /* ── Save / Publish ── */
  function handleSave() {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2200);
  }
  function handlePublish() {
    setPublishedMsg(true);
    setTimeout(() => setPublishedMsg(false), 2200);
  }

  /* ── Library filter ── */
  const filteredLibrary = Object.entries(LIBRARY).reduce<Record<string, string[]>>((acc, [cat, exercises]) => {
    if (activeCategory && cat !== activeCategory) return acc;
    const filtered = exercises.filter(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {});

  /* ── Pro tip ── */
  const tips = [
    { title: "Sobrecarga Progressiva", body: "Incentive o cliente a aumentar gradualmente o peso, frequência ou repetições para continuar vendo evolução muscular." },
    { title: "Tempo de Descanso",      body: "Para hipertrofia, 60–90s de descanso entre séries é o ideal. Para força, 2–3 minutos permitem recuperação completa." },
    { title: "Variação de Exercícios", body: "Trocar exercícios a cada 6–8 semanas evita adaptação e mantém o estímulo muscular elevado." },
  ];
  const tip = tips[activeDay % tips.length];

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* ═══════════════ TOP NAV ═══════════════ */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-7 h-[58px] bg-white border-b border-border-light gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Logo variant="light" size="sm" />
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 min-w-0">
            <span className="text-[13px] font-semibold text-muted">Workout Builder</span>
          </div>
        </div>

        {/* Plan name editable */}
        <div className="flex-1 max-w-xs hidden md:block">
          <input
            value={planName}
            onChange={e => setPlanName(e.target.value)}
            className="w-full text-center text-[14px] font-bold text-dark bg-transparent border-b-2 border-transparent hover:border-border focus:border-blue outline-none transition-colors px-2 py-0.5"
          />
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toast feedback */}
          {(savedMsg || publishedMsg) && (
            <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full animate-fade-up ${
              publishedMsg ? "bg-green-pale text-green" : "bg-blue-pale text-blue"
            }`}>
              {publishedMsg ? "✓ Plano publicado!" : "✓ Rascunho salvo!"}
            </span>
          )}
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-[13px] font-bold text-mid hover:bg-surface hover:border-muted transition-all">
            <IcSave className="w-4 h-4" /> Salvar Rascunho
          </button>
          <button onClick={handlePublish}
            className="btn-gradient flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold rounded-xl">
            <IcPublish className="w-4 h-4" /> Publicar Plano
          </button>
        </div>
      </header>

      {/* ═══════════════ BODY ═══════════════ */}
      <div className="flex flex-1 min-h-0">

        {/* ═══ LEFT: EXERCISE LIBRARY ═══ */}
        <aside className="hidden lg:flex flex-col w-[220px] xl:w-[240px] flex-shrink-0 bg-white border-r border-border-light">
          {/* Library header */}
          <div className="px-4 pt-5 pb-3 border-b border-border-light">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[.07em] mb-3">Biblioteca de Exercícios</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <IcSearch className="w-3.5 h-3.5" />
              </span>
              <input
                type="text" placeholder="Buscar exercícios..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-[12.5px] bg-surface border border-border rounded-xl outline-none focus:border-blue focus:bg-white transition-all placeholder:text-muted"
              />
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-border-light">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                activeCategory === null ? "bg-blue text-white" : "bg-surface text-muted hover:bg-border-light"
              }`}>
              Todos
            </button>
            {Object.keys(LIBRARY).map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                  activeCategory === cat ? "bg-blue text-white" : "bg-surface text-muted hover:bg-border-light"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Category + exercise list */}
          <div className="flex-1 overflow-y-auto py-2">
            {Object.entries(filteredLibrary).map(([cat, exercises]) => (
              <div key={cat}>
                {/* Category row */}
                <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-2 text-muted">
                    <span className="w-4 h-4">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-[11.5px] font-bold text-mid">{cat}</span>
                  </div>
                  <span className="text-[11px] font-bold text-muted bg-surface px-1.5 py-0.5 rounded-md">{exercises.length}</span>
                </div>
                {/* Exercise items */}
                {exercises.map(ex => (
                  <button key={ex} onClick={() => addExercise(ex, cat)}
                    className="w-full text-left px-4 py-2 text-[12.5px] text-mid hover:bg-blue-pale hover:text-blue transition-colors flex items-center justify-between group">
                    <span className="leading-tight">{ex}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue font-bold text-[16px] leading-none">+</span>
                  </button>
                ))}
              </div>
            ))}
            {Object.keys(filteredLibrary).length === 0 && (
              <div className="px-4 py-8 text-center text-[12.5px] text-muted">
                Nenhum exercício encontrado para "{searchQuery}"
              </div>
            )}
          </div>

          {/* Pro Tip */}
          <div className="m-3 p-3.5 rounded-xl bg-blue-pale border border-blue/15">
            <div className="flex items-center gap-2 mb-1.5">
              <IcTip className="w-4 h-4 text-blue flex-shrink-0" />
              <span className="text-[12px] font-bold text-blue">Pro Tip</span>
            </div>
            <p className="text-[11.5px] text-mid leading-relaxed">
              <strong className="font-semibold text-blue">{tip.title}:</strong> {tip.body}
            </p>
          </div>
        </aside>

        {/* ═══ RIGHT: BUILDER CANVAS ═══ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Client bar ── */}
          <div className="flex items-center justify-between px-5 md:px-7 py-3.5 bg-white border-b border-border-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>
                AS
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-[15px] font-bold text-dark">Ana Souza</p>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    Editando Rascunho
                  </span>
                  <span className="text-muted text-[13px]">·</span>
                  <span className="text-[13px] text-muted">{planName}</span>
                </div>
              </div>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-[13px] font-semibold text-mid hover:bg-surface transition-all">
              <IcCalendar className="w-4 h-4" /> Agendar Plano
            </button>
          </div>

          {/* ── Day tabs ── */}
          <div className="flex items-center gap-1 px-5 md:px-7 pt-4 pb-0 overflow-x-auto scrollbar-none border-b border-border-light bg-white">
            {days.map((d, i) => (
              <button key={d.id} onClick={() => setActiveDay(i)}
                className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                  activeDay === i
                    ? "border-blue text-blue bg-blue-pale/40 rounded-t-xl"
                    : "border-transparent text-muted hover:text-mid hover:border-border"
                }`}>
                {d.isRest && <IcRest className="w-3.5 h-3.5 text-muted" />}
                {d.label}
              </button>
            ))}
            <button onClick={addDay}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-semibold text-blue hover:bg-blue-pale rounded-t-xl transition-all -mb-px border-b-2 border-transparent whitespace-nowrap">
              <span className="text-[16px] leading-none font-bold">+</span> Adicionar Dia
            </button>
          </div>

          {/* ── Canvas ── */}
          <div className="flex-1 overflow-y-auto px-5 md:px-7 py-5">

            {/* Day header controls */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <input
                value={current.label}
                onChange={e => renameDay(e.target.value)}
                className="text-[15px] font-bold text-dark bg-transparent border-b-2 border-transparent hover:border-border focus:border-blue outline-none transition-colors px-1 py-0.5 min-w-[160px]"
              />
              <button onClick={toggleRest}
                className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  current.isRest
                    ? "border-muted bg-surface text-muted hover:border-red-300 hover:text-red-500"
                    : "border-border text-muted hover:bg-surface"
                }`}>
                {current.isRest ? "⛔ Dia de Descanso" : "Marcar como Descanso"}
              </button>
            </div>

            {/* Rest state */}
            {current.isRest ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface border-2 border-dashed border-border flex items-center justify-center mb-4">
                  <IcRest className="w-8 h-8 text-muted" />
                </div>
                <p className="text-[15px] font-semibold text-mid mb-1">Dia de descanso</p>
                <p className="text-[13px] text-muted max-w-xs">Recuperação ativa ou repouso total. Nenhum exercício agendado.</p>
              </div>
            ) : (
              <>
                {/* Exercise cards */}
                <div className="space-y-3">
                  {current.exercises.map((ex, idx) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      index={idx}
                      total={current.exercises.length}
                      onRemove={() => removeExercise(ex.id)}
                      onFieldChange={(f, v) => updateField(ex.id, f, v)}
                      onNotesChange={v => updateNotes(ex.id, v)}
                      onMoveUp={() => moveUp(idx)}
                      onMoveDown={() => moveDown(idx)}
                    />
                  ))}
                </div>

                {/* Add exercise button */}
                <button
                  onClick={() => {
                    const cat = Object.keys(LIBRARY)[0];
                    addExercise(LIBRARY[cat][0], cat);
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border-2 border-dashed border-border bg-white hover:border-blue hover:bg-blue-pale/30 hover:text-blue text-muted text-[13.5px] font-semibold transition-all group">
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-[15px] font-bold leading-none group-hover:bg-blue group-hover:text-white group-hover:border-blue transition-all">+</span>
                  Adicionar Novo Exercício
                </button>

                {/* Footer stats */}
                <div className="flex items-center justify-between mt-6 flex-wrap gap-2">
                  <div className="flex items-center gap-5 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                      <IcClock className="w-3.5 h-3.5 text-green" />
                      Duração est.: <strong className="text-mid font-semibold ml-0.5">{calcDuration(days)}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                      <IcFlame className="w-3.5 h-3.5 text-blue" />
                      Intensidade: <strong className="text-mid font-semibold ml-0.5">{calcIntensity(days)}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                      <IcDumbbell className="w-3.5 h-3.5 text-muted" />
                      <strong className="text-mid font-semibold">{current.exercises.length}</strong> exercício{current.exercises.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="text-[12px] text-muted">
                    Última modificação hoje às {new Date().toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" })}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   EXERCISE CARD
───────────────────────────────────────────────────── */
interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  onRemove: () => void;
  onFieldChange: (field: keyof ExerciseSet, value: string) => void;
  onNotesChange: (value: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const FIELDS: { key: keyof ExerciseSet; label: string; placeholder: string; width: string }[] = [
  { key: "sets",   label: "Séries",     placeholder: "3",     width: "w-[13%]" },
  { key: "reps",   label: "Reps",       placeholder: "10-12", width: "w-[17%]" },
  { key: "weight", label: "Peso (kg)",  placeholder: "—",     width: "w-[17%]" },
  { key: "rest",   label: "Descanso (s)",placeholder: "60",   width: "w-[20%]" },
  { key: "tempo",  label: "Tempo",      placeholder: "2-0-2", width: "w-[17%]" },
];

function ExerciseCard({
  exercise, index, total,
  onRemove, onFieldChange, onNotesChange, onMoveUp, onMoveDown,
}: ExerciseCardProps) {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light">
        <div className="flex items-center gap-3">
          {/* Drag handle / reorder */}
          <div className="flex flex-col gap-1 cursor-grab active:cursor-grabbing text-border hover:text-muted transition-colors">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-current" />
              <div className="w-1 h-1 rounded-full bg-current" />
            </div>
          </div>

          {/* Category icon */}
          <div className="w-8 h-8 rounded-lg bg-blue-pale flex items-center justify-center text-blue flex-shrink-0">
            <IcDumbbell className="w-4 h-4" />
          </div>

          {/* Editable name */}
          <input
            value={exercise.name}
            onChange={e => onFieldChange("sets", e.target.value)} // we'll override to name
            className="text-[14.5px] font-bold text-dark bg-transparent outline-none border-b border-transparent hover:border-border focus:border-blue transition-colors min-w-[160px]"
            readOnly
          />
          <span className="text-[11px] text-muted bg-surface px-2 py-0.5 rounded-full border border-border-light hidden sm:inline">
            {exercise.category}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Move up/down */}
          <button onClick={onMoveUp} disabled={index === 0}
            className="p-1.5 rounded-lg text-muted hover:text-blue hover:bg-blue-pale transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <IcChevronUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="p-1.5 rounded-lg text-muted hover:text-blue hover:bg-blue-pale transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <IcChevronDown className="w-3.5 h-3.5" />
          </button>
          {/* Notes toggle */}
          <button onClick={() => setShowNotes(v => !v)}
            className={`p-1.5 rounded-lg transition-all text-[11px] font-semibold ${
              showNotes ? "bg-blue-pale text-blue" : "text-muted hover:text-blue hover:bg-blue-pale"
            }`}>
            <IcNote className="w-3.5 h-3.5" />
          </button>
          {/* Remove */}
          <button onClick={onRemove}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
            <IcTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Set fields */}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3 flex-wrap">
          {FIELDS.map(f => (
            <div key={f.key} className={`${f.width} min-w-[80px] flex-1`}>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-[.06em] mb-1.5">{f.label}</label>
              <input
                type="text"
                value={exercise.sets[f.key]}
                onChange={e => onFieldChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 text-[13.5px] font-semibold text-dark bg-surface border border-border rounded-xl outline-none focus:border-blue focus:bg-white transition-all text-center"
              />
            </div>
          ))}
        </div>

        {/* Notes area */}
        {showNotes && (
          <div className="mt-3 animate-fade-up">
            <textarea
              value={exercise.notes}
              onChange={e => onNotesChange(e.target.value)}
              placeholder="Observações para o cliente (ex: controle a descida, foco na contração)..."
              rows={2}
              className="w-full px-3 py-2.5 text-[12.5px] text-mid bg-surface border border-border rounded-xl outline-none focus:border-blue focus:bg-white transition-all resize-none placeholder:text-muted"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────── */
function IcSearch({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>;
}
function IcSave({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>;
}
function IcPublish({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>;
}
function IcCalendar({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>;
}
function IcDumbbell({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M6.5 6.5h11M6.5 17.5h11M4 10h2v4H4zM18 10h2v4h-2z"/>
    <rect x="6" y="8" width="12" height="8" rx="2"/>
  </svg>;
}
function IcTrash({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>;
}
function IcChevronUp({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="18 15 12 9 6 15"/>
  </svg>;
}
function IcChevronDown({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>;
}
function IcNote({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>
  </svg>;
}
function IcRest({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>;
}
function IcTip({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>;
}
function IcClock({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>;
}
function IcFlame({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>;
}
function IcChest({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>;
}
function IcBack({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>;
}
function IcLegs({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M8 2v20M16 2v20M5 12h14"/>
  </svg>;
}
function IcShoulder({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>;
}
function IcArm({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>;
}
function IcCore({ className = "w-4 h-4" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>;
}
