# Spec: Redesign do Mapa 3D Hospitalar Premium

**Data**: 2026-05-10
**Status**: Draft
**Tópico**: Melhoria da visualização e layout do mapa interativo.

## 1. Objetivo
Transformar o mapa 3D atual em uma interface de alta fidelidade (Premium) que facilite a orientação do usuário, aumentando o espaçamento entre salas e aplicando efeitos visuais modernos (Glassmorphism).

## 2. Arquitetura do Mapa
O mapa continuará utilizando CSS 3D (`transform-style: preserve-3d`), mas com uma malha de coordenadas expandida.

### 2.1 Setorização (Wings)
As salas serão agrupadas em 4 alas temáticas para facilitar a carga cognitiva:
- **Ala de Diagnóstico (Norte)**: Tons de Azul.
- **Ala de Especialidades (Oeste)**: Tons de Ciano/Esmeralda.
- **Ala de Internação/UTI (Leste)**: Tons de Roxo/Indigo (Efeito de vidro escuro).
- **Ala de Emergência (Sul)**: Tons de Vermelho (Destaque visual).

### 2.2 Grid e Espaçamento
- **Container**: Aumento do plano base para `1200px x 900px`.
- **Corredores**: Mínimo de `80px` de largura entre blocos de alas diferentes.
- **Base**: Grid sutil em `#f0f0f0` com linhas de 1px a cada 40px.

## 3. Design dos Componentes

### 3.1 Blocos de Salas (Room Blocks)
- **Visual**: Fundo semi-transparente (`rgba(255,255,255,0.7)`) com `backdrop-filter: blur(10px)`.
- **Bordas**: 1px sólido com a cor temática da ala em opacidade baixa (20%).
- **Sombras**:
  - Sombra de contato (preta, baixa opacidade).
  - Sombra de "elevação" (cor temática, difusa).
- **Interação**: No hover, a sala sobe 40px no eixo Z (`translateZ(40px)`) e aumenta a intensidade do desfoque.

### 3.2 Emergência (Destaque)
- Bloco 50% mais alto que os demais.
- Animação de pulso na borda.
- Ícone centralizado e maior.

### 3.3 Caminho de Navegação (Pathing)
- Linha contínua com gradiente neon.
- Efeito de "fluxo" (dash-offset animado).

## 4. Plano de Implementação
1. Refatorar as classes CSS de salas para suportar os novos efeitos de vidro.
2. Atualizar as coordenadas de todas as salas no HTML.
3. Implementar a nova lógica de hover e profundidade.
4. Adicionar a sinalização de "Você está aqui" com um marcador 3D flutuante.

## 5. Verificação
- O mapa deve rotacionar suavemente via controles de UI.
- Nenhuma sala deve sobrepor outra visualmente em ângulos de 45 graus.
- O contraste entre o texto da sala e o fundo deve atender ao WCAG AA.
