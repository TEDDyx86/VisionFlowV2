# University Map — Mapbox Clean Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renovar o modal de mapa do campus (`modal-map`) em `example-university.html` com estética Mapbox Clean, interação gestual nativa nos edifícios SVG e animação de rota dupla camada.

**Architecture:** Todas as mudanças ficam confinadas a `example-university.html`. O arquivo tem três zonas de edição independentes: bloco `<style>` (CSS do mapa, linhas ~198–336), bloco SVG dentro de `#campus-svg` (linhas ~872–951), e o bloco `<script>` inline ao final (funções `drawRoute` em ~1196 e listener `VISIONFLOW_HOVER` em ~1263). Cada task edita uma zona e faz commit isolado.

**Tech Stack:** HTML5, SVG, CSS3 (animações com `stroke-dashoffset` e `transform`), JavaScript vanilla, Tailwind CSS via CDN (classes utilitárias nos tiles).

---

## Mapa de arquivos

| Arquivo | Operação | Zona |
|---|---|---|
| `example-university.html` | Modify — bloco `<style>` | CSS do mapa (Task 1) |
| `example-university.html` | Modify — `#campus-svg` | SVG/HTML (Task 2) |
| `example-university.html` | Modify — sidebar HTML | Tiles da sidebar (Task 3) |
| `example-university.html` | Modify — `window.drawRoute` | JS (Task 4) |
| `example-university.html` | Modify — listener `VISIONFLOW_HOVER` | JS (Task 5) |
| `example-university.html` | Modify — após `drawRoute` | JS timer inatividade (Task 6) |

---

## Task 1: CSS — Paleta Urbana do Mapa

**Arquivo:** `example-university.html` — bloco `<style>`, seção `/* Map Styles */` (~linha 198)

- [ ] **Step 1: Substituir `.university-map-container`**

Localizar:
```css
.university-map-container {
    background-color: #f8fafc;
    background-image: 
        linear-gradient(rgba(203, 213, 225, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(203, 213, 225, 0.2) 1px, transparent 1px);
    background-size: 40px 40px;
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 2px solid #e2e8f0;
}
```

Substituir por:
```css
.university-map-container {
    background-color: #e8e8e8;
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.08);
    border: 2px solid #d4d4d4;
}
```

- [ ] **Step 2: Substituir `.map-building` e `.map-building.active`**

Localizar:
```css
.map-building {
    fill: #ffffff;
    stroke: #115cb9;
    stroke-width: 2.5;
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
}

.map-building.active {
    fill: #eff6ff;
    stroke: #3b82f6;
    stroke-width: 4;
    filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.3));
}
```

Substituir por:
```css
.map-building {
    fill: #fafaf8;
    stroke: none;
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
}

.map-building.active {
    fill: #eff6ff;
    filter: drop-shadow(0 0 16px rgba(37, 99, 235, 0.4));
}

.map-building.hovered {
    filter: drop-shadow(0 0 16px rgba(37, 99, 235, 0.4));
}
```

- [ ] **Step 3: Substituir `.map-park`**

Localizar:
```css
.map-park {
    fill: #f0fdf4;
    stroke: #bbf7d0;
    stroke-width: 1.5;
}
```

Substituir por:
```css
.map-park {
    fill: #c8dbc0;
    stroke: none;
}
```

- [ ] **Step 4: Substituir `.map-road` e remover `.map-sidewalk`**

Localizar:
```css
.map-road {
    fill: none;
    stroke: #f1f5f9;
    stroke-width: 24;
    stroke-linecap: round;
}

.map-sidewalk {
    fill: none;
    stroke: #e2e8f0;
    stroke-width: 28;
    stroke-linecap: round;
}
```

Substituir por (remove `.map-sidewalk`, atualiza `.map-road`):
```css
.map-road {
    fill: none;
    stroke: #ffffff;
    stroke-width: 32;
    stroke-linecap: round;
}
```

- [ ] **Step 5: Substituir `.nav-path` e adicionar `.nav-path-bg`**

Localizar:
```css
.nav-path {
    fill: none;
    stroke: #115cb9;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    opacity: 0;
}

.nav-path.active {
    opacity: 1;
    animation: drawPath 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.path-bg {
    fill: none;
    stroke: rgba(17, 92, 185, 0.05);
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
}
```

Substituir por:
```css
.nav-path-bg {
    fill: none;
    stroke: white;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    opacity: 0;
}

.nav-path-bg.active {
    opacity: 0.9;
    animation: drawPath 1.2s ease-out forwards;
}

.nav-path {
    fill: none;
    stroke: #2563eb;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    opacity: 0;
}

.nav-path.active {
    opacity: 1;
    animation: drawPath 1.2s ease-out 0.2s forwards;
}

@keyframes drawPath {
    to { stroke-dashoffset: 0; }
}
```

