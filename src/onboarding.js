import { logEvent } from './eventLog.js';

export function initOnboarding() {
    const step1 = document.getElementById('onboarding-step1');
    const step2 = document.getElementById('onboarding-step2');
    const overlay = document.getElementById('overlay');

    const btnNext1 = document.getElementById('btn-next-step1');
    const btnNext2 = document.getElementById('btn-next-step2');
    const btnFinish = document.getElementById('btn-finish-onboarding');

    // Mostra a etapa 1
    step1.classList.remove('hidden');
    step1.classList.add('active');

    btnNext1.addEventListener('click', () => {
        step1.classList.remove('active');
        step1.classList.add('hidden');
        
        step2.classList.remove('hidden');
        step2.classList.add('active');
        logEvent('Onboarding: Etapa 2');
    });

    const finishOnboarding = () => {
        step2.classList.remove('active');
        step2.classList.add('hidden');
        overlay.classList.remove('active');
        logEvent('Onboarding Finalizado');
    };

    btnNext2.addEventListener('click', finishOnboarding);
    btnFinish.addEventListener('click', finishOnboarding);
}
