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
            document.getElementById('status-cam').className = 'status-badge offline';
            document.getElementById('status-cam').innerText = 'Câmera Off';
            document.getElementById('status-hand').className = 'status-badge offline';
            document.getElementById('status-hand').innerText = 'Mão não detectada';
            
            // Volta para a tela de consentimento
            document.getElementById('overlay').classList.add('active');
            document.getElementById('consent-modal').classList.add('active');
            document.getElementById('onboarding-step1').classList.add('hidden');
            document.getElementById('onboarding-step2').classList.add('hidden');
        }
    });
});
