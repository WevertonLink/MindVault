import { Vibration } from 'react-native';

export const haptics = {
  // Light tap for general UI interactions
  light: () => {
    Vibration.vibrate(10);
  },

  // Medium impact for selections
  medium: () => {
    Vibration.vibrate(20);
  },

  // Heavy impact for important actions
  heavy: () => {
    Vibration.vibrate(30);
  },

  // Success feedback
  success: () => {
    Vibration.vibrate([0, 10, 50, 10]);
  },

  // Warning feedback
  warning: () => {
    Vibration.vibrate([0, 15, 30, 15, 30, 15]);
  },

  // Error feedback
  error: () => {
    Vibration.vibrate([0, 50, 100, 50]);
  },

  // Selection feedback (like tapping a button)
  selection: () => {
    Vibration.vibrate(15);
  },
};
