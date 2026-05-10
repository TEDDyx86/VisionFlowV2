const cursorElement = document.getElementById('custom-cursor');
const statusGesture = document.getElementById('status-hand'); // Alterado para status-hand no novo design

// Hover effects
let currentHoverElement = null;

// Dwell Actions
let dwellStartTime = 0;
let dwellAnimationFrame = null;
const DWELL_TIME = 3000;

function updateDwellProgress() {
    const now = Date.now();
    const elapsed = now - dwellStartTime;
    const progress = Math.min(elapsed / DWELL_TIME, 1);
    
    if(cursorElement) {
        const circle = cursorElement.querySelector('.cursor-dwell-circle');
        if (circle) {
            const maxOffset = 176;
            circle.style.strokeDashoffset = maxOffset - (maxOffset * progress);
        }
    }

    if (progress >= 1) {
        if(cursorElement) cursorElement.classList.remove('dwelling');
        // Aciona o clique nas coordenadas atuais do cursor
        triggerClick(parseFloat(cursorElement.style.left), parseFloat(cursorElement.style.top));
        cancelDwell();
    } else {
        dwellAnimationFrame = requestAnimationFrame(updateDwellProgress);
    }
}

function startDwell() {
    cancelDwell();
    dwellStartTime = Date.now();
    if(cursorElement) cursorElement.classList.add('dwelling');
    dwellAnimationFrame = requestAnimationFrame(updateDwellProgress);
}

function cancelDwell() {
    if (dwellAnimationFrame) {
        cancelAnimationFrame(dwellAnimationFrame);
        dwellAnimationFrame = null;
    }
    if(cursorElement) {
        cursorElement.classList.remove('dwelling');
        const circle = cursorElement.querySelector('.cursor-dwell-circle');
        if (circle) circle.style.strokeDashoffset = 176;
    }
}

window.addEventListener('message', (event) => {
    if (event.data.type === 'VISIONFLOW_DWELL_START') {
        startDwell();
    } else if (event.data.type === 'VISIONFLOW_DWELL_CANCEL') {
        cancelDwell();
    }
});

export function updateCursor(x, y, isPinching) {
    if (x === null || y === null) {
        if(cursorElement) cursorElement.classList.add('hidden');
        if(statusGesture) {
            statusGesture.innerText = 'Mão não detectada';
            statusGesture.className = 'px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold';
        }
        // Remove hover anterior se a mão sumir
        if (currentHoverElement) {
            currentHoverElement.classList.remove('hovered');
            if (currentHoverElement.tagName === 'IFRAME') {
                currentHoverElement.contentWindow.postMessage({ type: 'VISIONFLOW_HOVER', x: -1, y: -1 }, '*');
            }
            currentHoverElement = null;
            cancelDwell();
        }
        return;
    }

    if(cursorElement) {
        cursorElement.classList.remove('hidden');
        cursorElement.style.left = `${x}px`;
        cursorElement.style.top = `${y}px`;
    }

    if (isPinching) {
        if(cursorElement) cursorElement.classList.add('pinching');
        if(statusGesture) {
            statusGesture.innerText = 'Pinçando';
            statusGesture.className = 'px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold';
        }
    } else {
        if(cursorElement) cursorElement.classList.remove('pinching');
        if(statusGesture) {
            statusGesture.innerText = 'Movendo';
            statusGesture.className = 'px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-bold';
        }
    }

    // Detecção de Hover
    const element = document.elementFromPoint(x, y);
    
    if (element && element.tagName === 'IFRAME') {
        const rect = element.getBoundingClientRect();
        element.contentWindow.postMessage({
            type: 'VISIONFLOW_HOVER',
            x: x - rect.left,
            y: y - rect.top
        }, '*');
        
        if (currentHoverElement !== element) {
            if (currentHoverElement && currentHoverElement.tagName !== 'IFRAME') {
                currentHoverElement.classList.remove('hovered');
                cancelDwell();
            }
            currentHoverElement = element;
        }
    } else if (element && element.classList.contains('interactable')) {
        if (currentHoverElement !== element) {
            if (currentHoverElement) {
                currentHoverElement.classList.remove('hovered');
                cancelDwell();
                if (currentHoverElement.tagName === 'IFRAME') {
                    currentHoverElement.contentWindow.postMessage({ type: 'VISIONFLOW_HOVER', x: -1, y: -1 }, '*');
                }
            }
            element.classList.add('hovered');
            currentHoverElement = element;
            if (element.classList.contains('dwellable')) {
                startDwell();
            }
        }
    } else {
        if (currentHoverElement) {
            currentHoverElement.classList.remove('hovered');
            cancelDwell();
            if (currentHoverElement.tagName === 'IFRAME') {
                currentHoverElement.contentWindow.postMessage({ type: 'VISIONFLOW_HOVER', x: -1, y: -1 }, '*');
            }
            currentHoverElement = null;
        }
    }
}

export function triggerClick(x, y) {
    // Simular evento de clique na posição (x,y)
    const element = document.elementFromPoint(x, y);
    if (element) {
        if (element.tagName === 'IFRAME') {
            const rect = element.getBoundingClientRect();
            element.contentWindow.postMessage({
                type: 'VISIONFLOW_CLICK',
                x: x - rect.left,
                y: y - rect.top
            }, '*');
            return;
        }

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
        if(statusGesture) statusGesture.innerText = dy > 0 ? 'Scroll Down' : 'Scroll Up';
        scrollInterval = setInterval(() => {
            const iframeView = document.getElementById('iframe-view');
            const templateFrame = document.getElementById('template-frame');
            
            if (iframeView && !iframeView.classList.contains('hidden') && templateFrame && templateFrame.contentWindow) {
                templateFrame.contentWindow.postMessage({
                    type: 'VISIONFLOW_SCROLL',
                    dy: dy
                }, '*');
            } else {
                const container = document.querySelector('.interaction-area');
                if (container) {
                    container.scrollBy({ top: dy, behavior: 'auto' });
                } else {
                    window.scrollBy({ top: dy, behavior: 'auto' });
                }
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

export function triggerDrag(x, y, dx, dy) {
    const element = document.elementFromPoint(x, y);
    if (element && element.tagName === 'IFRAME') {
        element.contentWindow.postMessage({
            type: 'VISIONFLOW_DRAG',
            dx: dx,
            dy: dy
        }, '*');
    }
}
