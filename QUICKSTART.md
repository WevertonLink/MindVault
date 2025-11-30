# 🚀 Guia de Início Rápido - MindVault

## ⚡ Instalação Rápida

```bash
cd MindVault
npm install
npm start
```

Em outro terminal:
```bash
npm run android
```

## 🎯 Primeiro Uso

### 1. Tela de Boas-Vindas
- Apresenta as 4 features principais do app
- Clique em **"Começar"** para iniciar

### 2. Seleção de Energia
- **Energia Baixa** 🌙 - Apenas alguns cards (5)
- **Energia Normal** ☀️ - Sessão moderada (20 revisões)
- **Energia Alta** ⚡ - Sessão intensa (30 cards mistos)

### 3. Dashboard
Você verá:
- **Recomendação do Flow Engine** - O que fazer agora
- **Stats** - Streak, revisões pendentes, ideias, minutos
- **Ações** - Iniciar Estudo, Capturar Ideia, Hiperfoco

## 📚 Funcionalidades

### Estudar Flashcards
1. No Dashboard, clique em **"Iniciar Estudo"**
2. Toque no card para virar e ver a resposta
3. Avalie sua resposta: **Difícil** / **Médio** / **Fácil**
4. O algoritmo SRS ajusta automaticamente o intervalo

### Capturar Ideias
1. No Dashboard, clique em **"Capturar Ideia"**
2. Digite o título da ideia
3. Selecione seu estado emocional atual
4. Adicione pontos-chave da visão
5. Defina a prioridade
6. Salve!

### Modo Hiperfoco
1. No Dashboard, clique em **"Hiperfoco"**
2. Escolha a duração (25min padrão Pomodoro)
3. Clique em **"Iniciar"**
4. Foque sem distrações
5. O app alterna automaticamente entre foco e pausa

## 🎨 Design Elegante

### Gradientes e Profundidade
- Cards com sombras em camadas
- Gradiente dourado nos botões primários
- Glass morphism em elementos especiais

### Cores
- **Fundo**: Preto profundo (#000000)
- **Cards**: Cinza escuro (#111111)
- **Dourado**: Acento principal (#FFD700)
- **Texto**: Branco puro (#FFFFFF)

### Animações
- Flip 3D suave nos flashcards
- Transições horizontais entre telas
- Feedback tátil nos botões

## 🧠 Para TDAH

### Princípios Aplicados
- **Uma ação por tela** - Reduz sobrecarga cognitiva
- **Feedback visual imediato** - Sempre sabe o que está acontecendo
- **Flow Engine** - Remove paralisia de decisão
- **Baixo estímulo** - Sem animações desnecessárias

### Dicas de Uso
1. Sempre selecione sua energia atual honestamente
2. Use o Hiperfoco em momentos de alta energia
3. Capture ideias imediatamente, não adie
4. Confie no Flow Engine - ele sabe o que você precisa

## 📦 Dados de Exemplo

O app vem com:
- **2 Decks** pré-criados (JavaScript Básico, React Native)
- **6 Flashcards** para testar o sistema SRS
- **3 Ideias** de exemplo

## 🔍 Estrutura do Código

```
/src
├── components/        # Button, Card, Header
├── screens/          # 7 telas completas
├── services/         # SRS, Flow Engine, Sample Data
├── store/            # Zustand global state
├── navigation/       # React Navigation setup
├── theme/            # Design system elegante
├── types/            # TypeScript interfaces
└── database/         # SQLite operations
```

## 🐛 Troubleshooting

### App não compila
```bash
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache
```

### Database error
- Delete o app do emulador
- Reinstale com `npm run android`

### Animações lentas
- Use um dispositivo físico ou emulador com aceleração

## 📱 Testado Em

- Android SDK 33+
- React Native 0.82.1
- Node.js 20+

## 💡 Próximos Passos

Após familiarizar-se:
1. Crie seus próprios decks de flashcards
2. Capture suas ideias reais
3. Use o Hiperfoco diariamente
4. Acompanhe seu streak

---

**Desenvolvido com ❤️ para mentes neurodivergentes**

MindVault v1.0.0
