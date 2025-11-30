import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components';
import { theme } from '../theme';

type FlowReactivationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FlowReactivation'>;
type FlowReactivationScreenRouteProp = RouteProp<RootStackParamList, 'FlowReactivation'>;

interface Props {
  navigation: FlowReactivationScreenNavigationProp;
  route: FlowReactivationScreenRouteProp;
}

const FlowReactivationScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reativação de Flow</Text>
      <Text style={styles.subtitle}>Em desenvolvimento</Text>
      <Button
        title="Voltar"
        onPress={() => navigation.goBack()}
        variant="outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.heading,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
});

export default FlowReactivationScreen;
