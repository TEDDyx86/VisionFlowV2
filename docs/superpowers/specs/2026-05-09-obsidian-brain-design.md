# Spec: Integração Obsidian Brain (Cérebro de Memória)

**Data:** 2026-05-09
**Status:** Em Revisão
**Autor:** Antigravity (IA)

## 1. Objetivo
Integrar o Obsidian como uma camada de persistência e inteligência para o projeto VisionFlow 2.0. O objetivo é permitir que o sistema "aprenda" com as interações do usuário (Memória de Longo Prazo) e documente sua própria evolução técnica (Diário de Bordo do Agente).

## 2. Arquitetura
A arquitetura escolhida é a **Sincronização via Agente (Assíncrona)**.
- O sistema VisionFlow Web captura eventos e os armazena temporariamente (LocalStorage).
- O Agente (IA) lê esses dados durante as sessões de desenvolvimento.
- O Agente organiza e escreve o conhecimento em um cofre estruturado do Obsidian.

## 3. Estrutura do Cofre (Vault)
A pasta raiz será `Brain/` na raiz do projeto.

```text
Brain/
├── 👤 Usuarios/         # Notas de perfil (User_Profile.md)
├── 🧠 Agente/           # Logs de decisões e lições aprendidas
│   ├── Decisoes/        # ADRs (Architecture Decision Records)
│   └── Erros_Comuns/    # Histórico de bugs resolvidos
├── 📅 Sessoes/          # Resumos cronológicos de uso
└── 🎨 Design_System/    # Memória visual e tokens de estilo
```

## 4. Mecânica de Sincronização
1. **app.js / eventLog.js**: Atualizados para salvar logs estruturados.
2. **Ciclo de Memória**:
   - O Agente executa o comando para ler os logs do navegador.
   - O Agente cria/atualiza as notas markdown no `Brain/`.
   - O Agente utiliza os arquivos do `Brain/` como contexto para futuras tarefas.

## 5. Templates de Dados
- **Decisão Técnica**: Data, Contexto, Opções, Escolha, Justificativa.
- **Perfil do Usuário**: Preferências de sensibilidade, temas favoritos, templates usados.
- **Resumo de Sessão**: Eventos principais, erros encontrados, feedback coletado.

## 6. Próximos Passos
1. Criar a estrutura de pastas inicial.
2. Atualizar `src/eventLog.js` para persistência básica.
3. Criar a primeira nota de decisão técnica documentando esta especificação.
