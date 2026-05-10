const API_KEY = '2bf23b80-45de-4d05-8d86-53c3758dc363';
const API_URL = 'https://api.higgsfield.ai/v1/generations';

async function generateVideo(prompt) {
    console.log(`\n🚀 Iniciando geração de vídeo no Higgsfield...`);
    console.log(`📝 Prompt: "${prompt}"`);

    try {
        // 1. Criar o Job
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'higgsfield-video-v1', // Nome padrão do modelo
                prompt: prompt,
                duration: 5
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Falha ao criar job: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const jobId = data.id;
        console.log(`✅ Job criado com sucesso! ID: ${jobId}`);
        console.log(`⏳ Aguardando processamento (isso pode levar alguns minutos)...`);

        // 2. Polling
        let status = 'processing';
        let resultUrl = null;
        let attempts = 0;
        const maxAttempts = 60; // 10 minutos (10s por tentativa)

        while (status === 'processing' && attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10s

            const statusRes = await fetch(`${API_URL}/${jobId}`, {
                headers: { 'Authorization': `Bearer ${API_KEY}` }
            });

            if (!statusRes.ok) continue;

            const statusData = await statusRes.json();
            status = statusData.status;

            if (status === 'completed') {
                resultUrl = statusData.output_url || (statusData.results && statusData.results[0].url);
                break;
            } else if (status === 'failed') {
                throw new Error(`O processamento falhou: ${statusData.error_message || 'Erro desconhecido'}`);
            }

            process.stdout.write('.'); // Feedback visual no console
        }

        if (resultUrl) {
            console.log(`\n\n🎉 VÍDEO CONCLUÍDO!`);
            console.log(`🔗 Link: ${resultUrl}`);
            return resultUrl;
        } else {
            throw new Error('Tempo limite excedido ou URL não encontrada.');
        }

    } catch (error) {
        console.error(`\n❌ Erro no processo: ${error.message}`);
        process.exit(1);
    }
}

// Execução via linha de comando
const userPrompt = process.argv.slice(2).join(' ');
if (!userPrompt) {
    console.log('Uso: node scripts/higgsfield-tool.js "seu prompt aqui"');
    process.exit(1);
}

generateVideo(userPrompt);
