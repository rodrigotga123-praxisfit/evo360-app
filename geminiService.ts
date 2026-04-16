import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, PhysicalAssessment, BehavioralData, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeEvo360(
  user: UserProfile,
  assessment: PhysicalAssessment,
  behavioral: BehavioralData
): Promise<AIAnalysis> {
  const prompt = `
    Analise os seguintes dados do usuário EVO 360:
    
    Perfil: ${JSON.stringify(user)}
    Avaliação Física: ${JSON.stringify(assessment)}
    Comportamento: ${JSON.stringify(behavioral)}
    
    Gere um diagnóstico completo, recomendações personalizadas, alertas de risco, um SCORE (0-100) e classifique o perfil (Iniciante, Inconsistente, Disciplinado, Avançado).
    Responda em JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
          score: { type: Type.NUMBER },
          profile: { type: Type.STRING }
        },
        required: ["diagnosis", "recommendations", "riskAlerts", "score", "profile"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function analyzeBodyImage(
  base64Image: string,
  user: UserProfile,
  assessment: PhysicalAssessment
): Promise<any> {
  const prompt = `
    Analise esta foto de um usuário fitness. 
    Dados do usuário: ${user.objective}, Peso: ${assessment.weight}kg, Altura: ${assessment.height}cm.
    
    Estime o percentual de gordura, analise a estrutura muscular, postura e identifique pontos fortes e fracos.
    Responda em JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedBF: { type: Type.NUMBER },
          muscleStructure: { type: Type.STRING },
          posture: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
