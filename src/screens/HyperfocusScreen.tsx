import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { Button, Header } from '../components';
import { theme } from '../theme';

type HyperfocusScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Hyperfocus'>;

interface Props {
  navigation: HyperfocusScreenNavigationProp;
}

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

const HyperfocusScreen: React.FC<Props> = ({ navigation }) => {
  const [duration, setDuration] = useState(POMODORO_DURATION);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    if (!isBreak) {
      // Pomodoro completed
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      // Every 4 pomodoros, long break
      const nextDuration = newCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK;
      setDuration(nextDuration);
      setTimeLeft(nextDuration);
      setIsBreak(true);
    } else {
      // Break completed
      setDuration(POMODORO_DURATION);
      setTimeLeft(POMODORO_DURATION);
      setIsBreak(false);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
    setIsBreak(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <LinearGradient
      colors={theme.gradients.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <Header
        title="Hiperfoco"
        subtitle={isBreak ? 'Pausa' : 'Pomodoro'}
        leftAction={{
          icon: <Text style={styles.headerIcon}>←</Text>,
          onPress: () => navigation.goBack(),
        }}
        variant="gradient"
      />

      <View style={styles.content}>
        {/* Pomodoro Counter */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>POMODOROS COMPLETADOS</Text>
          <View style={styles.pomodoroIndicators}>
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pomodoroIndicator,
                  index < completedPomodoros % 4 && styles.pomodoroIndicatorActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.counterValue}>{completedPomodoros}</Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <LinearGradient
            colors={theme.gradients.cardGradient}
            style={[styles.timerCard, theme.shadows.xl]}
          >
            {/* Circular Progress */}
            <View style={styles.circularProgress}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.timerLabel}>
                {isBreak ? 'PAUSA' : 'FOCO'}
              </Text>
            </View>

            {/* Linear Progress */}
            <View style={styles.linearProgressContainer}>
              <View style={styles.linearProgressBackground}>
                <LinearGradient
                  colors={isBreak ? [theme.colors.info, theme.colors.success] : theme.gradients.goldGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.linearProgressFill, { width: `${progress}%` }]}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isRunning ? (
            <Button
              title="Iniciar"
              onPress={handleStart}
              variant="primary"
              size="large"
            />
          ) : (
            <Button
              title="Pausar"
              onPress={handlePause}
              variant="secondary"
              size="large"
            />
          )}

          {timeLeft !== duration && (
            <Button
              title="Resetar"
              onPress={handleReset}
              variant="outline"
              size="medium"
            />
          )}
        </View>

        {/* Duration Options */}
        {!isRunning && (
          <View style={styles.durationOptionsContainer}>
            <Text style={styles.optionsLabel}>DURAÇÃO</Text>
            <View style={styles.durationOptions}>
              <DurationOption
                label="25min"
                duration={25 * 60}
                selected={duration === 25 * 60 && !isBreak}
                onPress={() => handleDurationChange(25 * 60)}
              />
              <DurationOption
                label="15min"
                duration={15 * 60}
                selected={duration === 15 * 60 && !isBreak}
                onPress={() => handleDurationChange(15 * 60)}
              />
              <DurationOption
                label="5min"
                duration={5 * 60}
                selected={duration === 5 * 60 && !isBreak}
                onPress={() => handleDurationChange(5 * 60)}
              />
            </View>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {isBreak
              ? '😌 Descanse e recarregue sua energia'
              : '🎯 Mantenha o foco no que importa'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const DurationOption: React.FC<{
  label: string;
  duration: number;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.durationOption}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={selected ? theme.gradients.goldGradient : theme.gradients.cardGradient}
      style={[
        styles.durationOptionGradient,
        selected ? theme.shadows.gold : theme.shadows.sm,
      ]}
    >
      <Text
        style={[
          styles.durationOptionText,
          { color: selected ? theme.colors.background : theme.colors.text },
        ]}
      >
        {label}
      </Text>
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
  headerIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  counterLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.widest,
    marginBottom: theme.spacing.md,
  },
  pomodoroIndicators: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  pomodoroIndicator: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    borderWidth: theme.borderWidth.medium,
    borderColor: theme.colors.cardBorder,
  },
  pomodoroIndicatorActive: {
    backgroundColor: theme.colors.gold,
    borderColor: theme.colors.gold,
  },
  counterValue: {
    fontSize: theme.typography.fontSize.xlarge,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  timerCard: {
    borderRadius: theme.borderRadius.xxl,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorderLight,
    padding: theme.spacing.xxxl,
    alignItems: 'center',
  },
  circularProgress: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  timerText: {
    fontSize: 64,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  timerLabel: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.widest,
    marginTop: theme.spacing.sm,
  },
  linearProgressContainer: {
    width: '100%',
  },
  linearProgressBackground: {
    height: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  linearProgressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
  controlsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  durationOptionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  optionsLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.widest,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  durationOptions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  durationOption: {
    flex: 1,
  },
  durationOptionGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  durationOptionText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HyperfocusScreen;
