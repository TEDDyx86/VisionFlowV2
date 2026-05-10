# Redesign do Mapa 3D Hospitalar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar o mapa 3D para um visual premium (glassmorphism), com maior espaçamento entre as salas e melhor organização por alas.

**Architecture:** Refatoração do CSS para usar variáveis de cores por ala, expansão do grid 3D e aplicação de efeitos de desfoque (backdrop-filter) e sombras dinâmicas.

**Tech Stack:** HTML5, CSS3 (Vanilla), Material Symbols.

---

### Task 1: Refatoração do CSS Base (Efeitos e Variáveis)

**Files:**
- Modify: `c:\Users\Administrator\Documents\GitHub\VisionFlow2.0\example-hospital.html` (Bloco de Styles)

- [ ] **Step 1: Adicionar variáveis de cores por ala e novos estilos de glassmorphism**

```css
/* Atualizar variáveis no bloco de <style> */
:root {
    --wing-north: #3b82f6; /* Blue */
    --wing-south: #ef4444; /* Red */
    --wing-east: #8b5cf6;  /* Violet */
    --wing-west: #06b6d4;  /* Cyan */
}

.room-3d {
    position: absolute;
    transform-style: preserve-3d;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.room-3d:hover {
    transform: translateZ(40px) scale(1.05);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 50px 100px rgba(0,0,0,0.2);
}

.glass-roof {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%);
    pointer-events: none;
}
```

- [ ] **Step 2: Verificar aplicação do CSS**
Abrir o arquivo no navegador e verificar se os estilos de hover foram atualizados.

- [ ] **Step 3: Commit**

```bash
git commit -m "style: add glassmorphism and wing variables to 3d map"
```

---

### Task 2: Reorganização das Coordenadas (Afastamento)

**Files:**
- Modify: `c:\Users\Administrator\Documents\GitHub\VisionFlow2.0\example-hospital.html` (Container #map-3d-plane)

- [ ] **Step 1: Expandir o container principal e reposicionar as alas**

```html
<!-- Modificar as coordenadas das salas para criar corredores de 80px -->
<!-- Exemplo: Ala Norte (Diagnóstico) -->
<div class="room-3d top-[50px] left-[300px] w-[220px] h-[160px] ..." style="border-top: 4px solid var(--wing-north);">
    <!-- Conteúdo do Laboratório -->
</div>

<!-- Exemplo: Ala Sul (Emergência) -->
<div class="room-3d top-[650px] left-[400px] w-[350px] h-[200px] ..." style="border-top: 4px solid var(--wing-south);">
    <!-- Conteúdo da Emergência -->
</div>
```

- [ ] **Step 2: Ajustar o grid de fundo**

```html
<div class="absolute inset-0" style="background-image: linear-gradient(#e1e2e4 1px, transparent 1px), linear-gradient(90deg, #e1e2e4 1px, transparent 1px); background-size: 80px 80px; opacity: 0.2;"></div>
```

- [ ] **Step 3: Commit**

```bash
git commit -m "layout: reorganize 3d map rooms with better spacing"
```

---

### Task 3: Implementação do Caminho Neon e Marcador 3D

**Files:**
- Modify: `c:\Users\Administrator\Documents\GitHub\VisionFlow2.0\example-hospital.html`

- [ ] **Step 1: Atualizar o SVG do caminho para efeito neon**

```html
<svg class="absolute inset-0 w-full h-full pointer-events-none transform-style-3d" style="transform: translateZ(30px);">
    <path d="M 550 400 L 550 690 L 450 690" fill="none" stroke="var(--wing-south)" stroke-width="6" stroke-linecap="round" class="animate-pulse shadow-glow" />
    <!-- Marcador de localização realocado -->
</svg>
```

- [ ] **Step 2: Estilizar o marcador "Você está aqui"**

```html
<div class="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-ping"></div>
<div class="absolute -top-10 -left-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl">
    <span class="material-symbols-outlined text-white text-3xl">my_location</span>
</div>
```

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: add neon path and improved location marker"
```
