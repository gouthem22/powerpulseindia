import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Sourced from env

export const generateInsights = async (prompt: string): Promise<{ summary: string[]; confidence: number }> => {
  if (!apiKey) {
    console.warn("Gemini API Key not found. Returning mock data.");
    return {
      summary: [
        "AI Insight unavailable (Missing API Key).",
        "Please configure process.env.API_KEY to enable real-time insights.",
        "Data trends indicate significant growth in renewable adoption across key regions."
      ],
      confidence: 0.0
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash'; 
    
    const systemInstruction = `You are an expert energy data analyst. Analyze the provided electricity consumption data summary and provide 3 distinct, high-value insights in JSON format.
    The output must be a JSON object with two keys: "summary" (an array of 3 strings) and "confidence" (a number between 0 and 1).
    Focus on trends, anomalies, and renewable energy adoption. Be concise.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: [
        "Error generating insights.",
        "Please check network connection or API quota.",
        "Fallback analysis: Consumption patterns show upward trends in industrial sectors."
      ],
      confidence: 0.5
    };
  }
};
