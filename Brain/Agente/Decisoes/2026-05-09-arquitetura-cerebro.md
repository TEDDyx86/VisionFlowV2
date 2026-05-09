# ADR-001: Integração do Obsidian como Cérebro de Memória

- **Data**: 2026-05-09
- **Status**: Aceito
- **Contexto**: O sistema VisionFlow precisava de uma forma de lembrar preferências de usuários e registrar decisões técnicas de forma transparente e persistente.
- **Escolha**: Sincronização Assíncrona via Agente.
- **Consequências**: 
    - Positivo: Baixa complexidade técnica no frontend.
    - Negativo: Requer que o Agente faça a "ponte" manualmente entre o browser e o Obsidian.