- [ ] **Step 6: Substituir `.map-label-academic`**

Localizar:
```css
.map-label-academic {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 11px;
    fill: #334155;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    pointer-events: none;
}
```

Substituir por:
```css
.map-label-academic {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    fill: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    pointer-events: none;
    transition: fill 0.2s ease;
}

.map-label-academic.hovered {
    fill: #2563eb;
}
```

- [ ] **Step 7: Adicionar keyframes e classes de animação novas** — inserir após o bloco de `.map-label-academic`:

```css
@keyframes sonar {
    0%   { transform: scale(1);   opacity: 0.8; }
    100% { transform: scale(2.2); opacity: 0;   }
}

.sonar-ring {
    transform-box: fill-box;
    transform-origin: center;
    animation: sonar 2s ease-out infinite;
}

@keyframes popIn {
    0%   { transform: scale(0); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

.dest-pin {
    display: none;
    transform-box: fill-box;
    transform-origin: center;
}

.dest-pin.active {
    display: block;
    animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes sidebarPulse {
    0%   { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(37, 99, 235, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}

.sidebar-tile.pulse {
    animation: sidebarPulse 0.4s ease-out;
}

.dwell-ring {
    fill: none;
    stroke: #2563eb;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    transform: rotate(-90deg);
}

.dwell-ring.active {
    opacity: 1;
    animation: dwellProgress 2s linear forwards;
}

@keyframes dwellProgress {
    to { stroke-dashoffset: 0; }
}
```

- [ ] **Step 8: Verificar no browser**

Abrir `http://localhost:3000`, navegar até o template da universidade, abrir o modal "Mapa do Campus".

Esperado:
- Fundo do mapa: cinza médio (`#e8e8e8`)
- Ruas: brancas e espessas
- Áreas verdes: sage (`#c8dbc0`)
- Edifícios: off-white sem stroke visível, com sombra sutil

- [ ] **Step 9: Commit**

```bash
git add example-university.html
git commit -m "feat(map): aplicar paleta urbana Mapbox Clean ao mapa SVG"
```

---

## Task 2: SVG — Reconstruir Elementos do Mapa

**Arquivo:** `example-university.html` — dentro de `<svg id="campus-svg">` (~linha 872)

- [ ] **Step 1: Remover as calçadas (sidewalks)**

Localizar e remover a linha duplicada de paths (a linha com classe `map-sidewalk`):
```html
<path d="M 150 700 L 150 100 M 150 350 L 900 350 M 500 350 L 500 100 M 850 350 L 850 100" class="map-sidewalk" />
```

Manter apenas a linha com `class="map-road"`.

- [ ] **Step 2: Substituir o marcador "Você Está Aqui" pelo marcador com anel sonar**

Localizar:
```html
<!-- Totem -->
<circle cx="150" cy="620" r="12" fill="white" stroke="#ef4444" stroke-width="3" />
<circle cx="150" cy="620" r="5" fill="#ef4444" />
<text x="150" y="660" text-anchor="middle" class="map-label-academic" style="font-size: 10px; font-weight: 800; fill: #ef4444;">VOCÊ ESTÁ AQUI</text>
```

Substituir por:
```html
<!-- Totem: Você Está Aqui com anel sonar -->
<g id="totem-marker">
    <!-- Anel sonar animado -->
    <g class="sonar-ring" style="transform-origin: 150px 620px;">
        <circle cx="150" cy="620" r="18" stroke="#ef4444" stroke-width="1.5" fill="none" />
    </g>
    <!-- Anel estático -->
    <circle cx="150" cy="620" r="14" fill="white" stroke="#ef4444" stroke-width="2" />
    <!-- Ponto central -->
    <circle cx="150" cy="620" r="6" fill="#ef4444" />
</g>
<text x="150" y="660" text-anchor="middle" class="map-label-academic" style="font-size: 10px; font-weight: 800; fill: #ef4444;">VOCÊ ESTÁ AQUI</text>
```

> Nota: `transform-origin` é definido inline em `px` pois `transform-box: fill-box` com `transform-origin: center` tem suporte inconsistente para elementos `<g>` em alguns browsers. Usar coordenadas absolutas é mais seguro.

- [ ] **Step 3: Adicionar paths de fundo (brancas) para cada destino**

