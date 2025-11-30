import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { Button, Header } from '../components';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { EmotionalState, Priority, IdeaState } from '../types';
import { createIdea } from '../database';
import { IdeaExpander } from '../services/ai';

type IdeaCaptureScreenNavigationProp = StackNavigationProp<RootStackParamList, 'IdeaCapture'>;

interface Props {
  navigation: IdeaCaptureScreenNavigationProp;
}

const IdeaCaptureScreen: React.FC<Props> = ({ navigation }) => {
  const { addIdea } = useAppStore();
  const [title, setTitle] = useState('');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('inspired');
  const [priority, setPriority] = useState<Priority>('medium');
  const [currentVisionPoint, setCurrentVisionPoint] = useState('');
  const [visionPoints, setVisionPoints] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [expanding, setExpanding] = useState(false);

  const handleAddVisionPoint = () => {
    if (currentVisionPoint.trim()) {
      setVisionPoints([...visionPoints, currentVisionPoint.trim()]);
      setCurrentVisionPoint('');
    }
  };

  const handleRemoveVisionPoint = (index: number) => {
    setVisionPoints(visionPoints.filter((_, i) => i !== index));
  };

  const handleExpandWithAI = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Digite um título para a ideia primeiro');
      return;
    }

    setExpanding(true);

    try {
      const result = await IdeaExpander.expandIdea(title, emotionalState);

      if (result.success && result.expansion) {
        // Adiciona os vision points gerados pela IA
        const newPoints = result.expansion.visionPoints.filter(p => p.trim());
        setVisionPoints([...visionPoints, ...newPoints]);

        // Mostra a motivação
        if (result.expansion.motivation) {
          Alert.alert('Motivação ✨', result.expansion.motivation);
        }
      } else {
        Alert.alert(
          'Erro',
          result.error || 'Não foi possível expandir a ideia'
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao expandir a ideia. Verifique se o Ollama está rodando.'
      );
      console.error('Expansion error:', error);
    } finally {
      setExpanding(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setSaving(true);

    const newIdea: IdeaState = {
      id: Date.now().toString(),
      title: title.trim(),
      emotionalState,
      visionPoints,
      priority,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await createIdea(newIdea);
      addIdea(newIdea);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving idea:', error);
      setSaving(false);
    }
  };

  return (
    <LinearGradient
      colors={theme.gradients.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <Header
        title="Capturar Ideia"
        subtitle="Preserve seu estado mental"
        leftAction={{
          icon: <Text style={styles.headerIcon}>←</Text>,
          onPress: () => navigation.goBack(),
        }}
        variant="gradient"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TÍTULO DA IDEIA</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Nova feature para o app"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.titleInput}
            multiline
          />

          {/* AI Expand Button */}
          <TouchableOpacity
            onPress={handleExpandWithAI}
            style={styles.aiButton}
            disabled={expanding || !title.trim()}
          >
            {expanding ? (
              <ActivityIndicator size="small" color={theme.colors.gold} />
            ) : (
              <>
                <Text style={styles.aiButtonIcon}>✨</Text>
                <Text style={styles.aiButtonText}>Expandir com IA</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Emotional State */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ESTADO EMOCIONAL</Text>
          <Text style={styles.sectionHint}>
            Como você está se sentindo agora?
          </Text>
          <View style={styles.emotionalGrid}>
            <EmotionalOption
              emoji="✨"
              label="Inspirado"
              state="inspired"
              selected={emotionalState === 'inspired'}
              onPress={() => setEmotionalState('inspired')}
            />
            <EmotionalOption
              emoji="🎯"
              label="Focado"
              state="focused"
              selected={emotionalState === 'focused'}
              onPress={() => setEmotionalState('focused')}
            />
            <EmotionalOption
              emoji="😌"
              label="Calmo"
              state="calm"
              selected={emotionalState === 'calm'}
              onPress={() => setEmotionalState('calm')}
            />
            <EmotionalOption
              emoji="🚀"
              label="Empolgado"
              state="excited"
              selected={emotionalState === 'excited'}
              onPress={() => setEmotionalState('excited')}
            />
          </View>
        </View>

        {/* Vision Points */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PONTOS DA VISÃO</Text>
          <Text style={styles.sectionHint}>
            Capture os pontos-chave da sua ideia
          </Text>

          {/* Existing points */}
          {visionPoints.map((point, index) => (
            <View key={index} style={styles.visionPointItem}>
              <Text style={styles.visionPointText}>• {point}</Text>
              <TouchableOpacity onPress={() => handleRemoveVisionPoint(index)}>
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add new point */}
          <View style={styles.visionPointInput}>
            <TextInput
              value={currentVisionPoint}
              onChangeText={setCurrentVisionPoint}
              placeholder="Adicionar ponto..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.visionInput}
              onSubmitEditing={handleAddVisionPoint}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={handleAddVisionPoint}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRIORIDADE</Text>
          <View style={styles.priorityContainer}>
            <PriorityOption
              label="Alta"
              priority="high"
              color={theme.colors.error}
              selected={priority === 'high'}
              onPress={() => setPriority('high')}
            />
            <PriorityOption
              label="Média"
              priority="medium"
              color={theme.colors.warning}
              selected={priority === 'medium'}
              onPress={() => setPriority('medium')}
            />
            <PriorityOption
              label="Baixa"
              priority="low"
              color={theme.colors.info}
              selected={priority === 'low'}
              onPress={() => setPriority('low')}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <Button
            title="Salvar Ideia"
            onPress={handleSave}
            variant="primary"
            size="large"
            disabled={!title.trim()}
            loading={saving}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const EmotionalOption: React.FC<{
  emoji: string;
  label: string;
  state: EmotionalState;
  selected: boolean;
  onPress: () => void;
}> = ({ emoji, label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.emotionalOption}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={selected ? theme.gradients.goldGradient : theme.gradients.cardGradient}
      style={[
        styles.emotionalOptionGradient,
        selected ? theme.shadows.gold : theme.shadows.sm,
      ]}
    >
      <Text style={styles.emotionalEmoji}>{emoji}</Text>
      <Text
        style={[
          styles.emotionalLabel,
          { color: selected ? theme.colors.background : theme.colors.text },
        ]}
      >
        {label}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

const PriorityOption: React.FC<{
  label: string;
  priority: Priority;
  color: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, color, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.priorityOption}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={theme.gradients.cardGradient}
      style={[
        styles.priorityOptionGradient,
        selected && { borderColor: color, borderWidth: 2 },
        selected ? theme.shadows.md : theme.shadows.sm,
      ]}
    >
      <View style={[styles.priorityIndicator, { backgroundColor: color }]} />
      <Text style={styles.priorityLabel}>{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
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
    paddingBottom: theme.spacing.xxxl,
  },
  headerIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.widest,
    marginBottom: theme.spacing.sm,
  },
  sectionHint: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  titleInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.subtitle,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  emotionalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  emotionalOption: {
    width: '48%',
  },
  emotionalOptionGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
  },
  emotionalEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  emotionalLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  visionPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  visionPointText: {
    flex: 1,
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  removeButton: {
    fontSize: 18,
    color: theme.colors.error,
    padding: theme.spacing.sm,
  },
  visionPointInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  visionInput: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.gold,
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  addButtonText: {
    fontSize: 24,
    color: theme.colors.background,
    fontFamily: theme.typography.fontFamily.bold,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  priorityOption: {
    flex: 1,
  },
  priorityOptionGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.xs,
  },
  priorityLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
  saveContainer: {
    marginTop: theme.spacing.lg,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.gold,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  aiButtonIcon: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  aiButtonText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
});

export default IdeaCaptureScreen;
