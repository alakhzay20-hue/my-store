
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFullProduct = async (idea: string): Promise<Partial<Product>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك خبير مبيعات وتسويق لمتجر "علاء الخزاعي" (Alaa Al-Khuzai Marketplace) الفاخر لعام 2030، قم بابتكار منتج احترافي بناءً على هذه الفكرة: "${idea}". 
      يجب أن يكون الرد بتنسيق JSON حصراً ويحتوي على:
      - name: اسم تجاري جذاب ومحترف
      - price: سعر منطقي بالدولار (مثلاً 1,200 $)
      - description: وصف تسويقي يركز على الجودة والمميزات (3 جمل)
      - originStory: نبذة عن تقنية التصنيع أو تاريخ العلامة التجارية (جملتين)
      - category: إما "clothes" أو "treasury" أو "electronics" أو "art"
      - stockQuantity: كمية مخزون افتراضية (بين 5 و 50)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            price: { type: Type.STRING },
            description: { type: Type.STRING },
            originStory: { type: Type.STRING },
            category: { type: Type.STRING },
            stockQuantity: { type: Type.NUMBER },
          },
          required: ["name", "price", "description", "originStory", "category", "stockQuantity"],
        }
      }
    });
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return { name: idea, price: "99.99 $", description: "منتج متميز من تشكيلة علاء الخزاعي الحصرية.", category: 'treasury', stockQuantity: 10 };
  }
};

export const generateProductImage = async (productName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end professional studio product photography of ${productName}, minimalist clean background, soft commercial lighting, 8k resolution, elegant presentation for Alaa Al-Khuzai Luxury Collection.` }]
      },
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return `https://picsum.photos/seed/${productName}/800/800`;
  } catch (error) {
    return `https://picsum.photos/seed/${productName}/800/800`;
  }
};

export const generateBrandLogo = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end minimalist luxury monogram logo for 'AK' (Alaa Al-Khuzai), futuristic aesthetic, vector style, sleek geometric precision, metallic silver and electric neon green accents on deep obsidian black, symmetrical professional mark, isolated on solid black, 8k resolution.` }]
      },
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return '';
  } catch (error) {
    console.error("Logo Generation Error:", error);
    return '';
  }
};

export const generateBrandFavicon = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Ultra-minimalist favicon icon for 'AK', simple bold geometric mark, high contrast neon green on black, clear visibility at small scale, square format, professional app icon style.` }]
      },
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return '';
  } catch (error) {
    console.error("Favicon Generation Error:", error);
    return '';
  }
};

export const generateBrandHeroImage = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Cinematic brand visual identity image for 'Alaa Al-Khuzai Marketplace 2030'. Abstract high-tech luxury environment, soft flowing neon green energy lines, polished carbon fiber textures, depth of field, futuristic showroom atmosphere, professional lighting, 8k resolution, elegant and powerful.` }]
      },
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return '';
  } catch (error) {
    console.error("Hero Image Generation Error:", error);
    return '';
  }
};

export const createConciergeChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'أنت مساعد التسوق الذكي لمتجر علاء الخزاعي (Alaa Al-Khuzai Marketplace) لعام 2030. مهمتك هي مساعدة العملاء في اختيار أفضل المنتجات التي تناسب ذوقهم الراقي. تحدث بأسلوب مهني، عصري، ولبق باللغة العربية. قدم اقتراحات بناءً على احتياجاتهم.',
      tools: [{ googleSearch: {} }]
    }
  });
};