Localizar o bloco `<!-- Navigation Paths -->`:
```html
<!-- Navigation Paths -->
<path id="path-Direito" d="M 150 620 L 150 130 L 110 130" class="nav-path" />
<path id="path-Adm" d="M 150 620 L 150 350 L 500 350 L 500 130" class="nav-path" />
<path id="path-Software" d="M 150 620 L 150 350 L 850 350 L 850 130" class="nav-path" />
<path id="path-Biblioteca" d="M 150 620 L 150 350 L 110 350" class="nav-path" />
<path id="path-RU" d="M 150 620 L 150 350 L 850 350 L 850 330" class="nav-path" />
```

Substituir por (adiciona path-bg antes de cada path principal):
```html
<!-- Navigation Paths (bg branca + linha azul sobrepostas) -->
<path id="path-bg-Direito"   d="M 150 620 L 150 130 L 110 130"                           class="nav-path-bg" />
<path id="path-Direito"      d="M 150 620 L 150 130 L 110 130"                           class="nav-path" />

<path id="path-bg-Adm"       d="M 150 620 L 150 350 L 500 350 L 500 130"                 class="nav-path-bg" />
<path id="path-Adm"          d="M 150 620 L 150 350 L 500 350 L 500 130"                 class="nav-path" />

<path id="path-bg-Software"  d="M 150 620 L 150 350 L 850 350 L 850 130"                 class="nav-path-bg" />
<path id="path-Software"     d="M 150 620 L 150 350 L 850 350 L 850 130"                 class="nav-path" />

<path id="path-bg-Biblioteca" d="M 150 620 L 150 350 L 110 350"                          class="nav-path-bg" />
<path id="path-Biblioteca"    d="M 150 620 L 150 350 L 110 350"                          class="nav-path" />

<path id="path-bg-RU"        d="M 150 620 L 150 350 L 850 350 L 850 330"                 class="nav-path-bg" />
<path id="path-RU"           d="M 150 620 L 150 350 L 850 350 L 850 330"                 class="nav-path" />
```

- [ ] **Step 4: Adicionar pins de destino (inicialmente ocultos) para cada bloco**

Adicionar logo após as navigation paths, antes de `<!-- Totem -->`:

```html
<!-- Destination Pins (aparecem ao fim da animação de rota) -->
<!-- Pin Direito: endpoint de path = (110, 130) -->
<g id="pin-Direito" class="dest-pin">
    <circle cx="110" cy="115" r="10" fill="#16a34a" />
    <circle cx="110" cy="115" r="4"  fill="white" />
</g>

<!-- Pin Adm: endpoint = (500, 130) -->
<g id="pin-Adm" class="dest-pin">
    <circle cx="500" cy="115" r="10" fill="#16a34a" />
    <circle cx="500" cy="115" r="4"  fill="white" />
</g>

<!-- Pin Software: endpoint = (850, 130) -->
<g id="pin-Software" class="dest-pin">
    <circle cx="850" cy="115" r="10" fill="#16a34a" />
    <circle cx="850" cy="115" r="4"  fill="white" />
</g>

<!-- Pin Biblioteca: endpoint = (110, 350) -->
<g id="pin-Biblioteca" class="dest-pin">
    <circle cx="95"  cy="350" r="10" fill="#16a34a" />
    <circle cx="95"  cy="350" r="4"  fill="white" />
</g>

<!-- Pin RU: endpoint = (850, 330) -->
<g id="pin-RU" class="dest-pin">
    <circle cx="850" cy="315" r="10" fill="#16a34a" />
    <circle cx="850" cy="315" r="4"  fill="white" />
</g>
```

- [ ] **Step 5: Adicionar `data-route` e anéis de dwell nos `<rect>` de cada edifício**

Os `<rect>` dos edifícios já têm tamanho >= 120×100px no viewBox, satisfazendo a área mínima. Adicionar `data-route` e um anel de dwell SVG sobreposto a cada um.

Localizar e substituir o bloco `<!-- Buildings -->`:

