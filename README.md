# HealthTrack — Auth Flow

Plataforma de nutrição e performance com Next.js 14 + TypeScript + Tailwind CSS.

## Telas incluídas

| Rota | Tela |
|------|------|
| `/login` | Login com painel split-screen |
| `/cadastro/perfil` | Seleção de perfil (Profissional / Cliente) |
| `/cadastro/profissional` | Cadastro profissional com verificação de CRN/CREF |

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000 — redireciona automaticamente para `/login`.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **DM Sans** + **DM Serif Display** (Google Fonts)

## Estrutura

```
healthtrack/
├── app/
│   ├── layout.tsx              # Root layout + fontes
│   ├── globals.css             # Tokens CSS + utilidades
│   ├── page.tsx                # Redirect → /login
│   ├── login/
│   │   └── page.tsx
│   └── cadastro/
│       ├── perfil/
│       │   ├── page.tsx
│       │   └── RoleSelectClient.tsx
│       └── profissional/
│           ├── page.tsx
│           └── ProfissionalClient.tsx
├── components/
│   ├── auth/
│   │   └── LoginClient.tsx     # Tela de login completa
│   ├── icons/
│   │   └── index.tsx           # Todos os ícones SVG
│   └── ui/
│       ├── Logo.tsx            # Logo SVG (dark/light)
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── PasswordInput.tsx
│       └── Navbar.tsx
└── lib/
    ├── types.ts
    └── utils.ts                # formatCRN, formatCREF, getPasswordStrength
```

## Funcionalidades

### Tela de Login
- Layout split-screen (painel escuro + formulário branco)
- Seletor de perfil (Profissional / Cliente)
- Toggle de senha visível
- Login social Google / Apple
- Animações de entrada

### Seleção de Perfil
- Cards interativos com lista de features por perfil
- Indicador de etapas (1/3)
- Hover com elevação e borda colorida

### Cadastro de Profissional
- Barra de progresso multi-etapas
- **CRN** aparece automaticamente para especialidades de nutrição
- **CREF** aparece automaticamente para educação física
- Ambos em layout de 2 colunas para "Nutricionista + Personal"
- Formatação automática de CRN (`XX-XXXXXX`) e CREF (`XXXXXX-G/XX`)
- Medidor de força de senha em tempo real
- Termos com checkbox validado antes de avançar
