# appuan v1.3 — Contexto do Projeto

## O que é o appuan

O appuan é uma plataforma de gestão unificada que reúne, num só lugar,
todas as dimensões da vida de quem o usa — pessoal, profissional e
educacional — com regras rígidas de separação de visibilidade e
compartilhamento entre áreas.

Não é um app de nicho. Substitui vários apps de mercado dentro de uma
interface única, sem que o usuário precise migrar de ferramenta.

## Stack

- Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- Banco: Supabase (PostgreSQL) — projeto kytfvznsdjgolquwfyun
- Deploy: Cloudflare Pages
- Domínio: appuan.app
- Repositório: github.com/ruysantanajr/appuan-v1_3

## Identidade visual

- Nav/sidebar background: #170024
- Accent principal: #3a1165
- Hover: #7C3AED
- Purple principal: #6B21D4
- Purple Light: #9B5CF6
- Purple Ultra (cards): #EDE9FE
- Gold (educacional): #D4A017
- Blue (profissional): #1D4ED8
- Fundo base: #FAFAF7
- Gradiente de destaque: linear-gradient(135deg, #9B5CF6, #FCD34D)
- Tema: Light

## Entidades principais

### area
- tipo: pessoal | compartilhada
- Área pessoal: criada automaticamente no cadastro do usuário, sigla PES
- Área compartilhada: AEDRU (AED), Arandu (ARN), etc.
- sigla: exatamente 3 letras maiúsculas, imutável após primeira requisição

### demanda
- status: nova | em tratamento | convertida | descartada
- origem: whatsapp | email | ligacao | sistema | presencial | interna
- Entrada rápida, sem fricção — campo de texto livre + seleção de área
- Pode ser convertida em requisição ou descartada

### requisicao
- status: a fazer | em fila | em andamento | aguardando | concluida | cancelada
- Numeração: REQ-[SIGLA]-[000001] sequencial por área
- Fluxo não-linear — transições por ações explícitas, nunca drag and drop
- Pode percorrer múltiplos fluxos em sequência (comercial, chamado, faturamento, etc.)

### fluxo
- Conjunto de etapas que uma requisição percorre
- Exemplos: Comercial, Chamado, Faturamento, Qualificação
- Regras de sequência entre fluxos configuráveis por tipo de requisição

### etapa
- Passo dentro de um fluxo
- Exemplos dentro do Fluxo Comercial: criar proposta → enviar → aguardar retorno → aprovação

### organizacao
- tipo: interna | cliente | fornecedor | outro
- status: ativa | inativa

### contato
- Pessoas vinculadas a organizações
- status: ativo | inativo

### equipamento
- Ativos com campos de qualificação
- Nome calculado na exibição: tipo + marca + tag

### usuario
- tipo: superadmin | admin | usuario
- Tem budibase_id para compatibilidade legada
- Vinculado a um contato

### trilha_auditoria
- Append-only — nunca deletar ou atualizar registros
- Registra todas as mudanças de status, troca de responsável e edições relevantes

## Convenções obrigatórias

- IDs: UUID gerado pelo Supabase (gen_random_uuid())
- Timestamps: criado_em e atualizado_em em todas as tabelas
- Português brasileiro em todo o sistema — interface, banco, código
- Enums com concordância de gênero com o sujeito
- RLS ativo em todas as tabelas

## Painéis Kanban

- Painel Geral: todas as requisições do usuário logado
- Painel Pessoal: só área pessoal
- Painel por Área: filtra por área compartilhada específica
- Colunas fixas — não customizáveis
- Transições por ações explícitas, com registro em trilha_auditoria

## Integrações planejadas

- Bling: ERP — pedidos, faturamento, estoque, clientes
- Autentique: assinatura eletrônica — disparada por etapas do fluxo
- LLM (a definir): agentes contextuais por tela e etapa

## Micro apps planejados

- Qualificação de equipamento: conduz o técnico teste a teste, gera relatório automático
- Relatório de reembolso: vinculado à requisição do chamado, gerado automaticamente
- Outros a identificar conforme uso real

## Nunca fazer

- Nunca deletar ou atualizar registros da trilha_auditoria
- Nunca usar texto livre onde há enum definido
- Nunca criar tabelas sem criado_em e atualizado_em
- Nunca implementar drag and drop no Kanban
- Nunca misturar dados de áreas pessoais com compartilhadas
- Nunca hardcodar IDs de registros no código

## Estado atual — v1.3

Projeto em construção do zero na stack Next.js + Claude Code + VPS.
Reconstrói o que foi validado na v1.2 (Antigravity), com correções e
melhorias identificadas no processo.

Ordem de construção:
1. Setup inicial Next.js + Supabase + autenticação
2. Layout base + sidebar + navegação
3. Caixa de Entrada — registro de demandas
4. Lista de Demandas — filtros e ordenação
5. Detalhe da Demanda — edição e conversão em requisição
6. Kanban — visão macro das requisições
7. Detalhe da Requisição — fluxo, etapas, checklist, anexos, comentários
8. Telas de cadastro — organizações, contatos, equipamentos, usuários
9. Integrações — Bling, Autentique
10. Micro apps — qualificação, reembolso
11. IA contextual — agentes por tela e etapa
