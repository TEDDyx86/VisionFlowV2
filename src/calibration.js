import { logEvent } from './eventLog.js';

const presets = {
    smooth: { // Foco em Estabilidade Máxima (Cenário Hospital)
        mincutoff: 0.05,
        beta: 0.01,
        pinchThreshold: 0.08
    },
    standard: { // Equilibrado
        mincutoff: 0.5,
        beta: 0.05,
        pinchThreshold: 0.06
    },
    fast: { // Foco em Agilidade (Cenário Fast Food)
        mincutoff: 1.0,
        beta: 0.08,
        pinchThreshold: 0.04
    }
};

let currentPreset = 'smooth';

export function initCalibration() {
    const buttons = document.querySelectorAll('.preset-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPreset = e.target.getAttribute('data-preset');
            logEvent(`Calibração alterada para: ${currentPreset}`);
        });
    });
}

export function getCalibrationParams() {
    return presets[currentPreset];
}