```html
<!-- Buildings -->
<!-- Bloco A -->
<rect id="svg-Direito" x="50" y="80" width="120" height="100" rx="15" class="map-building" data-route="Direito" />
<circle id="dwell-Direito" cx="110" cy="130" r="22" class="dwell-ring" />
<text x="110" y="135" text-anchor="middle" id="lbl-Direito" class="map-label-academic">Bloco A</text>
<text x="110" y="150" text-anchor="middle" class="map-label-academic" style="font-size: 8px; opacity: 0.6;">Direito</text>

<!-- Bloco B -->
<rect id="svg-Adm" x="440" y="80" width="120" height="100" rx="15" class="map-building" data-route="Adm" />
<circle id="dwell-Adm" cx="500" cy="130" r="22" class="dwell-ring" />
<text x="500" y="135" text-anchor="middle" id="lbl-Adm" class="map-label-academic">Bloco B</text>
<text x="500" y="150" text-anchor="middle" class="map-label-academic" style="font-size: 8px; opacity: 0.6;">Adm</text>

<!-- Bloco C -->
<rect id="svg-Software" x="790" y="80" width="120" height="100" rx="15" class="map-building" data-route="Software" />
<circle id="dwell-Software" cx="850" cy="130" r="22" class="dwell-ring" />
<text x="850" y="135" text-anchor="middle" id="lbl-Software" class="map-label-academic">Bloco C</text>
<text x="850" y="150" text-anchor="middle" class="map-label-academic" style="font-size: 8px; opacity: 0.6;">Software</text>

<!-- Biblioteca -->
<rect id="svg-Biblioteca" x="50" y="300" width="120" height="100" rx="15" class="map-building" data-route="Biblioteca" />
<circle id="dwell-Biblioteca" cx="110" cy="350" r="22" class="dwell-ring" />
<text x="110" y="355" text-anchor="middle" id="lbl-Biblioteca" class="map-label-academic">Biblio</text>
<text x="110" y="370" text-anchor="middle" class="map-label-academic" style="font-size: 8px; opacity: 0.6;">Central</text>

<!-- RU -->
<rect id="svg-RU" x="790" y="300" width="120" height="100" rx="15" class="map-building" data-route="RU" />
<circle id="dwell-RU" cx="850" cy="350" r="22" class="dwell-ring" />
<text x="850" y="355" text-anchor="middle" id="lbl-RU" class="map-label-academic">RU</text>
<text x="850" y="370" text-anchor="middle" class="map-label-academic" style="font-size: 8px; opacity: 0.6;">Restaurante</text>
```

- [ ] **Step 6: Substituir o footer da legenda pelo footer dinâmico**

Localizar:
```html
<!-- Legend Footer (Modern Academic Theme) -->
<div class="p-8 border-t border-slate-100 bg-white flex items-center justify-center gap-16">
    ...conteúdo da legenda...
</div>
```

Substituir por:
```html
<!-- Footer Dinâmico -->
<div class="p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-8">
    <!-- Estado do footer -->
    <div class="flex items-center gap-4 flex-1">
        <div id="map-footer-spinner" class="hidden w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span id="map-footer-text" class="text-sm font-semibold text-slate-500">
            Selecione um destino na lista ou aponte para um edifício
        </span>
    </div>
    <!-- Legenda compacta -->
    <div class="flex items-center gap-8 flex-shrink-0">
        <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-white border-2 border-red-500 flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Você Aqui</span>
        </div>
        <div class="flex items-center gap-2">
            <div class="w-8 h-1.5 rounded-full bg-blue-600"></div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trajeto</span>
        </div>
        <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destino</span>
        </div>
    </div>
</div>
```

- [ ] **Step 7: Verificar no browser**

Abrir modal de mapa.

Esperado:
- Anel sonar vermelho pulsando no marcador "Você Está Aqui"
- Edifícios sem stroke, com sombra sutil
- Ruas brancas e largas
- Áreas verdes em sage
- Footer mostra "Selecione um destino..."

- [ ] **Step 8: Commit**

```bash
git add example-university.html
git commit -m "feat(map): reconstruir elementos SVG com marcadores, pins e anéis de dwell"
```

---

## Task 3: HTML — Reformar Tiles da Sidebar

**Arquivo:** `example-university.html` — div `w-80` da sidebar (~linha 806)

- [ ] **Step 1: Trocar largura e cabeçalho da sidebar**

Localizar:
```html
<div class="w-80 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
    <h3 class="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-2 px-2">Destinos no Campus</h3>
```

Substituir por:
```html
<div class="w-96 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
    <div class="flex gap-2 mb-2 px-1">
        <button class="interactable dwellable flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white transition-all" id="filter-todos">Todos</button>
        <button class="interactable dwellable flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 transition-all" id="filter-servicos">Serviços</button>
    </div>
```

- [ ] **Step 2: Substituir os 5 tiles com a nova estrutura (altura mínima 88px + distância)**

A tabela de distâncias/tempos:
| ID | Label | Subtítulo | Ícone | Distância | Tempo |
|---|---|---|---|---|---|
| Direito | Bloco A | Direito & RI | `gavel` | 120m | ~2 min |
| Adm | Bloco B | Adm & Economia | `business_center` | 200m | ~3 min |
| Software | Bloco C | Engenharia & TI | `code` | 280m | ~4 min |
| Biblioteca | Biblioteca | Acervo Digital | `auto_stories` | 150m | ~2 min |
| RU | Restaurante | Refeitório Central | `restaurant` | 310m | ~4 min |

