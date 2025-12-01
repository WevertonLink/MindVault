import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.md,
    };

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
      },
      large: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
      },
    };

    return { ...baseStyle, ...sizeStyles[size] };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      small: {
        fontSize: theme.typography.fontSize.small,
        lineHeight: theme.typography.lineHeight.small,
      },
      medium: {
        fontSize: theme.typography.fontSize.body,
        lineHeight: theme.typography.lineHeight.body,
      },
      large: {
        fontSize: theme.typography.fontSize.subtitle,
        lineHeight: theme.typography.lineHeight.subtitle,
      },
    };

    return {
      fontFamily: theme.typography.fontFamily.bold,
      letterSpacing: theme.typography.letterSpacing.wide,
      ...sizeStyles[size],
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.background : theme.colors.gold}
        />
      );
    }

    const textColor =
      variant === 'primary'
        ? theme.colors.background
        : variant === 'outline' || variant === 'ghost'
          ? theme.colors.gold
          : theme.colors.text;

    return (
      <Text style={[getTextStyle(), { color: textColor }, textStyle]}>
        {title}
      </Text>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={theme.gradients.goldGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            getButtonStyle(),
            disabled && { opacity: theme.opacity.medium },
            theme.shadows.gold,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={theme.gradients.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            getButtonStyle(),
            { borderWidth: theme.borderWidth.thin, borderColor: theme.colors.cardBorder },
            disabled && { opacity: theme.opacity.medium },
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        getButtonStyle(),
        variant === 'outline' && {
          borderWidth: theme.borderWidth.medium,
          borderColor: theme.colors.gold,
          backgroundColor: 'transparent',
          ...theme.shadows.none,
        },
        variant === 'ghost' && {
          backgroundColor: 'transparent',
          ...theme.shadows.none,
        },
        disabled && { opacity: theme.opacity.medium },
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
