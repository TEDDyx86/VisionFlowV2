import { updateCursor, triggerClick, triggerScroll, endScroll, triggerDrag } from './controllers.js';
import { getCalibrationParams } from './calibration.js';
import { logEvent } from './eventLog.js';

let isPinching = false;
let lastPinchTime = 0;
let pinchDebounce = 300; // ms

// Smoothing exponencial
let smoothedX = 0;
let smoothedY = 0;

let lastCursorX = 0;
let lastCursorY = 0;

export function processGestures(landmarks) {
    const params = getCalibrationParams();

    if (!landmarks) {
        updateCursor(null, null, false);
        return;
    }

    // Usar o ponto 9 (MIDDLE_FINGER_MCP) ou 0 (WRIST) como base para a posição do cursor
    // 8 é o INDEX_FINGER_TIP
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    
    // Suavização da posição (EMA - Exponential Moving Average)
    smoothedX = smoothedX * (1 - params.smoothing) + (indexTip.x * window.innerWidth) * params.smoothing;
    smoothedY = smoothedY * (1 - params.smoothing) + (indexTip.y * window.innerHeight) * params.smoothing;
    
    // Inverter X pois a imagem da câmera é espelhada (mirror effect)
    const cursorX = window.innerWidth - smoothedX; 
    const cursorY = smoothedY;

    // Detectar Pinça (distância 3D ou 2D entre polegar e indicador)
    // Detectar Pinça (apenas distância 2D entre polegar e indicador para evitar jitter de Z)
    const dx = indexTip.x - thumbTip.x;
    const dy = indexTip.y - thumbTip.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    const wasPinching = isPinching;
    
    // Lógica da pinça baseada na calibração
    if (distance < params.pinchThreshold) {
        isPinching = true;
    } else if (distance > params.pinchThreshold * 1.2) { 
        // Histerese para evitar flicker
        isPinching = false;
    }

    // Lógica de Scroll por Zonas foi substituída por Drag-to-Scroll mais ergonômico.

    // Clique
    if (isPinching && !wasPinching) {
        const now = Date.now();
        if (now - lastPinchTime > pinchDebounce) {
            triggerClick(cursorX, cursorY);
            lastPinchTime = now;
            logEvent('Gesto de clique reconhecido');
        }
    }

    // Arrastar (Drag) -> Transformado em Scroll Natural
    if (isPinching && wasPinching) {
        const dragDx = cursorX - lastCursorX;
        const dragDy = cursorY - lastCursorY;
        if (Math.abs(dragDy) > 2) { // Threshold para evitar micro-tremores
            // Multiplicador de velocidade. O negativo inverte o eixo como num celular
            window.scrollBy({ top: -dragDy * 1.5, behavior: 'instant' }); 
            triggerDrag(cursorX, cursorY, dragDx, dragDy);
        }
    }

    lastCursorX = cursorX;
    lastCursorY = cursorY;

    // Atualiza a View
    updateCursor(cursorX, cursorY, isPinching);
}
