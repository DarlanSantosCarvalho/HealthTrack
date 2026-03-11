"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { IconChart, IconClock, IconArrowRight, IconCheck } from "@/components/icons";

const proFeatures = [
  "Painel de gestão de clientes",
  "Criação de dietas e planos de treino",
  "Fichas de evolução e comparativos",
  "Formulários de anamnese personalizados",
];

const clientFeatures = [
  "Visualização de dieta e treino do dia",
  "Fotos comparativas de evolução",
  "Assistente IA para substituições",
  "Histórico completo de métricas",
];

export default function RoleSelectClient() {
  const router = useRouter();

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

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-blue-pale border border-blue/20 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
          <span className="w-[7px] h-[7px] rounded-full bg-blue" />
          <span className="text-[11px] font-semibold text-blue uppercase tracking-[.04em]">Etapa 1 de 3 — Escolha seu perfil</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-[38px] md:text-[44px] text-dark text-center leading-[1.1] tracking-tight mb-4 animate-fade-up-delay">
          Como você vai usar o{" "}
          <span style={{ background: "linear-gradient(90deg,#498467,#1C6E8C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            HealthTrack
          </span>?
        </h1>
        <p className="text-base text-muted text-center leading-relaxed max-w-md mb-14 font-light animate-fade-up-delay-2">
          Escolha seu perfil para personalizar sua experiência. Isso nos ajuda a configurar as ferramentas certas para sua jornada.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[640px] animate-fade-up-delay-2">

          {/* Professional */}
          <div
            onClick={() => router.push("/cadastro/profissional")}
            className="group bg-white border-2 border-border rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-green hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"
              style={{ background: "linear-gradient(135deg,rgba(73,132,103,.04),rgba(28,110,140,.03))" }} />

            <div className="w-16 h-16 rounded-2xl bg-green-pale flex items-center justify-center mb-5">
              <IconChart className="w-7 h-7 text-green" />
            </div>
            <h3 className="font-display text-[22px] text-dark mb-2.5">Sou Profissional</h3>
            <p className="text-[13.5px] text-muted leading-relaxed mb-6 font-light">
              Gerencie clientes, crie dietas personalizadas e monte treinos em escala com inteligência.
            </p>
            <ul className="space-y-2 mb-7">
              {proFeatures.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[12.5px] text-mid font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 bg-green text-white text-sm font-bold rounded-xl transition-all duration-200 group-hover:-translate-y-0.5"
              style={{ boxShadow: "0 4px 16px rgba(73,132,103,.28)" }}
            >
              Continuar como Profissional <IconArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Client */}
          <div
            onClick={() => router.push("/cadastro/cliente")}
            className="group bg-white border-2 border-border rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-blue hover:shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"
              style={{ background: "linear-gradient(135deg,rgba(28,110,140,.04),rgba(73,132,103,.03))" }} />

            <div className="w-16 h-16 rounded-2xl bg-blue-pale flex items-center justify-center mb-5">
              <IconClock className="w-7 h-7 text-blue" />
            </div>
            <h3 className="font-display text-[22px] text-dark mb-2.5">Sou Cliente</h3>
            <p className="text-[13.5px] text-muted leading-relaxed mb-6 font-light">
              Acompanhe sua evolução individual, siga planos especializados e alcance suas metas de saúde.
            </p>
            <ul className="space-y-2 mb-7">
              {clientFeatures.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[12.5px] text-mid font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue text-white text-sm font-bold rounded-xl transition-all duration-200 group-hover:-translate-y-0.5"
              style={{ boxShadow: "0 4px 16px rgba(28,110,140,.28)" }}
            >
              Continuar como Cliente <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Steps dots */}
        <div className="flex items-center gap-2 mt-10">
          <div className="w-5 h-2 rounded-full bg-blue transition-all" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>

        <p className="mt-5 text-[13px] text-muted flex items-center gap-1.5">
          Não sabe qual escolher?{" "}
          <a href="#" className="text-blue font-medium hover:underline">Ver diferenças detalhadas →</a>
        </p>
      </div>

      <footer className="text-center py-6 text-[11.5px] text-muted">
        © 2026 HealthTrack Inc. Todos os direitos reservados.
      </footer>
    </div>
  );
}
