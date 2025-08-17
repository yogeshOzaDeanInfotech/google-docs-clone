import { GoogleGenerativeAI } from "@google/generative-ai"
import { GeminiResponse } from "@/types/gemini"

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  initialize(apiKey: string) {
    if (!apiKey) {
      throw new Error("Gemini API key is required")
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" })
  }

  async generateContent(
    prompt: string,
    documentContext?: string
  ): Promise<GeminiResponse> {
    try {
      if (!this.model) {
        throw new Error("Gemini AI not initialized. Please provide an API key.")
      }

      const contextPrompt = documentContext
        ? `Current Document Context:\n${documentContext}\n\nUser Request: ${prompt}\n\nProvide a helpful response considering the document context.`
        : prompt

      const result = await this.model.generateContent(contextPrompt)
      const response = await result.response
      const text = response.text()

      return {
        text,
        suggestions: this.extractSuggestions(text)
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error)
      return {
        text: "",
        error: error.message || "Failed to generate content"
      }
    }
  }

  async analyzeDocument(content: string): Promise<GeminiResponse> {
    const prompt = `Analyze the following document and provide insights about its structure, content quality, and suggestions for improvement:\n\n${content}`
    return this.generateContent(prompt)
  }

  async generateTemplate(templateType: string, details?: string): Promise<GeminiResponse> {
    const prompt = `Generate a ${templateType} document template${details ? ` with the following details: ${details}` : ''}. Format it properly with appropriate sections.`
    return this.generateContent(prompt)
  }

  async translateContent(content: string, targetLanguage: string): Promise<GeminiResponse> {
    const prompt = `Translate the following content to ${targetLanguage} while maintaining the formal document structure:\n\n${content}`
    return this.generateContent(prompt)
  }

  async improveFormatting(content: string): Promise<GeminiResponse> {
    const prompt = `Improve the formatting and structure of the following document. Maintain the original content but enhance readability:\n\n${content}`
    return this.generateContent(prompt)
  }

  private extractSuggestions(text: string): string[] {
    // Extract bullet points or numbered lists as suggestions
    const suggestions: string[] = []
    const lines = text.split('\n')
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (
        trimmed.match(/^[\d]+\./) || // Numbered list
        trimmed.match(/^[•\-\*]/) || // Bullet points
        trimmed.match(/^[१-९]\./) // Marathi numbers
      ) {
        suggestions.push(trimmed.replace(/^[\d१-९]+\.|^[•\-\*]\s*/, '').trim())
      }
    })

    return suggestions
  }
}

export const geminiService = new GeminiService()

export { GeminiService }