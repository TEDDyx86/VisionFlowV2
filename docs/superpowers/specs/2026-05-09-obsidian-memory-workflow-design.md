# Design Spec: Obsidian Agentic Memory Workflow

**Data**: 2026-05-09
**Status**: Draft
**Topic**: Definição do processo de extração, sumarização e armazenamento de memória no VisionFlow 2.0.

## 1. Visão Geral
Este documento descreve o fluxo de trabalho onde o Agente IA atua como o curador do "Cérebro" do sistema, transformando logs efêmeros do navegador em conhecimento persistente no Obsidian.

## 2. Componentes do Sistema

### 2.1 Extração de Dados (LocalStorage)
O sistema utiliza a chave `visionflow_logs` no `localStorage` para armazenar os últimos 50 eventos. O Agente acessará esses dados via ferramentas de inspeção do navegador.

### 2.2 Motor de Sumarização (Agentic)
O Agente processará os logs brutos seguindo estas regras:
- Agrupar ações repetitivas (ex: "5 scrolls" vira "Navegação fluida pela página").
- Identificar intenções por trás dos cliques.
- Extrair erros de console ou comportamentos inesperados.

### 2.3 Estrutura de Destino (Obsidian Vault)
- `Brain/Sessoes/YYYY-MM-DD-sessao-N.md`: Relatórios detalhados de cada período de uso.
- `Brain/Usuarios/User_Default.md`: Perfil evolutivo das preferências do usuário.

## 3. Templates de Nota

### 3.1 Sessão
```markdown
# Sessão de Uso: [Título]
- **Data**: YYYY-MM-DD
- **Duração**: [X] min

## 📝 Resumo Narrativo
[Descrição]

## 💡 Insights e Preferências
- [Insight]

## 🛠️ Debug e Erros
- [Erro]
```

### 3.2 Perfil de Usuário
```markdown
# Perfil: [Nome/ID]
- **Primeiro Contato**: YYYY-MM-DD

## 🎨 Preferências Estéticas
- [Preferência]

## 🧠 Memória Acumulada
- [Fato]
```

## 4. Plano de Verificação
- O Agente deve ser capaz de ler o `localStorage` com sucesso.
- O Agente deve criar os arquivos Markdown nas pastas corretas.
- O Agente deve atualizar o perfil de usuário sem apagar informações anteriores.
