# Redesign Homepage And Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a página inicial em um menu de navegação que redireciona para 5 exemplos práticos de uso do sistema touchless (Visualizador 3D, Kiosk, Mercado, Restaurante, Hospital).

**Architecture:** A página `index.html` será modificada para exibir uma grade de links (cards) para as novas páginas. Serão criadas 5 novas páginas HTML na raiz do projeto. O CSS será atualizado para suportar os novos layouts visuais mantendo o design *premium glassmorphism*. Todos os arquivos importarão `app.js` para injetar a lógica touchless globalmente.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, MediaPipe Hands.

## User Review Required

- **Arquitetura de Páginas vs. SPA:** Optamos por criar páginas separadas (e.g. `example-3d.html`) em vez de um Single Page Application (SPA) para simplificar a arquitetura inicial e facilitar o desenvolvimento paralelo. Ao clicar no link, a nova página carregará novamente a câmera. Se preferir que tudo aconteça em uma única página para não precisar reabrir a câmera (via SPA/modificando o DOM via JavaScript sem reload), precisaremos alterar o plano. **Você concorda com a abordagem de múltiplas páginas ou prefere um SPA?**

## Proposed Changes

---

### Task 1: Atualizar a Página Inicial (index.html)

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Substituir a área de interação por um menu de opções**

Substitua o conteúdo dentro da `<main class="interaction-area">` atual para exibir a nova grade de navegação.

```html
<main class="interaction-area">
    <h1>Escolha uma Experiência</h1>
    <p>Navegue sem toque usando os exemplos práticos abaixo.</p>

    <div class="examples-grid">
        <a href="example-3d.html" class="example-card interactable">
            <div class="card-icon">🧊</div>
            <h3>Visualizador 3D</h3>
            <p>Interaja com modelos tridimensionais.</p>
        </a>
        <a href="example-kiosk.html" class="example-card interactable">
            <div class="card-icon">🗺️</div>
            <h3>Kiosk de Campus</h3>
            <p>Diretório e mapa universitário.</p>
        </a>
        <a href="example-market.html" class="example-card interactable">
            <div class="card-icon">🛒</div>
            <h3>Mercado</h3>
            <p>Autoatendimento e carrinho de compras.</p>
        </a>
        <a href="example-restaurant.html" class="example-card interactable">
            <div class="card-icon">🍔</div>
            <h3>Restaurante</h3>
            <p>Cardápio interativo e pedidos.</p>
        </a>
        <a href="example-hospital.html" class="example-card interactable">
            <div class="card-icon">🏥</div>
            <h3>Hospital</h3>
            <p>Triagem e informações para pacientes.</p>
        </a>
    </div>
</main>
```

### Task 2: Atualizar os Estilos (styles.css)

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Adicionar estilos para a grade de exemplos e botões de navegação**

```css
/* Adicione no final do arquivo styles.css */

.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.example-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 30px;
    text-align: center;
    text-decoration: none;
    color: var(--text-color);
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.example-card:hover, .example-card.hovered {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.card-icon {
    font-size: 3rem;
    margin-bottom: 15px;
}

.example-card h3 {
    margin-bottom: 10px;
    font-size: 1.2rem;
    font-weight: 600;
}

.example-card p {
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Back button */
.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    transition: background 0.3s;
}

.btn-back:hover, .btn-back.hovered {
    background: rgba(255, 255, 255, 0.15);
}

/* Specific example layouts */
.demo-container {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.demo-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 1.1rem;
    margin: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.demo-btn:hover, .demo-btn.hovered {
    transform: scale(1.05);
    box-shadow: 0 0 15px var(--primary-color);
}
```

### Task 3: Criar Página do Visualizador 3D (example-3d.html)

**Files:**
- Create: `example-3d.html`

- [ ] **Step 1: Criar o arquivo copiando a base do index.html e inserindo o novo `<main>`**

*(Nota para o agente: Copie todo o HTML do `index.html`, desde o `<html>` até `</html>`, mas substitua o interior da tag `<main class="interaction-area">` pelo código abaixo)*

