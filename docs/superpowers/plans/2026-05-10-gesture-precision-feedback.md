# Gestos de Precisão e Feedback Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar suavização de cursor (EMA), magnetismo para elementos interativos e um halo visual de progresso para o gesto de pinça.

**Architecture:** Utilizaremos uma abordagem modular, adicionando um novo utilitário de magnetismo, refatorando o motor de gestos para incluir EMA (Exponential Moving Average) e atualizando o controlador de visão para manipular variáveis CSS que controlam o "Halo" SVG do cursor.

**Tech Stack:** JavaScript (ES6+), CSS3 (Custom Properties & Animations), MediaPipe Hands.

---

### Task 1: Estilização do Novo Cursor (Halo)

**Files:**
- Modify: `styles.css`
- Modify: `index.html`

- [ ] **Step 1: Atualizar a estrutura do cursor no HTML**
Modificar o `#custom-cursor` para incluir o elemento do Halo (SVG ou div circular).

```html
<!-- index.html -->
<div id="custom-cursor">
    <div class="cursor-dot"></div>
    <svg class="cursor-halo" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" class="halo-bg"></circle>
        <circle cx="50" cy="50" r="45" class="halo-progress"></circle>
    </svg>
</div>
```

- [ ] **Step 2: Adicionar estilos CSS para o Halo**
Implementar o progresso circular usando `stroke-dasharray`.

```css
/* styles.css */
#custom-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease-out; /* Suavização extra na renderização */
}

.cursor-halo {
    width: 60px;
    height: 60px;
    transform: rotate(-90deg);
}

.halo-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 4;
}

.halo-progress {
    fill: none;
    stroke: var(--accent-color, #00f2ff);
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 283; /* 2 * PI * R (45) */
    stroke-dashoffset: var(--pinch-progress, 283);
    transition: stroke-dashoffset 0.05s linear;
}

#custom-cursor.active-target .cursor-dot {
    background: #ff00ea; /* Cor de destaque ao magnetizar */
    box-shadow: 0 0 15px #ff00ea;
}
```

- [ ] **Step 3: Commit**

---

### Task 2: Implementação do Módulo de Magnetismo

**Files:**
- Create: `src/magnetism.js`

- [ ] **Step 1: Criar lógica de detecção de proximidade**

```javascript
// src/magnetism.js
export function getMagneticOffset(cursorX, cursorY, radius = 60) {
    const targets = document.querySelectorAll('.interactable');
    let bestTarget = null;
    let minDistance = radius;

    targets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = centerX - cursorX;
        const dy = centerY - cursorY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
            minDistance = distance;
            bestTarget = { x: centerX, y: centerY };
        }
    });

    if (bestTarget) {
        // Retorna o ponto central do alvo se estiver dentro do raio
        return bestTarget;
    }
    return null;
}
```

- [ ] **Step 2: Commit**

---

### Task 3: Refatoração do Gesture Engine (EMA & Progresso)

**Files:**
- Modify: `src/gestureEngine.js`
- Modify: `src/controllers.js`

- [ ] **Step 1: Implementar EMA e integração com Magnetismo em `gestureEngine.js`**

```javascript
// src/gestureEngine.js
import { getMagneticOffset } from './magnetism.js';

// ... variáveis existentes ...
let rawX = 0;
let rawY = 0;

export function processGestures(landmarks) {
    const params = getCalibrationParams();
    if (!landmarks) {
        updateCursor(null, null, false, 0);
        return;
    }

    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    
    // 1. Posição Bruta (Invertida)
    const targetX = window.innerWidth - (indexTip.x * window.innerWidth);
    const targetY = indexTip.y * window.innerHeight;

    // 2. Aplicação de EMA (Suavização)
    const smoothFactor = params.smoothing || 0.15;
    smoothedX = smoothedX * (1 - smoothFactor) + targetX * smoothFactor;
    smoothedY = smoothedY * (1 - smoothFactor) + targetY * smoothFactor;

    // 3. Magnetismo
    const magneticPoint = getMagneticOffset(smoothedX, smoothedY);
    const finalX = magneticPoint ? magneticPoint.x : smoothedX;
    const finalY = magneticPoint ? magneticPoint.y : smoothedY;

    // 4. Cálculo de Progresso da Pinça (Pinch)
    const dx = indexTip.x - thumbTip.x;
    const dy = indexTip.y - thumbTip.y;
    const dz = indexTip.z - thumbTip.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    // Normaliza o progresso (0 a 1) baseado no threshold de calibração
    const maxDist = params.pinchThreshold * 2.5;
    const progress = Math.max(0, Math.min(1, (maxDist - distance) / (maxDist - params.pinchThreshold)));

    // ... lógica de clique existente ...

    updateCursor(finalX, finalY, isPinching, progress, !!magneticPoint);
}
```

- [ ] **Step 2: Atualizar `updateCursor` em `controllers.js`**

```javascript
// src/controllers.js
export function updateCursor(x, y, isPinching, progress, isMagnetic) {
    const cursor = document.getElementById('custom-cursor');
    if (!x || !y) {
        cursor.style.display = 'none';
        return;
    }
    
    cursor.style.display = 'block';
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    // Atualiza progresso do Halo (CSS Variable)
    const dashOffset = 283 - (progress * 283);
    cursor.style.setProperty('--pinch-progress', dashOffset);

    if (isMagnetic) cursor.classList.add('active-target');
    else cursor.classList.remove('active-target');

    if (isPinching) cursor.classList.add('pinching');
    else cursor.classList.remove('pinching');
}
```

- [ ] **Step 3: Commit**

---

### Task 4: Verificação e Calibração

- [ ] **Step 1: Abrir o Hospital Map e testar magnetismo nos leitos**
- [ ] **Step 2: Verificar se o Halo se fecha corretamente antes do clique**
- [ ] **Step 3: Ajustar `smoothing` se houver atraso perceptível**
