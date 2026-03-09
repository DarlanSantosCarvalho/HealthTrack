"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { IconMail, IconLock, IconCheck, IconArrowRight, IconGoogle, IconApple } from "@/components/icons";

type Role = "profissional" | "cliente";

export default function LoginClient() {
  const [role, setRole] = useState<Role>("profissional");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ── LEFT PANEL ───────────────────────────── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0d2b1f 0%,#0e2536 50%,#0d1e2b 100%)" }}>

        {/* Animated blobs */}
        <div className="absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full opacity-35 animate-drift-1"
          style={{ background: "radial-gradient(circle,#498467 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-16 -right-20 w-80 h-80 rounded-full opacity-35 animate-drift-2"
          style={{ background: "radial-gradient(circle,#1C6E8C 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full opacity-20 animate-drift-1"
          style={{ background: "radial-gradient(circle,#6aad8a 0%,transparent 70%)", filter: "blur(60px)" }} />

        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Logo variant="dark" size="md" />
        </div>

        {/* Center copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-[rgba(73,132,103,.18)] border border-[rgba(73,132,103,.35)] rounded-full px-3.5 py-1.5 w-fit mb-7">
            <span className="w-[7px] h-[7px] rounded-full bg-[#5fbf8a] animate-pulse-dot"
              style={{ boxShadow: "0 0 0 3px rgba(95,191,138,.25)" }} />
            <span className="text-[11px] font-semibold text-[#7dd4a8] uppercase tracking-[.04em]">Plataforma Ativa</span>
          </div>

          <h1 className="font-display text-[46px] leading-[1.08] text-white mb-5 tracking-tight">
            Saúde &amp;<br />performance<br />
            <em className="not-italic" style={{ background:"linear-gradient(90deg,#5fbf8a,#4badd6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              em um só lugar
            </em>
          </h1>
          <p className="text-base text-white/50 leading-relaxed max-w-sm mb-12 font-light">
            Conecte nutricionistas, personal trainers e clientes em um ecossistema inteligente de acompanhamento e evolução.
          </p>

          {/* Stats */}
          <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-white/[.04] backdrop-blur-sm max-w-[400px]">
            {[
              { value: "2.4k", label: "Profissionais" },
              { value: "18k",  label: "Clientes" },
              { value: "96%",  label: "Satisfação" },
            ].map((stat, i) => (
              <div key={i} className={`flex-1 px-5 py-4 ${i < 2 ? "border-r border-white/[.08]" : ""}`}>
                <p className="text-[22px] font-bold text-white leading-none mb-1">
                  <span style={{ background:"linear-gradient(90deg,#5fbf8a,#4badd6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{stat.value}</span>
                </p>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="bg-white/[.06] border border-white/10 rounded-2xl p-5 backdrop-blur-sm max-w-[400px]">
            <p className="text-sm text-white/70 leading-relaxed mb-4 italic font-light">
              "Reduzi o tempo de atualização de dietas para menos de 5 minutos por paciente. Minha produtividade triplicou."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#498467,#1C6E8C)" }}>AL</div>
              <div>
                <p className="text-[13px] font-semibold text-white/85 leading-none">Dra. Ana Lima</p>
                <p className="text-[11.5px] text-white/40 mt-0.5">Nutricionista Esportiva · São Paulo</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array(5).fill(0).map((_, i) => <span key={i} className="text-[#f4c843] text-xs">★</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────── */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-white relative min-h-screen lg:min-h-0">
        {/* Subtle radial gradients */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 10%,rgba(73,132,103,.04) 0%,transparent 50%),radial-gradient(circle at 20% 90%,rgba(28,110,140,.04) 0%,transparent 50%)" }} />

        <div className="w-full max-w-[420px] relative z-10 animate-fade-up">

          {/* Mobile-only logo */}
          <div className="flex lg:hidden mb-8">
            <Logo variant="light" size="md" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-[30px] text-dark tracking-tight mb-2">Bem-vindo de volta</h2>
            <p className="text-sm text-muted">
              Não tem conta?{" "}
              <Link href="/cadastro/perfil" className="text-blue font-semibold hover:underline">
                Criar conta gratuita
              </Link>
            </p>
          </div>

          {/* Role selector */}
          <div className="flex bg-surface border border-border-light rounded-xl p-1 mb-7 gap-1">
            {(["profissional", "cliente"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[9px] text-[13px] font-semibold transition-all duration-200 ${
                  role === r
                    ? "bg-white shadow-sm text-dark"
                    : "text-muted hover:text-dark"
                }`}
              >
                {r === "profissional" ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
                {r === "profissional" ? "Profissional" : "Cliente"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11.5px] font-bold text-mid uppercase tracking-[.04em] mb-1.5">E-mail</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"><IconMail /></span>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com.br" autoComplete="email"
                  className="input-base"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11.5px] font-bold text-mid uppercase tracking-[.04em]">Senha</label>
                <a href="#" className="text-[12px] font-medium text-blue hover:underline">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"><IconLock /></span>
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="input-base pr-10"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-blue transition-colors p-1 rounded">
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-green cursor-pointer" />
              <span className="text-[13.5px] text-mid">Manter conectado</span>
            </label>

            {/* CTA */}
            <button type="submit" disabled={loading}
              className="btn-gradient w-full flex items-center justify-center gap-2 py-4 text-[15px] font-bold rounded-xl disabled:opacity-70">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>Aguarde...</>
              ) : (
                <>Entrar na plataforma <IconArrowRight /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3.5 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[12px] font-semibold text-muted uppercase tracking-[.04em]">ou continue com</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-2.5 mb-7">
            {[
              { icon: <IconGoogle />, label: "Google" },
              { icon: <IconApple />, label: "Apple" },
            ].map((btn) => (
              <button key={btn.label}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-[1.5px] border-border rounded-xl text-[13.5px] font-semibold text-dark hover:border-muted hover:bg-surface hover:-translate-y-0.5 transition-all duration-150">
                {btn.icon}{btn.label}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-border-light">
            <p className="text-[12px] text-muted leading-relaxed">
              Ao entrar, você concorda com os{" "}
              <a href="#" className="text-blue font-medium hover:underline">Termos de Uso</a>{" "}e{" "}
              <a href="#" className="text-blue font-medium hover:underline">Política de Privacidade</a>.
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
              {[
                { icon: <IconCheck className="w-3 h-3" />, label: "Dados protegidos" },
                { icon: <IconCheck className="w-3 h-3" />, label: "LGPD conforme" },
                { icon: <IconLock className="w-3 h-3" />, label: "SSL 256-bit" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1.5 text-[11px] font-medium text-muted">
                  <span className="text-green">{b.icon}</span>{b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
