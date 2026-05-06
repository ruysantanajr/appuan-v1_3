---

appuan Documento de Visão e Conceito do Produto Versão 1.3 · Maio de 2026 · Base para o appuan v1.3

---

1. IDENTIDADE DO PRODUTO

1.1 Nome e origem

O appuan nasce da intersecção entre a sabedoria ancestral dos povos originários do território brasileiro, a precisão da engenharia de processos e a modernidade da linguagem digital.

Termo de origem: Apuã — Tupi-Guarani Significado: Redondo, esférico, íntegro, completo Evolução digital: O til (ã) substituído por N para estabilidade técnica em bancos, domínios e comunicações internacionais

1.2 Grafia oficial

Interface, produto, comunicação digital: appuan (minúsculo) Contratos, documentos jurídicos, comunicações formais: Appuan (capitalizado)

---

2. CONCEITO CENTRAL

2.1 O problema que o appuan resolve

Ferramentas de gestão existentes forçam a pessoa a se dividir: um app para tarefas pessoais, outro para tarefas profissionais, outro para estudos, outro para projetos de equipe. Essa fragmentação cria dispersão de informação, perda de contexto e fricção desnecessária no dia a dia.

O appuan parte de uma premissa diferente: a pessoa que usa o sistema é uma só. Não existe um "você profissional" separado do "você pessoal" ou do "você estudante". Forçar essa separação em ferramentas diferentes gera dispersão e dificulta a execução.

2.2 A proposta do appuan

O appuan é uma plataforma unificada que reúne, num só lugar, a gestão de todas as dimensões da vida de quem o usa — pessoal, profissional, educacional ou qualquer outra — com regras rígidas de separação de visibilidade e compartilhamento entre áreas.

O que é pessoal é exclusivo do usuário. O que é de equipe é compartilhado apenas com quem deve ver. Sem mistura, sem vazamento, sem confusão.

Sobre tudo isso: controles completos de SLA, trilha de auditoria, fluxo e responsável — independente de ser uma tarefa pessoal ou uma demanda corporativa.

2.3 Posicionamento

O appuan não é um app de nicho. É uma plataforma que substitui vários apps de mercado — alguns com funcionalidades simplificadas, outros com funcionalidades adicionais — tudo dentro de uma interface única, sem que o usuário precise migrar de ferramenta para executar seu trabalho.

---

3. ESTRUTURA FUNCIONAL

3.1 Áreas

Toda atividade no appuan pertence a uma área. Existem dois tipos:

Pessoal: exclusiva de cada usuário, criada automaticamente no cadastro. O que está aqui só o próprio usuário vê.

Compartilhada: pertence a um grupo de usuários — uma empresa, um time, um projeto. Ex: AEDRU, Arandu Cultural, Itaú, AmBev. O acesso é controlado por permissão.

O usuário vê tudo que lhe pertence — pessoal e compartilhado — no mesmo painel, sem precisar trocar de ferramenta ou de contexto.

3.2 Demandas — a caixa de entrada

A caixa de entrada é o ponto de captura rápida do appuan. Qualquer ideia, pedido, tarefa ou informação pode ser registrada ali na hora — mesmo incompleta, mesmo mal escrita. O importante é não perder.

Cada registro é chamado de demanda. Ela pertence a uma área e fica numa lista para tratamento posterior.

A demanda é simples por design: uma área de seleção e um campo de texto livre. Sem formulários complexos, sem campos obrigatórios além do essencial. A captura tem que ser rápida e sem fricção.

3.3 Requisições — a entidade central

Quando uma demanda é tratada e confirmada como algo concreto a executar, ela é convertida em requisição. A requisição é a entidade central do appuan — é onde o trabalho acontece de fato.

A conversão é explícita e intencional. Nem toda demanda vira requisição — algumas são descartadas no tratamento.

3.4 Kanban — a visão macro

As requisições são geridas em painéis Kanban. As colunas são fixas e não customizáveis — simples e suficientes para qualquer tipo de requisição:

A fazer → Em fila → Em andamento → Aguardando → Concluída · Cancelada

Lógica das transições:

