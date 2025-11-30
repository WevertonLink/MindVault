# Integração Ollama + MindVault 🤖✨

## Visão Geral

O MindVault agora possui integração completa com **Ollama** para gerar flashcards automaticamente e expandir ideias usando IA local (modelo: deepseek-r1:1.5b).

## Funcionalidades Implementadas

### 1. 🎯 Geração de Flashcards com IA

**Localização**: Dashboard → "Gerar Flashcards com IA"

**Como funciona**:
- Digite um tópico (ex: "Fotossíntese", "React Hooks", "História do Brasil")
- Escolha a quantidade de flashcards (1-10)
- Clique em "Gerar Flashcards"
- A IA cria flashcards com perguntas e respostas otimizadas para aprendizado

**Recursos**:
- Detecção automática de dificuldade (Fácil/Médio/Difícil)
- Salvar todos os flashcards em um novo deck
- Preview dos flashcards antes de salvar

### 2. 💡 Expansão de Ideias com IA

**Localização**: Idea Capture Screen → Botão "Expandir com IA"

**Como funciona**:
- Digite o título de uma ideia
- Selecione seu estado emocional
- Clique em "Expandir com IA"
- A IA gera:
  - Essência da ideia
  - Vision Points (3-5 pontos-chave)
  - Próximos Passos práticos
  - Mensagem motivacional

## Arquitetura da Integração

```
src/services/ai/
├── OllamaService.ts        # Cliente HTTP para Ollama API
├── PromptTemplates.ts      # Templates otimizados de prompts
├── FlashcardGenerator.ts   # Geração de flashcards
├── IdeaExpander.ts         # Expansão de ideias
└── index.ts                # Exports centralizados
```

## Como Testar Localmente

### Pré-requisitos

1. **Ollama rodando**:
   ```bash
   cd ~/ollama
   ./ollama serve
   ```

2. **Modelo instalado**:
   ```bash
   ./ollama list
   # Deve mostrar: deepseek-r1:1.5b
   ```

### Passo a Passo

#### No Termux:

1. **Iniciar o servidor Ollama** (se ainda não estiver rodando):
   ```bash
   cd ~/ollama
   ./ollama serve &> /tmp/ollama.log &
   ```

2. **Verificar se está funcionando**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

3. **Executar o MindVault**:
   ```bash
   cd ~/MindVault
   npm start
   ```

4. **Em outro terminal, buildar para Android**:
   ```bash
   cd ~/MindVault
   npm run android
   ```

#### No Aplicativo:

1. **Testar Geração de Flashcards**:
   - Abra o app
   - Navegue até Dashboard
   - Toque em "Gerar Flashcards com IA"
   - Digite: "Mitocôndria" (ou qualquer tópico)
   - Quantidade: 5
   - Aguarde a geração (10-30 segundos)
   - Veja os flashcards gerados
   - Toque em "Salvar Todos"

2. **Testar Expansão de Ideias**:
   - Dashboard → "Capturar Ideia"
   - Título: "App de meditação gamificado"
   - Estado emocional: "Inspirado"
   - Toque em "Expandir com IA"
   - Aguarde (10-30 segundos)
   - Vision points serão adicionados automaticamente

## Configuração do Modelo

### Endereços Disponíveis

- **Android Emulator**: `http://10.0.2.2:11434`
- **Dispositivo Real (mesmo WiFi)**: `http://192.168.x.x:11434`
- **Localhost**: `http://localhost:11434`

O serviço OllamaService está configurado para usar `10.0.2.2:11434` por padrão (Android emulator).

### Para Testar em Dispositivo Real:

Edite `/src/services/ai/OllamaService.ts`:

```typescript
constructor(
  baseUrl: string = 'http://SEU_IP_LOCAL:11434', // Ex: http://192.168.1.100:11434
  model: string = 'deepseek-r1:1.5b',
  timeout: number = 60000
)
```

**Encontrar seu IP local**:
```bash
ifconfig | grep "inet "
```

## Troubleshooting

### Erro: "Timeout: O modelo demorou muito para responder"
- **Causa**: Ollama não está rodando ou modelo está sobrecarregado
- **Solução**:
  - Verificar se Ollama está rodando: `ps aux | grep ollama`
  - Reiniciar Ollama: `killall ollama && ./ollama serve &`

### Erro: "Ollama API error: 404"
- **Causa**: Modelo não encontrado
- **Solução**:
  - Verificar modelos: `./ollama list`
  - Trocar modelo no código se necessário

### Erro: "Não foi possível gerar flashcards"
- **Causa**: Resposta do modelo está em formato inesperado
- **Solução**:
  - Tentar novamente (às vezes o modelo gera formato diferente)
  - Ver logs no terminal: `tail -f /tmp/ollama.log`

### App não conecta no Ollama
- **Causa**: Endereço IP incorreto
- **Solução**:
  - Emulador: usar `10.0.2.2:11434`
  - Dispositivo real: usar IP da máquina na rede local
  - Verificar firewall (Ollama precisa aceitar conexões externas)

## Performance

### Tempos Médios (deepseek-r1:1.5b):

- **Geração de 5 flashcards**: 15-30 segundos
- **Expansão de ideia**: 10-20 segundos
- **Uso de RAM**: +500MB durante inferência

### Otimizações:

- Timeout configurado em 60 segundos
- Streaming desabilitado para respostas mais estáveis
- Temperature ajustada por funcionalidade:
  - Flashcards: 0.7 (balanceado)
  - Expansão de ideias: 0.8 (mais criativo)

## Próximas Melhorias

- [ ] Cache de prompts frequentes
- [ ] Suporte para streaming de respostas
- [ ] Múltiplos modelos (permitir escolha)
- [ ] Sugestões de tópicos baseadas em histórico
- [ ] Integração com voz (speech-to-text)

## Licença

Integrado ao MindVault v1.0.0 - Desenvolvido com ❤️ para mentes neurodivergentes.
