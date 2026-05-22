import { updateCursor, triggerClick, triggerScroll, endScroll, triggerDrag, startScrollInertia, stopScrollInertia } from './controllers.js';
import { getCalibrationParams } from './calibration.js';
import { logEvent } from './eventLog.js';
import { OneEuroFilter } from './OneEuroFilter.js';

let isPinching = false;
let lastPinchTime = 0;
let pinchDebounce = 300; // ms

// Smoothing Dinâmico (Filtro de 1 Euro)
const filterX = new OneEuroFilter(0.5, 0.05);
const filterY = new OneEuroFilter(0.5, 0.05);

let lastCursorX = 0;
let lastCursorY = 0;

// Drag smoothing
let smoothedDragDx = 0;
let smoothedDragDy = 0;
const DRAG_SMOOTH = 0.35;  // peso do novo sample (menor = mais suave)
const MAX_DRAG_PX = 20;    // cap por frame — previne saltos de frames dropados

// Buffer de velocidade para lançamento de inércia
const velBufX = [];
const velBufY = [];
const VEL_BUF_LEN = 5;

export function processGestures(landmarks) {
    const params = getCalibrationParams();
    
    // Atualiza os parâmetros do filtro dinamicamente baseado no preset selecionado
    filterX.mincutoff = params.mincutoff;
    filterX.beta = params.beta;
    filterY.mincutoff = params.mincutoff;
    filterY.beta = params.beta;

    if (!landmarks) {
        // Se a mão sumir do frame, interrompe a inércia por segurança
        stopScrollInertia();
        isPinching = false;
        updateCursor(null, null, false);
        return;
    }

    // Usar o ponto 9 (MIDDLE_FINGER_MCP) ou 0 (WRIST) como base para a posição do cursor
    // 8 é o INDEX_FINGER_TIP
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    
    // Converte a coordenada normalizada para a tela e aplica o Filtro de 1 Euro
    const rawX = indexTip.x * window.innerWidth;
    const rawY = indexTip.y * window.innerHeight;
    const timestamp = performance.now();

    const smoothedX = filterX.filter(rawX, timestamp);
    const smoothedY = filterY.filter(rawY, timestamp);
    
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
        // Novo gesto de pinça cancela qualquer inércia ativa instantaneamente
        stopScrollInertia();
        
        const now = Date.now();
        if (now - lastPinchTime > pinchDebounce) {
            triggerClick(cursorX, cursorY);
            lastPinchTime = now;
            logEvent('Gesto de clique reconhecido');
        }
    }

    // Arrastar (Drag) -> Transformado em Scroll Natural
    if (isPinching && wasPinching) {
        const rawDx = cursorX - lastCursorX;
        const rawDy = cursorY - lastCursorY;

        // Cap para prevenir saltos causados por frames dropados
        const cappedDx = Math.sign(rawDx) * Math.min(Math.abs(rawDx), MAX_DRAG_PX);
        const cappedDy = Math.sign(rawDy) * Math.min(Math.abs(rawDy), MAX_DRAG_PX);

        // EMA suaviza micro-tremores sem adicionar lag perceptível
        smoothedDragDx = smoothedDragDx * (1 - DRAG_SMOOTH) + cappedDx * DRAG_SMOOTH;
        smoothedDragDy = smoothedDragDy * (1 - DRAG_SMOOTH) + cappedDy * DRAG_SMOOTH;

        // Buffer rolante para calcular velocidade de lançamento de inércia
        velBufX.push(cappedDx);
        velBufY.push(cappedDy);
        if (velBufX.length > VEL_BUF_LEN) velBufX.shift();
        if (velBufY.length > VEL_BUF_LEN) velBufY.shift();

        if (Math.abs(smoothedDragDy) > 1) {
            triggerDrag(cursorX, cursorY, smoothedDragDx, smoothedDragDy);
        }
    }

    // Ao liberar a pinça, usa média dos últimos frames para velocidade de lançamento estável
    if (!isPinching && wasPinching) {
        const N    = Math.min(3, velBufY.length);
        const avgX = N ? velBufX.slice(-N).reduce((a, b) => a + b, 0) / N : 0;
        const avgY = N ? velBufY.slice(-N).reduce((a, b) => a + b, 0) / N : 0;

        if (Math.abs(avgY) > 2 || Math.abs(avgX) > 2) {
            logEvent(`Scroll Inercial Ativado: dy=${avgY.toFixed(1)}`);
            startScrollInertia(cursorX, cursorY, avgX, avgY);
        }
        smoothedDragDx = 0;
        smoothedDragDy = 0;
        velBufX.length = 0;
        velBufY.length = 0;
    }

    lastCursorX = cursorX;
    lastCursorY = cursorY;

    // Atualiza a View
    updateCursor(cursorX, cursorY, isPinching);
}
