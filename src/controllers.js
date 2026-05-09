const cursorElement = document.getElementById('custom-cursor');
const statusGesture = document.getElementById('status-gesture');

// Hover effects
let currentHoverElement = null;

export function updateCursor(x, y, isPinching) {
    if (x === null || y === null) {
        cursorElement.classList.add('hidden');
        statusGesture.innerText = 'Pronto';
        // Remove hover anterior se a mão sumir
        if (currentHoverElement) {
            currentHoverElement.classList.remove('hovered');
            currentHoverElement = null;
        }
        return;
    }

    cursorElement.classList.remove('hidden');
    cursorElement.style.left = `${x}px`;
    cursorElement.style.top = `${y}px`;

    if (isPinching) {
        cursorElement.classList.add('pinching');
        statusGesture.innerText = 'Pinçando';
    } else {
        cursorElement.classList.remove('pinching');
        statusGesture.innerText = 'Movendo';
    }

    // Detecção de Hover
    const element = document.elementFromPoint(x, y);
    if (element && element.classList.contains('interactable')) {
        if (currentHoverElement !== element) {
            if (currentHoverElement) currentHoverElement.classList.remove('hovered');
            element.classList.add('hovered');
            currentHoverElement = element;
        }
    } else {
        if (currentHoverElement) {
            currentHoverElement.classList.remove('hovered');
            currentHoverElement = null;
        }
    }
}

export function triggerClick(x, y) {
    // Simular evento de clique na posição (x,y)
    const element = document.elementFromPoint(x, y);
    if (element) {
        // Efeito visual no card se for iterativo
        if (element.classList.contains('interactable')) {
            element.classList.add('clicked');
            setTimeout(() => element.classList.remove('clicked'), 200);
        }

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(clickEvent);
    }
}

let scrollInterval = null;

export function triggerScroll(dy) {
    if (!scrollInterval) {
        statusGesture.innerText = dy > 0 ? 'Scroll Down' : 'Scroll Up';
        scrollInterval = setInterval(() => {
            const container = document.querySelector('.interaction-area');
            if (container) {
                container.scrollBy({ top: dy, behavior: 'auto' });
            }
        }, 16); // ~60fps
    }
}

export function endScroll() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}
