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
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/types';
import { Card, Header } from '../components';
import { theme } from '../theme';
import { getAllDecks, getFlashcardsByDeck, createDeck, deleteDeck } from '../database';
import { Deck } from '../types';
import { haptics } from '../utils/haptics';

type DeckManagementScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DeckManagement'>;

interface Props {
  navigation: DeckManagementScreenNavigationProp;
}

const DeckManagementScreen: React.FC<Props> = ({ navigation }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [deckCardCounts, setDeckCardCounts] = useState<Record<string, number>>({});

  const loadDecks = async () => {
    try {
      const allDecks = await getAllDecks();
      setDecks(allDecks);

      // Load card counts for each deck
      const counts: Record<string, number> = {};
      for (const deck of allDecks) {
        const cards = await getFlashcardsByDeck(deck.id);
        counts[deck.id] = cards.length;
      }
      setDeckCardCounts(counts);

      setLoading(false);
    } catch (error) {
      console.error('Error loading decks:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [])
  );

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) {
      haptics.warning();
      Alert.alert('Erro', 'Digite um nome para o deck');
      return;
    }

    try {
      await createDeck({
        name: newDeckName.trim(),
        description: newDeckDescription.trim(),
        color: '#FFD700',
      });

      haptics.success();
      setNewDeckName('');
      setNewDeckDescription('');
      setShowCreateModal(false);
      loadDecks();
    } catch (error) {
      haptics.error();
      Alert.alert('Erro', 'Não foi possível criar o deck');
      console.error('Error creating deck:', error);
    }
  };

  const handleDeckPress = (deck: Deck) => {
    navigation.navigate('FlashcardEditor', { deckId: deck.id, deckName: deck.name });
  };

  const handleDeleteDeck = (deck: Deck) => {
    haptics.medium(); // Feedback for long press
    const cardCount = deckCardCounts[deck.id] || 0;
    Alert.alert(
      'Deletar Deck',
      `Tem certeza que deseja deletar "${deck.name}"?${cardCount > 0 ? ` Isso irá deletar ${cardCount} card(s).` : ''}`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => haptics.light() },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDeck(deck.id);
              haptics.success();
              loadDecks();
            } catch (error) {
              haptics.error();
              Alert.alert('Erro', 'Não foi possível deletar o deck');
              console.error('Error deleting deck:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={theme.gradients.backgroundGradient}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando decks...</Text>
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
        title="Meus Decks"
        subtitle={`${decks.length} ${decks.length === 1 ? 'deck' : 'decks'}`}
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
        {decks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>Nenhum deck ainda</Text>
            <Text style={styles.emptySubtitle}>
              Crie seu primeiro deck de flashcards
            </Text>
          </View>
        ) : (
          <View style={styles.decksGrid}>
            {decks.map((deck) => (
              <TouchableOpacity
                key={deck.id}
                onPress={() => handleDeckPress(deck)}
                onLongPress={() => handleDeleteDeck(deck)}
                activeOpacity={0.8}
              >
                <Card variant="elevated" style={styles.deckCard}>
                  <View style={styles.deckHeader}>
                    <View style={[styles.deckColorIndicator, { backgroundColor: deck.color }]} />
                    <Text style={styles.deckName} numberOfLines={1}>
                      {deck.name}
                    </Text>
                  </View>
                  {deck.description ? (
                    <Text style={styles.deckDescription} numberOfLines={2}>
                      {deck.description}
                    </Text>
                  ) : null}
                  <View style={styles.deckFooter}>
                    <Text style={styles.deckCardCount}>
                      {deckCardCounts[deck.id] || 0} cards
                    </Text>
                    <Text style={styles.deckArrow}>→</Text>
                  </View>
                  <Text style={styles.deckHint}>Pressione e segure para deletar</Text>
                </Card>
              </TouchableOpacity>
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

      {/* Create Deck Modal */}
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
              <Text style={styles.modalTitle}>Novo Deck</Text>

              <Text style={styles.inputLabel}>Nome do Deck</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Biologia, História..."
                placeholderTextColor={theme.colors.textTertiary}
                value={newDeckName}
                onChangeText={setNewDeckName}
                autoFocus
              />

              <Text style={styles.inputLabel}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Adicione uma descrição..."
                placeholderTextColor={theme.colors.textTertiary}
                value={newDeckDescription}
                onChangeText={setNewDeckDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={() => {
                    setShowCreateModal(false);
                    setNewDeckName('');
                    setNewDeckDescription('');
                  }}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButtonPrimary}
                  onPress={handleCreateDeck}
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
  decksGrid: {
    gap: theme.spacing.md,
  },
  deckCard: {
    padding: theme.spacing.lg,
  },
  deckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  deckColorIndicator: {
    width: 4,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  deckName: {
    flex: 1,
    fontSize: theme.typography.fontSize.subtitle,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
  },
  deckDescription: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.body,
  },
  deckFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: theme.borderWidth.thin,
    borderTopColor: theme.colors.cardBorder,
  },
  deckCardCount: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.gold,
  },
  deckArrow: {
    fontSize: 20,
    color: theme.colors.textTertiary,
  },
  deckHint: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
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

export default DeckManagementScreen;