Localizar o bloco dos 5 tiles (da linha `<button id="btn-map-Direito"` até o `</button>` do RU) e substituir por:

```html
<button id="btn-map-Direito" onclick="drawRoute('Direito')" class="interactable dwellable sidebar-tile min-h-[88px]">
    <div class="flex items-center gap-4">
        <div class="relative w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <span class="material-symbols-outlined text-[28px]">gavel</span>
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                <circle id="dwell-tile-Direito" cx="28" cy="28" r="26" fill="none" stroke="#2563eb" stroke-width="3"
                    stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="163"
                    style="transform: rotate(-90deg); transform-origin: 28px 28px; opacity: 0; transition: opacity 0.1s;" />
            </svg>
        </div>
        <div class="flex-1 text-left">
            <span class="block font-bold text-slate-700 text-base">Bloco A</span>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider">Direito & RI</span>
            <span class="block text-[11px] text-blue-500 font-semibold mt-1">● 120m · ~2 min</span>
        </div>
        <span id="badge-Direito" class="hidden text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativa</span>
    </div>
</button>

<button id="btn-map-Adm" onclick="drawRoute('Adm')" class="interactable dwellable sidebar-tile min-h-[88px]">
    <div class="flex items-center gap-4">
        <div class="relative w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <span class="material-symbols-outlined text-[28px]">business_center</span>
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                <circle id="dwell-tile-Adm" cx="28" cy="28" r="26" fill="none" stroke="#2563eb" stroke-width="3"
                    stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="163"
                    style="transform: rotate(-90deg); transform-origin: 28px 28px; opacity: 0; transition: opacity 0.1s;" />
            </svg>
        </div>
        <div class="flex-1 text-left">
            <span class="block font-bold text-slate-700 text-base">Bloco B</span>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider">Adm & Economia</span>
            <span class="block text-[11px] text-blue-500 font-semibold mt-1">● 200m · ~3 min</span>
        </div>
        <span id="badge-Adm" class="hidden text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativa</span>
    </div>
</button>

<button id="btn-map-Software" onclick="drawRoute('Software')" class="interactable dwellable sidebar-tile min-h-[88px]">
    <div class="flex items-center gap-4">
        <div class="relative w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <span class="material-symbols-outlined text-[28px]">code</span>
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                <circle id="dwell-tile-Software" cx="28" cy="28" r="26" fill="none" stroke="#2563eb" stroke-width="3"
                    stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="163"
                    style="transform: rotate(-90deg); transform-origin: 28px 28px; opacity: 0; transition: opacity 0.1s;" />
            </svg>
        </div>
        <div class="flex-1 text-left">
            <span class="block font-bold text-slate-700 text-base">Bloco C</span>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider">Engenharia & TI</span>
            <span class="block text-[11px] text-blue-500 font-semibold mt-1">● 280m · ~4 min</span>
        </div>
        <span id="badge-Software" class="hidden text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativa</span>
    </div>
</button>

<button id="btn-map-Biblioteca" onclick="drawRoute('Biblioteca')" class="interactable dwellable sidebar-tile min-h-[88px]">
    <div class="flex items-center gap-4">
        <div class="relative w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <span class="material-symbols-outlined text-[28px]">auto_stories</span>
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                <circle id="dwell-tile-Biblioteca" cx="28" cy="28" r="26" fill="none" stroke="#2563eb" stroke-width="3"
                    stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="163"
                    style="transform: rotate(-90deg); transform-origin: 28px 28px; opacity: 0; transition: opacity 0.1s;" />
            </svg>
        </div>
        <div class="flex-1 text-left">
            <span class="block font-bold text-slate-700 text-base">Biblioteca</span>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider">Acervo Digital</span>
            <span class="block text-[11px] text-blue-500 font-semibold mt-1">● 150m · ~2 min</span>
        </div>
        <span id="badge-Biblioteca" class="hidden text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativa</span>
    </div>
</button>

<button id="btn-map-RU" onclick="drawRoute('RU')" class="interactable dwellable sidebar-tile min-h-[88px]">
    <div class="flex items-center gap-4">
        <div class="relative w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
            <span class="material-symbols-outlined text-[28px]">restaurant</span>
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                <circle id="dwell-tile-RU" cx="28" cy="28" r="26" fill="none" stroke="#2563eb" stroke-width="3"
                    stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="163"
                    style="transform: rotate(-90deg); transform-origin: 28px 28px; opacity: 0; transition: opacity 0.1s;" />
            </svg>
        </div>
        <div class="flex-1 text-left">
            <span class="block font-bold text-slate-700 text-base">Restaurante</span>
            <span class="text-[11px] text-slate-400 uppercase tracking-wider">Refeitório Central</span>
            <span class="block text-[11px] text-blue-500 font-semibold mt-1">● 310m · ~4 min</span>
        </div>
        <span id="badge-RU" class="hidden text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded-full">Ativa</span>
    </div>
</button>
```

