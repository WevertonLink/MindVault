import { FlowEngineInput, FlowEngineOutput } from '../types';

export const getNextStep = (input: FlowEngineInput): FlowEngineOutput => {
  const { energy, pendingReviews, newCardsAvailable } = input;

  // Low energy: Light mode - minimal effort, just a few cards
  if (energy === 'low') {
    const count = Math.min(5, pendingReviews || newCardsAvailable);
    return {
      mode: 'light',
      count,
      message: count > 0
        ? 'Energia baixa detectada. Vamos devagar com apenas alguns cards.'
        : 'Nenhum card disponível no momento. Descanse!',
    };
  }

  // Normal energy: Prioritize reviews, moderate pace
  if (energy === 'normal') {
    if (pendingReviews > 0) {
      const count = Math.min(20, pendingReviews);
      return {
        mode: 'reviews',
        count,
        message: `Você tem ${pendingReviews} revisões pendentes. Vamos revisar!`,
      };
    }

    if (newCardsAvailable > 0) {
      const count = Math.min(10, newCardsAvailable);
      return {
        mode: 'light',
        count,
        message: `Vamos aprender ${count} novos cards!`,
      };
    }

    return {
      mode: 'light',
      count: 0,
      message: 'Parabéns! Você está em dia com seus estudos.',
    };
  }

  // High energy: Mixed mode - aggressive learning
  if (energy === 'high') {
    const totalAvailable = pendingReviews + newCardsAvailable;

    if (totalAvailable === 0) {
      return {
        mode: 'mixed',
        count: 0,
        message: 'Incrível! Nenhum card pendente. Você está no topo!',
      };
    }

    // Mix of reviews and new cards
    const reviewCount = Math.min(20, pendingReviews);
    const newCount = Math.min(10, newCardsAvailable);
    const totalCount = reviewCount + newCount;

    return {
      mode: 'mixed',
      count: Math.min(30, totalCount),
      message: `Energia alta! Vamos com tudo: ${reviewCount} revisões + ${newCount} novos cards!`,
    };
  }

  // Fallback
  return {
    mode: 'light',
    count: 0,
    message: 'Estado indefinido. Por favor, selecione seu nível de energia.',
  };
};

// Get motivational message based on streak
export const getStreakMessage = (streak: number): string => {
  if (streak === 0) {
    return 'Comece sua jornada hoje!';
  }

  if (streak === 1) {
    return 'Primeiro dia completo! Continue assim.';
  }

  if (streak < 7) {
    return `${streak} dias de foco! Você está construindo um hábito.`;
  }

  if (streak < 30) {
    return `${streak} dias! Seu foco está ficando poderoso.`;
  }

  if (streak < 100) {
    return `${streak} dias! Você é imparável!`;
  }

  return `${streak} dias! Lendário! Sua disciplina é inspiradora.`;
};

// Suggest break time based on study duration
export const shouldTakeBreak = (studyMinutes: number): boolean => {
  // Suggest break every 25-30 minutes (Pomodoro)
  return studyMinutes > 0 && studyMinutes % 25 < 5;
};
