import { getCalibrationParams } from './calibration.js';

const cursorElement = document.getElementById('custom-cursor');
const statusGesture = document.getElementById('status-hand'); // Alterado para status-hand no novo design

// Hover effects
let currentHoverElement = null;

// Dwell Actions
let dwellStartTime = 0;
let dwellAnimationFrame = null;
let activeDwellElement = null;
let iframeDwellTime = null;
const DWELL_TIME_DEFAULT = 800; // ms - padrão reduzido de 3000ms

function getDwellTime(element) {
    if (iframeDwellTime !== null) {
        return iframeDwellTime;
    }
    if (element && element.dataset.dwellTime) {
        return parseInt(element.dataset.dwellTime, 10);
    }
    return DWELL_TIME_DEFAULT;
}

function updateDwellProgress() {
    const now = Date.now();
    const elapsed = now - dwellStartTime;
    const dwellTime = getDwellTime(activeDwellElement);
    const progress = Math.min(elapsed / dwellTime, 1);
    
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

function startDwell(element, customDwellTime = null) {
    cancelDwell();
    activeDwellElement = element;
    iframeDwellTime = customDwellTime;
    dwellStartTime = Date.now();
    if(cursorElement) cursorElement.classList.add('dwelling');
    dwellAnimationFrame = requestAnimationFrame(updateDwellProgress);
}

function cancelDwell() {
    if (dwellAnimationFrame) {
        cancelAnimationFrame(dwellAnimationFrame);
        dwellAnimationFrame = null;
    }
    activeDwellElement = null;
    iframeDwellTime = null;
    if(cursorElement) {
        cursorElement.classList.remove('dwelling');
        const circle = cursorElement.querySelector('.cursor-dwell-circle');
        if (circle) circle.style.strokeDashoffset = 176;
    }
}

window.addEventListener('message', (event) => {
    if (event.data.type === 'VISIONFLOW_DWELL_START') {
        startDwell(null, event.data.dwellTime);
    } else if (event.data.type === 'VISIONFLOW_DWELL_CANCEL') {
        cancelDwell();
    }
});

let lastHoverCheck = 0;

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

    // Detecção de Hover com Throttling para Performance
    const now = Date.now();
    if (now - lastHoverCheck > 100) {
        const rawEl = document.elementFromPoint(x, y);
        const element = rawEl ? rawEl.closest('.interactable, .dwellable, button, a, [role="button"]') || rawEl : null;
        
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
        } else if (element && (element.classList.contains('interactable') || element.classList.contains('dwellable'))) {
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
                    startDwell(element);
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
        lastHoverCheck = now;
    }
}

export function triggerClick(x, y) {
    // Simular evento de clique na posição (x,y)
    const rawEl = document.elementFromPoint(x, y);
    const element = rawEl ? rawEl.closest('.interactable, .dwellable, button, a, [role="button"]') || rawEl : null;
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
        if (element.classList.contains('interactable') || element.classList.contains('dwellable')) {
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

export function triggerDrag(x, y, dx, dy, isFromInertia = false) {
    const params = getCalibrationParams();
    const multiplier = params && params.scrollMultiplier ? params.scrollMultiplier : 1.8;
    
    // Se for inércia, a velocidade já foi escalada inicialmente pelo multiplier.
    const finalDx = isFromInertia ? dx : dx * multiplier;
    const finalDy = isFromInertia ? dy : dy * multiplier;

    const element = document.elementFromPoint(x, y);
    if (element && element.tagName === 'IFRAME') {
        element.contentWindow.postMessage({
            type: 'VISIONFLOW_DRAG',
            dx: finalDx,
            dy: finalDy
        }, '*');
    } else {
        // Fallback: scroll da janela principal (ex: quando iframe não está ativo)
        window.scrollBy({ top: -finalDy * 1.5, behavior: 'instant' });
    }
}

// Lógica de Inércia Física para o Scroll (Momentum)
let inertiaFrameId = null;
let currentInertiaX = 0;
let currentInertiaY = 0;
let lastInertiaTime = 0;
const FRICTION = 0.94; // amortecimento por frame de referência (16.67ms)

export function startScrollInertia(x, y, vx, vy) {
    stopScrollInertia();

    const params = getCalibrationParams();
    const multiplier = params && params.scrollMultiplier ? params.scrollMultiplier : 1.8;

    currentInertiaX = vx * multiplier;
    currentInertiaY = vy * multiplier;
    lastInertiaTime = 0;

    function step(now) {
        // delta-time para friction e deslocamento consistentes em qualquer refresh rate
        const dt = lastInertiaTime > 0 ? Math.min(now - lastInertiaTime, 50) : 16.67;
        lastInertiaTime = now;
        const frames = dt / 16.67;

        if (Math.abs(currentInertiaX) < 0.2 && Math.abs(currentInertiaY) < 0.2) {
            stopScrollInertia();
            return;
        }

        triggerDrag(x, y, currentInertiaX * frames, currentInertiaY * frames, true);

        currentInertiaX *= Math.pow(FRICTION, frames);
        currentInertiaY *= Math.pow(FRICTION, frames);

        inertiaFrameId = requestAnimationFrame(step);
    }

    inertiaFrameId = requestAnimationFrame(step);
}

export function stopScrollInertia() {
    if (inertiaFrameId) {
        cancelAnimationFrame(inertiaFrameId);
        inertiaFrameId = null;
    }
    lastInertiaTime = 0;
}
