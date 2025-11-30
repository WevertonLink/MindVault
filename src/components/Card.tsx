import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme';

type CardVariant = 'default' | 'elevated' | 'glass' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
}) => {
  if (variant === 'glass') {
    return (
      <View
        style={[
          styles.baseCard,
          {
            backgroundColor: theme.effects.glass.backgroundColor,
            borderWidth: theme.effects.glass.borderWidth,
            borderColor: theme.effects.glass.borderColor,
            ...theme.shadows.md,
          },
          style,
        ]}
      >
        {/* Shimmer effect overlay */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.effects.shimmer.backgroundColor,
              borderRadius: theme.borderRadius.xl,
            },
          ]}
        />
        <View style={{ position: 'relative', zIndex: 1 }}>{children}</View>
      </View>
    );
  }

  if (variant === 'outlined') {
    return (
      <View
        style={[
          styles.baseCard,
          {
            backgroundColor: 'transparent',
            borderWidth: theme.borderWidth.thin,
            borderColor: theme.colors.cardBorder,
            ...theme.shadows.sm,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  if (variant === 'elevated') {
    return (
      <LinearGradient
        colors={theme.gradients.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.baseCard,
          {
            borderWidth: theme.borderWidth.thin,
            borderColor: theme.colors.cardBorderLight,
            ...theme.shadows.lg,
          },
          style,
        ]}
      >
        {/* Top highlight for depth */}
        <LinearGradient
          colors={theme.gradients.depthTop}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            StyleSheet.absoluteFill,
            {
              borderTopLeftRadius: theme.borderRadius.xl,
              borderTopRightRadius: theme.borderRadius.xl,
              height: '30%',
            },
          ]}
          pointerEvents="none"
        />
        {/* Bottom shadow for depth */}
        <LinearGradient
          colors={theme.gradients.depthBottom}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderBottomLeftRadius: theme.borderRadius.xl,
              borderBottomRightRadius: theme.borderRadius.xl,
              height: '30%',
            },
          ]}
          pointerEvents="none"
        />
        <View style={{ position: 'relative', zIndex: 1 }}>{children}</View>
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.baseCard,
        {
          backgroundColor: theme.colors.card,
          borderWidth: theme.borderWidth.thin,
          borderColor: theme.colors.cardBorder,
          ...theme.shadows.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    overflow: 'hidden',
  },
});
