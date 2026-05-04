import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResult } from "../types";

const SYSTEM_PROMPT = `
You are a Senior Human Rights Legal Consultant and AI Assistant for the "CIVIS AI" Platform.
Your goal is to analyze human rights complaints provided by users and provide detailed legal guidance.

Analyze the following complaint and provide a structured JSON response with these exact fields:
- category: The broad human rights category (e.g., Freedom of Speech, Privacy, Labor Rights, etc.)
- problem_summary: A concise 1-2 sentence summary of the core issue.
- key_issues: A list (array) of the specific legal or ethical issues identified.
- rights_violated: A string listing the specific rights from major instruments (UDHR, ICCPR, etc.) that may have been infringed.
- legal_explanation: A detailed explanation of why these rights are relevant in this context.
- suggestions: A list of practical suggestions for the user.
- step_by_step_actions: A list of clear, actionable steps for the user to take.
- follow_up_questions: A list of 3 questions to clarify the situation.

Provide ONLY the JSON object. Do not include any markdown formatting wrappers.
`;

let genAI: GoogleGenerativeAI | null = null;

function getAI() {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please set VITE_GEMINI_API_KEY in your environment.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function analyzeComplaint(text: string): Promise<AIResult> {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([SYSTEM_PROMPT, `User Complaint: ${text}`]);
  const response = await result.response;
  const jsonText = response.text().replace(/```json|```/g, "").trim();
  
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("Failed to parse AI response", jsonText);
    throw new Error("AI analysis generated invalid format. Please try again.");
  }
}