- [ ] **Step 3: Verificar no browser**

Esperado:
- Sidebar mais larga com dois botões de filtro no topo
- Cada tile tem altura mínima 88px com distância/tempo
- Badge "Ativa" está oculto inicialmente

- [ ] **Step 4: Commit**

```bash
git add example-university.html
git commit -m "feat(map): reformar sidebar com tiles maiores e info de distância"
```

---

## Task 4: JS — Refatorar `drawRoute()`

**Arquivo:** `example-university.html` — função `window.drawRoute` (~linha 1196)

- [ ] **Step 1: Substituir `window.drawRoute` integralmente**

Localizar:
```javascript
window.drawRoute = function(id) {
    ...
};
```

Substituir pelo bloco completo (inclui stub de `resetInactivityTimer` que Task 6 substituirá):

```javascript
// Stub — Task 6 substitui pela implementação completa
let inactivityTimer = null;
function resetInactivityTimer() { /* implementado na Task 6 */ }

const routeInfo = {
    'Direito':   { label: 'Bloco A (Direito)',           dist: '120m', time: '~2 min' },
    'Adm':       { label: 'Bloco B (Administração)',     dist: '200m', time: '~3 min' },
    'Software':  { label: 'Bloco C (Tecnologia)',        dist: '280m', time: '~4 min' },
    'Biblioteca':{ label: 'Biblioteca Central',          dist: '150m', time: '~2 min' },
    'RU':        { label: 'Restaurante Universitário',   dist: '310m', time: '~4 min' }
};

window.drawRoute = function(id) {
    const footerText    = document.getElementById('map-footer-text');
    const footerSpinner = document.getElementById('map-footer-spinner');

    // 1. Reset todos os estados anteriores
    document.querySelectorAll('.sidebar-tile').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('[id^="badge-"]').forEach(b => b.classList.add('hidden'));
    document.querySelectorAll('.nav-path, .nav-path-bg').forEach(p => {
        p.classList.remove('active');
        // Força reset da animação removendo e re-adicionando o elemento via reflow
        void p.offsetWidth;
    });
    document.querySelectorAll('.map-building').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.dest-pin').forEach(p => p.classList.remove('active'));

    // 2. Ativa o tile da sidebar
    const btn = document.getElementById(`btn-map-${id}`);
    if (btn) btn.classList.add('active');

    // Mostra badge "Ativa"
    const badge = document.getElementById(`badge-${id}`);
    if (badge) badge.classList.remove('hidden');

    // 3. Destaca o edifício no SVG
    const building = document.getElementById(`svg-${id}`);
    if (building) building.classList.add('active');

    // 4. Anima as duas paths (bg branca + azul principal)
    const pathBg   = document.getElementById(`path-bg-${id}`);
    const pathMain = document.getElementById(`path-${id}`);

    if (pathBg) {
        const len = pathBg.getTotalLength();
        pathBg.style.strokeDasharray  = len;
        pathBg.style.strokeDashoffset = len;
        void pathBg.offsetWidth; // force reflow
        pathBg.classList.add('active');
    }

    if (pathMain) {
        const len = pathMain.getTotalLength();
        pathMain.style.strokeDasharray  = len;
        pathMain.style.strokeDashoffset = len;
        void pathMain.offsetWidth; // force reflow
        pathMain.classList.add('active');
    }

    // 5. Footer: estado "calculando"
    if (footerSpinner) footerSpinner.classList.remove('hidden');
    if (footerText)    footerText.textContent = 'Calculando trajeto...';

    // 6. Após animação (~1.4s): exibe pin destino + atualiza footer
    setTimeout(() => {
        const pin = document.getElementById(`pin-${id}`);
        if (pin) pin.classList.add('active');

        if (footerSpinner) footerSpinner.classList.add('hidden');
        if (footerText && routeInfo[id]) {
            footerText.textContent = `Siga em frente até ${routeInfo[id].label} — ${routeInfo[id].dist} · ${routeInfo[id].time}`;
        }

        // Reinicia timer de inatividade
        resetInactivityTimer();
    }, 1400);
};
```

- [ ] **Step 2: Verificar no browser**

Abrir modal do mapa, clicar em "Bloco A".

