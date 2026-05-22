# Design Spec: University Map — Mapbox Clean Redesign

**Date:** 2026-05-22
**Status:** Approved
**Topic:** Renovação completa do modal de mapa do campus — visual urbano moderno + interação gestual nativa

---

## 1. Overview

Renovação completa do modal `modal-map` no template `example-university.html`. O objetivo é substituir o estilo acadêmico genérico atual por uma estética de mapa urbano moderno (referência: Mapbox/Google Maps minimalista), ao mesmo tempo em que se resolve a UX gestual com alvos maiores, dwell nativo nos edifícios SVG e feedback de hover sincronizado entre mapa e sidebar.

Não são adicionadas funcionalidades novas (sem andares, sem filtros complexos, sem dados externos). O foco é execução perfeita do que já existe.

---

## 2. Escopo

**Dentro do escopo:**
- Redesign visual do SVG do campus (paleta, ruas, edifícios, marcadores)
- Redesign dos tiles da sidebar (tamanho, estados, distância estimada)
- Camada gestual: dwell nos `<rect>` SVG, hover sincronizado mapa↔sidebar
- Animação de rota (efeito "linha no asfalto" com dupla path)
- Feedback dinâmico no footer do modal

**Fora do escopo:**
- Sub-mapas de andares
- Dados de ocupação em tempo real
- Dark mode toggle
- Novos destinos além dos 5 existentes

---

## 3. Visual Design — Mapa SVG

### Paleta

| Elemento | Valor atual | Novo valor |
|---|---|---|
| Fundo do mapa | `#f8fafc` | `#e8e8e8` |
| Ruas | `stroke: #f1f5f9`, `width: 24` | `stroke: #ffffff`, `width: 32` |
| Calçadas | `stroke: #e2e8f0`, `width: 28` | **removidas** |
| Áreas verdes | `#f0fdf4` | `#c8dbc0` (sage urbano) |
| Edifícios — fill | `#ffffff` | `#fafaf8` |
| Edifícios — stroke | `#115cb9`, `width: 2.5` | **removido** — substituído por `drop-shadow(0 4px 12px rgba(0,0,0,0.12))` |
| Rota | `stroke: #115cb9`, `width: 5` | dupla path (ver seção 5) |
| Labels | `font-size: 11px`, `fill: #334155` | `font-size: 13px`, `fill: #1e293b`, pill branco semitransparente |

### Marcadores

**"Você Está Aqui":**
- Círculo central: `r: 8`, `fill: #ef4444`
- Anel externo estático: `r: 14`, `stroke: #ef4444`, `stroke-width: 2`, `fill: none`
- Anel sonar: `<circle>` fixo `r: 18`, `stroke: #ef4444`, `stroke-width: 1.5`, `fill: none`, envolvido em `<g class="sonar-ring">` com `animation: sonar 2s ease-out infinite`

```css
@keyframes sonar {
  0%   { transform: scale(1);   opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0;   }
}
/* transform-origin precisa ser definido no centro do marcador via SVG transform-box */
.sonar-ring { transform-box: fill-box; transform-origin: center; }
```

**Pin de destino** (aparece ao final da rota):
- Círculo `r: 10`, `fill: #16a34a`, ponto branco central `r: 4`
- Entrada: `animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`

```css
@keyframes popIn {
  0%   { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
```

---

## 4. Sidebar

### Dimensões

- Largura: `w-80` → `w-96` (384px)
- Altura mínima dos tiles: 88px
- Ícone: 48px → 56px

### Estrutura de cada tile

```
┌──────────────────────────────────────────┐
│  [ícone 56px]  Nome do Bloco             │  altura mínima: 88px
│                Curso / Serviço           │
│                ● Xm · ~Y min             │
└──────────────────────────────────────────┘
```

Distâncias estimadas fixas (calculadas a partir da entrada principal):

| Destino | Distância | Tempo estimado |
|---|---|---|
| Bloco A — Direito | 120m | ~2 min |
| Bloco B — Adm | 200m | ~3 min |
| Bloco C — Software | 280m | ~4 min |
| Biblioteca | 150m | ~2 min |
| Restaurante (RU) | 310m | ~4 min |

### Estados dos tiles

| Estado | Estilo |
|---|---|
| Repouso | `bg-white`, `border: #e2e8f0`, `shadow-sm` |
| Hover | `border: #2563eb 2px`, `bg: #eff6ff`, `scale(1.03)`, pulso no ícone |
| Ativo | `border: #2563eb 3px`, `bg: #dbeafe`, badge "Rota ativa" verde |
| Dwell em progresso | anel SVG circular sobre o ícone (stroke-dashoffset, 2s) |

### Cabeçalho da sidebar

Substitui o label "Destinos no Campus" por dois botões dwellable: `Todos` (ativo por padrão) e `Serviços`. Ambos são `interactable dwellable`. Por ora, ambos exibem os mesmos 5 destinos — a separação existe para expansão futura sem refatoração.

---

## 5. Animação de Rota — Efeito "Linha no Asfalto"

Cada destino passa a ter **duas** paths sobrepostas no SVG:

