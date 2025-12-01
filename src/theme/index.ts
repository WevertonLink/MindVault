export const theme = {
  colors: {
    // Backgrounds com profundidade
    background: '#000000',
    backgroundElevated: '#0A0A0A',
    backgroundSubtle: '#050505',

    // Cards com camadas
    card: '#111111',
    cardElevated: '#1A1A1A',
    cardHover: '#222222',
    cardBorder: '#2A2A2A',
    cardBorderLight: '#333333',

    // Textos com hierarquia
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#999999',
    textMuted: '#666666',
    textDim: '#555555',

    // Cores básicas
    white: '#FFFFFF',
    black: '#000000',
    dark: '#111111',

    // Gold com variações elegantes
    gold: '#FFD700',
    goldLight: '#FFED4E',
    goldDark: '#B8960C',
    goldMuted: '#8B7500',
    goldGlow: 'rgba(255, 215, 0, 0.3)',

    // Acentos sutis
    accent: '#1E1E1E',
    accentLight: '#2E2E2E',

    // Estados
    success: '#00C851',
    error: '#FF4444',
    warning: '#FFBB33',
    info: '#33B5E5',

    // Overlays para profundidade
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.5)',
    overlayHeavy: 'rgba(0, 0, 0, 0.9)',
  },

  gradients: {
    // Gradientes elegantes
    cardGradient: ['#1A1A1A', '#111111', '#0A0A0A'],
    goldGradient: ['#FFD700', '#FFC700', '#FFB700'],
    backgroundGradient: ['#000000', '#0A0A0A', '#050505'],
    dark: ['#000000', '#0A0A0A', '#050505'], // Alias for backgroundGradient
    overlayGradient: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)'],

    // Gradientes sutis para profundidade
    depthTop: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0)'],
    depthBottom: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)'],
  },

  typography: {
    fontFamily: {
      regular: 'Montserrat-Regular',
      medium: 'Montserrat-Medium',
      semiBold: 'Montserrat-SemiBold',
      bold: 'Montserrat-Bold',
    },
    fontSize: {
      xs: 10,
      caption: 11,
      small: 12,
      body: 16,
      subtitle: 18,
      title: 24,
      heading: 28,
      large: 32,
      xlarge: 40,
    },
    lineHeight: {
      xs: 14,
      small: 16,
      body: 22,
      subtitle: 24,
      title: 32,
      heading: 36,
      large: 40,
      xlarge: 48,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
      widest: 2,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },

  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
  },

  shadows: {
    none: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 12,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
      elevation: 18,
    },
    // Sombra dourada para elementos especiais
    gold: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    // Sombra interna para profundidade
    inset: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 0,
    },
  },

  effects: {
    // Glass morphism
    glass: {
      backgroundColor: 'rgba(17, 17, 17, 0.7)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    },

    // Brilho sutil nos cards
    shimmer: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },

    // Bordas iluminadas
    glowBorder: {
      borderColor: '#FFD700',
      borderWidth: 1,
    },
  },

  opacity: {
    transparent: 0,
    lowest: 0.05,
    lower: 0.1,
    low: 0.2,
    medium: 0.5,
    high: 0.8,
    higher: 0.9,
    opaque: 1,
  },

  animation: {
    timing: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },
};

export type Theme = typeof theme;