Esperado:
1. Footer muda para "Calculando trajeto..." com spinner
2. Rota branca e azul animam sobre o mapa
3. Após ~1.4s, pin verde aparece no destino com bounce
4. Footer muda para "Siga em frente até Bloco A (Direito) — 120m · ~2 min"
5. Badge "Ativa" aparece no tile

- [ ] **Step 3: Commit**

```bash
git add example-university.html
git commit -m "feat(map): refatorar drawRoute com dupla path, pin destino e footer dinâmico"
```

---

## Task 5: JS — Camada Gestual (Dwell SVG + Hover Sync)

**Arquivo:** `example-university.html` — listener `VISIONFLOW_HOVER` (~linha 1263)

- [ ] **Step 1: Adicionar variáveis de estado do dwell SVG** — inserir logo antes do listener `window.addEventListener('message', ...)`:

```javascript
// Estado de dwell nos edifícios SVG
let svgDwellTarget   = null; // id do destino em dwell (ex: 'Direito')
let svgDwellStart    = null; // timestamp de início
let svgDwellFrame    = null; // requestAnimationFrame handle
const SVG_DWELL_MS   = 2000; // 2 segundos

function startSvgDwell(routeId) {
    cancelSvgDwell();
    svgDwellTarget = routeId;
    svgDwellStart  = performance.now();

    const ring = document.getElementById(`dwell-${routeId}`);
    if (ring) {
        ring.style.opacity = '1';
        ring.style.strokeDashoffset = '283';
    }

    function tick(now) {
        const elapsed  = now - svgDwellStart;
        const progress = Math.min(elapsed / SVG_DWELL_MS, 1);
        const offset   = 283 * (1 - progress);

        if (ring) ring.style.strokeDashoffset = offset;

        if (progress >= 1) {
            cancelSvgDwell();
            window.drawRoute(routeId);
        } else {
            svgDwellFrame = requestAnimationFrame(tick);
        }
    }

    svgDwellFrame = requestAnimationFrame(tick);
}

function cancelSvgDwell() {
    if (svgDwellFrame) cancelAnimationFrame(svgDwellFrame);
    svgDwellFrame = null;

    if (svgDwellTarget) {
        const ring = document.getElementById(`dwell-${svgDwellTarget}`);
        if (ring) {
            ring.style.opacity = '1';
            // Anima de volta para 0 suavemente
            ring.style.transition = 'stroke-dashoffset 0.2s ease, opacity 0.2s ease';
            ring.style.strokeDashoffset = '283';
            ring.style.opacity = '0';
            setTimeout(() => { ring.style.transition = ''; }, 200);
        }
    }
    svgDwellTarget = null;
    svgDwellStart  = null;
}
```

- [ ] **Step 2: Localizar e estender o bloco de tratamento de `VISIONFLOW_HOVER`**

O handler atual (~linha 1263) faz apenas hover genérico. Localizar o trecho dentro do `else if (event.data.type === 'VISIONFLOW_HOVER')`:

```javascript
} else if (event.data.type === 'VISIONFLOW_HOVER') {
    const el = document.elementFromPoint(event.data.x, event.data.y);
    if (currentHoverElement !== el) {
        if (currentHoverElement) {
            currentHoverElement.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            currentHoverElement.classList.remove('hovered');
        }
        if (el && event.data.x >= 0 && event.data.y >= 0) {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            // Only apply hover visual to interactive elements
            if (el.tagName === 'BUTTON' || el.closest('button') || el.closest('.cursor-pointer')) {
                el.classList.add('hovered');
            }
```

**Adicionar** logo após `el.classList.add('hovered');` (dentro do mesmo bloco `if`), antes do fechamento:

```javascript
            // Verifica se o elemento ou ancestral tem data-route (edifício SVG)
            const buildingEl = el.closest('[data-route]');
            const routeId    = buildingEl ? buildingEl.getAttribute('data-route') : null;

            if (routeId && routeId !== svgDwellTarget) {
                // Entrou em um novo edifício: inicia dwell + sinaliza parent
                window.parent.postMessage({ type: 'VISIONFLOW_DWELL_START' }, '*');
                startSvgDwell(routeId);

                // Destaca label do bloco
                const lbl = document.getElementById(`lbl-${routeId}`);
                if (lbl) lbl.classList.add('hovered');

                // Pulsa tile correspondente na sidebar
                const tile = document.getElementById(`btn-map-${routeId}`);
                if (tile) {
                    tile.classList.remove('pulse');
                    void tile.offsetWidth; // reset animation
                    tile.classList.add('pulse');
                    setTimeout(() => tile.classList.remove('pulse'), 400);
                }

            } else if (!routeId && svgDwellTarget) {
                // Saiu de edifício sem completar dwell
                window.parent.postMessage({ type: 'VISIONFLOW_DWELL_CANCEL' }, '*');
                const lbl = document.getElementById(`lbl-${svgDwellTarget}`);
                if (lbl) lbl.classList.remove('hovered');
                cancelSvgDwell();
            }
```

