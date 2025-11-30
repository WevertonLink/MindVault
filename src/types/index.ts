export type EnergyLevel = 'low' | 'normal' | 'high';

export type EmotionalState = 'inspired' | 'focused' | 'calm' | 'excited';

export type Priority = 'high' | 'medium' | 'low';

export type CardRating = 'easy' | 'medium' | 'hard';

export type StudyMode = 'light' | 'reviews' | 'mixed';

export interface Deck {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  intervalDays: number;
  easeFactor: number;
  repetitionCount: number;
  nextReviewAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface IdeaState {
  id: string;
  title: string;
  emotionalState: EmotionalState;
  visionPoints: string[];
  priority: Priority;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  lastAccessedAt?: number;
}

export interface StudySession {
  id: string;
  startedAt: number;
  endedAt?: number;
  cardsStudied: number;
  mode: StudyMode;
  energyLevel: EnergyLevel;
}

export interface FlowEngineInput {
  energy: EnergyLevel;
  pendingReviews: number;
  newCardsAvailable: number;
}

export interface FlowEngineOutput {
  mode: StudyMode;
  count: number;
  message: string;
}

export interface PomodoroSession {
  id: string;
  duration: number;
  startedAt: number;
  endedAt?: number;
  completed: boolean;
}

export interface UserStats {
  totalCards: number;
  cardsReviewed: number;
  currentStreak: number;
  longestStreak: number;
  totalIdeas: number;
  studyMinutes: number;
}
