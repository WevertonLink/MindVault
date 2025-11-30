import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { EnergyLevel } from '../types';

type EnergySelectScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EnergySelect'>;

interface Props {
  navigation: EnergySelectScreenNavigationProp;
}

const EnergySelectScreen: React.FC<Props> = ({ navigation }) => {
  const { setEnergy } = useAppStore();

  const handleEnergySelect = (energy: EnergyLevel) => {
    setEnergy(energy);
    navigation.navigate('Dashboard');
  };

  return (
    <LinearGradient
      colors={theme.gradients.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Como você está se sentindo?</Text>
          <Text style={styles.subtitle}>
            Vamos ajustar sua sessão baseado na sua energia
          </Text>
        </View>

        {/* Energy Options */}
        <View style={styles.optionsContainer}>
          <EnergyOption
            level="low"
            emoji="🌙"
            title="Energia Baixa"
            description="Vamos devagar, apenas alguns cards"
            color={theme.colors.info}
            onPress={() => handleEnergySelect('low')}
          />

          <EnergyOption
            level="normal"
            emoji="☀️"
            title="Energia Normal"
            description="Sessão moderada, foco em revisões"
            color={theme.colors.gold}
            onPress={() => handleEnergySelect('normal')}
          />

          <EnergyOption
            level="high"
            emoji="⚡"
            title="Energia Alta"
            description="Vamos com tudo! Máximo desempenho"
            color={theme.colors.success}
            onPress={() => handleEnergySelect('high')}
          />
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Você pode mudar a qualquer momento
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

interface EnergyOptionProps {
  level: EnergyLevel;
  emoji: string;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

const EnergyOption: React.FC<EnergyOptionProps> = ({
  emoji,
  title,
  description,
  color,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={theme.gradients.cardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.optionCard, theme.shadows.md]}
    >
      {/* Top highlight */}
      <LinearGradient
        colors={theme.gradients.depthTop}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.optionHighlight}
        pointerEvents="none"
      />

      <View style={styles.optionContent}>
        <Text style={styles.optionEmoji}>{emoji}</Text>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionDescription}>{description}</Text>
        </View>

        {/* Color indicator */}
        <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      </View>

      {/* Accent border */}
      <View style={[styles.accentBorder, { backgroundColor: color }]} />
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxxl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSize.heading,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    letterSpacing: theme.typography.letterSpacing.wide,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: theme.spacing.lg,
  },
  optionCard: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorderLight,
    overflow: 'hidden',
    position: 'relative',
  },
  optionHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xl,
    position: 'relative',
    zIndex: 1,
  },
  optionEmoji: {
    fontSize: 48,
    marginRight: theme.spacing.lg,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: theme.typography.fontSize.subtitle,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.sm,
  },
  accentBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: theme.opacity.medium,
  },
  footer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default EnergySelectScreen;