**E adicionar** no bloco de saída de elemento (`if (currentHoverElement) { ... }`), logo após `currentHoverElement.classList.remove('hovered');`:

```javascript
                // Cancela dwell SVG se sair de um edifício
                if (svgDwellTarget) {
                    window.parent.postMessage({ type: 'VISIONFLOW_DWELL_CANCEL' }, '*');
                    const lbl = document.getElementById(`lbl-${svgDwellTarget}`);
                    if (lbl) lbl.classList.remove('hovered');
                    cancelSvgDwell();
                }
```

- [ ] **Step 3: Verificar no browser — hover**

Abrir modal de mapa. Mover o mouse (simulando o cursor gestual) sobre um edifício SVG.

Esperado:
- Edifício ganha glow azul (`.map-building.hovered`)
- Label do bloco fica azul
- Tile correspondente na sidebar pisca uma vez

- [ ] **Step 4: Verificar no browser — dwell**

Manter o mouse parado sobre um edifício por 2 segundos.

Esperado:
- Anel azul circular começa a se preencher sobre o edifício
- Ao completar 2s, `drawRoute()` é acionado automaticamente

- [ ] **Step 5: Commit**

```bash
git add example-university.html
git commit -m "feat(map): adicionar dwell gestual nos edifícios SVG e sync hover sidebar"
```

---

## Task 6: JS — Timer de Inatividade (Reset em 8s)

**Arquivo:** `example-university.html` — bloco `<script>` inline, após `window.drawRoute`

- [ ] **Step 1: Substituir o stub de `resetInactivityTimer`** adicionado na Task 4 pela implementação completa. Localizar:

```javascript
// Stub — Task 6 substitui pela implementação completa
let inactivityTimer = null;
function resetInactivityTimer() { /* implementado na Task 6 */ }
```

Substituir por:

```javascript
let inactivityTimer = null;

function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        // Reset completo do mapa ao estado padrão
        document.querySelectorAll('.sidebar-tile').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('[id^="badge-"]').forEach(b => b.classList.add('hidden'));
        document.querySelectorAll('.nav-path, .nav-path-bg').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.map-building').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.dest-pin').forEach(p => p.classList.remove('active'));

        const footerText    = document.getElementById('map-footer-text');
        const footerSpinner = document.getElementById('map-footer-spinner');
        if (footerSpinner) footerSpinner.classList.add('hidden');
        if (footerText) {
            footerText.style.transition = 'opacity 0.5s ease';
            footerText.style.opacity = '0';
            setTimeout(() => {
                footerText.textContent = 'Selecione um destino na lista ou aponte para um edifício';
                footerText.style.opacity = '1';
            }, 500);
        }
    }, 8000);
}
```

> `resetInactivityTimer()` já é chamada dentro de `drawRoute()` ao fim da animação (Task 4, Step 1).

- [ ] **Step 2: Verificar no browser**

Selecionar um destino. Aguardar 8 segundos sem mover o cursor sobre o mapa.

Esperado:
- Footer faz fade para branco e volta ao texto padrão
- Paths, pins, tiles e buildings voltam ao estado inicial

- [ ] **Step 3: Commit**

```bash
git add example-university.html
git commit -m "feat(map): adicionar reset automático por inatividade após 8s"
```

---

## Task 7: Verificação Final

- [ ] **Step 1: Abrir o template no browser via servidor local**

```powershell
npx serve .
```

Navegar para `http://localhost:3000`, abrir "Heritage University", clicar em "Mapa do Campus".

- [ ] **Step 2: Checar critérios do spec**

- [ ] Fundo do mapa é cinza urbano, ruas brancas, áreas verdes em sage
- [ ] Edifícios sem stroke, sombra sutil
- [ ] Anel sonar vermelho pulsa continuamente no marcador "Você Está Aqui"
- [ ] Rota traça com efeito dupla camada (branca + azul)
- [ ] Pin verde aparece com bounce ao final da animação
- [ ] Footer mostra "Calculando..." > "Siga em frente até X — Ym · ~Z min"
- [ ] Tile da sidebar mostra badge "Ativa" ao selecionar
- [ ] Hover com mouse sobre edifício SVG: glow + label azul + pulse no tile da sidebar
- [ ] Manter hover sobre edifício 2s: anel de dwell se preenche e rota é traçada
- [ ] Após 8s sem interação: mapa reseta com fade

- [ ] **Step 3: Push para GitHub**

```bash
git push origin dev
```
