"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import {
  IconMail, IconLock, IconUser, IconCalendar, IconPhone,
  IconArrowRight, IconArrowLeft, IconCheck,
  IconTarget, IconHeart, IconZap, IconTrendingUp, IconRuler,
  IconGoogle, IconApple,
} from "@/components/icons";
import { getPasswordStrength } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────── */
type Goal = "emagrecer" | "ganhar-massa" | "saude" | "performance" | "reabilitacao" | "estilo-vida";
type ActivityLevel = "sedentario" | "leve" | "moderado" | "ativo" | "muito-ativo";
type Sex = "masculino" | "feminino" | "outro" | "prefiro-nao-dizer";

interface Form {
  // Step 1 — Account
  name: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
  // Step 2 — Profile
  birthDate: string;
  sex: Sex | "";
  height: string;
  weight: string;
  // Step 3 — Goals
  goals: Goal[];
  activityLevel: ActivityLevel | "";
  inviteCode: string;
}

/* ── Constants ──────────────────────────────────────── */
const GOALS: { id: Goal; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "emagrecer",     label: "Emagrecer",         icon: <IconTrendingUp />, desc: "Reduzir peso com saúde" },
  { id: "ganhar-massa",  label: "Ganhar massa",       icon: <IconZap />,        desc: "Hipertrofia e força" },
  { id: "saude",         label: "Saúde geral",        icon: <IconHeart />,      desc: "Qualidade de vida" },
  { id: "performance",   label: "Performance",        icon: <IconTarget />,     desc: "Esporte e competição" },
  { id: "reabilitacao",  label: "Reabilitação",       icon: <IconRuler />,      desc: "Recuperação funcional" },
  { id: "estilo-vida",   label: "Estilo de vida",     icon: <IconUser />,       desc: "Hábitos sustentáveis" },
];

const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; sub: string }[] = [
  { id: "sedentario",   label: "Sedentário",       sub: "Pouco ou nenhum exercício" },
  { id: "leve",         label: "Levemente ativo",  sub: "Exercício 1–2x por semana" },
  { id: "moderado",     label: "Moderadamente ativo", sub: "Exercício 3–4x por semana" },
  { id: "ativo",        label: "Muito ativo",      sub: "Exercício 5–6x por semana" },
  { id: "muito-ativo",  label: "Extremamente ativo", sub: "Treino diário ou profissional" },
];

const pwLabels = ["","Muito fraca","Fraca","Média","Forte"] as const;
const pwBarColors = ["","bg-red-400","bg-red-400","bg-amber-400","bg-green"] as const;
const pwTextColors = ["text-muted","text-red-400","text-red-400","text-amber-500","text-green"] as const;

/* ── Shared helpers ─────────────────────────────────── */
function Field({ label, children, optional }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11.5px] font-bold text-mid uppercase tracking-[.04em]">{label}</span>
        {optional && <span className="text-[10px] font-medium text-muted bg-surface px-2 py-0.5 rounded-full border border-border">Opcional</span>}
      </div>
      {children}
    </div>
  );
}

function InputIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none flex">{icon}</span>
      {children}
    </div>
  );
}

