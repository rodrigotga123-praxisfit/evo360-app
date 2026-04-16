import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WeeklyCheckIn, WorkoutLog, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const aiService = {
  async analyzeStudentPerformance(
    student: UserProfile,
    checkIns: WeeklyCheckIn[],
    logs: WorkoutLog[]
  ): Promise<AIAnalysis> {
    const prompt = `
      Analise o desempenho do aluno ${student.fullName} com base nos seguintes dados:
      
      Perfil: ${student.objective}, Nível ${student.level}
      Check-ins Recentes: ${JSON.stringify(checkIns.slice(0, 4))}
      Logs de Treino Recentes: ${JSON.stringify(logs.slice(0, 10))}
      
      Forneça um diagnóstico, recomendações, alertas de risco e um score de 0 a 100.
      Identifique também o perfil comportamental (ex: "Executor Consistente", "Oscilador de Energia").
    `;

    try {
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

      return JSON.parse(response.text);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return {
        diagnosis: "Não foi possível realizar a análise no momento.",
        recommendations: [],
        riskAlerts: [],
        score: student.evoScore || 0,
        profile: student.userProfile || "Não identificado"
      };
    }
  },

  async getFinancialInsights(financeData: any): Promise<any> {
    const prompt = `
      Analise os dados financeiros do treinador:
      ${JSON.stringify(financeData)}
      
      Forneça uma análise de crescimento, recomendações de precificação e metas para atingir o faturamento desejado.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { type: Type.STRING },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              priceSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    service: { type: Type.STRING },
                    current: { type: Type.NUMBER },
                    suggested: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Financial AI Error:", error);
      return null;
    }
  }
};
