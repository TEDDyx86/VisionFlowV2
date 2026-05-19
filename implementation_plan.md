# Dwell-to-Click — Plano de Implementação

> **Para agentes:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para implementar tarefa-a-tarefa.

**Goal:** Substituir a pinça como mecanismo primário de clique pelo dwell (cursor parado sobre elemento por ~800ms), configurando cada botão e card individualmente com `class="dwellable"`.

**Architecture:** O `controllers.js` já possui a infraestrutura de dwell (`startDwell`, `cancelDwell`, `updateDwellProgress`, `DWELL_TIME`) mas ela só dispara quando o elemento tem a classe `dwellable`. O plano adiciona essa classe em todos os elementos `interactable` dos 4 templates e do `index.html`, além de refatorar o `DWELL_TIME` para ser configurável por elemento via `data-dwell-time`. A pinça continua funcionando como fallback — não é removida.

**Tech Stack:** Vanilla JS ES Modules, MediaPipe Hands (landmark[8] = INDEX_FINGER_TIP), CSS via Tailwind + classes customizadas.

---

## Contexto Técnico — Entender Antes de Codar

### Como o Dwell já funciona (controllers.js)

```
updateCursor(x, y) → detecta elemento em (x,y)
  → se elemento tem .interactable E .dwellable → startDwell()
  → se cursor sair → cancelDwell()
  → ao completar DWELL_TIME ms → triggerClick(x, y)
```

**O que está faltando:**
1. `DWELL_TIME = 3000ms` — muito longo. Precisa ser ~800ms.
2. Não lê `data-dwell-time` do elemento — sem configuração por botão.
3. Nenhum dos `interactable` nos templates tem `dwellable` — dwell nunca dispara nos templates.

### Inventário de elementos por arquivo

| Arquivo | # interactable | # dwellable atual |
|---|---|---|
| `index.html` | 7 | 0 |
| `example-university.html` | 39 | 0 |
| `example-hospital.html` | 53 | 0 |
| `example-restaurant.html` | 10 | 0 |
| `example-market.html` | 5 | 0 |

---

## Arquivos Modificados

| Arquivo | Mudança |
|---|---|
| `src/controllers.js` | Lê `data-dwell-time`, reduz DWELL_TIME default para 800ms |
| `index.html` | Adiciona `dwellable` nos 7 interactables |
| `example-university.html` | Adiciona `dwellable` nos 39 interactables |
| `example-hospital.html` | Adiciona `dwellable` nos 53 interactables |
| `example-restaurant.html` | Adiciona `dwellable` nos 10 interactables |
| `example-market.html` | Adiciona `dwellable` nos 5 interactables |

---

## Task 1 — Refatorar controllers.js: DWELL_TIME configurável por elemento

**Files:**
- Modify: `src/controllers.js:7-52`

- [ ] **Step 1: Substituir o bloco de dwell (linhas 7–52) pelas versões com suporte a `data-dwell-time`**

```js
// Dwell Actions
let dwellStartTime = 0;
let dwellAnimationFrame = null;
let activeDwellElement = null;
const DWELL_TIME_DEFAULT = 800; // ms — reduzido de 3000ms para uso gestual

function getDwellTime(element) {
    if (element && element.dataset.dwellTime) {
        return parseInt(element.dataset.dwellTime, 10);
    }
    return DWELL_TIME_DEFAULT;
}

function updateDwellProgress() {
    const now = Date.now();
    const elapsed = now - dwellStartTime;
    const dwellTime = getDwellTime(activeDwellElement);
    const progress = Math.min(elapsed / dwellTime, 1);

    if (cursorElement) {
        const circle = cursorElement.querySelector('.cursor-dwell-circle');
        if (circle) {
            const maxOffset = 176;
            circle.style.strokeDashoffset = maxOffset - (maxOffset * progress);
        }
    }

    if (progress >= 1) {
        if (cursorElement) cursorElement.classList.remove('dwelling');
        triggerClick(parseFloat(cursorElement.style.left), parseFloat(cursorElement.style.top));
        cancelDwell();
    } else {
        dwellAnimationFrame = requestAnimationFrame(updateDwellProgress);
    }
}

function startDwell(element) {
    cancelDwell();
    activeDwellElement = element;
    dwellStartTime = Date.now();
    if (cursorElement) cursorElement.classList.add('dwelling');
    dwellAnimationFrame = requestAnimationFrame(updateDwellProgress);
}

function cancelDwell() {
    if (dwellAnimationFrame) {
        cancelAnimationFrame(dwellAnimationFrame);
        dwellAnimationFrame = null;
    }
    activeDwellElement = null;
    if (cursorElement) {
        cursorElement.classList.remove('dwelling');
        const circle = cursorElement.querySelector('.cursor-dwell-circle');
        if (circle) circle.style.strokeDashoffset = 176;
    }
}
```

