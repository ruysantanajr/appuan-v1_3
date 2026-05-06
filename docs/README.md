# appuan

> *"visão 360° de tudo que importa na sua vida."*

O appuan é uma plataforma de gestão unificada que reúne, num só lugar, todas as dimensões da vida de quem o usa — pessoal, profissional e educacional — com regras rígidas de separação de visibilidade e compartilhamento entre áreas.

---

## O que é o appuan

O appuan nasce da palavra Apuã — Tupi-Guarani — que significa redondo, íntegro, completo.

A premissa central é simples: a pessoa que usa o sistema é uma só. Não existe um "você profissional" separado do "você pessoal". Forçar essa separação em ferramentas diferentes gera dispersão, perda de contexto e fricção desnecessária.

O appuan substitui vários apps de mercado — alguns simplificados, outros estendidos — dentro de uma interface única.

---

## Funcionalidades principais

- **Caixa de Entrada** — captura rápida de demandas, sem fricção, de qualquer área da vida
- **Demandas** — lista de entradas para tratamento e conversão
- **Requisições** — entidade central de trabalho, com SLA, responsável e trilha de auditoria
- **Kanban** — painéis por área com status fixos e transições explícitas
- **Fluxos e Etapas** — visão micro de cada requisição dentro de seus fluxos de trabalho
- **Micro apps** — ferramentas integradas ao fluxo (qualificação de equipamentos, reembolso, etc.)
- **Integrações** — Bling (ERP) e Autentique (assinatura eletrônica)
- **IA contextual** — agentes especializados por tela e etapa

---

## Stack

| Camada | Tecnologia |
|---|---|
| Banco de dados | Supabase (PostgreSQL) |
| Frontend | Next.js + TypeScript + Tailwind CSS + shadcn/ui |
| Deploy | Cloudflare Pages |
| Repositório | GitHub |
| Domínio | appuan.app |

---

## Versões

| Versão | Stack | Status |
|---|---|---|
| v1.2 | Next.js + Antigravity (Google IDE) | Em desenvolvimento ativo |
| v1.3 | Next.js + Claude Code + VPS Oracle Cloud | Em construção |

---

## Desenvolvimento local

```bash
# Clonar o repositório
git clone https://github.com/ruysantanajr/appuan-v1_3.git
cd appuan-v1_3

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# Rodar em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

---

## Identidade visual

| Token | Valor | Uso |
|---|---|---|
| Purple | #6B21D4 | Cor principal |
| Purple Light | #9B5CF6 | Hover e destaques |
| Gold | #D4A017 | Núcleo educacional |
| Blue | #1D4ED8 | Núcleo profissional |
| Cream | #FAFAF7 | Fundo base |

---

## Contexto

Desenvolvido no ecossistema **LOGOS** por Ruy Rebello de Santana Junior.
Aplicado inicialmente nas operações da **AEDRU** e da **Arandu Cultural**.

---

*appuan v1.3 · Maio de 2026*
