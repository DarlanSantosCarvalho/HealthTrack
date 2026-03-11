"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { IconArrowRight, IconCheck } from "@/components/icons";

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
type PrimaryGoal = "build-muscle" | "lose-weight" | "improve-endurance" | "better-nutrition";
type ActivityLevel = "sedentary" | "moderately-active" | "highly-active";
type ConnectedApp = "strava";

interface OnboardingState {
  primaryGoal: PrimaryGoal | null;
  activityLevel: ActivityLevel | null;
  connectedApps: ConnectedApp[];
}

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const GOALS: { id: PrimaryGoal; label: string; description: string; icon: JSX.Element }[] = [
  {
    id: "build-muscle",
    label: "Ganhar Massa",
    description: "Aumentar força e hipertrofia.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M6.5 6.5h11M6.5 17.5h11M4 10h2v4H4zM18 10h2v4h-2zM6.5 10v4M17.5 10v4" />
        <rect x="6" y="8" width="12" height="8" rx="2" />
      </svg>
    ),
  },
  {
    id: "lose-weight",
    label: "Emagrecer",
    description: "Reduzir gordura e melhorar composição corporal.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    id: "improve-endurance",
    label: "Melhorar Resistência",
    description: "Melhor stamina e saúde cardiovascular.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "better-nutrition",
    label: "Nutrição Melhor",
    description: "Otimizar alimentação e hábitos nutricionais.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
        <path d="M12 6c-1.5 2-2 4-2 6s.5 4 2 6" />
        <path d="M12 6c1.5 2 2 4 2 6s-.5 4-2 6" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
];

