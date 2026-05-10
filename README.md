# VisionFlow V2 👁️✨

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

O **VisionFlow V2** é um motor de interface web *touchless* (sem toque) focado em acessibilidade e higiene. Utilizando visão computacional diretamente no navegador, o sistema permite que usuários interajam com totens de autoatendimento usando apenas gestos manuais (movimento de pinça para clique e arraste para navegação).

O projeto foi projetado para ser modular e *white-label*, sendo facilmente adaptável para múltiplos ambientes corporativos e públicos.

## 🚀 Principais Funcionalidades

* **Rastreamento em Tempo Real:** Utiliza a webcam para mapear os *landmarks* da mão do usuário com baixíssima latência direto no *client-side*.
* **Física de Interação (Pinch-to-Click):** O sistema calcula a distância Euclidiana entre o polegar e o indicador para registrar ações de *mousedown*, *mouseup* e *click* sintético.
* **Cursor Customizado e Feedback Visual:** Interface reativa onde o cursor acompanha a mão do usuário (com interpolação linear para suavidade) e fornece *feedback* visual imediato ao detectar o clique.
* **Múltiplos Ambientes (Templates):**
  * 🍔 **Digital Greenhouse (Fast Food):** Foco em agilidade para pedidos rápidos e customização de pratos.
  * 🛒 **Market Fresh (Mercado):** Navegação por esteira de produtos e carrinho de compras prático.
  * 🏥 **Hospital Central:** UI acessível com botões de emergência baseados em *dwell time* (ativação por tempo) e retirada rápida de senhas.
  * 🎓 **Heritage University (Campus):** Hub do aluno para cardápio do RU, mapa do campus e portal acadêmico.
  * 🧊 **Configurador 3D:** Interação espacial para exploração de modelos de manufatura, visualização em múltiplas texturas (PLA, PETG, etc.) e rotação de peças.

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5, CSS3, JavaScript (Vanilla/ES6+)
* **Visão Computacional:** [Google MediaPipe (Hands)](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) via WebGL/WebAssembly.
* **Geração Visual & Prototipagem:** Antigravity

## ⚙️ Como Executar o Projeto

Como o processamento da câmera é feito localmente, você precisará de um servidor local para contornar as restrições de CORS do navegador.

1. Clone o repositório:
   ```bash
   git clone [https://github.com/TEDDyx86/VisionFlowV2.git](https://github.com/TEDDyx86/VisionFlowV2.git)
