import { GoogleGenAI, Modality, Type, GenerateContentParameters } from "@google/genai";

// FIX: ResponseSchema is not an exported member of @google/genai.
// A compatible interface is defined locally to maintain type safety.
interface ResponseSchema {
    type: Type;
    format?: string;
    description?: string;
    nullable?: boolean;
    enum?: string[];
    properties?: {
        [key: string]: ResponseSchema;
    };
    required?: string[];
    items?: ResponseSchema;
    propertyOrdering?: string[];
}


const getAiInstance = () => {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY is not defined in environment variables");
    }
    return new GoogleGenAI({ apiKey: API_KEY });
}


export interface Trend {
  name: string;
  description: string;
  keywords: string[];
  predictionScore: number;
  rationale: string;
}

export interface Selections {
  [key: string]: string;
}

export interface FashionDna {
  archetype: string;
  description:string;
}

export interface ClothingItemTags {
  itemName: string;
  season: string;
  color: string;
  occasion: string;
}

// Private helper for image generation
const _generateContentWithImageResponse = async (contents: GenerateContentParameters['contents']): Promise<string> => {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in the API response.");
};

// Private helper for JSON generation
const _generateContentWithJsonResponse = async <T>(contents: GenerateContentParameters['contents'], responseSchema: ResponseSchema): Promise<T> => {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      }
    });
    
    return JSON.parse(response.text) as T;
};


export const generateOutfit = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `A high-resolution, full-body photograph of a fashion model showcasing an outfit. The style is minimal, clean, and modern, reflecting a luxury aesthetic. The model is standing against a plain, neutral background (light gray or cream). The outfit is: ${prompt}`;
    return await _generateContentWithImageResponse({ parts: [{ text: fullPrompt }] });
  } catch (error) {
    console.error("Error generating outfit with Gemini:", error);
    throw new Error("Failed to generate image from the AI service.");
  }
};

export const styleByMood = async (mood: string): Promise<string> => {
    try {
        const fullPrompt = `Generate a high-resolution, full-body photograph of a fashion model showcasing an outfit that perfectly embodies the mood: '${mood}'. The style should be minimal, clean, and modern, reflecting a luxury aesthetic. The model is standing against a plain, neutral background (light gray or cream).`;
        return await _generateContentWithImageResponse({ parts: [{ text: fullPrompt }] });
    } catch (error) {
        console.error("Error styling by mood with Gemini:", error);
        throw new Error("Failed to generate mood-based image from the AI service.");
    }
};

export const fetchTrends = async (): Promise<Trend[]> => {
    const prompt = `
      Analyze the current digital landscape (social media, fashion blogs, subcultures) and identify 3 emerging, niche fashion trends that have high potential to become mainstream. 
      For each trend, provide:
      - A catchy name.
      - A concise description (2-3 sentences).
      - A list of 3-5 keywords.
      - A prediction score (0-100) for its mainstream potential.
      - A brief rationale for the score.
      Return the data as a JSON array.
    `;
    const responseSchema: ResponseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                predictionScore: { type: Type.INTEGER },
                rationale: { type: Type.STRING },
            },
            required: ["name", "description", "keywords", "predictionScore", "rationale"],
        },
    };
    return await _generateContentWithJsonResponse<Trend[]>(prompt, responseSchema);
};

export const generateFashionDna = async (selections: Selections): Promise<FashionDna> => {
    const prompt = `
      Based on the following user selections, define their fashion style archetype.
      Selections: ${JSON.stringify(selections, null, 2)}
      Provide a creative, single-word or two-word archetype name and a short, insightful description (2-3 sentences) that captures the essence of this style.
      Return the data as a JSON object.
    `;
    const responseSchema: ResponseSchema = {
        type: Type.OBJECT,
        properties: {
            archetype: { type: Type.STRING },
            description: { type: Type.STRING },
        },
        required: ["archetype", "description"],
    };
    return await _generateContentWithJsonResponse<FashionDna>(prompt, responseSchema);
};

export const virtualTryOn = async (base64ImageData: string, mimeType: string, clothingPrompt: string): Promise<string> => {
    try {
        const contents: GenerateContentParameters['contents'] = {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: `Using the person in this image as a model, realistically replace their current clothes with this described outfit: "${clothingPrompt}". Preserve the model's body, pose, and the background. The new clothing should fit naturally.`,
                },
            ],
        };
        return await _generateContentWithImageResponse(contents);
    } catch (error) {
        console.error("Error with virtual try-on:", error);
        throw new Error("Failed to perform the virtual try-on.");
    }
};

export const createAvatar = async (base64ImageData: string, mimeType: string): Promise<string> => {
    try {
        const contents: GenerateContentParameters['contents'] = {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: `Create a stylized, modern 3D-style avatar of the person in this image. The avatar should have a clean, polished, and slightly futuristic aesthetic, suitable for a digital fashion platform. Focus on capturing the key facial features and hairstyle in this new artistic style. The background should be a simple, neutral gradient.`,
                },
            ],
        };
        return await _generateContentWithImageResponse(contents);
    } catch (error) {
        console.error("Error creating avatar:", error);
        throw new Error("Failed to create the avatar.");
    }
};

export const analyzeClothingItem = async (base64ImageData: string, mimeType: string): Promise<ClothingItemTags> => {
    try {
        const contents: GenerateContentParameters['contents'] = {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: `Analyze the clothing item in this image. The item is presented on a plain background. Identify its type, primary color, most suitable season, and the ideal occasion for wearing it. Provide a concise, one-to-three word answer for each category.
                    Example: { "itemName": "Denim Jacket", "season": "All-Season", "color": "Light Blue", "occasion": "Casual Outing" }`,
                },
            ],
        };
        const responseSchema: ResponseSchema = {
            type: Type.OBJECT,
            properties: {
                itemName: { type: Type.STRING, description: "The name of the clothing item (e.g., 'Wool Sweater')." },
                season: { type: Type.STRING, description: "The best season to wear it (e.g., 'Fall/Winter')." },
                color: { type: Type.STRING, description: "The dominant color of the item (e.g., 'Cream')." },
                occasion: { type: Type.STRING, description: "A suitable occasion (e.g., 'Office Wear')." },
            },
            required: ["itemName", "season", "color", "occasion"],
        };
        return await _generateContentWithJsonResponse<ClothingItemTags>(contents, responseSchema);
    } catch (error) {
        console.error("Error analyzing clothing item:", error);
        throw new Error("Failed to analyze the clothing item.");
    }
};