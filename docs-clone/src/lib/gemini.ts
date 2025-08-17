import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export async function generateContent(prompt: string, documentContext?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const contextPrompt = documentContext 
      ? `Document Context: ${documentContext}\n\nUser Request: ${prompt}`
      : prompt
      
    const result = await model.generateContent(contextPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini API error:", error)
    throw new Error("Failed to generate content. Please try again.")
  }
}

export async function analyzeDocument(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `Analyze the following document and provide insights:
    
    Document Content:
    ${content}
    
    Please provide:
    1. A brief summary
    2. Key points
    3. Suggestions for improvement
    4. Grammar and spelling corrections if any`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Document analysis error:", error)
    throw new Error("Failed to analyze document. Please try again.")
  }
}

export async function generateTemplate(templateType: string, context?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `Generate a ${templateType} document template in the appropriate language.
    ${context ? `Additional context: ${context}` : ""}
    
    Please provide a well-formatted template with placeholders for user-specific information.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Template generation error:", error)
    throw new Error("Failed to generate template. Please try again.")
  }
}