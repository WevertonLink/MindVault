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
      const deckId = `deck_${Date.now()}_${Math.random()}`;
      const deck: Deck = {
        id: deckId,
        ...deckData,
        createdAt: now,
        updatedAt: now,
      };

      await createDeck(deck);

      // Create flashcards for this deck
      const flashcardsForDeck = sampleFlashcardsData[deckData.name] || [];
      for (const cardData of flashcardsForDeck) {
        const card: Flashcard = {
          id: `card_${Date.now()}_${Math.random()}`,
          deckId: deck.id,
          ...cardData,
          intervalDays: 0,
          easeFactor: 2.5,
          repetitionCount: 0,
          nextReviewAt: now, // Make them available for review immediately
          createdAt: now,
          updatedAt: now,
        };

        await createFlashcard(card);
        // Small delay to ensure unique IDs
        await new Promise((resolve) => setTimeout(resolve, 10));
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
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    console.log('Sample data populated successfully!');
  } catch (error) {
    console.error('Error populating sample data:', error);
    throw error;
  }
};
