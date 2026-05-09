import { processGestures } from './gestureEngine.js';

const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusHand = document.getElementById('status-hand');

let hands = null;
let camera = null;

export function initHandTracker(videoElement) {
    hands = new window.Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1, // Focar em 1 mão para evitar confusão de multi-tracking
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    hands.onResults(onResults);

    camera = new window.Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 1280,
        height: 720
    });
    camera.start();
}

function onResults(results) {
    // Desenho para debug
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        statusHand.className = 'status-badge';
        statusHand.innerText = 'Mão Detectada';

        for (const landmarks of results.multiHandLandmarks) {
            window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS,
                {color: '#00FF00', lineWidth: 2});
            window.drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1, radius: 2});
        }

        // Passa os landmarks da primeira mão detectada para o GestureEngine
        processGestures(results.multiHandLandmarks[0]);
    } else {
        statusHand.className = 'status-badge offline';
        statusHand.innerText = 'Mão não detectada';
        
        // Passa nulo se perdeu a mão
        processGestures(null);
    }
    canvasCtx.restore();
}
