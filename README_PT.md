# MindVault

**App de Aprendizado, Ideias e Hiperfoco** - Projetado para neurodivergentes (TDAH/Ansiedade)

## Visão Geral

MindVault é um aplicativo mobile minimalista com design elegante (Preto + Branco + Dourado) que combina:

- **Flashcards SRS**: Repetição espaçada automática usando algoritmo SM-2
- **Flow Engine**: Sistema inteligente que decide o próximo passo ideal baseado em seu nível de energia
- **Idea Vault**: Captura e reativa estado mental, não apenas texto
- **Modo Hiperfoco**: Sessões Pomodoro sem distração

## Design com Profundidade e Elegância

- Gradientes sutis para criar camadas visuais
- Sombras sofisticadas (incluindo sombra dourada para elementos especiais)
- Efeitos glass morphism
- Bordas iluminadas
- Tipografia refinada com letter spacing

## Estrutura do Projeto

```
/src
  /components     - Componentes reutilizáveis (Button, Card, Header)
  /screens        - Telas do app
  /services       - Lógica de negócio (SRS, Flow Engine)
  /hooks          - React hooks customizados
  /store          - Gerenciamento de estado global (Zustand)
  /navigation     - Configuração de navegação
  /theme          - Sistema de tema elegante
  /types          - Tipos TypeScript
  /database       - SQLite database operations
```

## Tech Stack

- **Framework**: React Native CLI
- **Linguagem**: TypeScript (strict mode)
- **Persistência**: SQLite (react-native-sqlite-storage)
- **Estado**: Zustand
- **Navegação**: React Navigation v6
- **UI**: react-native-linear-gradient para efeitos elegantes

## Funcionalidades Implementadas

### ✅ Fase 0 - Skeleton
- ✅ Setup RN CLI + TypeScript (strict mode)
- ✅ Estrutura de pastas organizada
- ✅ Sistema de tema com profundidade e elegância
- ✅ Componentes base elegantes (Button, Card, Header)

### ✅ Fase 1 - Core
- ✅ Banco de dados SQLite com schema completo
- ✅ Algoritmo SRS (SM-2) implementado
- ✅ Flow Engine com lógica de energia
- ✅ Sistema de navegação React Navigation
- ✅ Tela Welcome com features
- ✅ Tela Energy Select interativa
- ✅ Tela Dashboard com stats e recomendações

### ✅ Fase 2 - Funcionalidades Principais
- ✅ **Tela de Estudo** - Flip animation 3D, rating (Fácil/Médio/Difícil), progresso
- ✅ **Tela de Captura de Ideias** - Estados emocionais, vision points, prioridades
- ✅ **Modo Hiperfoco** - Timer Pomodoro completo (25min/15min/5min), breaks automáticos
- ✅ **Dados de Exemplo** - Decks e flashcards pré-populados para demonstração

### 🎯 Extras Implementados
- ✅ Design elegante com gradientes e sombras sofisticadas
- ✅ Glass morphism e efeitos de profundidade
- ✅ Animações suaves e feedback visual
- ✅ Sistema de estado global com Zustand
- ✅ Tipagem TypeScript rigorosa

## Como Executar

### Pré-requisitos
- Node.js >= 20
- Android SDK configurado
- Dispositivo Android ou emulador

### Instalação

1. Instalar dependências:
\`\`\`bash
cd MindVault
npm install
\`\`\`

2. Iniciar o Metro bundler:
\`\`\`bash
npm start
\`\`\`

3. Em outro terminal, executar no Android:
\`\`\`bash
npm run android
\`\`\`

## Princípios UX para TDAH

- **Uma ação por tela**: Reduz paralisia de decisão
- **Feedback imediato**: Resposta visual instantânea
- **Baixo estímulo**: Sem animações desnecessárias
- **Flow Engine**: Remove a carga cognitiva de decidir o que fazer

## Funcionalidades Detalhadas

### 📚 Sistema de Flashcards
- Cards com animação de flip 3D suave
- Algoritmo SRS (SM-2) para otimizar revisões
- Sistema de rating em 3 níveis (Fácil, Médio, Difícil)
- Intervalos de revisão adaptativos
- Barra de progresso visual durante estudo
- Dados de exemplo pré-carregados

### 🧠 Idea Vault
- Captura título da ideia
- Seleção de estado emocional (Inspirado, Focado, Calmo, Empolgado)
- Lista de vision points editável
- Sistema de prioridades (Alta, Média, Baixa)
- Persistência em SQLite

### ⚡ Flow Engine
- Análise de nível de energia (Low, Normal, High)
- Recomendações personalizadas de estudo
- Mensagens motivacionais baseadas em streak
- Adaptação automática de quantidade de cards

### 🔥 Modo Hiperfoco
- Timer Pomodoro clássico (25min de foco)
- Pausas curtas (5min) e longas (15min)
- Alternância automática entre foco e pausa
- Contador de pomodoros completados
- Indicadores visuais de progresso
- Opções de duração personalizáveis

## Roadmap Futuro

- [ ] Tela de visualização e reativação de ideias salvas
- [ ] Sistema de tags para organização
- [ ] Estatísticas detalhadas de estudo
- [ ] Gerenciamento completo de decks (criar, editar, deletar)
- [ ] Notificações de revisão
- [ ] Export/Import de dados
- [ ] Sincronização em nuvem
- [ ] Widgets para tela inicial

## Licença

Desenvolvido com ❤️ para mentes brilhantes neurodivergentes.

---

**Versão**: 1.0.0
**Última atualização**: Novembro 2025
