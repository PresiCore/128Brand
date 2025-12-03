
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ChatResponse {
    text: string;
    productRecommendation?: string;
}

export const sendMessageToGemini = async (
  userMessage: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<ChatResponse> => {
  try {
    const modelId = 'gemini-2.5-flash'; // Using Flash for faster, snappy sales responses
    
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                response: { type: Type.STRING, description: "The conversational response to the user." },
                recommendedProductId: { type: Type.STRING, description: "The ID of the product to recommend (e.g. 'ai-growth-bot'), or null if none.", nullable: true }
            },
            required: ["response"]
        }
      },
      history: history, 
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    const responseText = result.text;
    
    try {
        if (!responseText) throw new Error("Empty response");
        const data = JSON.parse(responseText);
        return {
            text: data.response,
            productRecommendation: data.recommendedProductId
        };
    } catch (e) {
        console.error("Error parsing JSON from Gemini:", e);
        // Fallback for non-JSON text
        return { text: responseText || "Lo siento, hubo un error de conexión.", productRecommendation: undefined };
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { text: "Error de conexión. Por favor, intenta más tarde." };
  }
};
