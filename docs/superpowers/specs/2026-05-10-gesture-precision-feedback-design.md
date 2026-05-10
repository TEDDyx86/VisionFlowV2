# Design Spec: Gestos de Precisão e Feedback Visual (VisionFlow 2.0)

Este documento detalha o aprimoramento do sistema de navegação touchless, focando em estabilidade de cursor, magnetismo de alvos e feedback visual em tempo real.

## 1. Objetivos
- Reduzir o impacto do ruído de detecção (jitter) do MediaPipe.
- Facilitar a interação com elementos pequenos através de magnetismo.
- Fornecer feedback visual contínuo sobre o estado do gesto de pinça (pinch).

## 2. Componentes Técnicos

### 2.1. Controlador de Cursor Suavizado (EMA)
Utilizaremos **Média Móvel Exponencial (EMA)** para processar as coordenadas `(x, y)` vindas do MediaPipe.
- **Fórmula:** `pos_nova = (pos_atual * smoothing) + (pos_anterior * (1 - smoothing))`
- **Parâmetro:** `smoothing` padrão de `0.15` (ajustável na calibração).

### 2.2. Sistema de Magnetismo de Alvos
Um novo módulo `magnetism.js` será responsável por "puxar" o cursor para o centro de elementos interativos.
- **Trigger:** Cursor dentro de um raio de `60px` de um elemento `.interactable`.
- **Efeito:** Aplicação de um deslocamento (offset) nas coordenadas do cursor para coincidir com o `getBoundingClientRect()` do alvo.
- **Feedback:** O cursor mudará para um estado `active-target`.

### 2.3. Halo de Progresso de Pinça
O cursor visual (`#custom-cursor`) será atualizado para incluir um anel de progresso SVG.
- **Input:** Distância normalizada entre o polegar e o indicador (`index_tip` e `thumb_tip`).
- **Comportamento:**
    - Distância > Threshold: Anel invisível ou tênue.
    - Distância aproximando-se do Threshold: Anel começa a fechar (0% a 100%).
    - Threshold atingido: Disparo do clique e animação de "ripple".

## 3. Impacto nos Ambientes (Templates)
- **Hospital:** Permite clicar com precisão em leitos e salas minúsculas no mapa 3D.
- **Mercado:** Facilita o scroll lateral ao "travar" a mão no eixo horizontal durante o arrasto.
- **Restaurante:** Melhora a seleção de itens em menus densos.

## 4. Plano de Implementação Sugerido
1. Atualizar `styles.css` com os estados do novo cursor.
2. Implementar `magnetism.js`.
3. Refatorar `gestureEngine.js` para integrar EMA e lógica de progresso.
4. Validar no `example-hospital.html`.

---
**Data:** 2026-05-10
**Status:** Aguardando Revisão
**Autor:** Antigravity (AI Assistant)
