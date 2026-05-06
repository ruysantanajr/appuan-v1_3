\# appuan — Setup Claude Code no VPS

\> Objetivo: construir o appuan pelo mobile usando Claude Code num servidor remoto, sem depender do Desktop.

\---

\#\# Contexto e decisão

O MVP do appuan está sendo construído no \*\*Antigravity\*\* (IDE da Google, local no Desktop). A decisão é migrar o desenvolvimento paralelo para o \*\*Claude Code\*\* rodando num VPS, porque:

\- Claude Code já está incluso no plano Max da Anthropic  
\- PROMETEU (Claude) tem acesso direto ao Supabase do appuan via MCP  
\- O repositório já está no GitHub — sem retrabalho  
\- Permite programar pelo mobile via SSH, sem precisar do Desktop ligado  
\- Cloudflare Pages faz deploy automático a cada commit

\---

\#\# Arquitetura final

\`\`\`  
Mobile (Claude chat)  
    ↓  
PROMETEU analisa Supabase \+ gera prompt cirúrgico  
    ↓  
Termius (SSH app no mobile) → VPS Oracle Cloud  
    ↓  
Claude Code executa no terminal do VPS  
    ↓  
Git commit \+ push → GitHub  
    ↓  
Cloudflare Pages → deploy automático  
    ↓  
appuan.app atualizado  
\`\`\`

\---

\#\# Stack

| Camada | Ferramenta | Custo |  
|---|---|---|  
| Banco de dados | Supabase (PostgreSQL) | Gratuito |  
| Frontend | Next.js \+ Tailwind \+ shadcn/ui | Gratuito |  
| Agente de código | Claude Code | Incluso no Max |  
| Servidor remoto | Oracle Cloud Free Tier | Gratuito permanente |  
| Repositório | GitHub | Gratuito |  
| Deploy | Cloudflare Pages | Gratuito |  
| SSH mobile | Termius | Gratuito |

\*\*Custo total: $0\*\*

\---

\#\# Roteiro de setup — passo a passo

\#\#\# FASE 1 — Criar o VPS na Oracle Cloud

1\. Acesse \[cloud.oracle.com\](https://cloud.oracle.com) e crie uma conta gratuita  
   \- Vai pedir cartão para verificação, mas não cobra nada  
   \- Escolha a região: \*\*Brazil East (São Paulo)\*\*

2\. Vá em \*\*Compute → Instances → Create Instance\*\*

3\. Configure a VM:  
   \- \*\*Nome:\*\* appuan-vps  
   \- \*\*Imagem:\*\* Ubuntu 22.04 LTS  
   \- \*\*Shape:\*\* VM.Standard.A1.Flex (ARM) — gratuito permanente  
   \- \*\*CPU:\*\* 2 cores | \*\*RAM:\*\* 4 GB | \*\*Storage:\*\* 50 GB

4\. Gere um par de chaves SSH:  
\`\`\`bash  
ssh-keygen \-t ed25519 \-C "appuan-vps"  
\`\`\`  
Guarde a chave privada — você vai precisar dela no Termius.

5\. Clique em \*\*Create\*\* e aguarde 2-3 minutos

6\. Anote o \*\*IP público\*\* da VM

\---

\#\#\# FASE 2 — Configurar o VPS

Conecte via SSH no terminal do Desktop:  
\`\`\`bash  
ssh \-i \~/.ssh/sua-chave ubuntu@SEU-IP-PUBLICO  
\`\`\`

Execute em sequência:

\`\`\`bash  
\# Atualizar o sistema  
sudo apt update && sudo apt upgrade \-y

\# Instalar Node.js 20  
curl \-fsSL https://deb.nodesource.com/setup\_20.x | sudo \-E bash \-  
sudo apt install \-y nodejs

\# Instalar Git  
sudo apt install \-y git

\# Configurar Git  
git config \--global user.name "Seu Nome"  
git config \--global user.email "seu@email.com"  
\`\`\`

\---

\#\#\# FASE 3 — Instalar Claude Code

\`\`\`bash  
npm install \-g @anthropic-ai/claude-code  
claude \--version  
\`\`\`

\*\*Gerar API Key:\*\*  
1\. Acesse \[console.anthropic.com\](https://console.anthropic.com)  
2\. Vá em \*\*API Keys → Create Key\*\*  
3\. Nomeie como \`appuan-vps\`  
4\. Copie a chave — aparece só uma vez

\*\*Configurar no VPS:\*\*  
\`\`\`bash  
echo 'export ANTHROPIC\_API\_KEY=sua-chave-aqui' \>\> \~/.bashrc  
source \~/.bashrc  
\`\`\`

\---

\#\#\# FASE 4 — Clonar o repositório

\`\`\`bash  
cd \~  
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git  
cd appuan  
\`\`\`

\*\*Configurar variáveis do Supabase:\*\*  
\`\`\`bash  
cp .env.example .env.local  
nano .env.local  
\`\`\`

Preencha:  
\`\`\`  
NEXT\_PUBLIC\_SUPABASE\_URL=sua-url-supabase  
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=sua-chave-anon  
\`\`\`

\`\`\`bash  
npm install  
\`\`\`

\---

\#\#\# FASE 5 — Criar o CLAUDE.md

O \`CLAUDE.md\` injeta contexto do appuan em toda sessão do Claude Code — ele lê isso antes de qualquer tarefa, eliminando a necessidade de explicar o projeto toda vez.

\`\`\`bash  
nano CLAUDE.md  
\`\`\`

Conteúdo:

\`\`\`markdown  
\# appuan — Contexto do Projeto

\#\# O que é  
Sistema de gestão operacional para duas unidades de negócio: AEDRU e Pessoal/Arandu.

\#\# Stack  
\- Frontend: Next.js 14 \+ TypeScript \+ Tailwind CSS \+ shadcn/ui  
\- Backend: Supabase (PostgreSQL) com RLS ativo em todas as tabelas  
\- Deploy: Cloudflare Pages via GitHub

\#\# Identidade visual  
\- Nav background: \#170024  
\- Accent: \#3a1165  
\- Hover: \#7C3AED  
\- Table header: \#d8b4fe  
\- Table stripe: \#faf5ff

\#\# Tabelas principais  
\- usuario — tipo: superadmin, admin, usuario  
\- area — tipo: pessoal, equipe | sigla: 3 letras maiúsculas  
\- demanda — status: nova, em tratamento, convertida, descartada  
\- requisicao — status: em fila, em andamento, aguardando, concluida, cancelada  
\- fluxo, etapa, projeto, trilha\_auditoria

\#\# Convenções  
\- IDs: UUID gerado pelo Supabase  
\- Timestamps: criado\_em, atualizado\_em em todas as tabelas  
\- Numeração de requisições: REQ-\[SIGLA\]-\[000001\] por área  
\- Português brasileiro em todo o sistema

\#\# Nunca fazer  
\- Nunca deletar registros da trilha\_auditoria  
\- Nunca usar texto livre onde há enum definido  
\- Nunca criar campos sem os metadados padrão  
\`\`\`

\---

\#\#\# FASE 6 — Testar o Claude Code

\`\`\`bash  
claude  
\`\`\`

Digite para testar:  
\`\`\`  
Descreva a estrutura atual do projeto  
\`\`\`

Se responder corretamente, está funcionando.

\---

\#\#\# FASE 7 — Configurar Termius no mobile

1\. Baixe o \*\*Termius\*\* (Android ou iOS)  
2\. Crie novo host:  
   \- \*\*Hostname:\*\* SEU-IP-PUBLICO  
   \- \*\*Username:\*\* ubuntu  
   \- \*\*Auth:\*\* Key — importe a chave privada da Fase 1  
3\. Conecte e teste

\---

\#\#\# FASE 8 — Configurar Cloudflare Pages

1\. Acesse \[pages.cloudflare.com\](https://pages.cloudflare.com)  
2\. \*\*Create a project → Connect to Git\*\* → selecione o repositório do appuan  
3\. Configure o build:  
   \- \*\*Framework preset:\*\* Next.js  
   \- \*\*Build command:\*\* \`npm run build\`  
   \- \*\*Build output directory:\*\* \`.next\`  
4\. Adicione as variáveis de ambiente do Supabase  
5\. Clique em \*\*Save and Deploy\*\*  
6\. Vá em \*\*Custom Domains\*\* → adicione \`appuan.app\`  
   \- O DNS já está no Cloudflare — aponta automaticamente

\---

\#\# Fluxo de trabalho pelo mobile (após o setup)

\`\`\`  
1\. Abrir Claude pelo mobile  
2\. Pedir para PROMETEU analisar o Supabase e gerar o prompt  
3\. Abrir Termius → conectar no VPS  
4\. cd \~/appuan && claude  
5\. Colar o prompt  
6\. Claude Code executa e commita  
7\. Cloudflare Pages faz deploy automático  
8\. Conferir em appuan.app  
\`\`\`

\---

\#\# Observações importantes

\*\*Custo de API\*\*  
O Claude Code no VPS consome da API por token — não do plano Max. Para o volume do appuan em desenvolvimento, estimativa de menos de $20/mês.

\*\*Segurança\*\*  
Nunca compartilhe a API Key em texto aberto em conversas. Ela fica armazenada como variável de ambiente no servidor.

\*\*Versão do Claude Code\*\*  
Evite versões entre v2.1.89 e v2.1.99 — tiveram bug de consumo excessivo de tokens.

\---

\#\# Próximos passos

1\. Terminar o MVP no Antigravity  
2\. Configurar o VPS e testar o Claude Code remotamente  
3\. Primeiro deploy no Cloudflare Pages com domínio \`appuan.app\`  
4\. Apresentar o MVP para o sócio  
5\. Planejar próximas features com o novo fluxo mobile-first

\---

\*Documento gerado por PROMETEU — LOGOS | appuan v1.2 | maio 2026\*