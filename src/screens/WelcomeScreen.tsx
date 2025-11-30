import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { initDatabase } from '../database';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { hasSeenWelcome, setHasSeenWelcome } = useAppStore();

  useEffect(() => {
    // Initialize database and populate sample data
    const initializeApp = async () => {
      try {
        await initDatabase();
        const { populateSampleData } = await import('../services/sampleData');
        await populateSampleData();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();

    // If user has already seen welcome, go directly to energy select
    if (hasSeenWelcome) {
      navigation.replace('EnergySelect');
    }
  }, [hasSeenWelcome, navigation]);

  const handleGetStarted = () => {
    setHasSeenWelcome(true);
    navigation.navigate('EnergySelect');
  };

  return (
    <LinearGradient
      colors={theme.gradients.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={styles.content}>
        {/* Logo / Title Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>MindVault</Text>

          <View style={[styles.goldLine, theme.shadows.gold]} />

          <Text style={styles.tagline}>
            Aprendizado, Ideias e Hiperfoco
          </Text>

          <Text style={styles.subtitle}>
            Projetado para mentes neurodivergentes
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <FeatureItem
            icon="📚"
            title="Flashcards SRS"
            description="Repetição espaçada automática"
          />
          <FeatureItem
            icon="🎯"
            title="Flow Engine"
            description="Decide o próximo passo ideal"
          />
          <FeatureItem
            icon="💡"
            title="Idea Vault"
            description="Captura e reativa estado mental"
          />
          <FeatureItem
            icon="🔥"
            title="Modo Hiperfoco"
            description="Sessões sem distração"
          />
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Começar"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xxxl,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: theme.spacing.xxxl,
  },
  logo: {
    fontSize: theme.typography.fontSize.xlarge,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    letterSpacing: theme.typography.letterSpacing.widest,
    marginBottom: theme.spacing.md,
  },
  goldLine: {
    width: 80,
    height: 3,
    backgroundColor: theme.colors.gold,
    marginVertical: theme.spacing.lg,
  },
  tagline: {
    fontSize: theme.typography.fontSize.subtitle,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  featuresSection: {
    gap: theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  buttonContainer: {
    marginBottom: theme.spacing.lg,
  },
});

export default WelcomeScreen;