/* ── Step progress pill ─────────────────────────────── */
function StepPill({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
          i < current ? "bg-green w-6" : i === current ? "bg-blue w-8" : "bg-border w-3"
        }`} />
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */
export default function ClienteClient() {
  const [step, setStep] = useState(0); // 0, 1, 2
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<Form>({
    name: "", email: "", phone: "", password: "", terms: false,
    birthDate: "", sex: "", height: "", weight: "",
    goals: [], activityLevel: "", inviteCode: "",
  });

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleGoal(goal: Goal) {
    set("goals", form.goals.includes(goal)
      ? form.goals.filter(g => g !== goal)
      : [...form.goals, goal]
    );
  }

  const pwStrength = getPasswordStrength(form.password);

  function handleNext() {
    if (step < 2) setStep(s => s + 1);
  }
  function handleBack() {
    if (step > 0) setStep(s => s - 1);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-fade-up"
            style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)", boxShadow: "0 8px 32px rgba(73,132,103,.3)" }}>
            <IconCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display text-[36px] text-dark tracking-tight mb-3 animate-fade-up-delay">
            Conta criada com sucesso!
          </h1>
          <p className="text-base text-muted leading-relaxed max-w-sm mb-8 font-light animate-fade-up-delay-2">
            Bem-vindo ao HealthTrack, <strong className="text-dark font-semibold">{form.name.split(" ")[0]}</strong>! Aguarde seu profissional te convidar para começar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-delay-2">
            <Link href="/login"
              className="btn-gradient flex items-center gap-2 px-8 py-3.5 text-[15px] font-bold rounded-xl">
              Entrar na plataforma <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Checklist */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg animate-fade-up-delay-2">
            {[
              { icon: <IconMail className="w-4 h-4" />, text: "E-mail de boas-vindas enviado" },
              { icon: <IconHeart className="w-4 h-4" />, text: "Perfil configurado" },
              { icon: <IconTarget className="w-4 h-4" />, text: `${form.goals.length} objetivos registrados` },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white border border-border-light rounded-xl px-4 py-3 text-[13px] font-medium text-mid">
                <span className="text-green">{item.icon}</span>{item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ["Criar conta", "Seu perfil", "Seus objetivos"];
  const stepSubs = [
    "Primeiro, crie seu acesso à plataforma.",
    "Nos diga um pouco sobre você.",
    "O que você quer conquistar?",
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Nav />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px]">

        {/* ── LEFT: Motivational panel ───────────────── */}
        <MotivationalPanel step={step} goals={form.goals} />

        {/* ── RIGHT: Form panel ─────────────────────── */}
        <div className="flex flex-col bg-white border-l border-border-light">

          {/* Top progress bar */}
          <div className="px-8 pt-8 pb-6 border-b border-border-light">
            <div className="flex items-center justify-between mb-4">
              <StepPill current={step} total={3} />
              <span className="text-[12px] font-semibold text-muted">
                {step + 1} de 3
              </span>
            </div>
            <h2 className="font-display text-[26px] text-dark tracking-tight leading-tight mb-1">
              {stepTitles[step]}
            </h2>
            <p className="text-[13.5px] text-muted font-light">{stepSubs[step]}</p>
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form onSubmit={handleSubmit}>

              {/* ════ STEP 0: ACCOUNT ════ */}
              {step === 0 && (
                <div className="space-y-5 animate-fade-up">
                  {/* OAuth quick signup */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6">
                    {[
                      { icon: <IconGoogle />, label: "Google" },
                      { icon: <IconApple />, label: "Apple" },
                    ].map(btn => (
                      <button key={btn.label} type="button"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-[1.5px] border-border rounded-xl text-[13px] font-semibold text-dark hover:border-muted hover:bg-surface hover:-translate-y-0.5 transition-all">
                        {btn.icon}{btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11.5px] font-semibold text-muted uppercase tracking-[.04em]">ou com e-mail</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <Field label="Nome Completo">
                    <InputIcon icon={<IconUser />}>
                      <input type="text" placeholder="Seu nome completo"
                        value={form.name} onChange={e => set("name", e.target.value)}
                        className="input-base" autoComplete="name" />
                    </InputIcon>
                  </Field>

                  <Field label="E-mail">
                    <InputIcon icon={<IconMail />}>
                      <input type="email" placeholder="seu@email.com.br"
                        value={form.email} onChange={e => set("email", e.target.value)}
                        className="input-base" autoComplete="email" />
                    </InputIcon>
                  </Field>

                  <Field label="Celular" optional>
                    <InputIcon icon={<IconPhone />}>
                      <input type="tel" placeholder="(11) 9 9999-9999"
                        value={form.phone} onChange={e => set("phone", e.target.value)}
                        className="input-base" autoComplete="tel" />
                    </InputIcon>
                  </Field>

                  <Field label="Senha">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none flex">
                        <IconLock />
                      </span>
                      <input type={showPw ? "text" : "password"} placeholder="Mínimo 8 caracteres"
                        value={form.password} onChange={e => set("password", e.target.value)}
                        className="input-base pr-11" autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-blue transition-colors p-1 rounded">
                        {showPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="flex items-center gap-1 mt-2">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${i <= pwStrength ? pwBarColors[pwStrength] : "bg-border"}`} />
                        ))}
                        <span className={`text-[11px] font-semibold ml-1.5 min-w-[56px] ${pwTextColors[pwStrength]}`}>
                          {pwLabels[pwStrength]}
                        </span>
                      </div>
                    )}
                  </Field>

                  {/* Invite code */}
                  <Field label="Código de convite" optional>
                    <InputIcon icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                      </svg>
                    }>
                      <input type="text" placeholder="Código do seu profissional"
                        value={form.inviteCode} onChange={e => set("inviteCode", e.target.value.toUpperCase())}
                        className="input-base font-mono tracking-widest uppercase" maxLength={8} />
                    </InputIcon>
                    <p className="text-[11.5px] text-muted mt-1.5">Recebeu um código de um nutricionista ou personal? Insira aqui para ser vinculado automaticamente.</p>
                  </Field>

                  {/* Terms */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border-[1.5px] cursor-pointer transition-colors ${
                    form.terms ? "border-green bg-green-pale/40" : "border-border bg-surface hover:border-blue"
                  }`}>
                    <input type="checkbox" checked={form.terms} onChange={e => set("terms", e.target.checked)}
                      className="w-4 h-4 mt-0.5 flex-shrink-0 accent-green cursor-pointer rounded" />
                    <span className="text-[12.5px] text-mid leading-relaxed">
                      Concordo com os{" "}
                      <a href="#" className="text-blue font-semibold hover:underline" onClick={e => e.stopPropagation()}>Termos de Uso</a>
                      {" "}e{" "}
                      <a href="#" className="text-blue font-semibold hover:underline" onClick={e => e.stopPropagation()}>Política de Privacidade</a>.
                    </span>
                  </label>
                </div>
              )}

              {/* ════ STEP 1: PROFILE ════ */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-up">
                  {/* Avatar picker */}
                  <div className="flex flex-col items-center py-4 mb-2">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 relative cursor-pointer group"
                      style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>
                      <span className="text-3xl font-bold text-white">
                        {form.name ? form.name[0].toUpperCase() : "?"}
                      </span>
                      <div className="absolute inset-0 rounded-full bg-dark/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-[12px] text-muted">Foto de perfil (opcional)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Data de nascimento">
                      <InputIcon icon={<IconCalendar />}>
                        <input type="date" value={form.birthDate}
                          onChange={e => set("birthDate", e.target.value)}
                          className="input-base" />
                      </InputIcon>
                    </Field>

                    <Field label="Sexo biológico">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none flex">
                          <IconUser />
                        </span>
                        <select value={form.sex} onChange={e => set("sex", e.target.value as Sex)}
                          className="input-base pr-8 cursor-pointer appearance-none">
                          <option value="" disabled>Selecionar</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
                          <option value="prefiro-nao-dizer">Prefiro não dizer</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted" />
                      </div>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Altura (cm)">
                      <InputIcon icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M12 22V2"/><path d="M17 7l-5-5-5 5"/><path d="M17 17l-5 5-5-5"/>
                        </svg>
                      }>
                        <input type="number" placeholder="170" min="100" max="250"
                          value={form.height} onChange={e => set("height", e.target.value)}
                          className="input-base" />
                      </InputIcon>
                    </Field>

                    <Field label="Peso (kg)">
                      <InputIcon icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 8v4"/><path d="M12 16h.01"/>
                        </svg>
                      }>
                        <input type="number" placeholder="70" min="30" max="300" step="0.1"
                          value={form.weight} onChange={e => set("weight", e.target.value)}
                          className="input-base" />
                      </InputIcon>
                    </Field>
                  </div>

                  {/* BMI preview */}
                  {form.height && form.weight && (
                    <BmiCard height={Number(form.height)} weight={Number(form.weight)} />
                  )}

                  <InfoCard
                    icon={<IconHeart className="w-4 h-4 text-white" />}
                    title="Por que pedimos isso?"
                    text="Altura, peso e data de nascimento ajudam seu profissional a calcular métricas como IMC, TMB e necessidades calóricas com precisão."
                  />
                </div>
              )}

              {/* ════ STEP 2: GOALS ════ */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-up">

                  {/* Goals grid */}
                  <div>
                    <p className="text-[11.5px] font-bold text-mid uppercase tracking-[.04em] mb-3">
                      Objetivos <span className="text-[10px] font-medium text-muted normal-case tracking-normal ml-1">(selecione quantos quiser)</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {GOALS.map(goal => {
                        const selected = form.goals.includes(goal.id);
                        return (
                          <button key={goal.id} type="button" onClick={() => toggleGoal(goal.id)}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border-[1.5px] text-left transition-all duration-200 cursor-pointer ${
                              selected
                                ? "border-blue bg-blue-pale"
                                : "border-border bg-white hover:border-blue/40 hover:bg-blue-pale/30"
                            }`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                              selected ? "bg-blue text-white" : "bg-surface text-muted"
                            }`}>
                              {goal.icon}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-[13px] font-semibold leading-tight ${selected ? "text-blue" : "text-dark"}`}>{goal.label}</p>
                              <p className="text-[11px] text-muted mt-0.5 leading-snug">{goal.desc}</p>
                            </div>
                            {selected && (
                              <div className="ml-auto flex-shrink-0 w-4 h-4 rounded-full bg-blue flex items-center justify-center">
                                <IconCheck className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity level */}
                  <div>
                    <p className="text-[11.5px] font-bold text-mid uppercase tracking-[.04em] mb-3">Nível de atividade atual</p>
                    <div className="space-y-2">
                      {ACTIVITY_LEVELS.map(lvl => {
                        const selected = form.activityLevel === lvl.id;
                        return (
                          <button key={lvl.id} type="button"
                            onClick={() => set("activityLevel", lvl.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-[1.5px] text-left transition-all duration-150 cursor-pointer ${
                              selected
                                ? "border-green bg-green-pale"
                                : "border-border bg-white hover:border-green/40"
                            }`}>
                            <div>
                              <p className={`text-[13.5px] font-semibold ${selected ? "text-green" : "text-dark"}`}>{lvl.label}</p>
                              <p className="text-[11.5px] text-muted">{lvl.sub}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              selected ? "border-green bg-green" : "border-border"
                            }`}>
                              {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <InfoCard
                    icon={<IconTarget className="w-4 h-4 text-white" />}
                    title="Personalização com IA"
                    text="Seus objetivos e nível de atividade alimentam o assistente IA para sugerir substituições alimentares e variações de treino mais alinhadas com suas metas."
                  />
                </div>
              )}

            </form>
          </div>

          {/* Bottom navigation */}
          <div className="px-8 pb-8 pt-4 border-t border-border-light bg-white">
            <div className="flex gap-3">
              {step > 0 && (
                <button type="button" onClick={handleBack}
                  className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl border-[1.5px] border-border text-[13.5px] font-semibold text-mid hover:border-muted hover:bg-surface transition-all">
                  <IconArrowLeft className="w-4 h-4" /> Voltar
                </button>
              )}

              {step < 2 ? (
                <button type="button" onClick={handleNext}
                  disabled={step === 0 && (!form.name || !form.email || !form.password || !form.terms)}
                  className="btn-gradient flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
                  {step === 0 ? "Continuar" : "Próximo"} <IconArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" onClick={handleSubmit}
                  disabled={loading || form.goals.length === 0 || !form.activityLevel}
                  className="btn-gradient flex-1 flex items-center justify-center gap-2 py-3.5 text-[14px] font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>Criando conta...</>
                  ) : (
                    <>Criar minha conta <IconArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>

            {step === 0 && (
              <p className="text-center mt-4 text-[12.5px] text-muted">
                Já tem conta?{" "}
                <Link href="/login" className="text-blue font-semibold hover:underline">Entrar</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Motivational panel ─────────────────────────────── */
function MotivationalPanel({ step, goals }: { step: number; goals: Goal[] }) {
  const panels = [
    {
      eyebrow: "Comece grátis",
      title: <>Sua jornada começa<br />com um <em className="not-italic" style={{ background:"linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>único passo</em></>,
      sub: "Crie sua conta em menos de 2 minutos e conecte-se a profissionais de saúde que vão transformar seus resultados.",
      highlights: [
        { icon: <IconHeart className="w-4 h-4" />, label: "Acompanhamento personalizado" },
        { icon: <IconTarget className="w-4 h-4" />, label: "Metas claras e mensuráveis" },
        { icon: <IconZap className="w-4 h-4" />, label: "Assistente IA disponível 24h" },
      ],
    },
    {
      eyebrow: "Perfil completo",
      title: <>Quanto mais<br />sabemos, <em className="not-italic" style={{ background:"linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>melhor o plano</em></>,
      sub: "Essas informações permitem que seu nutricionista e personal trainer criem planos completamente adaptados ao seu corpo.",
      highlights: [
        { icon: <IconRuler className="w-4 h-4" />, label: "Métricas corporais precisas" },
        { icon: <IconHeart className="w-4 h-4" />, label: "Planos 100% individualizados" },
        { icon: <IconTarget className="w-4 h-4" />, label: "Cálculo automático de macros" },
      ],
    },
    {
      eyebrow: goals.length > 0 ? `${goals.length} objetivo${goals.length > 1 ? "s" : ""} selecionado${goals.length > 1 ? "s" : ""}` : "Defina seus objetivos",
      title: <>Clareza de <em className="not-italic" style={{ background:"linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>objetivos</em><br />é o primeiro resultado</>,
      sub: "Sabendo o que você quer alcançar, nosso sistema e seus profissionais vão trabalhar de forma muito mais precisa e motivadora.",
      highlights: [
        { icon: <IconZap className="w-4 h-4" />, label: "IA adaptada aos seus objetivos" },
        { icon: <IconTrendingUp className="w-4 h-4" />, label: "Progresso visível em semanas" },
        { icon: <IconHeart className="w-4 h-4" />, label: "Suporte contínuo do profissional" },
      ],
    },
  ];

  const p = panels[step];

  return (
    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#0d2b1f 0%,#0e2536 55%,#0b1d2a 100%)" }}>

      {/* Animated blobs */}
      <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full opacity-30 animate-drift-1"
        style={{ background: "radial-gradient(circle,#498467,transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute -bottom-20 right-0 w-80 h-80 rounded-full opacity-25 animate-drift-2"
        style={{ background: "radial-gradient(circle,#1C6E8C,transparent 70%)", filter: "blur(70px)" }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-15 animate-drift-1"
        style={{ background: "radial-gradient(circle,#6aad8a,transparent 70%)", filter: "blur(50px)" }} />

      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <Logo variant="dark" size="md" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-[rgba(73,132,103,.18)] border border-[rgba(73,132,103,.35)] rounded-full px-3.5 py-1.5 w-fit mb-7 transition-all duration-500">
          <span className="w-[7px] h-[7px] rounded-full bg-[#5fbf8a] animate-pulse-dot" style={{ boxShadow:"0 0 0 3px rgba(95,191,138,.25)" }} />
          <span className="text-[11px] font-semibold text-[#7dd4a8] uppercase tracking-[.04em]">{p.eyebrow}</span>
        </div>

        <h1 className="font-display text-[40px] leading-[1.1] text-white mb-5 tracking-tight">
          {p.title}
        </h1>
        <p className="text-[15px] text-white/50 leading-relaxed max-w-sm mb-10 font-light">{p.sub}</p>

        {/* Highlights */}
        <div className="space-y-3">
          {p.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/[.05] border border-white/[.08] rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background:"linear-gradient(135deg,#498467,#1C6E8C)" }}>
                <span className="text-white">{h.icon}</span>
              </div>
              <span className="text-[13.5px] font-medium text-white/80">{h.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom social proof */}
      <div className="relative z-10">
        <div className="bg-white/[.06] border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex gap-2 mb-3">
            {["JS","MC","RP","AL","TK"].map(initials => (
              <div key={initials} className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background:"linear-gradient(135deg,#498467,#1C6E8C)", marginLeft: initials === "JS" ? 0 : "-8px" }}>
                {initials}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-[10px] text-white/70 font-semibold" style={{ marginLeft: "-8px" }}>
              +18k
            </div>
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed font-light">
            Mais de <strong className="text-white font-semibold">18.000 clientes</strong> já acompanham sua evolução no HealthTrack com apoio de profissionais certificados.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────── */
function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3.5 bg-surface/90 backdrop-blur-md border-b border-border-light">
      <Link href="/login"><Logo variant="light" size="md" /></Link>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted hidden sm:block">Já tem conta?</span>
        <Link href="/login"
          className="text-[13.5px] font-semibold text-white bg-blue hover:bg-blue-light px-4 py-2 rounded-lg transition-colors">
          Entrar
        </Link>
      </div>
    </nav>
  );
}

function BmiCard({ height, weight }: { height: number; weight: number }) {
  const bmi = weight / ((height / 100) ** 2);
  const cat =
    bmi < 18.5 ? { label: "Abaixo do peso", color: "text-blue", bg: "bg-blue-pale border-blue/20" } :
    bmi < 25   ? { label: "Peso normal",     color: "text-green", bg: "bg-green-pale border-green/20" } :
    bmi < 30   ? { label: "Sobrepeso",       color: "text-amber-600", bg: "bg-amber-50 border-amber-200" } :
                 { label: "Obesidade",        color: "text-red-500", bg: "bg-red-50 border-red-200" };
  return (
    <div className={`flex items-center gap-4 p-3.5 rounded-xl border ${cat.bg} animate-fade-up`}>
      <div className="flex-1">
        <p className="text-[11.5px] font-semibold text-mid uppercase tracking-wide mb-0.5">IMC calculado</p>
        <p className={`text-[22px] font-bold font-display ${cat.color}`}>{bmi.toFixed(1)}</p>
      </div>
      <div className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold ${cat.color} bg-white/60`}>
        {cat.label}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 bg-blue-pale border-[1.5px] border-blue/15 rounded-xl p-3.5">
      <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[12.5px] font-bold text-blue mb-0.5">{title}</p>
        <p className="text-[12px] text-mid leading-relaxed font-light">{text}</p>
      </div>
    </div>
  );
}

function EyeOn() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOff() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
