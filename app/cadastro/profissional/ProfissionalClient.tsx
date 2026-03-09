"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { IconMail, IconUser, IconActivity, IconLock, IconShield, IconCheck, IconArrowRight, IconArrowLeft } from "@/components/icons";
import { formatCRN, formatCREF, getPasswordStrength } from "@/lib/utils";

type Specialty = "" | "nutri-clinico" | "nutri-esportivo" | "nutri-funcional" | "personal" | "educador-fisico" | "treinador-funcional" | "ambos";

const needsCRN  = (s: Specialty) => ["nutri-clinico","nutri-esportivo","nutri-funcional","ambos"].includes(s);
const needsCREF = (s: Specialty) => ["personal","educador-fisico","treinador-funcional","ambos"].includes(s);

const pwLabels = ["","Muito fraca","Fraca","Média","Forte"] as const;
const pwColors = ["","bg-red-400","bg-red-400","bg-amber-400","bg-green"] as const;
const pwTextColors = ["text-muted","text-red-400","text-red-400","text-amber-500","text-green"] as const;

export default function ProfissionalClient() {
  const [form, setForm] = useState({
    name: "", email: "", specialty: "" as Specialty,
    crn: "", cref: "", password: "", terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwStrength = getPasswordStrength(form.password);

  function set(key: keyof typeof form, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleCRN(e: ChangeEvent<HTMLInputElement>) {
    set("crn", formatCRN(e.target.value.replace(/[^0-9]/g, "")));
  }

  function handleCREF(e: ChangeEvent<HTMLInputElement>) {
    set("cref", formatCREF(e.target.value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.terms) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  const showCRN  = needsCRN(form.specialty);
  const showCREF = needsCREF(form.specialty);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Nav */}
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

      <div className="flex-1 flex flex-col items-center px-5 py-10">

        {/* Progress card */}
        <div className="w-full max-w-[520px] bg-white border border-border-light rounded-2xl px-5 py-4 mb-5 flex items-center gap-4 shadow-sm animate-fade-up">
          {/* Step indicators */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Step 1 done */}
            <div className="w-7 h-7 rounded-full bg-green flex items-center justify-center">
              <IconCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="w-6 h-0.5 rounded-full bg-green" />
            {/* Step 2 active */}
            <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center text-white text-[11px] font-bold"
              style={{ boxShadow: "0 0 0 3px rgba(28,110,140,.2)" }}>
              2
            </div>
            <div className="w-6 h-0.5 rounded-full bg-border" />
            {/* Step 3 pending */}
            <div className="w-7 h-7 rounded-full bg-border-light flex items-center justify-center text-muted text-[11px] font-bold">3</div>
          </div>
          {/* Progress bar */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-blue mb-1.5 tracking-wide">Etapa 1: Identidade &amp; Credenciais</p>
            <div className="h-[5px] bg-border-light rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: "33%", background: "linear-gradient(90deg,#498467,#1C6E8C)" }} />
            </div>
            <p className="text-[11.5px] text-muted mt-1">33% concluído · 1 de 3 etapas</p>
          </div>
        </div>

        {/* Form card */}
        <div className="w-full max-w-[520px] bg-white border border-border-light rounded-3xl overflow-hidden shadow-md animate-fade-up-delay">
          {/* Gradient strip */}
          <div className="h-1.5" style={{ background: "linear-gradient(90deg,#498467,#1C6E8C)" }} />

          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="font-display text-[28px] text-dark tracking-tight mb-2">Junte-se à rede</h2>
              <p className="text-[14px] text-muted leading-relaxed font-light">
                Cadastre-se como nutricionista ou personal trainer e comece a gerenciar seus clientes com inteligência.
              </p>
            </div>

            <div className="space-y-5">
              {/* Full name */}
              <Field label="Nome Completo" badge={{ text: "Obrigatório", color: "red" }}>
                <InputWithIcon icon={<IconUser />}
                  type="text" placeholder="Ex: Dra. Ana Lima" value={form.name}
                  onChange={e => set("name", e.target.value)} autoComplete="name" />
              </Field>

              {/* Email */}
              <Field label="E-mail Profissional" badge={{ text: "Obrigatório", color: "red" }}>
                <InputWithIcon icon={<IconMail />}
                  type="email" placeholder="ana@clinicasaude.com.br" value={form.email}
                  onChange={e => set("email", e.target.value)} autoComplete="email" />
              </Field>

              {/* Specialty */}
              <Field label="Área de Atuação" badge={{ text: "Obrigatório", color: "red" }}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                    <IconActivity />
                  </span>
                  <select
                    value={form.specialty}
                    onChange={e => set("specialty", e.target.value as Specialty)}
                    className="input-base pr-10 cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Selecione sua especialidade</option>
                    <optgroup label="Nutrição">
                      <option value="nutri-clinico">Nutricionista Clínico</option>
                      <option value="nutri-esportivo">Nutricionista Esportivo</option>
                      <option value="nutri-funcional">Nutricionista Funcional</option>
                    </optgroup>
                    <optgroup label="Educação Física">
                      <option value="personal">Personal Trainer</option>
                      <option value="educador-fisico">Educador Físico</option>
                      <option value="treinador-funcional">Treinador Funcional</option>
                    </optgroup>
                    <optgroup label="Combinado">
                      <option value="ambos">Nutricionista + Personal Trainer</option>
                    </optgroup>
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-muted" />
                </div>
              </Field>

              {/* ── CRN BLOCK ── */}
              {showCRN && (
                <div className="animate-fade-up">
                  <CredentialInfo type="CRN" />
                  <Field label="Número do CRN" badge={{ text: "Conselho Regional de Nutrição", color: "green" }}>
                    <CredentialInput
                      prefix="CRN"
                      placeholder="XX-XXXXXX"
                      value={form.crn}
                      onChange={handleCRN}
                      maxLength={9}
                    />
                    <p className="mt-1.5 text-[11.5px] text-muted">Ex: 03-012345 (SP) · 06-012345 (MG) · Formato do crachá do CFN</p>
                  </Field>
                </div>
              )}

              {/* ── CREF BLOCK ── */}
              {showCREF && (
                <div className="animate-fade-up">
                  <CredentialInfo type="CREF" />
                  <Field label="Número do CREF" badge={{ text: "Conselho Regional de Educação Física", color: "green" }}>
                    <CredentialInput
                      prefix="CREF"
                      placeholder="XXXXXX-G/XX"
                      value={form.cref}
                      onChange={handleCREF}
                      maxLength={14}
                    />
                    <p className="mt-1.5 text-[11.5px] text-muted">Ex: 012345-G/SP · número + G + UF do estado de registro</p>
                  </Field>
                </div>
              )}

              {/* ── BOTH BLOCK (side by side) ── */}
              {form.specialty === "ambos" && (
                <div className="grid grid-cols-2 gap-4 animate-fade-up">
                  <Field label="CRN" badge={{ text: "Nutrição", color: "green" }}>
                    <CredentialInput prefix="CRN" placeholder="XX-XXXXXX" value={form.crn} onChange={handleCRN} maxLength={9} />
                  </Field>
                  <Field label="CREF" badge={{ text: "Ed. Física", color: "green" }}>
                    <CredentialInput prefix="CREF" placeholder="XXXXXX-G/XX" value={form.cref} onChange={handleCREF} maxLength={14} />
                  </Field>
                </div>
              )}

              {/* Password */}
              <Field label="Senha de Acesso" badge={{ text: "Obrigatório", color: "red" }}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"><IconLock /></span>
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    className="input-base pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-blue transition-colors p-1 rounded">
                    {showPw ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {/* Strength bars */}
                {form.password && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${i <= pwStrength ? pwColors[pwStrength] : "bg-border"}`} />
                    ))}
                    <span className={`text-[11px] font-semibold ml-1.5 min-w-[56px] ${pwTextColors[pwStrength]}`}>
                      {pwLabels[pwStrength]}
                    </span>
                  </div>
                )}
              </Field>

              {/* Terms */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-[1.5px] cursor-pointer transition-colors ${form.terms ? "border-green bg-green-pale/40" : "border-border bg-surface hover:border-blue"}`}>
                <input type="checkbox" checked={form.terms} onChange={e => set("terms", e.target.checked)}
                  className="w-4 h-4 mt-0.5 flex-shrink-0 accent-green cursor-pointer rounded" />
                <span className="text-[12.5px] text-mid leading-relaxed">
                  Concordo com os{" "}
                  <a href="#" className="text-blue font-semibold hover:underline" onClick={e => e.stopPropagation()}>Termos de Uso</a>{" "}e{" "}
                  <a href="#" className="text-blue font-semibold hover:underline" onClick={e => e.stopPropagation()}>Política de Privacidade</a>{" "}
                  do HealthTrack, e declaro possuir as credenciais profissionais necessárias, sujeitando-me às normas dos conselhos de classe.
                </span>
              </label>

              {/* CTA */}
              <button type="submit" disabled={!form.terms || loading}
                className="btn-gradient w-full flex items-center justify-center gap-2 py-4 text-[15px] font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>Aguarde...</>
                ) : (
                  <>Continuar para Etapa 2 <IconArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          {/* Card footer */}
          <div className="px-8 md:px-10 py-4 border-t border-border-light bg-surface flex items-center justify-between flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-green bg-green-pale px-3 py-1.5 rounded-full border border-green-mid">
              <IconCheck className="w-3 h-3" />Cadastro Profissional Verificado
            </span>
            <div className="flex gap-4">
              <a href="#" className="text-[12px] text-muted hover:text-blue transition-colors">Central de Ajuda</a>
              <a href="#" className="text-[12px] text-muted hover:text-blue transition-colors">Contato</a>
            </div>
          </div>
        </div>

        {/* Back link */}
        <Link href="/cadastro/perfil"
          className="mt-6 flex items-center gap-1.5 text-[13px] text-muted hover:text-blue transition-colors">
          <IconArrowLeft className="w-3.5 h-3.5" /> Voltar para escolha de perfil
        </Link>

        <footer className="mt-8 text-center text-[11.5px] text-muted">
          © 2026 HealthTrack Inc. Todas as credenciais são verificadas junto aos conselhos competentes.
        </footer>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function Field({ label, badge, children }: {
  label: string;
  badge?: { text: string; color?: "blue" | "green" | "red" };
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11.5px] font-bold text-mid uppercase tracking-[.04em]">{label}</span>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            badge.color === "green" ? "bg-green-pale text-green" :
            badge.color === "red"   ? "bg-red-50 text-red-500" :
            "bg-blue-pale text-blue"
          }`}>
            {badge.text}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function InputWithIcon({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">{icon}</span>
      <input className="input-base" {...props} />
    </div>
  );
}

function CredentialInput({ prefix, ...props }: { prefix: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11.5px] font-bold text-muted pointer-events-none tracking-[.04em]">
        {prefix}
      </span>
      <input
        type="text"
        className="input-base font-semibold tracking-wide"
        style={{ paddingLeft: prefix.length > 3 ? "52px" : "44px", borderColor: "var(--green)", boxShadow: "none" }}
        onFocus={e => { e.currentTarget.style.boxShadow = "0 0 0 4px rgba(73,132,103,.1)"; }}
        onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
        {...props}
      />
    </div>
  );
}

function CredentialInfo({ type }: { type: "CRN" | "CREF" }) {
  const content = {
    CRN: {
      title: "Verificação de CRN obrigatória",
      desc: "Nutricionistas devem fornecer o número do CRN ativo. Suas credenciais serão verificadas junto ao CFN em até 24h.",
    },
    CREF: {
      title: "Verificação de CREF obrigatória",
      desc: "Personal trainers e educadores físicos devem fornecer o CREF ativo. Credenciais verificadas junto ao CONFEF em até 24h.",
    },
  }[type];

  return (
    <div className="flex items-start gap-3 bg-green-pale border-[1.5px] border-green-mid rounded-xl p-3.5 mb-3">
      <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center flex-shrink-0">
        <IconShield className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-[12.5px] font-bold text-green mb-0.5">{content.title}</p>
        <p className="text-[12px] text-mid leading-relaxed font-light">{content.desc}</p>
      </div>
    </div>
  );
}
