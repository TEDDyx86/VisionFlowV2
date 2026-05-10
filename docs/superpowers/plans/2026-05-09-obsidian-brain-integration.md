# Obsidian Brain Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar a estrutura de pastas do Obsidian e habilitar a persistência de logs no VisionFlow para alimentar o "Cérebro".

**Architecture:** 
- Criação da hierarquia de pastas `Brain/`.
- Atualização do `src/eventLog.js` para salvar eventos no `localStorage`.
- Registro da primeira decisão técnica (ADR) no Obsidian.

**Tech Stack:** JavaScript (ES6), Markdown, LocalStorage.

---

### Task 1: Estrutura do Cofre (Obsidian)

**Files:**
- Create: `Brain/.obsidian/core-plugins.json`
- Create: `Brain/Usuarios/.gitkeep`
- Create: `Brain/Agente/Decisoes/.gitkeep`
- Create: `Brain/Sessoes/.gitkeep`

- [ ] **Step 1: Criar diretórios básicos**
Run: `mkdir -p Brain/Usuarios Brain/Agente/Decisoes Brain/Agente/Erros_Comuns Brain/Sessoes Brain/Design_System`

- [ ] **Step 2: Inicializar o Obsidian Vault**
Criar um arquivo de configuração básica para que o Obsidian reconheça a pasta.
```json
{
  "fileExplorerOrder": "alphabetical",
  "showFileExplorer": true
}
```
Salvar em: `Brain/.obsidian/app.json`

- [ ] **Step 3: Commit inicial da estrutura**
Run: `git add Brain/ && git commit -m "chore: inicializa estrutura do cérebro Obsidian"`

### Task 2: Persistência de Logs no Frontend

**Files:**
- Modify: `c:\Users\Administrator\Documents\GitHub\VisionFlow2.0\src\eventLog.js`

- [ ] **Step 1: Implementar salvamento no LocalStorage**
```javascript
export function logEvent(message) {
    const logList = document.getElementById('log-list');
    
    // Formatar hora local
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour12: false });
    const logEntry = { time: timeString, message: message, timestamp: now.getTime() };

    // Persistência no LocalStorage
    const savedLogs = JSON.parse(localStorage.getItem('visionflow_logs') || '[]');
    savedLogs.push(logEntry);
    // Manter apenas os últimos 50 logs para não estourar o storage
    if (savedLogs.length > 50) savedLogs.shift();
    localStorage.setItem('visionflow_logs', JSON.stringify(savedLogs));

    if (!logList) return;

    const li = document.createElement('li');
    li.innerHTML = `<strong>[${timeString}]</strong> ${message}`;
    logList.insertBefore(li, logList.firstChild);

    if (logList.children.length > 20) {
        logList.removeChild(logList.lastChild);
    }
}
```

- [ ] **Step 2: Testar persistência**
Abrir o `index.html` (ou o navegador já aberto), realizar uma ação e verificar no console: `JSON.parse(localStorage.getItem('visionflow_logs'))`.

- [ ] **Step 3: Commit**
Run: `git add src/eventLog.js && git commit -m "feat: adiciona persistência de logs no localStorage"`

### Task 3: Primeira Nota de Memória (Bootstrap)

**Files:**
- Create: `Brain/Agente/Decisoes/2026-05-09-arquitetura-cerebro.md`

- [ ] **Step 1: Escrever a ADR-001**
```markdown
# ADR-001: Integração do Obsidian como Cérebro de Memória

- **Data**: 2026-05-09
- **Status**: Aceito
- **Contexto**: O sistema VisionFlow precisava de uma forma de lembrar preferências de usuários e registrar decisões técnicas de forma transparente e persistente.
- **Escolha**: Sincronização Assíncrona via Agente.
- **Consequências**: 
    - Positivo: Baixa complexidade técnica no frontend.
    - Negativo: Requer que o Agente faça a "ponte" manualmente entre o browser e o Obsidian.
```

- [ ] **Step 2: Commit**
Run: `git add Brain/Agente/Decisoes/ && git commit -m "docs: registra primeira decisão técnica no cérebro"`
