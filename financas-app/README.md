# Rotina Financeira do Rafa

App de gestão financeira pessoal com Next.js 16, Supabase e Tailwind CSS.

## Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Backend/BaaS:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Gráficos:** Recharts
- **Deploy:** Vercel

---

## Rodar localmente

### 1. Instalar dependências

```bash
cd financas-app
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha `.env.local` com suas chaves do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxx
```

> ⚠️ **Nunca** commite o arquivo `.env.local`.

### 3. Criar as tabelas no Supabase

No **SQL Editor** do seu projeto Supabase, execute o conteúdo de `supabase-schema.sql`.

### 4. Iniciar o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Deploy na Vercel

### Passo 1 — Importar repositório

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte sua conta GitHub e selecione o repositório `app_financas`
3. O `vercel.json` na raiz já configura o **Root Directory** como `financas-app` automaticamente

### Passo 2 — Adicionar variáveis de ambiente

Na tela de configuração do projeto na Vercel, adicione:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_xxxx` |

### Passo 3 — Deploy

Clique em **Deploy**. A Vercel detecta Next.js automaticamente.

### Passo 4 — Configurar redirect no Supabase

No painel do Supabase, vá em **Authentication → URL Configuration** e adicione a URL da Vercel em **Redirect URLs**:

```
https://seu-app.vercel.app/**
```

---

## Segurança

| Variável | Exposição | Por quê é seguro |
|----------|-----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend (pública) | É apenas o endpoint da API — não dá acesso ao banco |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend (pública) | Chave de acesso mínimo; segurança garantida pelo **Row Level Security (RLS)** |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Nunca usar no frontend | Acesso total ao banco — use apenas em servidores |

O RLS garante que cada usuário só acessa **seus próprios dados**, mesmo que a chave anon seja pública.

---

## Estrutura do projeto

```
financas-app/
├── src/
│   ├── app/
│   │   ├── (app)/          # Rotas protegidas (dashboard, transações)
│   │   ├── auth/           # Login, registro, callback
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── dashboard/      # Cards, gráfico, últimas transações
│   │   ├── layout/         # Sidebar, Header, MobileNav
│   │   ├── transactions/   # Form, List, Filters
│   │   └── ui/             # Componentes base (shadcn/ui)
│   ├── lib/
│   │   ├── supabase/       # Clients browser e server
│   │   ├── categories.ts   # 12 categorias pré-definidas
│   │   └── utils.ts        # Formatação + exportação CSV
│   └── types/              # Tipos TypeScript
├── supabase-schema.sql     # SQL para criar tabelas + RLS
└── .env.local.example      # Modelo das variáveis de ambiente
```
