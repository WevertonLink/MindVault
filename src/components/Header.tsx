import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  rightAction?: {
    icon: React.ReactNode;
    onPress: () => void;
  };
  style?: ViewStyle;
  variant?: 'default' | 'gradient';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  style,
  variant = 'default',
}) => {
  const content = (
    <View style={[styles.container, style]}>
      <View style={styles.leftSection}>
        {leftAction && (
          <TouchableOpacity
            onPress={leftAction.onPress}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            {leftAction.icon}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            {rightAction.icon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[theme.colors.backgroundElevated, theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.gradientContainer,
          {
            borderBottomWidth: theme.borderWidth.thin,
            borderBottomColor: theme.colors.cardBorder,
          },
        ]}
      >
        {content}
        {/* Bottom gold accent line */}
        <View style={styles.accentLine} />
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.defaultContainer,
        {
          backgroundColor: theme.colors.background,
          borderBottomWidth: theme.borderWidth.thin,
          borderBottomColor: theme.colors.cardBorder,
        },
      ]}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    paddingTop: theme.spacing.md,
    ...theme.shadows.sm,
  },
  defaultContainer: {
    paddingTop: theme.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.title,
    lineHeight: theme.typography.lineHeight.title,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.small,
    lineHeight: theme.typography.lineHeight.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  accentLine: {
    height: 1,
    backgroundColor: theme.colors.gold,
    opacity: theme.opacity.low,
    marginTop: theme.spacing.xs,
  },
});
