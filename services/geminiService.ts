import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ContentBlock } from "../types";

// Simple in-memory cache
const analysisCache = new Map<string, ContentBlock[]>();

// Define the response schema to ensure structured JSON output suitable for rendering
const chartConfigSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A concise title for the chart. MUST BE IN THE SAME LANGUAGE AS THE INPUT TEXT." },
    description: { type: Type.STRING, description: "A short caption explaining the insight. MUST BE IN THE SAME LANGUAGE AS THE INPUT TEXT." },
    type: { 
      type: Type.STRING, 
      enum: ["bar", "horizontalBar", "line", "pie", "area", "radar", "funnel", "radialBar"], 
      description: "The most appropriate chart type. Use 'radialBar' ONLY for percentage completion or single KPI scores (0-100)." 
    },
    xAxisLabel: { type: Type.STRING, description: "Label for the X axis (categories). MUST BE IN THE SAME LANGUAGE AS THE INPUT TEXT." },
    yAxisLabel: { type: Type.STRING, description: "Label for the Y axis (values). MUST BE IN THE SAME LANGUAGE AS THE INPUT TEXT." },
    color: { type: Type.STRING, description: "A hex color code relevant to the mood (e.g. #4F46E5)", nullable: true },
    data: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Category name or label. MUST BE IN THE SAME LANGUAGE AS THE INPUT TEXT." },
          value: { type: Type.NUMBER, description: "Numerical value" }
        },
        required: ["name", "value"]
      }
    }
  },
  required: ["title", "type", "data", "xAxisLabel", "yAxisLabel"]
};

const contentBlockSchema: Schema = {
  type: Type.ARRAY,
  description: "An array of content blocks representing the enhanced article.",
  items: {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, enum: ["text", "chart"] },
      content: { type: Type.STRING, description: "The text content for text blocks. Should be a logical paragraph or section." },
      chartConfig: chartConfigSchema
    },
    required: ["type"]
  }
};

export const analyzeArticle = async (text: string): Promise<ContentBlock[]> => {
  // Check cache first
  const cacheKey = text.trim();
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey)!;
  }

  // Access the API key directly from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert data editor and visualization specialist.
    Analyze the following article text. Your goal is to break the text into logical reading blocks and insert data visualizations ONLY where they add significant value.
    
    Instructions:
    1. Break the original text into 'text' blocks. Preserve the original writing style, content, AND LANGUAGE.
    2. Identify sections containing numerical data, comparisons, or trends.
    3. **BE CONSERVATIVE WITH CHARTS**: Do NOT create a chart for every single number. Only create a chart if there are at least 2-3 data points to compare, OR if there is a specific KPI percentage that needs highlighting.
    4. If a section has only one simple number (e.g., "Revenue was 5 million"), do NOT create a chart.
    5. Create a 'chart' block IMMEDIATELY following the text block that introduces the data.
    6. For 'chart' blocks, extract the data accurately and choose the best visualization type:
       - 'bar': Comparisons of distinct categories (e.g., Q1 vs Q2 vs Q3).
       - 'horizontalBar': Comparisons when category names are long.
       - 'line': Trends over time.
       - 'area': Volume trends over time.
       - 'pie': Parts of a whole (use sparingly, max 6 slices).
       - 'radar': Comparing performance across multiple variables or cyclical data.
       - 'funnel': Stages, processes, or conversion pipelines.
       - 'radialBar': Single percentage values (0-100%) or completion rates.
    7. CRITICAL: All labels, titles, descriptions, and category names in the chart config MUST be in the SAME LANGUAGE as the input text. If the input is Farsi, the chart labels must be Farsi.
    8. **LABELS**: Ensure 'name' properties in data are descriptive (e.g., "Q1 Revenue", not just "Value").
    
    Input Text:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: contentBlockSchema,
        temperature: 0.2, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");

    const rawBlocks = JSON.parse(jsonText) as any[];

    if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
        throw new Error("Analysis failed to generate valid blocks.");
    }

    // Add unique IDs for React rendering
    const processedBlocks = rawBlocks.map((block: any, index: number) => ({
      ...block,
      id: `block-${index}-${Date.now()}`
    }));

    // Save to cache
    analysisCache.set(cacheKey, processedBlocks);

    return processedBlocks;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Enhance error message for user
    if (error.message.includes("429")) {
        throw new Error("We're receiving too many requests. Please try again in a moment.");
    }
    throw new Error(error.message || "Failed to analyze article. Please try again.");
  }
};