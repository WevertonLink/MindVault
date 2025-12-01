/**
 * AIFlashcardGeneratorScreen - Tela para geração de flashcards com IA
 *
 * Permite ao usuário inserir um tópico e gerar flashcards automaticamente
 * usando o modelo Ollama
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FlashcardGenerator, type GeneratedFlashcard} from '../services/ai';
import {theme} from '../theme';
import {createDeck, createFlashcard} from '../database';

interface Props {
  navigation: any;
}

export const AIFlashcardGeneratorScreen: React.FC<Props> = ({navigation}) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState('5');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<GeneratedFlashcard[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('Atenção', 'Digite um tópico para gerar flashcards');
      return;
    }

    const cardCount = parseInt(count, 10);
    if (isNaN(cardCount) || cardCount < 1 || cardCount > 10) {
      Alert.alert('Atenção', 'Quantidade deve estar entre 1 e 10');
      return;
    }

    setLoading(true);
    setFlashcards([]);

    try {
      const result = await FlashcardGenerator.generateFromTopic(
        topic,
        cardCount
      );

      if (result.success && result.flashcards.length > 0) {
        setFlashcards(result.flashcards);
      } else {
        Alert.alert(
          'Erro',
          result.error || 'Não foi possível gerar flashcards'
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao gerar flashcards. Verifique se o Ollama está rodando.'
      );
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (flashcards.length === 0) {
      return;
    }

    try {
      // Cria um novo deck para os flashcards gerados
      const deckName = `IA: ${topic}`;
      const deckId = await createDeck({
        name: deckName,
        description: `Flashcards gerados por IA sobre ${topic}`,
        color: '#FFD700',
      });

      // Salva todos os flashcards no novo deck
      for (const card of flashcards) {
        await createFlashcard({
          deckId,
          front: card.front,
          back: card.back,
        });
      }

      Alert.alert(
        'Sucesso!',
        `${flashcards.length} flashcards salvos no deck "${deckName}"`,
        [
          {
            text: 'Ver Dashboard',
            onPress: () => navigation.navigate('Dashboard'),
          },
          {text: 'Gerar Mais', style: 'cancel'},
        ]
      );

      // Limpa os campos
      setFlashcards([]);
      setTopic('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os flashcards');
      console.error('Save error:', error);
    }
  };

  return (
    <LinearGradient colors={theme.gradients.dark} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gerar Flashcards com IA</Text>
          <Text style={styles.subtitle}>
            Powered by Ollama (deepseek-r1:1.5b)
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Tópico de Estudo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Fotossíntese, React Hooks, História do Brasil..."
            placeholderTextColor={theme.colors.textDim}
            value={topic}
            onChangeText={setTopic}
            editable={!loading}
          />

          <Text style={styles.label}>Quantidade de Flashcards</Text>
          <TextInput
            style={styles.inputSmall}
            placeholder="5"
            placeholderTextColor={theme.colors.textDim}
            value={count}
            onChangeText={setCount}
            keyboardType="number-pad"
            maxLength={2}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.buttonDisabled]}
            onPress={handleGenerate}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={theme.colors.black} size="small" />
            ) : (
              <Text style={styles.generateButtonText}>Gerar Flashcards</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {flashcards.length > 0 && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {flashcards.length} Flashcards Gerados
              </Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAll}>
                <Text style={styles.saveButtonText}>Salvar Todos</Text>
              </TouchableOpacity>
            </View>

            {flashcards.map((card, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardNumber}>#{index + 1}</Text>
                  {card.difficulty && (
                    <Text
                      style={[
                        styles.difficulty,
                        styles[`difficulty${card.difficulty}`],
                      ]}>
                      {card.difficulty === 'easy'
                        ? 'Fácil'
                        : card.difficulty === 'medium'
                        ? 'Médio'
                        : 'Difícil'}
                    </Text>
                  )}
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>PERGUNTA:</Text>
                  <Text style={styles.cardText}>{card.front}</Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>RESPOSTA:</Text>
                  <Text style={styles.cardText}>{card.back}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.gold} />
            <Text style={styles.loadingText}>
              Gerando flashcards com IA...
            </Text>
            <Text style={styles.loadingSubtext}>
              Isso pode levar alguns segundos
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && flashcards.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Digite um tópico e clique em "Gerar Flashcards" para começar
            </Text>
          </View>
        )}
      </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: theme.colors.gold,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textDim,
  },
  inputSection: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: theme.colors.white,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  inputSmall: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: theme.colors.white,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    width: 100,
  },
  generateButton: {
    backgroundColor: theme.colors.gold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: theme.colors.gold,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resultsSection: {
    padding: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  saveButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.gold,
  },
  saveButtonText: {
    color: theme.colors.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumber: {
    color: theme.colors.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  difficulty: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyeasy: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    color: '#4CAF50',
  },
  difficultymedium: {
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    color: '#FF9800',
  },
  difficultyhard: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    color: '#F44336',
  },
  cardContent: {
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 10,
    color: theme.colors.gold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: theme.colors.white,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.white,
    fontSize: 16,
    marginTop: 16,
  },
  loadingSubtext: {
    color: theme.colors.textDim,
    fontSize: 12,
    marginTop: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textDim,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