const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; description: string; icon: JSX.Element }[] = [
  {
    id: "sedentary",
    label: "Sedentário",
    description: "Pouco ou nenhum exercício; trabalho de escritório.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <line x1="12" y1="14" x2="12" y2="20" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    id: "moderately-active",
    label: "Moderadamente Ativo",
    description: "Exercício 3–4x por semana, rotina diária ativa.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
        <path d="M12 7v5l3 3M9 9l-2 4M15 9l2 4M9 20l3-4 3 4" />
      </svg>
    ),
  },
  {
    id: "highly-active",
    label: "Muito Ativo",
    description: "Treino intenso na maioria dos dias; trabalho físico.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

interface AppInfo {
  id: ConnectedApp;
  label: string;
  description: string;
  icon: JSX.Element;
}

const APPS: (AppInfo | { id: "coming-soon"; label: string; description: string; icon: JSX.Element })[] = [

  {
    id: "strava" as ConnectedApp,
    label: "Strava",
    description: "Registre corrida, ciclismo e natação diretamente do Strava.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#FC4C02" />
        <path d="M10 17l3-6 3 6M13 11l2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "garmin" as ConnectedApp,
    label: "Garmin",
    description: "Sincronize métricas avançadas de treino e dados de recuperação.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#007DC5" />
        <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="sans-serif">GARMIN</text>
      </svg>
    ),
  },
  {
    id: "coming-soon",
    label: "Mais apps em breve",
    description: "",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function OnboardingClient() {
  const [step, setStep] = useState(0); // 0, 1, 2
  const [done, setDone] = useState(false);
  const [state, setState] = useState<OnboardingState>({
    primaryGoal: null,
    activityLevel: null,
    connectedApps: [],
  });

  // Mock user name (would come from auth context)
  const userName = "Alex";

  function toggleApp(appId: ConnectedApp) {
    setState(prev => ({
      ...prev,
      connectedApps: prev.connectedApps.includes(appId)
        ? prev.connectedApps.filter(a => a !== appId)
        : [...prev.connectedApps, appId],
    }));
  }

  function handleFinish() {
    setDone(true);
  }

  if (done) {
    return <SuccessScreen name={userName} />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ── TOP NAV ── */}
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-border-light">
        <Logo variant="light" size="md" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-muted uppercase tracking-[.06em]">
              Etapa {step + 1} de 3
            </p>
            <p className="text-[13px] font-semibold text-blue">Onboarding</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>
            {userName[0]}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="flex-1 flex flex-col items-center px-5 py-10 md:py-14">
        <div className="w-full max-w-3xl">

          {/* Step 1: Goals & Activity */}
          {step === 0 && (
            <StepGoals
              name={userName}
              primaryGoal={state.primaryGoal}
              activityLevel={state.activityLevel}
              onGoalSelect={g => setState(p => ({ ...p, primaryGoal: g }))}
              onActivitySelect={a => setState(p => ({ ...p, activityLevel: a }))}
              onNext={() => setStep(1)}
              onSkip={() => setStep(1)}
            />
          )}

          {/* Step 2: Connect apps */}
          {step === 1 && (
            <StepApps
              connectedApps={state.connectedApps}
              onToggleApp={toggleApp}
              onNext={() => setStep(2)}
              onSkip={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}

          {/* Step 3: Notifications */}
          {step === 2 && (
            <StepNotifications
              onFinish={handleFinish}
              onSkip={handleFinish}
              onBack={() => setStep(1)}
            />
          )}

        </div>
      </main>

      <footer className="text-center py-5 text-[11.5px] text-muted border-t border-border-light bg-white">
        © 2026 HealthTrack Inc. Todos os direitos reservados.
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STEP 1 — GOALS & ACTIVITY
───────────────────────────────────────────────────────── */
function StepGoals({
  name, primaryGoal, activityLevel,
  onGoalSelect, onActivitySelect, onNext, onSkip,
}: {
  name: string;
  primaryGoal: PrimaryGoal | null;
  activityLevel: ActivityLevel | null;
  onGoalSelect: (g: PrimaryGoal) => void;
  onActivitySelect: (a: ActivityLevel) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="animate-fade-up">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="font-display text-[34px] md:text-[40px] text-dark tracking-tight leading-tight mb-3">
          Bem-vindo à sua jornada,{" "}
          <span style={{ background: "linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {name}
          </span>!
        </h1>
        <p className="text-[15px] text-muted font-light leading-relaxed max-w-xl">
          Estamos animados para ajudá-lo a se transformar. Vamos começar personalizando sua experiência com algumas perguntas rápidas.
        </p>
      </div>

      {/* Goals */}
      <section className="mb-10">
        <SectionLabel
          icon={
            <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
          }
          label="Qual é seu objetivo principal?"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {GOALS.map(goal => {
            const selected = primaryGoal === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => onGoalSelect(goal.id)}
                className={`group relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${selected
                    ? "border-green bg-green-pale shadow-md"
                    : "border-border bg-white hover:border-green/50 hover:shadow-sm"
                  }`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors ${selected ? "bg-green text-white" : "bg-surface text-muted group-hover:bg-green-pale group-hover:text-green"
                  }`}>
                  {goal.icon}
                </div>
                <p className={`text-[14px] font-bold leading-tight mb-1.5 ${selected ? "text-green" : "text-dark"}`}>
                  {goal.label}
                </p>
                <p className="text-[12px] text-muted leading-snug font-light">
                  {goal.description}
                </p>
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green flex items-center justify-center">
                    <IconCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Activity level */}
      <section className="mb-10">
        <SectionLabel
          icon={
            <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" fill="currentColor" stroke="none" />
              <path d="M12 7v5l3 3M9 9l-2 4M15 9l2 4M9 20l3-4 3 4" />
            </svg>
          }
          label="Nível de atividade atual"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {ACTIVITY_LEVELS.map(lvl => {
            const selected = activityLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onActivitySelect(lvl.id)}
                className={`group relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${selected
                    ? "border-green bg-green-pale shadow-md"
                    : "border-border bg-white hover:border-green/50 hover:shadow-sm"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${selected ? "bg-green text-white" : "bg-surface text-muted group-hover:bg-green-pale group-hover:text-green"
                  }`}>
                  {lvl.icon}
                </div>
                <p className={`text-[14px] font-bold mb-1 ${selected ? "text-green" : "text-dark"}`}>{lvl.label}</p>
                <p className="text-[12px] text-muted leading-snug font-light">{lvl.description}</p>
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green flex items-center justify-center">
                    <IconCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Nav */}
      <StepFooter
        onSkip={onSkip}
        onNext={onNext}
        nextDisabled={!primaryGoal || !activityLevel}
        nextLabel="Próxima seção"
        step={0}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STEP 2 — CONNECT APPS
───────────────────────────────────────────────────────── */
function StepApps({
  connectedApps, onToggleApp, onNext, onSkip, onBack,
}: {
  connectedApps: ConnectedApp[];
  onToggleApp: (a: ConnectedApp) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-muted hover:text-blue text-[13px] font-medium flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </button>
        <button onClick={onSkip} className="text-[13px] text-muted hover:text-dark transition-colors">
          Pular por agora
        </button>
      </div>

      <div className="mb-10 mt-6">
        <h1 className="font-display text-[34px] md:text-[40px] text-dark tracking-tight leading-tight mb-3">
          Conecte seus <span style={{ background: "linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>dados de saúde</span>
        </h1>
        <p className="text-[15px] text-muted font-light leading-relaxed max-w-xl">
          Sincronize seus apps e dispositivos favoritos para dar ao seu profissional uma visão completa do seu progresso.
        </p>
      </div>

      {/* Apps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {APPS.map(app => {
          if (app.id === "coming-soon") {
            return (
              <div key="coming-soon"
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border bg-white min-h-[180px]">
                <div className="text-muted mb-3">{app.icon}</div>
                <p className="text-[13px] font-medium text-muted text-center">{app.label}</p>
              </div>
            );
          }

          const isConnected = connectedApps.includes(app.id as ConnectedApp);
          return (
            <div key={app.id}
              className={`relative flex flex-col p-5 rounded-2xl border-2 transition-all duration-200 ${isConnected
                  ? "border-green bg-green-pale shadow-md"
                  : "border-border bg-white hover:border-green/40 hover:shadow-sm"
                }`}
            >
              {/* Status badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConnected ? "bg-white/60" : "bg-surface"}`}>
                  {app.icon}
                </div>
                {isConnected ? (
                  <span className="text-[11px] font-bold text-green bg-green-mid px-2.5 py-1 rounded-full flex items-center gap-1">
                    <IconCheck className="w-3 h-3" /> Conectado
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-muted bg-surface px-2.5 py-1 rounded-full border border-border">
                    Não sincronizado
                  </span>
                )}
                {isConnected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green flex items-center justify-center shadow-sm">
                    <IconCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              <h3 className={`text-[14.5px] font-bold mb-1.5 ${isConnected ? "text-green" : "text-dark"}`}>
                {app.label}
              </h3>
              <p className="text-[12px] text-muted leading-snug font-light flex-1 mb-4">
                {app.description}
              </p>

              {/* Action button */}
              {isConnected ? (
                <button onClick={() => onToggleApp(app.id as ConnectedApp)}
                  className="w-full py-2.5 rounded-xl bg-white border border-border text-[13px] font-semibold text-mid hover:bg-surface hover:border-muted transition-all">
                  Desconectar
                </button>
              ) : (
                <button onClick={() => onToggleApp(app.id as ConnectedApp)}
                  className="btn-gradient w-full flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold rounded-xl">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Conectar
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className={`rounded-full transition-all duration-300 ${i === 1 ? "w-6 h-2.5 bg-green" : "w-2.5 h-2.5 bg-border"
            }`} />
        ))}
      </div>

      <StepFooter
        onSkip={onSkip}
        onNext={onNext}
        nextDisabled={false}
        nextLabel="Próxima seção"
        step={1}
        hideSkip
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STEP 3 — NOTIFICATIONS
───────────────────────────────────────────────────────── */
type NotifPref = "daily-plan" | "progress-updates" | "coach-messages" | "ai-suggestions";

const NOTIF_OPTIONS: { id: NotifPref; label: string; desc: string; icon: JSX.Element; defaultOn: boolean }[] = [
  {
    id: "daily-plan",
    label: "Plano do dia",
    desc: "Receba lembretes diários da sua dieta e treino programados.",
    defaultOn: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: "progress-updates",
    label: "Atualizações de evolução",
    desc: "Resumo semanal das suas métricas e conquistas.",
    defaultOn: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: "coach-messages",
    label: "Mensagens do profissional",
    desc: "Alertas quando seu nutricionista ou personal enviar uma atualização.",
    defaultOn: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "ai-suggestions",
    label: "Sugestões da IA",
    desc: "Dicas personalizadas do assistente com base no seu histórico.",
    defaultOn: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

function StepNotifications({ onFinish, onSkip, onBack }: {
  onFinish: () => void; onSkip: () => void; onBack: () => void;
}) {
  const [enabled, setEnabled] = useState<Record<NotifPref, boolean>>(
    Object.fromEntries(NOTIF_OPTIONS.map(o => [o.id, o.defaultOn])) as Record<NotifPref, boolean>
  );

  function toggle(id: NotifPref) {
    setEnabled(p => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-1">
        <button onClick={onBack} className="text-muted hover:text-blue text-[13px] font-medium flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </button>
        <button onClick={onSkip} className="text-[13px] text-muted hover:text-dark transition-colors">
          Pular por agora
        </button>
      </div>

      <div className="mb-10 mt-6">
        <h1 className="font-display text-[34px] md:text-[40px] text-dark tracking-tight leading-tight mb-3">
          Fique em <span style={{ background: "linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>sintonia</span> com sua evolução
        </h1>
        <p className="text-[15px] text-muted font-light leading-relaxed max-w-xl">
          Configure quais notificações você quer receber. Você pode alterar isso a qualquer momento nas configurações.
        </p>
      </div>

      <div className="space-y-3 mb-10 max-w-2xl">
        {NOTIF_OPTIONS.map(opt => (
          <div key={opt.id}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${enabled[opt.id]
                ? "border-green bg-green-pale"
                : "border-border bg-white"
              }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${enabled[opt.id] ? "bg-green text-white" : "bg-surface text-muted"
              }`}>
              {opt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[14px] font-bold ${enabled[opt.id] ? "text-green" : "text-dark"}`}>{opt.label}</p>
              <p className="text-[12.5px] text-muted font-light leading-snug mt-0.5">{opt.desc}</p>
            </div>
            {/* Toggle switch */}
            <button
              type="button"
              onClick={() => toggle(opt.id)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${enabled[opt.id] ? "bg-green" : "bg-border"
                }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${enabled[opt.id] ? "translate-x-5" : "translate-x-0.5"
                }`} />
            </button>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <div key={i} className={`rounded-full transition-all duration-300 ${i === 2 ? "w-6 h-2.5 bg-green" : "w-2.5 h-2.5 bg-border"
            }`} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onSkip} className="text-[14px] text-muted hover:text-dark transition-colors font-medium">
          Pular por agora
        </button>
        <button onClick={onFinish}
          className="btn-gradient flex items-center gap-2 px-8 py-3.5 text-[14px] font-bold rounded-xl">
          Concluir configuração <IconArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SUCCESS SCREEN
───────────────────────────────────────────────────────── */
function SuccessScreen({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b border-border-light">
        <Logo variant="light" size="md" />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">
        {/* Animated checkmark */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center animate-fade-up"
            style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)", boxShadow: "0 12px 40px rgba(73,132,103,.35)" }}>
            <IconCheck className="w-11 h-11 text-white" />
          </div>
          {/* Orbit rings */}
          <div className="absolute inset-0 rounded-full border-2 border-green/20 scale-[1.3] animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        <div className="animate-fade-up-delay">
          <h1 className="font-display text-[38px] md:text-[44px] text-dark tracking-tight mb-3">
            Tudo pronto, <span style={{ background: "linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{name}</span>!
          </h1>
          <p className="text-[15px] text-muted font-light leading-relaxed max-w-md mb-10 mx-auto">
            Seu perfil está configurado. Agora é só aguardar seu profissional ativar seu plano e começar a acompanhar sua evolução.
          </p>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
            {[
              { icon: "🎯", label: "Objetivos definidos" },
              { icon: "🔗", label: "Apps prontos para conectar" },
              { icon: "🔔", label: "Notificações configuradas" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white border border-border-light rounded-xl px-4 py-3 text-[13px] font-medium text-mid">
                <span className="text-lg">{item.icon}</span>{item.label}
              </div>
            ))}
          </div>

          <Link href="/login"
            className="btn-gradient inline-flex items-center gap-2 px-10 py-4 text-[15px] font-bold rounded-xl">
            Ir para o dashboard <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────────────────────── */
function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <h2 className="text-[16px] font-bold text-dark">{label}</h2>
    </div>
  );
}

function StepFooter({
  onSkip, onNext, nextDisabled, nextLabel, step, hideSkip,
}: {
  onSkip: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  nextLabel: string;
  step: number;
  hideSkip?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {!hideSkip ? (
        <button onClick={onSkip}
          className="text-[14px] text-muted hover:text-dark transition-colors font-medium">
          Pular por agora
        </button>
      ) : <div />}

      <div className="flex items-center gap-5">
        {/* Dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className={`rounded-full transition-all duration-300 ${i === step ? "w-5 h-2 bg-green" : i < step ? "w-2 h-2 bg-green-mid" : "w-2 h-2 bg-border"
              }`} />
          ))}
        </div>

        <button onClick={onNext} disabled={nextDisabled}
          className="btn-gradient flex items-center gap-2 px-7 py-3.5 text-[14px] font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0">
          {nextLabel} <IconArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
