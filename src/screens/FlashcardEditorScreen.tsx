import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { Header } from '../components';
import { theme } from '../theme';
import { getFlashcardsByDeck, createFlashcard } from '../database';
import { Flashcard } from '../types';

type FlashcardEditorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FlashcardEditor'>;
type FlashcardEditorScreenRouteProp = RouteProp<RootStackParamList, 'FlashcardEditor'>;

interface Props {
  navigation: FlashcardEditorScreenNavigationProp;
  route: FlashcardEditorScreenRouteProp;
}

const FlashcardEditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { deckId, deckName } = route.params;
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');

  const loadFlashcards = async () => {
    try {
      const cards = await getFlashcardsByDeck(deckId);
      setFlashcards(cards);
      setLoading(false);
    } catch (error) {
      console.error('Error loading flashcards:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFlashcards();
    }, [deckId])
  );

  const handleCreateFlashcard = async () => {
    if (!cardFront.trim() || !cardBack.trim()) {
      Alert.alert('Erro', 'Preencha a frente e o verso do card');
      return;
    }

    try {
      await createFlashcard({
        deckId,
        front: cardFront.trim(),
        back: cardBack.trim(),
        nextReviewAt: Date.now(), // Make immediately available for review
      });

      setCardFront('');
      setCardBack('');
      setShowCreateModal(false);
      loadFlashcards();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o flashcard');
      console.error('Error creating flashcard:', error);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={theme.gradients.backgroundGradient}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando flashcards...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradients.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <Header
        title={deckName}
        subtitle={`${flashcards.length} ${flashcards.length === 1 ? 'card' : 'cards'}`}
        leftAction={{
          icon: <Text style={styles.headerIcon}>←</Text>,
          onPress: () => navigation.goBack(),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {flashcards.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🃏</Text>
            <Text style={styles.emptyTitle}>Nenhum flashcard ainda</Text>
            <Text style={styles.emptySubtitle}>
              Adicione seu primeiro card para começar a estudar
            </Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {flashcards.map((card, index) => (
              <View key={card.id} style={styles.cardItem}>
                <View style={styles.cardNumber}>
                  <Text style={styles.cardNumberText}>#{index + 1}</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardSide}>
                    <Text style={styles.cardLabel}>FRENTE</Text>
                    <Text style={styles.cardText}>{card.front}</Text>
                  </View>
                  <View style={styles.cardDivider} />
                  <View style={styles.cardSide}>
                    <Text style={styles.cardLabel}>VERSO</Text>
                    <Text style={styles.cardText}>{card.back}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.gradients.goldGradient}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Create Flashcard Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={theme.gradients.cardGradient}
              style={styles.modalGradient}
            >
              <Text style={styles.modalTitle}>Novo Flashcard</Text>

              <Text style={styles.inputLabel}>Frente (Pergunta)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: O que é fotossíntese?"
                placeholderTextColor={theme.colors.textTertiary}
                value={cardFront}
                onChangeText={setCardFront}
                multiline
                numberOfLines={3}
                autoFocus
              />

              <Text style={styles.inputLabel}>Verso (Resposta)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Processo pelo qual plantas..."
                placeholderTextColor={theme.colors.textTertiary}
                value={cardBack}
                onChangeText={setCardBack}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={() => {
                    setShowCreateModal(false);
                    setCardFront('');
                    setCardBack('');
                  }}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButtonPrimary}
                  onPress={handleCreateFlashcard}
                >
                  <LinearGradient
                    colors={theme.gradients.goldGradient}
                    style={styles.modalButtonPrimaryGradient}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Criar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  headerIcon: {
    fontSize: 24,
    color: theme.colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: theme.spacing.md,
  },
  cardItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  cardNumber: {
    marginBottom: theme.spacing.md,
  },
  cardNumberText: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.gold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  cardContent: {
    gap: theme.spacing.md,
  },
  cardSide: {
    gap: theme.spacing.sm,
  },
  cardLabel: {
    fontSize: theme.typography.fontSize.caption,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textSecondary,
    letterSpacing: theme.typography.letterSpacing.widest,
  },
  cardText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.body,
  },
  cardDivider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    ...theme.shadows.lg,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 32,
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: theme.spacing.xl,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  modalButtonSecondary: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text,
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  modalButtonPrimaryGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: theme.typography.fontSize.body,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.black,
  },
});

export default FlashcardEditorScreen;
