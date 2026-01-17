import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, BusinessIdea, UserStatus } from "../types";

const BUSINESS_IDEA_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      businessName: { type: Type.STRING },
      category: { type: Type.STRING },
      subcategory: { type: Type.STRING },
      problemStatement: { type: Type.STRING },
      uniqueValueProposition: { type: Type.STRING },
      targetCustomers: { type: Type.STRING },
      revenueModel: { type: Type.STRING },
      estimatedStartupCost: { type: Type.STRING },
      profitPotential: { type: Type.STRING },
      scalabilityLevel: { type: Type.STRING },
      aiAutomationUsage: { type: Type.STRING },
      competitiveAdvantage: { type: Type.STRING },
      whyWorkIn2025: { type: Type.STRING },
      
      marketDemandScore: { type: Type.NUMBER },
      competitionLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
      executionDifficulty: { type: Type.NUMBER },
      riskScore: { type: Type.NUMBER },
      
      businessModelCanvas: {
        type: Type.OBJECT,
        properties: {
          customerSegments: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          channels: { type: Type.STRING },
          customerRelationships: { type: Type.STRING },
          revenueStreams: { type: Type.STRING },
          keyActivities: { type: Type.STRING },
          keyResources: { type: Type.STRING },
          keyPartners: { type: Type.STRING },
          costStructure: { type: Type.STRING },
        }
      },
      gtmStrategy: { type: Type.STRING },
      pricingStrategy: { type: Type.STRING },
      roadmap: {
        type: Type.OBJECT,
        properties: {
          day30: { type: Type.STRING },
          day60: { type: Type.STRING },
          day90: { type: Type.STRING },
        }
      },
      toolStack: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            tools: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      },
      mentorInsight: {
        type: Type.OBJECT,
        properties: {
          mistakeToAvoid: { type: Type.STRING },
          growthLever: { type: Type.STRING },
          unfairAdvantage: { type: Type.STRING }
        }
      }
    },
    required: [
      "businessName", "category", "subcategory", "problemStatement", 
      "uniqueValueProposition", "targetCustomers", "revenueModel",
      "estimatedStartupCost", "profitPotential", "scalabilityLevel",
      "aiAutomationUsage", "competitiveAdvantage", "whyWorkIn2025"
    ],
  },
};

export async function generateBusinessIdeas(
  prefs: UserPreferences,
  selectedCategories: string[],
  userStatus: UserStatus
): Promise<BusinessIdea[]> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "API_KEY") {
    throw new Error("Missing API_KEY. Ensure your Gemini API Key is added to Vercel Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const count = userStatus === 'pro' ? 12 : 6;

  const prompt = `
    Act as a world-class Startup Generator and Market Analyst.
    Task: Generate ${count} disruptive business ideas for: ${selectedCategories.join(", ")}.
    
    Context:
    - User Profile: Budget: ${prefs.budget}, Skills: ${prefs.skillLevel}, Time: ${prefs.timeAvailability}, Location: ${prefs.geography}.
    - Model: 2025 Trends & Market Gaps.
    
    If user_status is 'pro', provide deep execution details (Canvas, GTM, Roadmap).
    Focus on practical, high-demand ideas that solve real friction in 2025.
  `;

  try {
    const config: any = {
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: BUSINESS_IDEA_SCHEMA,
      },
    };

    // Use Search Grounding for better Market Analysis if Pro
    if (userStatus === 'pro') {
      config.config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent(config);

    if (!response.text) {
      throw new Error("Empty response from AI engine.");
    }

    const results = JSON.parse(response.text);
    return results.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    }));
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment or upgrade your Google AI Studio quota.");
    }
    if (error.status === 401 || error.status === 403) {
      throw new Error("Invalid API Key. Please verify the API_KEY in your Vercel project settings.");
    }
    
    throw new Error(error.message || "The AI engine is currently under high load. Please try again in 30 seconds.");
  }
}