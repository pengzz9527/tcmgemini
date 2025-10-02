import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import type { Constitution, Season, DietaryPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * A robust wrapper for Gemini API calls with exponential backoff.
 * This function will retry the API call if it fails with a rate-limit error.
 * @param apiCall The function that makes the actual API call.
 * @param maxRetries The maximum number of times to retry.
 * @returns The response from the API call.
 */
async function callGeminiWithRetry(
  apiCall: () => Promise<GenerateContentResponse>, 
  maxRetries = 3
): Promise<GenerateContentResponse> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      // Check for rate limit / resource exhausted errors by inspecting the error message.
      const errorMessage = JSON.stringify(error).toLowerCase();
      const isRateLimitError = errorMessage.includes('429') || errorMessage.includes('resource_exhausted');
      
      if (isRateLimitError && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
        console.warn(`Gemini API rate limit exceeded. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error("Non-retryable error or max retries reached.", error);
        throw error; // Re-throw the last error if not retryable or retries exhausted
      }
    }
  }
  throw lastError; // Should be captured and thrown inside the loop, but as a fallback.
}

const dietPlanSchema = {
  type: Type.OBJECT,
  properties: {
    generalAdvice: {
      type: Type.STRING,
      description: '针对该体质和季节的总体饮食原则和建议，2-3句话。',
    },
    recommendedFoods: {
      type: Type.ARRAY,
      description: '推荐的食材列表，大约5-8项。',
      items: { type: Type.STRING },
    },
    avoidFoods: {
      type: Type.ARRAY,
      description: '需要避免或少吃的食材列表，大约5-8项。',
      items: { type: Type.STRING },
    },
    sampleRecipes: {
      type: Type.ARRAY,
      description: '2个适合的简单食谱。',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: '菜谱名称' },
          ingredients: {
            type: Type.ARRAY,
            description: '所需食材列表',
            items: { type: Type.STRING },
          },
          instructions: { type: Type.STRING, description: '简单的制作步骤' },
        },
        required: ['name', 'ingredients', 'instructions'],
      },
    },
  },
  required: ['generalAdvice', 'recommendedFoods', 'avoidFoods', 'sampleRecipes'],
};

export const generateDietaryPlan = async (constitution: Constitution, season: Season): Promise<DietaryPlan> => {
  const prompt = `你是一位精通中医养生学和营养学的专家。请根据用户的体质和当前季节，为他们生成一份个性化、详细且易于执行的饮食调理建议。

体质: ${constitution}
季节: ${season}

请严格按照提供的JSON格式返回你的建议。`;

  try {
    const apiCall = () => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: dietPlanSchema,
        temperature: 0.7,
      },
    });

    const textResponse = await callGeminiWithRetry(apiCall);
    const jsonText = textResponse.text.trim();
    const plan = JSON.parse(jsonText) as DietaryPlan;
    return plan;

  } catch (error) {
    console.error('Error generating dietary plan after retries:', error);
    throw new Error('Failed to generate dietary plan from Gemini API.');
  }
};


export const determineConstitution = async (answers: Record<string, string>): Promise<Constitution> => {
  const formattedAnswers = Object.entries(answers)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  const prompt = `你是一位经验丰富的中医师。请根据用户对一份健康问卷的回答，判断他们最可能属于哪一种中医体质。

用户的回答如下：
${formattedAnswers}

请从以下列表中选择最匹配的一种体质，并仅返回该体质的全名（包含中文和英文）。
- 平和质 (Balanced)
- 气虚质 (Qi-Deficient)
- 阳虚质 (Yang-Deficient)
- 阴虚质 (Yin-Deficient)
- 痰湿质 (Phlegm-Dampness)
- 湿热质 (Damp-Heat)
- 血瘀质 (Blood Stasis)
- 气郁质 (Qi Stagnation)
- 特禀质 (Allergic)

你的回答必须严格遵循格式，例如："气虚质 (Qi-Deficient)"。不要包含任何解释、前言或额外的文字。`;

  try {
    const apiCall = () => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });
    
    const response = await callGeminiWithRetry(apiCall);
    const resultText = response.text.trim();
    const knownConstitutions = [
      '平和质 (Balanced)', '气虚质 (Qi-Deficient)', '阳虚质 (Yang-Deficient)', '阴虚质 (Yin-Deficient)',
      '痰湿质 (Phlegm-Dampness)', '湿热质 (Damp-Heat)', '血瘀质 (Blood Stasis)', '气郁质 (Qi Stagnation)', '特禀质 (Allergic)'
    ];

    if (knownConstitutions.includes(resultText)) {
      return resultText as Constitution;
    } else {
      console.warn('Gemini returned an unexpected constitution format:', resultText);
      throw new Error('无法识别返回的体质类型。');
    }
  } catch (error) {
    console.error('Error determining constitution after retries:', error);
    throw new Error('体质分析失败，请稍后重试。');
  }
};