A fazer: requisição criada, sem destino definido ainda Em fila: encaminhada para um usuário ou time, ainda não assumida Em andamento: assumida e em execução Aguardando: pausada, dependendo de evento externo Concluída ou Cancelada: de qualquer estado, a qualquer momento

Diferença fundamental em relação ao Trello: não existe arrastar e soltar. Toda mudança de status acontece por ações explícitas — botões, confirmações, menus. Isso garante que cada transição seja um evento registrável, auditável e passível de regras de SLA.

3.5 Painéis — os diferentes níveis de visão

Painel Geral: mostra todas as requisições do usuário logado — pessoais, de equipe, de projetos próprios e de projetos compartilhados com ele. Uma visão única de tudo que ele tem que fazer, sem precisar migrar entre painéis.

Painel Pessoal: filtra apenas as requisições da área pessoal do usuário.

Painel por Área: filtra as requisições de uma área compartilhada específica — AEDRU, Arandu Cultural, etc.

3.6 Fluxos e etapas — a visão micro

Cada requisição pode percorrer um ou mais fluxos em sequência. Dentro de cada fluxo, existem etapas definidas.

No Kanban, o usuário vê o status macro da requisição. Ao entrar nela, vê em qual fluxo ela está e em qual etapa desse fluxo — quem está com ela, o que está esperando, o que precisa acontecer para avançar.

Exemplo de uma requisição de serviço na AEDRU:

Fluxo Comercial: criar proposta → enviar → aguardar retorno → editar → aprovação do cliente

Fluxo de Chamado: abrir chamado → verificar documentação → verificar técnico → verificar equipamento → agendar → executar

Fluxo de Faturamento: emitir → enviar → receber

A requisição percorre esses fluxos em sequência. No macro ela aparece "em andamento" — quem precisa do detalhe entra e vê exatamente onde está.

As regras de quais fluxos uma requisição pode percorrer, e em que ordem, são configuráveis e serão definidas por tipo de requisição em versões futuras.

---

4. TELAS DE SUPORTE E MICRO APPS

4.1 Telas de cadastro e estrutura

São as telas que alimentam o sistema e dão suporte às requisições:

Organizações: clientes, fornecedores, parceiros e entidades internas Contatos: pessoas vinculadas a organizações Equipamentos: ativos com campos de qualificação e histórico Usuários: membros do sistema com controle de acesso por área Áreas: gestão das áreas pessoais e compartilhadas Documentos: criação, armazenamento e versionamento de documentos vinculados a tipos de serviço

4.2 Telas de produção

São telas de trabalho vinculadas ao fluxo das requisições:

Propostas: preparação e envio de propostas comerciais Relatórios: geração de relatórios vinculados a requisições e chamados

4.3 Dentro da requisição

Cada requisição tem ferramentas internas de trabalho:

Checklist: listas de verificação por etapa Anexos: imagens, PDFs e documentos vinculados Comentários: comunicação interna sobre a requisição Fluxo e etapa atual: visibilidade do caminho percorrido Trilha de auditoria: histórico completo de todas as ações

4.4 Micro apps

O appuan absorve ferramentas externas que hoje vivem espalhadas, desde que tenham relação com o fluxo de trabalho já registrado dentro do sistema.

A lógica é: se o dado já está na requisição, o micro app não precisa pedir de novo — ele aproveita o que já existe.

Exemplo 1 — Relatório de Reembolso: hoje uma planilha separada no App Sheet, preenchida manualmente após consultar o sistema de chamados. No appuan, vira um micro app vinculado à requisição do chamado. Os dados do técnico, do equipamento e do serviço já estão lá — o relatório é gerado automaticamente.

Exemplo 2 — Qualificação de Equipamento: hoje o técnico copia dados do sistema de chamados, preenche uma planilha Excel, exporta como PDF, junta com outros PDFs e monta o relatório final manualmente. No appuan, a qualificação é uma etapa dentro do fluxo de chamado. O técnico é conduzido teste a teste dentro do próprio sistema, os dados do equipamento já estão puxados da requisição, ele anexa fotos e relatórios dos instrumentos ali mesmo, e o relatório final é gerado automaticamente ao concluir. O técnico nunca sai do appuan.

