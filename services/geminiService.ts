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
      competitionLevel: { type: Type.STRING },
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
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY is missing. Please set it in Vercel Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const count = userStatus === 'pro' ? 20 : 10;

  const prompt = `
    Act as a world-class AI Business Idea Generation Engine.
    User Status: ${userStatus}
    Generate EXACTLY ${count} unique, high-potential business ideas for: ${selectedCategories.join(", ")}.
    
    User Profile: Budget ${prefs.budget}, Skill ${prefs.skillLevel}, Commitment ${prefs.timeAvailability}, Location ${prefs.geography}.
    
    CRITICAL INSTRUCTIONS:
    1. If user_status is "pro", you MUST generate detailed execution plans (Canvas, GTM, Pricing, 30-60-90 Roadmap, Tool Stacks).
    2. If user_status is "guest" or "logged_in_free", provide useful but less detailed execution details.
    3. Ensure ideas are innovative for 2025 and scannable for mobile.
    4. Provide localized tool stack examples (e.g. Razorpay for payments if location is India).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: BUSINESS_IDEA_SCHEMA,
      },
    });

    const results = JSON.parse(response.text || "[]");
    return results.slice(0, count).map((item: any, index: number) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9) + index,
    }));
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate ideas. The AI engine might be busy.");
  }
}