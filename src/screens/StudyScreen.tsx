import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { Button, Header } from '../components';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { Flashcard, CardRating } from '../types';
import { updateCardSRS } from '../services/srs';
import { getDueFlashcards, updateFlashcard } from '../database';
import { haptics } from '../utils/haptics';

type StudyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Study'>;
type StudyScreenRouteProp = RouteProp<RootStackParamList, 'Study'>;

interface Props {
  navigation: StudyScreenNavigationProp;
  route: StudyScreenRouteProp;
}

const StudyScreen: React.FC<Props> = ({ navigation }) => {
  const { incrementCardsReviewed } = useAppStore();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const dueCards = await getDueFlashcards();
      setCards(dueCards);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cards:', error);
      setLoading(false);
    }
  };

  const handleFlip = () => {
    haptics.light();
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleRating = async (rating: CardRating) => {
    if (currentIndex >= cards.length) return;

    // Different haptic feedback based on rating
    if (rating === 'easy') {
      haptics.success();
    } else if (rating === 'medium') {
      haptics.medium();
    } else {
      haptics.warning();
    }

    const currentCard = cards[currentIndex];
    const updatedCard = updateCardSRS(currentCard, rating);

    try {
      await updateFlashcard(updatedCard);
      incrementCardsReviewed();

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        flipAnimation.setValue(0);
      } else {
        // Study session complete
        haptics.heavy(); // Big success for completing all cards
        navigation.goBack();
      }
    } catch (error) {
      haptics.error();
      console.error('Error updating card:', error);
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 90, 90, 180],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 90, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

  if (loading) {
    return (
      <LinearGradient
        colors={theme.gradients.backgroundGradient}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando cards...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (cards.length === 0) {
    return (
      <LinearGradient
        colors={theme.gradients.backgroundGradient}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <Header
          title="Estudo"
          leftAction={{
            icon: <Text style={styles.headerIcon}>←</Text>,
            onPress: () => navigation.goBack(),
          }}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>Nenhum card para revisar!</Text>
          <Text style={styles.emptySubtitle}>
            Você está em dia com seus estudos
          </Text>
          <Button
            title="Voltar ao Dashboard"
            onPress={() => navigation.goBack()}
            variant="primary"
            style={styles.emptyButton}
          />
        </View>
      </LinearGradient>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <LinearGradient
      colors={theme.gradients.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <Header
        title="Estudo"
        subtitle={`${currentIndex + 1} de ${cards.length}`}
        leftAction={{
          icon: <Text style={styles.headerIcon}>←</Text>,
          onPress: () => navigation.goBack(),
        }}
      />

      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <LinearGradient
              colors={theme.gradients.goldGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Flashcard */}
        <TouchableOpacity
          onPress={handleFlip}
          activeOpacity={0.9}
          style={styles.cardContainer}
        >
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={theme.gradients.cardGradient}
              style={[styles.cardGradient, theme.shadows.lg]}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>FRENTE</Text>
                <Text style={styles.cardText}>{currentCard.front}</Text>
              </View>
              <View style={styles.tapHint}>
                <Text style={styles.tapHintText}>Toque para virar</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={theme.gradients.cardGradient}
              style={[styles.cardGradient, theme.shadows.lg]}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>VERSO</Text>
                <Text style={styles.cardText}>{currentCard.back}</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* Rating Buttons (only show when flipped) */}
        {isFlipped && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Como foi?</Text>
            <View style={styles.ratingButtons}>
              <RatingButton
                title="Difícil"
                color={theme.colors.error}
                onPress={() => handleRating('hard')}
              />
              <RatingButton
                title="Médio"
                color={theme.colors.warning}
                onPress={() => handleRating('medium')}
              />
              <RatingButton
                title="Fácil"
                color={theme.colors.success}
                onPress={() => handleRating('easy')}
              />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const RatingButton: React.FC<{
  title: string;
  color: string;
  onPress: () => void;
}> = ({ title, color, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.ratingButton}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={theme.gradients.cardGradient}
      style={[styles.ratingButtonGradient, theme.shadows.md]}
    >
      <View style={[styles.ratingIndicator, { backgroundColor: color }]} />
      <Text style={styles.ratingButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  headerIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  progressContainer: {
    marginBottom: theme.spacing.xl,
  },
  progressBackground: {
    height: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
  progressText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.gold,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
  },
  cardGradient: {
    flex: 1,
    borderRadius: theme.borderRadius.xxl,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorderLight,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  cardLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.widest,
    marginBottom: theme.spacing.lg,
  },
  cardText: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.title * 1.2,
  },
  tapHint: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    alignSelf: 'center',
  },
  tapHintText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textMuted,
  },
  ratingContainer: {
    marginTop: theme.spacing.xl,
  },
  ratingTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  ratingButton: {
    flex: 1,
  },
  ratingButtonGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  ratingIndicator: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.sm,
  },
  ratingButtonText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
});

export default StudyScreen;
