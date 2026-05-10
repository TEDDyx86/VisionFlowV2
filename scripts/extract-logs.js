const fs = require('fs');
const path = require('path');

async function extractLogsToObsidian(logs) {
    if (!logs || logs.length === 0) {
        console.log('Nenhum log encontrado para extrair.');
        return;
    }

    const date = new Date().toISOString().split('T')[0];
    const sessionFile = path.join(__dirname, '..', 'Brain', 'Sessoes', `${date}-sessao-extraida.md`);
    
    let content = `# Sessão Extraída - ${date}\n\n`;
    content += `## Eventos de Navegação\n\n`;
    
    logs.forEach(log => {
        content += `- **[${log.time}]**: ${log.message}\n`;
    });
    
    content += `\n\n--- \n*Extraído automaticamente via Agente VisionFlow.*`;

    fs.writeFileSync(sessionFile, content);
    console.log(`✅ Logs extraídos com sucesso para: ${sessionFile}`);
}

// Se rodado diretamente
if (require.main === module) {
    // Exemplo de como seria chamado passando logs via argumento ou arquivo temporário
    const rawData = process.argv[2];
    if (rawData) {
        const logs = JSON.parse(rawData);
        extractLogsToObsidian(logs);
    }
}

module.exports = { extractLogsToObsidian };
