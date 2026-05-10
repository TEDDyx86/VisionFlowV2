# Obsidian Agentic Memory Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar o sistema de templates do Obsidian e realizar a primeira sincronização de memória baseada nos logs do browser.

**Architecture:** 
- Criação de templates Markdown estruturados para sessões e perfis.
- Extração de logs do LocalStorage via Agente.
- Geração de notas persistentes no vault `Brain/`.

**Tech Stack:** Markdown, Obsidian, LocalStorage.

---

### Task 1: Criar Templates de Memória

**Files:**
- [NEW] `Brain/.obsidian/templates/Sessao_Template.md`
- [NEW] `Brain/.obsidian/templates/User_Profile_Template.md`

- [ ] **Step 1: Criar o diretório de templates**
Run: `mkdir -p Brain/.obsidian/templates`

- [ ] **Step 2: Criar o template de Sessão**
Conteúdo:
```markdown
# Sessão de Uso: {{title}}
- **Data**: {{date}}
- **Duração**: {{duration}}

## 📝 Resumo Narrativo
[Resumo gerado pelo Agente]

## 💡 Insights e Preferências
- [Insight]

## 🛠️ Debug e Erros
- [Erro]
```
Salvar em: `Brain/.obsidian/templates/Sessao_Template.md`

- [ ] **Step 3: Criar o template de Perfil de Usuário**
Conteúdo:
```markdown
# Perfil: {{name}}
- **Primeiro Contato**: {{date}}

## 🎨 Preferências Estéticas
- [Preferência]

## 🧠 Memória Acumulada
- [Fato importante]
```
Salvar em: `Brain/.obsidian/templates/User_Profile_Template.md`

- [ ] **Step 4: Commit**
Run: `git add Brain/.obsidian/templates/ && git commit -m "docs: adiciona templates de memoria para o Obsidian"`

### Task 2: Extração de Logs e Gerar Primeira Sessão

**Files:**
- [NEW] `Brain/Sessoes/2026-05-09-primeira-sincronizacao.md`

- [ ] **Step 1: Extrair logs do LocalStorage**
O Agente deve ler `visionflow_logs` do browser (Page ID: `41278A5CFDE758A0B37478779CEC8CED` ou similar aberta no localhost:8080).

- [ ] **Step 2: Gerar o arquivo de sessão**
Processar os logs e criar a nota em `Brain/Sessoes/2026-05-09-primeira-sincronizacao.md`.
Exemplo de conteúdo baseado nos logs reais (extrair do browser).

- [ ] **Step 3: Commit**
Run: `git add Brain/Sessoes/ && git commit -m "docs: registra primeira sessao de memoria sincronizada"`

### Task 3: Inicializar Perfil de Usuário

**Files:**
- [NEW] `Brain/Usuarios/User_Default.md`

- [ ] **Step 1: Criar o perfil inicial**
Baseado nos logs e na interação até agora, criar `Brain/Usuarios/User_Default.md`.

- [ ] **Step 2: Commit**
Run: `git add Brain/Usuarios/ && git commit -m "docs: inicializa perfil do usuario default"`

### Task 4: Verificação Final

- [ ] **Step 1: Listar arquivos no terminal**
Run: `ls -R Brain/`
Verificar se todos os arquivos estão nos lugares corretos.

- [ ] **Step 2: Atualizar task.md principal**
Marcar tudo como concluído.
