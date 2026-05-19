export function logEvent(message) {
    const logList = document.getElementById('log-list');
    
    // Formatar hora local
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour12: false });
    const logEntry = { time: timeString, message: message, timestamp: now.getTime() };

    // Persistência no LocalStorage
    try {
        const savedLogs = JSON.parse(localStorage.getItem('visionflow_logs') || '[]');
        savedLogs.push(logEntry);
        if (savedLogs.length > 50) savedLogs.shift();
        localStorage.setItem('visionflow_logs', JSON.stringify(savedLogs));
    } catch (e) {
        console.error('Erro ao salvar log no localStorage:', e);
    }

    if (!logList) return;

    const li = document.createElement('li');
    li.innerHTML = `<strong>[${timeString}]</strong> ${message}`;
    logList.insertBefore(li, logList.firstChild);

    if (logList.children.length > 20) {
        logList.removeChild(logList.lastChild);
    }
}
