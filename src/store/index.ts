import { create } from 'zustand';
import { Flashcard, Deck, IdeaState, EnergyLevel, UserStats } from '../types';

interface AppState {
  // Energy and Flow
  currentEnergy: EnergyLevel | null;
  setEnergy: (energy: EnergyLevel) => void;

  // Flashcards
  currentDeck: Deck | null;
  flashcards: Flashcard[];
  setCurrentDeck: (deck: Deck | null) => void;
  setFlashcards: (cards: Flashcard[]) => void;
  updateFlashcard: (card: Flashcard) => void;

  // Ideas
  ideas: IdeaState[];
  setIdeas: (ideas: IdeaState[]) => void;
  addIdea: (idea: IdeaState) => void;

  // User Stats
  stats: UserStats;
  setStats: (stats: UserStats) => void;
  incrementCardsReviewed: () => void;
  updateStreak: () => void;

  // Navigation
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;

  // Study Session
  isStudying: boolean;
  setIsStudying: (studying: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Energy and Flow
  currentEnergy: null,
  setEnergy: (energy) => set({ currentEnergy: energy }),

  // Flashcards
  currentDeck: null,
  flashcards: [],
  setCurrentDeck: (deck) => set({ currentDeck: deck }),
  setFlashcards: (cards) => set({ flashcards: cards }),
  updateFlashcard: (updatedCard) =>
    set((state) => ({
      flashcards: state.flashcards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    })),

  // Ideas
  ideas: [],
  setIdeas: (ideas) => set({ ideas }),
  addIdea: (idea) =>
    set((state) => ({
      ideas: [idea, ...state.ideas],
    })),

  // User Stats
  stats: {
    totalCards: 0,
    cardsReviewed: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalIdeas: 0,
    studyMinutes: 0,
  },
  setStats: (stats) => set({ stats }),
  incrementCardsReviewed: () =>
    set((state) => ({
      stats: {
        ...state.stats,
        cardsReviewed: state.stats.cardsReviewed + 1,
      },
    })),
  updateStreak: () =>
    set((state) => {
      const newStreak = state.stats.currentStreak + 1;
      return {
        stats: {
          ...state.stats,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, state.stats.longestStreak),
        },
      };
    }),

  // Navigation
  hasSeenWelcome: false,
  setHasSeenWelcome: (seen) => set({ hasSeenWelcome: seen }),

  // Study Session
  isStudying: false,
  setIsStudying: (studying) => set({ isStudying: studying }),
}));
