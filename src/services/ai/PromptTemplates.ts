/**
 * PromptTemplates - Templates de prompts para diferentes funcionalidades
 *
 * Estes templates são otimizados para gerar respostas estruturadas
 * e úteis para o contexto de aprendizado e captura de ideias
 */

export class PromptTemplates {
  /**
   * Template para geração de flashcards sobre um tópico
   */
  static flashcardGeneration(topic: string, count: number = 5): string {
    return `Você é um especialista em criar flashcards para aprendizado eficaz usando o método de repetição espaçada.

Crie EXATAMENTE ${count} flashcards sobre o tópico: "${topic}"

REGRAS IMPORTANTES:
- Cada flashcard deve ter uma PERGUNTA clara e uma RESPOSTA concisa
- As perguntas devem testar compreensão, não memorização literal
- Respostas devem ter no máximo 2-3 frases
- Varie o nível de dificuldade (fácil, médio, difícil)
- Use linguagem clara e direta

FORMATO EXATO (COPIE ESTE FORMATO):
---
PERGUNTA: [sua pergunta aqui]
RESPOSTA: [sua resposta aqui]
---

Gere os ${count} flashcards agora:`;
  }

  /**
   * Template para expansão de ideias
   */
  static ideaExpansion(
    ideaTitle: string,
    emotionalState: string
  ): string {
    return `Você é um coach criativo especializado em expandir e desenvolver ideias.

A pessoa está no estado emocional: ${emotionalState}
Ideia inicial: "${ideaTitle}"

Expanda esta ideia fornecendo:

1. ESSÊNCIA (1 frase): O que torna esta ideia especial?

2. VISION POINTS (3-5 pontos):
- Aspectos-chave desta ideia
- Possibilidades e direções
- Elementos que podem ser explorados

3. PRÓXIMOS PASSOS (3 ações concretas):
- Passos práticos e pequenos
- Adequados ao estado emocional atual
- Que podem ser feitos hoje ou esta semana

4. MOTIVAÇÃO (1 frase inspiradora):
- Relacionada ao estado emocional
- Que reforce o valor da ideia

Responda em PORTUGUÊS, de forma clara e estruturada.`;
  }

  /**
   * Template para sugestões de tópicos de estudo
   */
  static studyTopicSuggestions(
    energyLevel: 'low' | 'normal' | 'high',
    previousTopics: string[]
  ): string {
    const energyDescriptions = {
      low: 'baixa energia (preferência por conteúdo leve e visual)',
      normal: 'energia normal (equilíbrio entre teoria e prática)',
      high: 'alta energia (desafios complexos e novos conceitos)',
    };

    const previousContext =
      previousTopics.length > 0
        ? `\nTópicos já estudados: ${previousTopics.join(', ')}`
        : '';

    return `Você é um mentor de aprendizado personalizado.

Estado atual: ${energyDescriptions[energyLevel]}${previousContext}

Sugira 3 tópicos de estudo interessantes que:
1. Sejam adequados ao nível de energia atual
2. Sejam variados e motivadores
3. Complementem ou expandam os tópicos anteriores (se houver)

Para cada tópico, forneça:
- NOME: Um título atraente
- RAZÃO: Por que estudar isso agora (1 frase)
- DURAÇÃO: Tempo estimado (5-30 min)

Formato:
1. [NOME] - [RAZÃO] - [DURAÇÃO]
2. [NOME] - [RAZÃO] - [DURAÇÃO]
3. [NOME] - [RAZÃO] - [DURAÇÃO]`;
  }

  /**
   * Template para resumir texto em flashcards
   */
  static textToFlashcards(text: string, maxCards: number = 5): string {
    return `Você é um especialista em extrair conhecimento essencial de textos.

Analise o texto abaixo e crie até ${maxCards} flashcards com os conceitos mais importantes:

"""
${text.slice(0, 2000)} ${text.length > 2000 ? '...' : ''}
"""

REGRAS:
- Foque nos conceitos-chave e ideias principais
- Cada flashcard deve ser independente
- Perguntas devem testar compreensão real
- Respostas concisas (máx 2-3 frases)

FORMATO EXATO:
---
PERGUNTA: [pergunta]
RESPOSTA: [resposta]
---

Gere os flashcards agora:`;
  }

  /**
   * Template para dicas de hiperfoco
   */
  static hyperFocusTips(
    sessionNumber: number,
    topic?: string
  ): string {
    return `Você é um coach de produtividade para pessoas com TDAH.

Esta é a sessão Pomodoro #${sessionNumber}${topic ? ` focada em: ${topic}` : ''}.

Dê 1 ÚNICA dica prática e motivadora de 1-2 frases para:
- Manter o foco durante esta sessão
- Específica para ${topic ? 'este tópico' : 'o momento atual'}
- Adequada para pessoas neurodivergentes

Seja direto, positivo e prático. NÃO use emojis.`;
  }

  /**
   * Template para priorização de ideias
   */
  static prioritizeIdeas(ideas: Array<{title: string; state: string}>): string {
    const ideasList = ideas
      .map((idea, i) => `${i + 1}. "${idea.title}" (estado: ${idea.state})`)
      .join('\n');

    return `Você é um consultor de priorização e foco.

Analise estas ideias e sugira qual deveria ser trabalhada PRIMEIRO e por quê:

${ideasList}

Responda em EXATAMENTE este formato:
PRIORIDADE: [número da ideia]
RAZÃO: [1-2 frases explicando por quê]
PRIMEIRA AÇÃO: [1 ação concreta para começar]

Seja direto e prático.`;
  }
}