```html
<!-- Path de fundo (branca, desenha primeiro) -->
<path id="path-bg-Direito" d="..." class="nav-path-bg" />
<!-- Path principal (azul, desenha com delay de 200ms) -->
<path id="path-Direito" d="..." class="nav-path" />
```

```css
.nav-path-bg {
  stroke: white;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  opacity: 0;
}

.nav-path-bg.active {
  opacity: 0.9;
  animation: drawPath 1.2s ease-out forwards;
}

.nav-path {
  stroke: #2563eb;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  opacity: 0;
}

.nav-path.active {
  opacity: 1;
  animation: drawPath 1.2s ease-out 0.2s forwards;
}
```

Ao acionar `drawRoute(id)`:
1. Limpa todas as paths ativas e o pin de destino anterior
2. Ativa `path-bg-{id}` e `path-{id}` com classe `active`
3. Após 1.4s (fim da animação), exibe o pin de destino no SVG
4. Atualiza o footer com o texto de instrução

---

## 6. Camada Gestual

### Dwell nos edifícios SVG

Cada `<rect>` de edifício recebe:
- `data-route="NomeDoDestino"`
- Dimensões expandidas para área de hit mínima de **120×90px** no viewBox SVG (1000×700). Os blocos atuais têm 120×100px — já atendem. Blocos menores que isso precisam de um `<rect>` invisível sobreposto (`fill: transparent`, `pointer-events: all`) com as dimensões mínimas, preservando o visual original.

O iframe escuta `VISIONFLOW_HOVER` e calcula qual `<rect>` está sob o cursor via `document.elementFromPoint()`. Ao entrar num `<rect>` com `data-route`:
1. Envia `VISIONFLOW_DWELL_START` ao parent
2. Exibe anel de progresso SVG sobre o edifício (elemento `<circle>` dedicado por bloco, animado por `stroke-dashoffset` em 2s)
3. Ao completar 2s, aciona `drawRoute(data-route)`

Ao sair do `<rect>`:
1. Envia `VISIONFLOW_DWELL_CANCEL` ao parent
2. Oculta o anel de progresso SVG

### Hover sincronizado (mapa ↔ sidebar)

Ao receber `VISIONFLOW_HOVER` dentro de um `<rect>` de edifício:
- O `<rect>` recebe `filter: drop-shadow(0 0 16px rgba(37,99,235,0.4))`
- A label do bloco: `opacity: 1`, `fill: #2563eb`
- O tile correspondente na sidebar: outline pulse 300ms (`animation: sidebarPulse`)

```css
@keyframes sidebarPulse {
  0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
  70%  { box-shadow: 0 0 0 8px rgba(37,99,235,0); }
  100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
}
```

---

## 7. Footer Dinâmico

O footer do modal passa a ter três estados:

| Estado | Texto | Duração |
|---|---|---|
| Padrão | "Selecione um destino na lista ou aponte para um edifício" | — |
| Calculando | "Calculando trajeto..." + spinner | Durante animação (~1.4s) |
| Rota ativa | "Siga em frente até [Destino] — aproximadamente [X]m · ~Y min" | Até nova seleção ou 8s de inatividade |

Após 8s sem interação (sem hover detectado), o footer volta ao estado padrão com `fade` de 500ms e as paths ativas são limpas.

---

## 8. Arquitetura de Implementação

Todas as mudanças ficam **confinadas ao `modal-map` dentro de `example-university.html`**. Nenhum arquivo externo é alterado.

### Mudanças no HTML/SVG
- Substituir paleta de cores nas classes CSS do mapa
- Adicionar `path-bg-*` para cada destino
- Adicionar elementos SVG para pins de destino (inicialmente `display: none`)
- Adicionar anéis sonar ao marcador "Você Está Aqui"
- Adicionar anéis de progresso dwell sobre cada `<rect>` de edifício
- Aumentar dimensões dos `<rect>` (~15%) e adicionar `data-route`
- Reformular estrutura HTML dos tiles da sidebar

### Mudanças no JavaScript (inline no template)
- Refatorar `drawRoute(id)` para acionar dupla path + pin + footer
- Adicionar listener `VISIONFLOW_HOVER` com detecção de `<rect>` e lógica de dwell
- Adicionar timer de inatividade (8s reset)
- Adicionar lógica de progresso dwell nos edifícios SVG

### CSS adicionado
- `@keyframes sonar`
- `@keyframes popIn`
- `@keyframes sidebarPulse`
- `.nav-path-bg` e estados
- Novos estados dos tiles (hover, active, dwell)
- Pill de label SVG

---

## 9. Critérios de Sucesso

- [ ] Mapa tem aparência de mapa urbano moderno ao abrir o modal
- [ ] Rota animada com efeito dupla camada (branca + azul)
- [ ] Pin verde aparece ao final da rota com bounce
- [ ] Marcador "Você Está Aqui" pulsa continuamente
- [ ] Tile da sidebar ativa badge "Rota ativa"
- [ ] Manter a mão sobre um edifício SVG por 2s traça a rota
- [ ] Hover num edifício SVG destaca o tile correspondente na sidebar
- [ ] Footer exibe texto correto nos 3 estados
- [ ] Após 8s sem interação, mapa reseta ao estado inicial