Outros micro apps serão identificados e incorporados conforme o uso real do sistema.

---

5. INTEGRAÇÕES

5.1 Bling (ERP)

Integração via API com o ERP utilizado na AEDRU e na Arandu Cultural. O appuan se conecta ao Bling para troca de dados de pedidos, faturamento, estoque e clientes. O que depende do Bling acontece dentro do fluxo da requisição — sem o usuário precisar abrir o ERP separado.

5.2 Autentique (Assinatura Eletrônica)

Integração via API com o sistema de assinatura eletrônica utilizado nas duas empresas. Quando uma etapa do fluxo exigir assinatura — proposta, relatório, contrato — o appuan envia o documento ao Autentique e monitora o status. Quando concluída a assinatura, o fluxo avança automaticamente dentro do appuan.

5.3 Regra geral das integrações

As integrações são disparadas por eventos dentro do fluxo das requisições. O momento exato de cada disparo e o que acontece no appuan quando a integração responde serão definidos durante o desenvolvimento de cada fluxo.

---

6. INTELIGÊNCIA ARTIFICIAL

O appuan integra uma ou mais LLMs para oferecer agentes de IA contextuais a todos os usuários, em todas as telas e etapas do sistema.

Não é um chatbot genérico colado no canto da tela. É um agente que sabe exatamente onde o usuário está e o que ele está fazendo — e age de acordo com esse contexto.

Exemplos de aplicação:

No cadastro de equipamento: conduz o usuário campo a campo, explica o que cada informação significa, valida o que está sendo preenchido.

Na qualificação: conhece o equipamento, o histórico de qualificações anteriores e os testes que faltam. Pode alertar sobre valores fora do esperado para aquele modelo.

No fluxo comercial: conhece o cliente, o histórico de propostas e as condições acordadas. Sugere o template correto e alerta sobre inconsistências.

Em qualquer etapa: responde dúvidas, explica o que fazer, identifica erros e orienta a correção — sem o usuário precisar consultar um manual.

Decisão de LLM: a arquitetura do appuan será construída de forma que a LLM seja plugável — hoje possivelmente Gemini (aproveitando o Google Workspace já contratado), amanhã Claude ou GPT se fizer mais sentido. O sistema não ficará preso a um único provedor.

---

7. STACK TÉCNICA — v1.3

Banco de dados: Supabase (PostgreSQL) — mesmo projeto da v1.2 Frontend: Next.js \+ TypeScript \+ Tailwind CSS \+ shadcn/ui Deploy: Cloudflare Pages — domínio appuan.app Repositório: GitHub Desenvolvimento: Claude Code em VPS Oracle Cloud Free Tier Acesso mobile ao desenvolvimento: Termius (SSH) → VPS → Claude Code Custo operacional: zero na fase de construção

---

8. IDENTIDADE VISUAL

Cor principal (Purple): \#6B21D4 Cor de apoio (Purple Light): \#9B5CF6 Fundo de cards (Purple Ultra): \#EDE9FE Dourado institucional (Gold): \#D4A017 Azul profissional (Blue): \#1D4ED8 Fundo base: \#FAFAF7 (Cream) Texto principal dark: \#0D0D0D (Ink)

Gradiente de destaque: linear-gradient(135deg, \#9B5CF6 → \#FCD34D)

Codificação por núcleo: Pessoal: Roxo (\#6B21D4) Educacional: Dourado (\#D4A017) Profissional: Azul (\#1D4ED8)

---

9. CONTEXTO DE DESENVOLVIMENTO

O appuan v1.3 é uma reconstrução do appuan v1.2 na nova stack (Next.js \+ Claude Code \+ VPS), desenvolvida em paralelo à versão em Antigravity. As funcionalidades do MVP seguem o que foi construído e validado na v1.2, com correções e ajustes identificados durante o processo. Novas funcionalidades — fluxos avançados, micro apps, integrações e IA — serão incorporadas progressivamente após a base estar estável.

---

appuan v1.3 · AEDRU \+ Pessoal · Maio de 2026 Documento gerado por PROMETEU — Ecossistema LOGOS

---