- [ ] **Step 2: Atualizar chamada de `startDwell` dentro de `updateCursor` (~linha 135) para passar o elemento**

```js
// Antes:
if (element.classList.contains('dwellable')) {
    startDwell();
}

// Depois:
if (element.classList.contains('dwellable')) {
    startDwell(element);
}
```

- [ ] **Step 3: Verificar console do browser — sem erros vermelhos**

- [ ] **Step 4: Commit**

```bash
git add src/controllers.js
git commit -m "feat(dwell): DWELL_TIME configuravel por elemento via data-dwell-time (default 800ms)"
```

---

## Task 2 — index.html: Adicionar `dwellable` nos 7 interactables

**Files:**
- Modify: `index.html:163-208`

- [ ] **Step 1: Localizar os 7 interactables**

```powershell
Select-String -Path "index.html" -Pattern "class=.+interactable" | Select-Object LineNumber, Line
```

- [ ] **Step 2: Adicionar `dwellable` nos 5 cards de template (linhas ~163-187)**

```html
<!-- Antes -->
<div class="interactable flex flex-col ...">
<!-- Depois (data-dwell-time padrão = 800ms) -->
<div class="interactable dwellable flex flex-col ..." data-dwell-time="800">
```

- [ ] **Step 3: Adicionar `dwellable` nos 2 botões (linhas ~196, ~208)**

```html
<!-- btn-tutorial -->
<button id="btn-tutorial" class="interactable dwellable ..." data-dwell-time="800">

<!-- btn-back-home -->
<button id="btn-back-home" class="interactable dwellable ..." data-dwell-time="600">
```

- [ ] **Step 4: Testar — cursor sobre card por 800ms deve navegar para template**

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(dwell): ativa dwell-to-click nos 7 interactables do index.html"
```

---

## Task 3 — example-university.html: 39 interactables com tempos por tipo

**Files:**
- Modify: `example-university.html`

**Mapeamento de tempos:**

| Tipo de elemento | `data-dwell-time` | Razão |
|---|---|---|
| Cards principais (abrem modal) | `800` | Ação primária — padrão |
| Botões BottomNav | `600` | Navegação frequente — mais rápido |
| Botões X fechar modal | `500` | Ação de escape — mais rápido |
| Botões internos de modal | `800` | Padrão |

- [ ] **Step 1: Aplicar nos 6 cards (linhas ~380-435) com `data-dwell-time="800"`**

```html
<div onclick="showModal('modal-biblioteca')"
     class="interactable dwellable glass-card ..."
     data-dwell-time="800">
```

- [ ] **Step 2: Aplicar nos 5 botões BottomNav (linhas ~448-470) com `data-dwell-time="600"`**

```html
<button id="bnav-home"
        onclick="setActiveBottomNav('home')"
        class="interactable dwellable ..."
        data-dwell-time="600">
