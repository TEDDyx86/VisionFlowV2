# Redesign Homepage And Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o sistema VisionFlow em um modelo de templates comerciais (para "vender" a ideia). Vamos criar 5 páginas interativas (Visualizador 3D, Kiosk, Mercado, Restaurante, Hospital) com designs únicos gerados via Stitch MCP e alimentados por dados reais raspados via FireCrawl MCP.

**Architecture:** 
1. **FireCrawl (Data Scraping):** Buscaremos dados reais (ex: cardápios de restaurantes, itens de mercado) de plataformas reais para preencher os templates.
2. **Stitch (UI Generation):** Criaremos um novo projeto no Stitch e geraremos telas modernas e estilizadas para cada ambiente de negócio.
3. **Integração Front-end:** Injetaremos o `app.js` (MediaPipe Hands) e o CSS global nas telas geradas pelo Stitch para habilitar a navegação sem toque (pinch-to-click e cursor).
4. **Navegação:** O `index.html` será atualizado para atuar como um hub/menu principal linkando para os 5 templates.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, MediaPipe Hands, Stitch MCP, FireCrawl MCP.

## User Review Required

> [!IMPORTANT]
> **Estratégia de Scraping e Geração de UI**
> 1. Para o FireCrawl: Há algum site específico que você gostaria que eu usasse como base para raspar o cardápio do restaurante ou os itens do mercado? Se não, usarei sites públicos de exemplo.
> 2. Para o Stitch: Você quer que eu exporte os códigos HTML/CSS gerados pelo Stitch e salve-os localmente no repositório (ex: `example-restaurant.html`), ou apenas mantenha os projetos no servidor do Stitch e os incorpore via iframe? O plano atual assume a exportação do código para a raiz do projeto para a integração fácil com o `app.js` (pois o MediaPipe precisa acessar o DOM).

## Open Questions

> [!NOTE]
> Você quer aplicar alguma paleta de cores global aos templates (Design System do Stitch) ou cada template de negócio deve ter sua própria identidade visual (ex: Azul para Hospital, Laranja para Restaurante)?

## Proposed Changes

---

### Task 1: Coleta de Dados via FireCrawl

**Objetivo:** Obter dados reais para popular os templates de Restaurante e Mercado.

- [ ] **Step 1: Raspar dados de Restaurante**
  - Executar o `mcp_firecrawl_firecrawl_search` para "menu de restaurante fast food preços".
  - Salvar os itens em um arquivo temporário (`scratch/restaurant_data.json`).
- [ ] **Step 2: Raspar dados de Mercado**
  - Executar o `mcp_firecrawl_firecrawl_search` para "itens básicos de supermercado preços".
  - Salvar os itens em um arquivo temporário (`scratch/market_data.json`).

### Task 2: Geração de Interfaces via Stitch MCP

**Objetivo:** Criar um projeto no Stitch e gerar as 5 telas comerciais.

- [ ] **Step 1: Criar Projeto no Stitch**
  - Chamar `mcp_stitch_create_project` com o nome "VisionFlow Templates".
- [ ] **Step 2: Gerar Tela de Restaurante**
  - Chamar `mcp_stitch_generate_screen_from_text` usando os dados do `restaurant_data.json`.
  - Prompt: "Crie uma interface de autoatendimento (totem) de restaurante com os itens X, Y e Z. Design moderno, botões grandes e chamativos. Deve conter uma barra superior com botão de 'Voltar'."
- [ ] **Step 3: Gerar Tela de Mercado**
  - Chamar `mcp_stitch_generate_screen_from_text` usando os dados do `market_data.json`.
  - Prompt: "Crie uma interface de self-checkout de mercado exibindo os itens A, B, C. Design limpo. Botões de 'Adicionar ao Carrinho'."
- [ ] **Step 4: Gerar Tela de Hospital**
  - Chamar `mcp_stitch_generate_screen_from_text`.
  - Prompt: "Totem de triagem de hospital. Botões grandes: Pronto Socorro, Retirar Exames, Agendar Consulta. Design transmitindo saúde (azul/branco)."
- [ ] **Step 5: Gerar Tela de Kiosk Universitário**
  - Chamar `mcp_stitch_generate_screen_from_text`.
  - Prompt: "Mapa interativo / diretório de shopping ou universidade. Botões para Biblioteca, Praça de Alimentação, Laboratórios."
- [ ] **Step 6: Gerar Tela de Visualizador 3D**
  - Chamar `mcp_stitch_generate_screen_from_text`.
  - Prompt: "Interface para visualizar modelos 3D de produtos. Fundo escuro premium. Área central grande para o modelo, botões laterais para rotacionar."

### Task 3: Extração de Código e Integração com VisionFlow

**Objetivo:** Extrair o código gerado pelo Stitch e integrar a navegação sem toque (MediaPipe).

- [ ] **Step 1: Obter o código gerado pelo Stitch**
  - Para cada tela gerada, obter o HTML resultante.
  - Criar arquivos locais na raiz do repositório: `example-restaurant.html`, `example-market.html`, etc.
- [ ] **Step 2: Injetar as dependências do VisionFlow**
  - Modificar os arquivos HTML criados para injetar o `app.js` (MediaPipe Hands).
  - Adicionar no `<head>` a importação dos scripts do MediaPipe necessários e do `styles.css`.
  - Adicionar a classe `interactable` nos botões gerados pelo Stitch para permitir cliques por pinça.

### Task 4: Atualizar a Página Inicial (index.html)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Atualizar o Menu Principal**
  - Modificar a `<main class="interaction-area">` do `index.html` para exibir 5 botões de navegação estilizados direcionando para as 5 novas páginas HTML geradas.
  - Testar a transição entre a página inicial e os templates.

## Verification Plan

### Automated Tests
- Verificar se os arquivos `example-*.html` foram criados com sucesso.
- O FireCrawl deve retornar conteúdo legível sobre cardápios e produtos.

### Manual Verification
1. Abrir `index.html` no navegador.
2. Levantar a mão e mover o cursor via câmera.
3. Fazer o gesto de pinça para clicar no template de Restaurante.
4. Verificar se a tela de Restaurante carrega com o design do Stitch (e os dados do FireCrawl) e se o rastreamento da mão funciona nela.
5. Repetir a verificação para os outros 4 cenários.
