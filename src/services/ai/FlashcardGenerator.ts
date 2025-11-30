/**
 * FlashcardGenerator - Geração inteligente de flashcards usando IA
 *
 * Este serviço usa o Ollama para gerar flashcards de alta qualidade
 * baseados em tópicos ou textos fornecidos pelo usuário
 */

import {ollamaService} from './OllamaService';
import {PromptTemplates} from './PromptTemplates';

export interface GeneratedFlashcard {
  front: string;
  back: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface FlashcardGenerationResult {
  success: boolean;
  flashcards: GeneratedFlashcard[];
  error?: string;
}

export class FlashcardGenerator {
  /**
   * Gera flashcards sobre um tópico específico
   */
  static async generateFromTopic(
    topic: string,
    count: number = 5
  ): Promise<FlashcardGenerationResult> {
    try {
      // Validação
      if (!topic || topic.trim().length < 2) {
        return {
          success: false,
          flashcards: [],
          error: 'Tópico muito curto ou vazio',
        };
      }

      if (count < 1 || count > 20) {
        return {
          success: false,
          flashcards: [],
          error: 'Quantidade deve estar entre 1 e 20',
        };
      }

      // Gera o prompt
      const prompt = PromptTemplates.flashcardGeneration(topic, count);

      // Chama o Ollama
      const response = await ollamaService.generate(prompt, {
        temperature: 0.7,
        top_p: 0.9,
      });

      // Parseia a resposta
      const flashcards = this.parseFlashcardsFromResponse(response);

      if (flashcards.length === 0) {
        return {
          success: false,
          flashcards: [],
          error: 'Não foi possível gerar flashcards. Tente novamente.',
        };
      }

      return {
        success: true,
        flashcards: flashcards.slice(0, count), // Garante que retorna exatamente 'count' cards
      };
    } catch (error) {
      console.error('Error generating flashcards:', error);
      return {
        success: false,
        flashcards: [],
        error:
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao gerar flashcards',
      };
    }
  }

  /**
   * Gera flashcards a partir de um texto
   */
  static async generateFromText(
    text: string,
    maxCards: number = 5
  ): Promise<FlashcardGenerationResult> {
    try {
      if (!text || text.trim().length < 50) {
        return {
          success: false,
          flashcards: [],
          error: 'Texto muito curto (mínimo 50 caracteres)',
        };
      }

      const prompt = PromptTemplates.textToFlashcards(text, maxCards);
      const response = await ollamaService.generate(prompt, {
        temperature: 0.6, // Menos criativo para extrair fatos
      });

      const flashcards = this.parseFlashcardsFromResponse(response);

      if (flashcards.length === 0) {
        return {
          success: false,
          flashcards: [],
          error: 'Não foi possível extrair flashcards do texto',
        };
      }

      return {
        success: true,
        flashcards,
      };
    } catch (error) {
      console.error('Error generating flashcards from text:', error);
      return {
        success: false,
        flashcards: [],
        error:
          error instanceof Error ? error.message : 'Erro ao processar texto',
      };
    }
  }

  /**
   * Parseia a resposta do modelo em flashcards estruturados
   */
  private static parseFlashcardsFromResponse(
    response: string
  ): GeneratedFlashcard[] {
    const flashcards: GeneratedFlashcard[] = [];

    // Divide por separadores ---
    const sections = response.split('---').filter(s => s.trim());

    for (const section of sections) {
      const lines = section.trim().split('\n');
      let front = '';
      let back = '';

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Encontra PERGUNTA
        if (
          trimmedLine.startsWith('PERGUNTA:') ||
          trimmedLine.startsWith('QUESTION:')
        ) {
          front = trimmedLine
            .replace(/^(PERGUNTA|QUESTION):\s*/i, '')
            .trim();
        }

        // Encontra RESPOSTA
        if (
          trimmedLine.startsWith('RESPOSTA:') ||
          trimmedLine.startsWith('ANSWER:')
        ) {
          back = trimmedLine.replace(/^(RESPOSTA|ANSWER):\s*/i, '').trim();
        }
      }

      // Se encontrou ambos, adiciona o flashcard
      if (front && back) {
        flashcards.push({
          front,
          back,
          difficulty: this.inferDifficulty(front, back),
        });
      }
    }

    // Fallback: tenta outro formato comum
    if (flashcards.length === 0) {
      flashcards.push(...this.parseFallbackFormat(response));
    }

    return flashcards;
  }

  /**
   * Formato alternativo de parsing (Q: / A:)
   */
  private static parseFallbackFormat(
    response: string
  ): GeneratedFlashcard[] {
    const flashcards: GeneratedFlashcard[] = [];
    const lines = response.split('\n');
    let currentFront = '';
    let currentBack = '';

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.match(/^(Q|PERGUNTA):/i)) {
        if (currentFront && currentBack) {
          flashcards.push({
            front: currentFront,
            back: currentBack,
            difficulty: this.inferDifficulty(currentFront, currentBack),
          });
        }
        currentFront = trimmed.replace(/^(Q|PERGUNTA):\s*/i, '');
        currentBack = '';
      } else if (trimmed.match(/^(A|RESPOSTA):/i)) {
        currentBack = trimmed.replace(/^(A|RESPOSTA):\s*/i, '');
      }
    }

    // Adiciona o último card
    if (currentFront && currentBack) {
      flashcards.push({
        front: currentFront,
        back: currentBack,
        difficulty: this.inferDifficulty(currentFront, currentBack),
      });
    }

    return flashcards;
  }

  /**
   * Infere a dificuldade baseado no tamanho e complexidade
   */
  private static inferDifficulty(
    front: string,
    back: string
  ): 'easy' | 'medium' | 'hard' {
    const totalLength = front.length + back.length;
    const hasComplexWords = /\b\w{12,}\b/.test(front + back);

    if (totalLength < 100 && !hasComplexWords) {
      return 'easy';
    } else if (totalLength > 250 || hasComplexWords) {
      return 'hard';
    }
    return 'medium';
  }

  /**
   * Verifica se o serviço está disponível
   */
  static async isAvailable(): Promise<boolean> {
    return await ollamaService.checkHealth();
  }
}
