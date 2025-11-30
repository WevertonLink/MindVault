/**
 * IdeaExpander - Expansão inteligente de ideias usando IA
 *
 * Este serviço usa o Ollama para expandir ideias capturadas,
 * fornecendo insights, vision points e próximos passos
 */

import {ollamaService} from './OllamaService';
import {PromptTemplates} from './PromptTemplates';

export interface ExpandedIdea {
  essence: string;
  visionPoints: string[];
  nextSteps: string[];
  motivation: string;
}

export interface IdeaExpansionResult {
  success: boolean;
  expansion?: ExpandedIdea;
  error?: string;
}

export class IdeaExpander {
  /**
   * Expande uma ideia baseada no título e estado emocional
   */
  static async expandIdea(
    ideaTitle: string,
    emotionalState: string
  ): Promise<IdeaExpansionResult> {
    try {
      // Validação
      if (!ideaTitle || ideaTitle.trim().length < 3) {
        return {
          success: false,
          error: 'O título da ideia é muito curto',
        };
      }

      if (!emotionalState) {
        return {
          success: false,
          error: 'Estado emocional não fornecido',
        };
      }

      // Gera o prompt
      const prompt = PromptTemplates.ideaExpansion(ideaTitle, emotionalState);

      // Chama o Ollama
      const response = await ollamaService.generate(prompt, {
        temperature: 0.8, // Mais criativo para expansão de ideias
        top_p: 0.95,
      });

      // Parseia a resposta
      const expansion = this.parseExpansionResponse(response);

      if (!expansion) {
        return {
          success: false,
          error: 'Não foi possível processar a expansão',
        };
      }

      return {
        success: true,
        expansion,
      };
    } catch (error) {
      console.error('Error expanding idea:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao expandir ideia',
      };
    }
  }

  /**
   * Gera sugestões de tópicos de estudo baseados no nível de energia
   */
  static async suggestStudyTopics(
    energyLevel: 'low' | 'normal' | 'high',
    previousTopics: string[] = []
  ): Promise<{success: boolean; suggestions?: string[]; error?: string}> {
    try {
      const prompt = PromptTemplates.studyTopicSuggestions(
        energyLevel,
        previousTopics
      );

      const response = await ollamaService.generate(prompt, {
        temperature: 0.8,
      });

      const suggestions = this.parseTopicSuggestions(response);

      if (suggestions.length === 0) {
        return {
          success: false,
          error: 'Não foi possível gerar sugestões',
        };
      }

      return {
        success: true,
        suggestions,
      };
    } catch (error) {
      console.error('Error suggesting topics:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Erro ao gerar sugestões',
      };
    }
  }

  /**
   * Gera uma dica de foco para sessão Pomodoro
   */
  static async getHyperFocusTip(
    sessionNumber: number,
    topic?: string
  ): Promise<{success: boolean; tip?: string; error?: string}> {
    try {
      const prompt = PromptTemplates.hyperFocusTips(sessionNumber, topic);

      const response = await ollamaService.generate(prompt, {
        temperature: 0.7,
      });

      const tip = response.trim();

      if (!tip || tip.length < 10) {
        return {
          success: false,
          error: 'Dica muito curta',
        };
      }

      return {
        success: true,
        tip,
      };
    } catch (error) {
      console.error('Error generating hyperfocus tip:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao gerar dica',
      };
    }
  }

  /**
   * Prioriza ideias baseado em múltiplos fatores
   */
  static async prioritizeIdeas(
    ideas: Array<{title: string; state: string}>
  ): Promise<{
    success: boolean;
    priority?: number;
    reason?: string;
    firstAction?: string;
    error?: string;
  }> {
    try {
      if (ideas.length === 0) {
        return {
          success: false,
          error: 'Nenhuma ideia fornecida',
        };
      }

      const prompt = PromptTemplates.prioritizeIdeas(ideas);
      const response = await ollamaService.generate(prompt, {
        temperature: 0.6,
      });

      const result = this.parsePrioritizationResponse(response);

      if (!result) {
        return {
          success: false,
          error: 'Não foi possível processar a priorização',
        };
      }

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error('Error prioritizing ideas:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Erro ao priorizar ideias',
      };
    }
  }

  /**
   * Parseia a resposta de expansão de ideia
   */
  private static parseExpansionResponse(
    response: string
  ): ExpandedIdea | null {
    try {
      const lines = response.split('\n').map(l => l.trim());

      let essence = '';
      const visionPoints: string[] = [];
      const nextSteps: string[] = [];
      let motivation = '';

      let currentSection = '';

      for (const line of lines) {
        if (!line) continue;

        // Detecta seções
        if (line.match(/^1\.\s*ESS[ÊE]NCIA/i)) {
          currentSection = 'essence';
          continue;
        } else if (line.match(/^2\.\s*VISION\s*POINTS/i)) {
          currentSection = 'vision';
          continue;
        } else if (line.match(/^3\.\s*PR[ÓO]XIMOS\s*PASSOS/i)) {
          currentSection = 'steps';
          continue;
        } else if (line.match(/^4\.\s*MOTIVA[ÇC][ÃA]O/i)) {
          currentSection = 'motivation';
          continue;
        }

        // Adiciona conteúdo à seção atual
        if (currentSection === 'essence' && !essence) {
          essence = line.replace(/^-\s*/, '');
        } else if (currentSection === 'vision' && line.startsWith('-')) {
          visionPoints.push(line.replace(/^-\s*/, ''));
        } else if (currentSection === 'steps' && line.startsWith('-')) {
          nextSteps.push(line.replace(/^-\s*/, ''));
        } else if (currentSection === 'motivation' && !motivation) {
          motivation = line.replace(/^-\s*/, '');
        }
      }

      // Validação mínima
      if (!essence || visionPoints.length === 0) {
        return null;
      }

      return {
        essence,
        visionPoints,
        nextSteps,
        motivation,
      };
    } catch (error) {
      console.error('Error parsing expansion:', error);
      return null;
    }
  }

  /**
   * Parseia sugestões de tópicos
   */
  private static parseTopicSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    const lines = response.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      // Detecta linhas numeradas (1., 2., 3.)
      if (trimmed.match(/^\d+\./)) {
        const suggestion = trimmed.replace(/^\d+\.\s*/, '').trim();
        if (suggestion.length > 5) {
          suggestions.push(suggestion);
        }
      }
    }

    return suggestions;
  }

  /**
   * Parseia resposta de priorização
   */
  private static parsePrioritizationResponse(response: string): {
    priority: number;
    reason: string;
    firstAction: string;
  } | null {
    try {
      const lines = response.split('\n').map(l => l.trim());

      let priority = -1;
      let reason = '';
      let firstAction = '';

      for (const line of lines) {
        if (line.match(/^PRIORIDADE:/i)) {
          const match = line.match(/\d+/);
          if (match) {
            priority = parseInt(match[0], 10);
          }
        } else if (line.match(/^RAZ[ÃA]O:/i)) {
          reason = line.replace(/^RAZ[ÃA]O:\s*/i, '');
        } else if (line.match(/^PRIMEIRA\s+A[ÇC][ÃA]O:/i)) {
          firstAction = line.replace(/^PRIMEIRA\s+A[ÇC][ÃA]O:\s*/i, '');
        }
      }

      if (priority === -1 || !reason) {
        return null;
      }

      return {priority, reason, firstAction};
    } catch (error) {
      console.error('Error parsing prioritization:', error);
      return null;
    }
  }

  /**
   * Verifica se o serviço está disponível
   */
  static async isAvailable(): Promise<boolean> {
    return await ollamaService.checkHealth();
  }
}
