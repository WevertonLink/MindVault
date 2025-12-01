import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { Card, Button } from '../components';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { getNextStep, getStreakMessage } from '../services/flowEngine';
import { getDueFlashcards } from '../database';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { currentEnergy, stats } = useAppStore();
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    loadPendingReviews();
  }, []);

  const loadPendingReviews = async () => {
    try {
      const dueCards = await getDueFlashcards();
      setPendingReviews(dueCards.length);
    } catch (error) {
      console.error('Error loading pending reviews:', error);
    }
  };

  const handleStartStudy = () => {
    navigation.navigate('Study', {});
  };

  const handleCaptureIdea = () => {
    navigation.navigate('IdeaCapture');
  };

  const handleHyperfocus = () => {
    navigation.navigate('Hyperfocus');
  };

  const handleManageDecks = () => {
    navigation.navigate('DeckManagement');
  };

  const flowRecommendation = getNextStep({
    energy: currentEnergy || 'normal',
    pendingReviews,
    newCardsAvailable: 0,
  });

  return (
    <LinearGradient
      colors={theme.gradients.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Mente Brilhante</Text>
          <Text style={styles.streakText}>{getStreakMessage(stats.currentStreak)}</Text>
        </View>

        {/* Flow Recommendation Card */}
        <Card variant="elevated" style={styles.flowCard}>
          <View style={styles.flowHeader}>
            <Text style={styles.flowEmoji}>🎯</Text>
            <View style={styles.flowTextContainer}>
              <Text style={styles.flowTitle}>Próximo Passo</Text>
              <Text style={styles.flowMode}>{flowRecommendation.mode.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.flowMessage}>{flowRecommendation.message}</Text>

          {flowRecommendation.count > 0 && (
            <View style={styles.flowStats}>
              <Text style={styles.flowCount}>{flowRecommendation.count} cards</Text>
            </View>
          )}
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Streak"
            value={stats.currentStreak.toString()}
            icon="🔥"
            color={theme.colors.gold}
          />
          <StatCard
            title="Revisões"
            value={pendingReviews.toString()}
            icon="📚"
            color={theme.colors.info}
          />
          <StatCard
            title="Ideias"
            value={stats.totalIdeas.toString()}
            icon="💡"
            color={theme.colors.warning}
          />
          <StatCard
            title="Minutos"
            value={stats.studyMinutes.toString()}
            icon="⏱️"
            color={theme.colors.success}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Iniciar Estudo"
            onPress={handleStartStudy}
            variant="primary"
            size="large"
          />

          <Button
            title="Gerenciar Decks"
            onPress={handleManageDecks}
            variant="secondary"
            size="large"
          />

          <View style={styles.secondaryActions}>
            <TouchableOpacity
              onPress={handleCaptureIdea}
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.gradients.cardGradient}
                style={[styles.secondaryButtonGradient, theme.shadows.sm]}
              >
                <Text style={styles.secondaryButtonIcon}>💡</Text>
                <Text style={styles.secondaryButtonText}>Capturar Ideia</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleHyperfocus}
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={theme.gradients.cardGradient}
                style={[styles.secondaryButtonGradient, theme.shadows.sm]}
              >
                <Text style={styles.secondaryButtonIcon}>🔥</Text>
                <Text style={styles.secondaryButtonText}>Hiperfoco</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* AI Features - Temporarily disabled (requires cloud backend) */}
          {/* <View style={styles.aiSection}>
            <Text style={styles.aiSectionTitle}>✨ IA GENERATIVA</Text>
            <TouchableOpacity
              onPress={handleAIFlashcards}
              style={styles.aiButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
                style={[styles.aiButtonGradient, theme.shadows.md]}
              >
                <Text style={styles.aiButtonIcon}>🤖</Text>
                <View style={styles.aiButtonTextContainer}>
                  <Text style={styles.aiButtonTitle}>Gerar Flashcards com IA</Text>
                  <Text style={styles.aiButtonSubtitle}>Powered by Ollama</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card variant="default" style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.fontSize.heading,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  streakText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  flowCard: {
    marginBottom: theme.spacing.xl,
  },
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  flowEmoji: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  flowTextContainer: {
    flex: 1,
  },
  flowTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  flowMode: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.wider,
  },
  flowMessage: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.body,
  },
  flowStats: {
    borderTopWidth: theme.borderWidth.thin,
    borderTopColor: theme.colors.cardBorder,
    paddingTop: theme.spacing.md,
  },
  flowCount: {
    fontSize: theme.typography.fontSize.subtitle,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSize.heading,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.xs,
  },
  statTitle: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    gap: theme.spacing.lg,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  secondaryButton: {
    flex: 1,
  },
  secondaryButtonGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
  },
  secondaryButtonIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  secondaryButtonText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
  aiSection: {
    marginTop: theme.spacing.xl,
  },
  aiSectionTitle: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.widest,
    marginBottom: theme.spacing.md,
  },
  aiButton: {
    width: '100%',
  },
  aiButtonGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  aiButtonIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  aiButtonTextContainer: {
    flex: 1,
  },
  aiButtonTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  aiButtonSubtitle: {
    fontSize: theme.typography.fontSize.caption,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.gold,
  },
});

export default DashboardScreen;
