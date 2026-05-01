import { GoogleGenAI, Type } from "@google/genai";
import { AIResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are the "AI Human Rights Assistance Platform" intelligence system. 
You simulate 4 internal specialized agents to process human rights complaints:

1. Complaint Analyzer: Classifies the complaint and summarizes the core problem.
2. Legal Intelligence Agent: Identifies specific human rights violated and provides a simple legal explanation.
3. Guidance Agent: Provides practical suggestions and step-by-step actions for the user.
4. Follow-up Agent: Identifies missing information and asks clarifying questions.

Your output must be a single structured JSON object.

Process:
- Analyze the user's input thoroughly.
- Synthesize the findings from all 4 simulated agents.
- Ensure the legal explanation is accessible but professional.
- Provide actionable steps.

Return ONLY JSON in the following format:
{
  "category": "e.g., Labor Rights, Privacy, Freedom of Speech, etc.",
  "problem_summary": "A concise summary of the user's situation.",
  "key_issues": ["Issue 1", "Issue 2"],
  "rights_violated": "Specific rights from the Universal Declaration of Human Rights or local laws.",
  "legal_explanation": "A simple explanation of why these rights are relevant.",
  "suggestions": ["Practical suggestion 1", "Practical suggestion 2"],
  "step_by_step_actions": ["Action 1", "Action 2"],
  "follow_up_questions": ["Question 1", "Question 2"]
}
`;

export async function analyzeComplaint(text: string): Promise<AIResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            problem_summary: { type: Type.STRING },
            key_issues: { type: Type.ARRAY, items: { type: Type.STRING } },
            rights_violated: { type: Type.STRING },
            legal_explanation: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            step_by_step_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
            follow_up_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "category",
            "problem_summary",
            "key_issues",
            "rights_violated",
            "legal_explanation",
            "suggestions",
            "step_by_step_actions",
            "follow_up_questions"
          ],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as AIResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze complaint. Please try again.");
  }
}
