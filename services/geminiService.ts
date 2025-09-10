
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Sale, AIInsight } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const insightSchema = {
    type: Type.OBJECT,
    properties: {
        insight: {
            type: Type.STRING,
            description: "A natural language summary of the findings based on the user's question and provided data. Be concise and direct."
        },
        chartData: {
            type: Type.ARRAY,
            nullable: true,
            description: "Data formatted for a chart if applicable. Null if no chart is relevant.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The label for the data point (e.g., product name, day of the week)." },
                    value: { type: Type.NUMBER, description: "The numerical value for the data point." }
                }
            }
        },
        chartType: {
            type: Type.STRING,
            nullable: true,
            description: "The suggested chart type ('bar', 'pie', 'line'). Null if no chart is relevant."
        }
    }
};

export const getAIInsight = async (query: string, products: Product[], sales: Sale[]): Promise<AIInsight> => {
  if (!API_KEY) {
    // Return a mock response if API key is not available
    return {
      insight: "AI Insights are currently unavailable. Please configure your API key.",
      chartData: null,
      chartType: null,
    };
  }
  
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert business analyst for a small retail store. 
    Analyze the provided JSON data to answer the user's question. 
    Today's date is ${new Date().toLocaleDateString()}.

    User Question: "${query}"

    JSON Data:
    {
      "products": ${JSON.stringify(products)},
      "sales": ${JSON.stringify(sales, null, 2)}
    }
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: insightSchema
      }
    });

    const jsonString = response.text;
    const parsedResult = JSON.parse(jsonString);

    // Basic validation to ensure the result matches the expected structure.
    if (parsedResult && typeof parsedResult.insight === 'string') {
        return parsedResult as AIInsight;
    } else {
        throw new Error("Invalid AI response format");
    }

  } catch (error) {
    console.error("Error fetching AI insight:", error);
    throw new Error("Failed to get insights from AI. The model may have returned an unexpected format.");
  }
};
