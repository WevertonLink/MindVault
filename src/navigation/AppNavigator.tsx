import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { theme } from '../theme';

// Screens (will be created)
import WelcomeScreen from '../screens/WelcomeScreen';
import EnergySelectScreen from '../screens/EnergySelectScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StudyScreen from '../screens/StudyScreen';
import IdeaCaptureScreen from '../screens/IdeaCaptureScreen';
import FlowReactivationScreen from '../screens/FlowReactivationScreen';
import HyperfocusScreen from '../screens/HyperfocusScreen';
import { AIFlashcardGeneratorScreen } from '../screens/AIFlashcardGeneratorScreen';
import DeckManagementScreen from '../screens/DeckManagementScreen';
import FlashcardEditorScreen from '../screens/FlashcardEditorScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: theme.colors.background,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="EnergySelect" component={EnergySelectScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Study" component={StudyScreen} />
        <Stack.Screen name="IdeaCapture" component={IdeaCaptureScreen} />
        <Stack.Screen name="FlowReactivation" component={FlowReactivationScreen} />
        <Stack.Screen name="Hyperfocus" component={HyperfocusScreen} />
        <Stack.Screen name="AIFlashcardGenerator" component={AIFlashcardGeneratorScreen} />
        <Stack.Screen name="DeckManagement" component={DeckManagementScreen} />
        <Stack.Screen name="FlashcardEditor" component={FlashcardEditorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