```html
<main class="interaction-area">
    <a href="index.html" class="btn-back interactable">← Voltar</a>
    <h1>Visualizador 3D Interativo</h1>
    <p>Faça movimentos de pinça para interagir com o modelo.</p>
    
    <div class="demo-container">
        <div class="card-icon" style="font-size: 5rem;">🧊</div>
        <p>Área de renderização do modelo (WebGL/Three.js)</p>
        <div>
            <button class="demo-btn interactable">Rotacionar Esquerda</button>
            <button class="demo-btn interactable">Rotacionar Direita</button>
        </div>
    </div>
</main>
```

### Task 4: Criar Página Kiosk Universitário (example-kiosk.html)

**Files:**
- Create: `example-kiosk.html`

- [ ] **Step 1: Criar o arquivo copiando a base do index.html e inserindo o novo `<main>`**

```html
<main class="interaction-area">
    <a href="index.html" class="btn-back interactable">← Voltar</a>
    <h1>Kiosk de Campus</h1>
    <p>Encontre prédios e serviços na universidade.</p>
    
    <div class="examples-grid">
        <div class="example-card interactable">
            <div class="card-icon">📚</div>
            <h3>Biblioteca Central</h3>
            <p>Ir para o mapa</p>
        </div>
        <div class="example-card interactable">
            <div class="card-icon">🔬</div>
            <h3>Laboratórios de Ciências</h3>
            <p>Ir para o mapa</p>
        </div>
        <div class="example-card interactable">
            <div class="card-icon">☕</div>
            <h3>Praça de Alimentação</h3>
            <p>Ir para o mapa</p>
        </div>
    </div>
</main>
```

### Task 5: Criar Página Mercado (example-market.html)

**Files:**
- Create: `example-market.html`

- [ ] **Step 1: Criar o arquivo copiando a base do index.html e inserindo o novo `<main>`**

```html
<main class="interaction-area">
    <a href="index.html" class="btn-back interactable">← Voltar</a>
    <h1>Autoatendimento</h1>
    <p>Adicione itens ao seu carrinho com gestos.</p>
    
    <div class="examples-grid">
        <div class="example-card interactable">
            <div class="card-icon">🍎</div>
            <h3>Maçã Fresca</h3>
            <button class="demo-btn interactable">Adicionar R$ 5</button>
        </div>
        <div class="example-card interactable">
            <div class="card-icon">🍞</div>
            <h3>Pão de Forma</h3>
            <button class="demo-btn interactable">Adicionar R$ 8</button>
        </div>
        <div class="example-card interactable">
            <div class="card-icon">🥛</div>
            <h3>Leite Integral</h3>
            <button class="demo-btn interactable">Adicionar R$ 4</button>
        </div>
    </div>
</main>
```

### Task 6: Criar Página Restaurante (example-restaurant.html)

**Files:**
- Create: `example-restaurant.html`

- [ ] **Step 1: Criar o arquivo copiando a base do index.html e inserindo o novo `<main>`**

```html
<main class="interaction-area">
    <a href="index.html" class="btn-back interactable">← Voltar</a>
    <h1>Cardápio Digital</h1>
    <p>Faça seu pedido diretamente da mesa.</p>
    
    <div class="examples-grid">
        <div class="example-card interactable">
            <div class="card-icon">🍕</div>
            <h3>Pizza Margherita</h3>
            <button class="demo-btn interactable">Pedir - R$ 45</button>
        </div>
        <div class="example-card interactable">
            <div class="card-icon">🥗</div>
            <h3>Salada Caesar</h3>
            <button class="demo-btn interactable">Pedir - R$ 30</button>
        </div>
    </div>
</main>
```

### Task 7: Criar Página Hospital (example-hospital.html)

**Files:**
- Create: `example-hospital.html`

- [ ] **Step 1: Criar o arquivo copiando a base do index.html e inserindo o novo `<main>`**

```html
<main class="interaction-area">
    <a href="index.html" class="btn-back interactable">← Voltar</a>
    <h1>Totem Hospitalar</h1>
    <p>Selecione a opção desejada para triagem.</p>
    
    <div class="examples-grid">
        <div class="example-card interactable" style="border-color: #ff4757;">
            <div class="card-icon">🚨</div>
            <h3 style="color: #ff4757;">Pronto Socorro</h3>
        </div>
        <div class="example-card interactable">
            <div class="card-icon">📅</div>
            <h3>Agendar Consulta</h3>
        </div>
        <div class="example-card interactable">
            <div class="card-icon">🧪</div>
            <h3>Retirar Exames</h3>
        </div>
    </div>
</main>
```
