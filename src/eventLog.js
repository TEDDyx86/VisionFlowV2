export function logEvent(message) {
    const logList = document.getElementById('log-list');
    if (!logList) return;

    const li = document.createElement('li');
    
    // Formatar hora local
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour12: false });
    
    li.innerHTML = `<strong>[${timeString}]</strong> ${message}`;
    
    // Adiciona no topo
    logList.insertBefore(li, logList.firstChild);

    // Mantém no máximo 20 eventos
    if (logList.children.length > 20) {
        logList.removeChild(logList.lastChild);
    }
}