```

- [ ] **Step 3: Aplicar nos botões X de fechar modal com `data-dwell-time="500"`**

```powershell
Select-String -Path "example-university.html" -Pattern "closeModal" | Select-Object LineNumber, Line
```

- [ ] **Step 4: Aplicar nos demais botões internos com `data-dwell-time="800"`**

- [ ] **Step 5: Testar — cada card abre o modal correto via dwell**

- [ ] **Step 6: Commit**

```bash
git add example-university.html
git commit -m "feat(dwell): ativa dwell-to-click nos 39 interactables da universidade"
```

---

## Task 4 — example-hospital.html: 53 interactables com tempos por tipo

**Files:**
- Modify: `example-hospital.html`

**Mapeamento de tempos:**

| Tipo de elemento | `data-dwell-time` | Razão |
|---|---|---|
| Cards de especialidade | `800` | Padrão |
| Botões BottomNav | `600` | Navegação frequente |
| Botões X fechar modal | `500` | Ação de escape |
| Botão de emergência | `1500` | Evitar acionamento acidental |

> [!CAUTION]
> O botão de emergência DEVE ter `data-dwell-time="1500"` — ação crítica, precisa de intenção clara.

- [ ] **Step 1: Identificar todos os 53 interactables**

```powershell
Select-String -Path "example-hospital.html" -Pattern "interactable" | Select-Object LineNumber, Line
```

- [ ] **Step 2: Aplicar `dwellable` por grupo (A→D)**

- [ ] **Step 3: Testar no browser**

- [ ] **Step 4: Commit**

```bash
git add example-hospital.html
git commit -m "feat(dwell): ativa dwell-to-click nos 53 interactables do hospital (emergencia=1500ms)"
```

---

## Task 5 — example-restaurant.html: 10 interactables

**Files:**
- Modify: `example-restaurant.html`

**Mapeamento:**

| Tipo | `data-dwell-time` |
|---|---|
| Links sidebar (scroll-spy) | `600` |
| Cards de produto | `800` |
| Botão confirmar pedido | `1000` |

- [ ] **Step 1: Aplicar por grupo**
- [ ] **Step 2: Testar scroll-spy + dwell em conjunto**
- [ ] **Step 3: Commit**

```bash
git add example-restaurant.html
git commit -m "feat(dwell): ativa dwell-to-click nos 10 interactables do restaurante"
```

---

## Task 6 — example-market.html: 5 interactables

**Files:**
- Modify: `example-market.html`

**Mapeamento:**

| Tipo | `data-dwell-time` |
|---|---|
| Links categoria TopNav | `600` |
| Cards de produto | `800` |
| Botão carrinho | `1000` |

- [ ] **Step 1: Aplicar `dwellable` nos 5 elementos**
- [ ] **Step 2: Testar no browser**
- [ ] **Step 3: Commit**

```bash
git add example-market.html
git commit -m "feat(dwell): ativa dwell-to-click nos 5 interactables do market"
```

---

## Task 7 — Melhorar visibilidade do halo de dwell

**Files:**
- Modify: `index.html` bloco CSS `.cursor-dwell-circle`

O cursor SVG está em `index.html` e flutua sobre os iframes — o CSS já está acessível.

- [ ] **Step 1: Ajustar stroke do halo para maior visibilidade**

```css
.cursor-dwell-circle {
    fill: none;
    stroke: #7C3AED;   /* roxo — cor primária VisionFlow */
    stroke-width: 4;
    stroke-dasharray: 176;
    stroke-dashoffset: 176;
    transition: stroke-dashoffset 0.05s linear;
}
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "fix(cursor): melhora visibilidade do halo circular de dwell"
```

---

## Task 8 — Teste de regressão

- [ ] **Checklist de testes manuais:**

| Cenário | Esperado |
|---|---|
| Cursor sobre card por 800ms | Modal/ação abre |
| Cursor sai antes de 800ms | Halo reseta, sem ação |
| BottomNav dwell 600ms | Aba muda |
| Botão X dwell 500ms | Modal fecha |
| Pinça (fallback) | Click imediato |
| Pinça segurando + mover | Scroll inalterado |
| Botão emergência dwell 1500ms | Dispara somente com espera longa |

- [ ] **Commit final**

```bash
git add -A
git commit -m "test: valida dwell-to-click em todos os templates — pinça mantida como fallback"
```

---

## Decisões Abertas para Aprovação

> [!IMPORTANT]
> **Pergunta 1 — Pinça como fallback:** Mantemos a pinça funcionando em paralelo com o dwell, ou desativamos para forçar o novo comportamento?

> [!IMPORTANT]
> **Pergunta 2 — Tempo padrão:** 800ms é o valor proposto. Quer ajustar para mais (1000ms = menos acidentes) ou menos (600ms = mais ágil)?

> [!NOTE]
> **Risco baixo:** A infraestrutura de dwell já existe em `controllers.js`. A implementação é essencialmente adicionar atributos HTML — sem lógica nova complexa.
