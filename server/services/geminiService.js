import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate a Sales Objection Handling Report using Gemini
 * @param {Object} params - The inputs (product, industry, etc.)
 * @param {Array} trainingData - Array of relevant training documents
 * @returns {Promise<Object>} The generated report + tokens used
 */
export const generateReport = async (params, trainingData = []) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    let trainingContext = '';
    if (trainingData && trainingData.length > 0) {
      trainingContext = `\n\nAdditional Coaching Context (Training Data):\n`;
      trainingData.forEach((doc, idx) => {
        trainingContext += `--- Document ${idx + 1} (${doc.title}) ---\n${doc.content}\n`;
      });
    }

    const prompt = `You are the Sales Objections Handling Assistant, modeled after Manuj Bajaj.
Your goal is to provide deep insights on how to handle sales objections based on the following context.

Product: ${params.product}
Industry: ${params.industry}
Business Models: ${params.businessModels}
Deal Size: ${params.dealSize}
Buyer Profiles: ${params.buyerProfiles}
Additional Context: ${params.additionalContext || 'None'}
${trainingContext}

Please respond ONLY with a valid JSON object (do not wrap in markdown or include extra text) containing:
{
  "summary": "A brief summary of the sales landscape",
  "objections": [
    {
      "category": "String (e.g. Price, Trust)",
      "items": [
        {
          "objection": "The specific objection",
          "stab": "Initial empathetic response",
          "twist": "Reframe the objection",
          "six_klh_breakdown": "Breakdown using 6 KLH framework",
          "closing_offer_pitch": "Final pitch to close"
        }
      ]
    }
  ],
  "client_questions": [
    {
      "category": "String (e.g. Onboarding, ROI)",
      "items": [
        {
          "question": "The client's question",
          "why_they_ask": "Underlying reason",
          "power_answer_hint": "How to answer powerfully"
        }
      ]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to extract JSON from markdown if present
    let cleanJson = text;
    if (text.includes('\`\`\`json')) {
      cleanJson = text.split('\`\`\`json')[1].split('\`\`\`')[0].trim();
    } else if (text.includes('\`\`\`')) {
       cleanJson = text.split('\`\`\`')[1].split('\`\`\`')[0].trim();
    }
    
    const reportData = JSON.parse(cleanJson);
    const tokensUsed = response.usageMetadata?.totalTokenCount || 5000;

    return { reportData, tokensUsed };
  } catch (error) {
    console.error('Error in geminiService:', error);
    throw new Error('Failed to generate report from AI.');
  }
};
