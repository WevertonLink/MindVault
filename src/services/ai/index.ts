/**
 * AI Services - Integração com Ollama
 *
 * Este módulo exporta todos os serviços de IA do MindVault
 */

export {
  OllamaService,
  ollamaService,
  type OllamaGenerateRequest,
  type OllamaGenerateResponse,
} from './OllamaService';

export {PromptTemplates} from './PromptTemplates';

export {
  FlashcardGenerator,
  type GeneratedFlashcard,
  type FlashcardGenerationResult,
} from './FlashcardGenerator';

export {
  IdeaExpander,
  type ExpandedIdea,
  type IdeaExpansionResult,
} from './IdeaExpander';
