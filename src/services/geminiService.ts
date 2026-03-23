import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSpeech(
  targetWord: string,
  transcription: string,
  language: Language
): Promise<{ score: number; feedback: string }> {
  const prompt = `
    You are a speech-language pathologist.
    Target word/phrase: "${targetWord}"
    User's attempt (transcription): "${transcription}"
    Language: ${language === Language.ENGLISH ? "English" : "Spanish"}

    Evaluate the attempt on a scale of 0-100.
    Provide constructive, encouraging feedback for a child.
    Return the response in JSON format with "score" (number) and "feedback" (string).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      score: result.score ?? 0,
      feedback: result.feedback ?? "Great effort! Let's try again.",
    };
  } catch (error) {
    console.error("Speech analysis error:", error);
    return { score: 0, feedback: "I couldn't hear that clearly. Try again!" };
  }
}
