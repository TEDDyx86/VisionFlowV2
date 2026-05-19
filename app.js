import { initConsent } from './src/consent.js';
import { initOnboarding } from './src/onboarding.js';
import { startCamera, stopCamera } from './src/camera.js';
import { initHandTracker } from './src/handTracker.js';
import { initFallbackKeyboard } from './src/fallbackKeyboard.js';
import { logEvent } from './src/eventLog.js';
import { initCalibration } from './src/calibration.js';

document.addEventListener('DOMContentLoaded', () => {
    logEvent('Sistema inicializado');
    
    // IniciaFallback de teclado logo no início para acessibilidade
    initFallbackKeyboard();
    
    // Inicia Calibração
    initCalibration();

    // Módulos que precisam ser encadeados
    // O consentimento aciona a câmera, que aciona o handTracker (e por fim o onboarding e gestos)
    initConsent({
        onAccept: () => {
            logEvent('Câmera permitida pelo usuário');
            // Fluxo: Ligar câmera -> Iniciar tracker -> Começar Onboarding
            startCamera()
                .then(videoElement => {
                    initHandTracker(videoElement);
                    initOnboarding();
                })
                .catch(err => {
                    logEvent(`Erro na câmera: ${err.message}`);
                    alert("Não foi possível acessar a câmera. Tente novamente ou use o teclado.");
                });
        },
        onDeny: () => {
            logEvent('Câmera negada. Fallback ativo.');
            // Fallback já iniciado
            document.getElementById('overlay').classList.remove('active');
        },
        onRevoke: () => {
            logEvent('Acesso à câmera revogado');
            stopCamera();
            const camBadge = document.getElementById('status-cam');
            const handBadge = document.getElementById('status-hand');
            const offlineClass = 'px-4 py-1.5 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold whitespace-nowrap';
            if (camBadge) { camBadge.className = offlineClass; camBadge.innerText = 'Câmera Off'; }
            if (handBadge) { handBadge.className = offlineClass; handBadge.innerText = 'Mão não detectada'; }
            
            // Volta para a tela de consentimento
            document.getElementById('overlay').classList.add('active');
            document.getElementById('consent-modal').classList.add('active');
            document.getElementById('onboarding-step1').classList.add('hidden');
            document.getElementById('onboarding-step2').classList.add('hidden');
        }
    });

    // Lógica da UI para os Templates
    const homeView = document.getElementById('home-view');
    const iframeView = document.getElementById('iframe-view');
    const templateFrame = document.getElementById('template-frame');
    const cameraPreview = document.getElementById('camera-preview-container'); // Container da câmera
    const mainHeader = document.getElementById('main-header'); // Header principal
    
    document.querySelectorAll('.interactable[data-template]').forEach(card => {
        card.addEventListener('click', (e) => {
            const template = e.currentTarget.getAttribute('data-template');
            if (template) {
                logEvent(`Abrindo template: ${template}`);
                templateFrame.src = template;
                homeView.classList.add('hidden');
                iframeView.classList.remove('hidden');
                if (cameraPreview) cameraPreview.classList.add('hidden'); // Oculta a câmera
                if (mainHeader) mainHeader.classList.add('hidden'); // Oculta o header principal para evitar sobreposição
            }
        });
    });

    document.getElementById('btn-back-home').addEventListener('click', () => {
        logEvent('Voltando ao menu principal');
        templateFrame.src = '';
        iframeView.classList.add('hidden');
        homeView.classList.remove('hidden');
        if (cameraPreview) cameraPreview.classList.remove('hidden'); // Mostra a câmera
        if (mainHeader) mainHeader.classList.remove('hidden'); // Mostra o header principal
    });

    // Escuta mensagens postMessage dos iframes (ex: tutorial.html)
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'VISIONFLOW_CLOSE_MODULE') {
            document.getElementById('btn-back-home').click();
        }
    });
});
