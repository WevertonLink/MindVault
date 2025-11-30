/**
 * OllamaService - Cliente para comunicação com Ollama API
 *
 * Este serviço gerencia todas as comunicações com o servidor Ollama local
 * rodando em localhost:11434
 */

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export class OllamaService {
  private baseUrl: string;
  private model: string;
  private timeout: number;

  constructor(
    baseUrl: string = 'http://10.0.2.2:11434', // Android emulator localhost
    model: string = 'deepseek-r1:1.5b',
    timeout: number = 60000 // 60 segundos
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.timeout = timeout;
  }

  /**
   * Gera texto usando o modelo Ollama
   */
  async generate(
    prompt: string,
    options?: OllamaGenerateRequest['options']
  ): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            top_p: options?.top_p ?? 0.9,
            ...options,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data: OllamaGenerateResponse = await response.json();
      return data.response.trim();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout: O modelo demorou muito para responder');
        }
        throw new Error(`Erro ao gerar texto: ${error.message}`);
      }
      throw new Error('Erro desconhecido ao gerar texto');
    }
  }

  /**
   * Verifica se o servidor Ollama está disponível
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Lista os modelos disponíveis
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      return data.models.map((m: any) => m.name);
    } catch (error) {
      console.error('Error listing models:', error);
      return [];
    }
  }

  /**
   * Muda o modelo atual
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Obtém o modelo atual
   */
  getModel(): string {
    return this.model;
  }
}

// Instância singleton para uso global
export const ollamaService = new OllamaService();
