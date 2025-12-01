import { Deck, Flashcard, IdeaState } from '../types';
import { createDeck, createFlashcard, createIdea, getAllDecks } from '../database';

const sampleDecks: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'JavaScript Básico',
    description: 'Conceitos fundamentais de JavaScript',
    color: '#FFD700',
  },
  {
    name: 'React Native',
    description: 'Desenvolvimento mobile com React Native',
    color: '#61DAFB',
  },
  {
    name: 'Português - Gramática',
    description: 'Regras gramaticais essenciais',
    color: '#4CAF50',
  },
  {
    name: 'Matemática Básica',
    description: 'Fundamentos de matemática',
    color: '#FF5722',
  },
  {
    name: 'Inglês - Vocabulário',
    description: 'Palavras e expressões em inglês',
    color: '#2196F3',
  },
];

const sampleFlashcardsData: Record<string, Omit<Flashcard, 'id' | 'deckId' | 'intervalDays' | 'easeFactor' | 'repetitionCount' | 'nextReviewAt' | 'createdAt' | 'updatedAt'>[]> = {
  'JavaScript Básico': [
    {
      front: 'O que é uma closure em JavaScript?',
      back: 'Uma closure é uma função que mantém acesso ao escopo da função externa mesmo após a função externa ter retornado.',
    },
    {
      front: 'Qual a diferença entre let, const e var?',
      back: 'var tem escopo de função, let e const têm escopo de bloco. const não pode ser reatribuído.',
    },
    {
      front: 'O que é hoisting?',
      back: 'Hoisting é o comportamento do JavaScript de mover declarações para o topo do escopo durante a compilação.',
    },
  ],
  'React Native': [
    {
      front: 'O que é um componente funcional?',
      back: 'Um componente funcional é uma função JavaScript que retorna JSX e pode usar hooks para gerenciar estado.',
    },
    {
      front: 'Para que serve o hook useState?',
      back: 'useState permite adicionar estado local a componentes funcionais.',
    },
    {
      front: 'O que é StyleSheet em React Native?',
      back: 'StyleSheet é uma API que permite criar estilos de forma otimizada, similar a CSS.',
    },
  ],
  'Português - Gramática': [
    {
      front: 'Qual a diferença entre "mas" e "mais"?',
      back: '"Mas" é conjunção adversativa (porém). "Mais" indica adição ou quantidade.',
    },
    {
      front: 'Quando usar "há" ou "a" em expressões de tempo?',
      back: '"Há" indica tempo passado (há 2 anos). "A" indica tempo futuro ou distância (daqui a 2 horas).',
    },
    {
      front: 'O que é uma oração subordinada?',
      back: 'É uma oração que depende de outra (principal) para ter sentido completo.',
    },
    {
      front: 'Qual a função do pronome "se"?',
      back: 'Pode ser pronome reflexivo, parte de verbo pronominal, partícula apassivadora ou índice de indeterminação do sujeito.',
    },
    {
      front: 'O que é crase?',
      back: 'É a fusão da preposição "a" com o artigo "a" ou com pronomes demonstrativos, indicada por à.',
    },
  ],
  'Matemática Básica': [
    {
      front: 'O que é um número primo?',
      back: 'Um número natural maior que 1 que só é divisível por 1 e por ele mesmo.',
    },
    {
      front: 'Como calcular a área de um triângulo?',
      back: 'Área = (base × altura) ÷ 2',
    },
    {
      front: 'O que é o Teorema de Pitágoras?',
      back: 'Em um triângulo retângulo: a² = b² + c² (hipotenusa ao quadrado = soma dos quadrados dos catetos)',
    },
    {
      front: 'Qual a fórmula da média aritmética?',
      back: 'Média = (soma de todos os valores) ÷ (quantidade de valores)',
    },
    {
      front: 'O que é uma fração?',
      back: 'É a representação de uma parte de um todo, escrita como numerador/denominador.',
    },
    {
      front: 'Como converter fração em porcentagem?',
      back: 'Divide o numerador pelo denominador e multiplica por 100.',
    },
  ],
  'Inglês - Vocabulário': [
    {
      front: 'Como se diz "aprender" em inglês?',
      back: 'Learn',
    },
    {
      front: 'Qual a diferença entre "do" e "make"?',
      back: '"Do" = fazer/executar tarefas gerais. "Make" = criar/produzir algo.',
    },
    {
      front: 'O que significa "aware"?',
      back: 'Ciente, consciente (to be aware = estar ciente)',
    },
    {
      front: 'Como se diz "embora" em inglês?',
      back: 'Although / Though / Even though',
    },
    {
      front: 'Qual o plural de "child"?',
      back: 'Children (irregular)',
    },
    {
      front: 'O que significa "actually"?',
      back: 'Na verdade, realmente (falso cognato - não significa "atualmente")',
    },
    {
      front: 'Como usar "used to"?',
      back: 'Para descrever hábitos ou situações do passado que não ocorrem mais. Ex: I used to play soccer.',
    },
  ],
};

const sampleIdeas: Omit<IdeaState, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Feature: Dark Mode Automático',
    emotionalState: 'inspired',
    visionPoints: [
      'Detectar horário do sistema',
      'Transição suave entre temas',
      'Configuração manual opcional',
    ],
    priority: 'high',
    tags: ['feature', 'ux'],
  },
  {
    title: 'Melhorar Performance de Animações',
    emotionalState: 'focused',
    visionPoints: [
      'Usar useNativeDriver sempre que possível',
      'Implementar lazy loading',
      'Otimizar re-renders',
    ],
    priority: 'medium',
    tags: ['performance', 'optimization'],
  },
  {
    title: 'Sistema de Notificações',
    emotionalState: 'excited',
    visionPoints: [
      'Lembrete de revisão de flashcards',
      'Notificação de conquistas',
      'Timer Pomodoro completo',
    ],
    priority: 'high',
    tags: ['feature', 'engagement'],
  },
];

export const populateSampleData = async (): Promise<void> => {
  try {
    // Check if data already exists
    const existingDecks = await getAllDecks();
    if (existingDecks.length > 0) {
      console.log('Sample data already exists, skipping...');
      return;
    }

    const now = Date.now();

    // Create decks and flashcards
    for (const deckData of sampleDecks) {
      const deckId = await createDeck(deckData);

      // Create flashcards for this deck
      const flashcardsForDeck = sampleFlashcardsData[deckData.name] || [];
      for (const cardData of flashcardsForDeck) {
        await createFlashcard({
          deckId: deckId,
          ...cardData,
          nextReviewAt: now, // Make cards available for immediate review
        });
        // Small delay to ensure unique IDs
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 10));
      }
    }

    // Create ideas
    for (const ideaData of sampleIdeas) {
      const idea: IdeaState = {
        id: `idea_${Date.now()}_${Math.random()}`,
        ...ideaData,
        createdAt: now,
        updatedAt: now,
      };

      await createIdea(idea);
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 10));
    }

    console.log('Sample data populated successfully!');
  } catch (error) {
    console.error('Error populating sample data:', error);
    throw error;
  }
};
