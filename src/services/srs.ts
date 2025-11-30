import { Flashcard, CardRating } from '../types';

// SM-2 Algorithm multipliers
const RATING_MULTIPLIERS: Record<CardRating, number> = {
  easy: 2.5,
  medium: 1.5,
  hard: 1.1,
};

const INITIAL_INTERVAL_DAYS = 1;
const INITIAL_EASE_FACTOR = 2.5;

export const updateCardSRS = (
  card: Flashcard,
  rating: CardRating
): Flashcard => {
  const now = Date.now();
  let newIntervalDays = card.intervalDays;
  let newEaseFactor = card.easeFactor;
  let newRepetitionCount = card.repetitionCount + 1;

  // First review
  if (card.repetitionCount === 0) {
    newIntervalDays = INITIAL_INTERVAL_DAYS;
  } else {
    // Apply multiplier based on rating
    newIntervalDays = Math.round(card.intervalDays * RATING_MULTIPLIERS[rating]);

    // Adjust ease factor based on performance
    if (rating === 'easy') {
      newEaseFactor = Math.min(card.easeFactor + 0.15, 3.0);
    } else if (rating === 'hard') {
      newEaseFactor = Math.max(card.easeFactor - 0.15, 1.3);
      // Reset if too difficult
      if (rating === 'hard' && card.intervalDays > 7) {
        newIntervalDays = Math.max(1, Math.round(card.intervalDays * 0.5));
      }
    }
  }

  // Calculate next review timestamp
  const nextReviewAt = now + newIntervalDays * 24 * 60 * 60 * 1000;

  return {
    ...card,
    intervalDays: newIntervalDays,
    easeFactor: newEaseFactor,
    repetitionCount: newRepetitionCount,
    nextReviewAt,
    updatedAt: now,
  };
};

export const createNewCard = (
  id: string,
  deckId: string,
  front: string,
  back: string
): Flashcard => {
  const now = Date.now();

  return {
    id,
    deckId,
    front,
    back,
    intervalDays: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    repetitionCount: 0,
    nextReviewAt: null,
    createdAt: now,
    updatedAt: now,
  };
};

export const getDueCards = (cards: Flashcard[]): Flashcard[] => {
  const now = Date.now();
  return cards.filter(
    (card) => card.nextReviewAt !== null && card.nextReviewAt <= now
  );
};

export const getNewCards = (cards: Flashcard[]): Flashcard[] => {
  return cards.filter((card) => card.nextReviewAt === null);
};

export const getPendingReviewsCount = (cards: Flashcard[]): number => {
  return getDueCards(cards).length;
};
