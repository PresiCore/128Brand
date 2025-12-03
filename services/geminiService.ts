import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeminiConfig {
  systemInstruction?: string;
  jsonMode?: boolean;
}

export const sendMessageToGemini = async (
  userMessage: string, 
  history: { role: string; parts: { text: string }[] }[],
  config?: GeminiConfig
): Promise<string> => {
  try {
    // Updated to Gemini 3.0 as requested for complex reasoning
    const modelId = 'gemini-3-pro-preview'; 
    
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: config?.systemInstruction || SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: config?.jsonMode ? 'application/json' : 'text/plain',
      },
      history: history, 
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: userMessage
    });

    return response.text || "Lo siento, sin respuesta.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error de conexión con Gemini 3.0. Por favor, intenta más tarde.";
  }
};