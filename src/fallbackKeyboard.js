import { logEvent } from './eventLog.js';

let activeIndex = -1;
let interactables = [];

export function initFallbackKeyboard() {
    // Atualiza a lista de elementos que podemos iteragir
    interactables = Array.from(document.querySelectorAll('.interactable, .btn'));

    window.addEventListener('keydown', (e) => {
        // Ignora se estivermos digitando num input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Se o iframe estiver visível, repassa a tecla e ignora a lógica do pai
        const iframeView = document.getElementById('iframe-view');
        const templateFrame = document.getElementById('template-frame');
        
        if (iframeView && !iframeView.classList.contains('hidden') && templateFrame && templateFrame.contentWindow) {
            if (['ArrowDown', 'ArrowRight', 's', 'S', 'd', 'D', 'ArrowUp', 'ArrowLeft', 'w', 'W', 'a', 'A', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                templateFrame.contentWindow.postMessage({
                    type: 'VISIONFLOW_KEY',
                    key: e.key
                }, '*');
            }
            return;
        }

        // Se pressionar W/A/S/D ou Setas
        if (['ArrowDown', 'ArrowRight', 's', 'S', 'd', 'D'].includes(e.key)) {
            e.preventDefault();
            moveFocus(1);
        } else if (['ArrowUp', 'ArrowLeft', 'w', 'W', 'a', 'A'].includes(e.key)) {
            e.preventDefault();
            moveFocus(-1);
        } else if (['Enter', ' '].includes(e.key)) {
            if (activeIndex >= 0 && activeIndex < interactables.length) {
                e.preventDefault();
                interactables[activeIndex].click();
                logEvent('Clique via teclado disparado');
            }
        }
    });
}

function moveFocus(direction) {
    // Limpa estado atual
    if (activeIndex >= 0 && activeIndex < interactables.length) {
        interactables[activeIndex].classList.remove('focus-fallback');
    }

    // Calcula novo index circular
    activeIndex += direction;
    if (activeIndex >= interactables.length) activeIndex = 0;
    if (activeIndex < 0) activeIndex = interactables.length - 1;

    // Aplica novo estado
    if (interactables[activeIndex]) {
        interactables[activeIndex].classList.add('focus-fallback');
        // Scroll element para a tela caso nao esteja visível
        interactables[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
