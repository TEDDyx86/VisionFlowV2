import { logEvent } from './eventLog.js';

const presets = {
    smooth: {
        smoothing: 0.2,
        pinchThreshold: 0.08,
        scrollTopZone: 0.2,
        scrollBottomZone: 0.8,
        scrollSpeed: 8
    },
    standard: {
        smoothing: 0.5,
        pinchThreshold: 0.06,
        scrollTopZone: 0.25,
        scrollBottomZone: 0.75,
        scrollSpeed: 12
    },
    fast: {
        smoothing: 0.8,
        pinchThreshold: 0.04,
        scrollTopZone: 0.3,
        scrollBottomZone: 0.7,
        scrollSpeed: 16
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
