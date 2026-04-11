import { GoogleGenAI } from "@google/genai";
import { Language, Difficulty } from "../types";
import { handleError, ErrorType } from "../utils/errorHandler";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SpeechAnalysisResult {
  score: number;
  accuracy: number;
  fluency: number;
  pronunciation: number;
  feedback: string;
  isPerfect: boolean;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function analyzeSpeech(
  audioBlob: Blob,
  targetWord: string,
  language: Language,
  difficulty: Difficulty,
  targetSentence?: string,
  mouthPosition?: string,
  tonguePlacement?: string
): Promise<SpeechAnalysisResult> {
  try {
    // Edge case: Empty audio blob
    if (audioBlob.size < 100) {
      throw new Error('empty audio: The recorded audio is too short or silent.');
    }

    const base64Audio = await blobToBase64(audioBlob);

    const prompt = `
      You are a professional Speech-Language Pathologist (SLP).
      Analyze this audio recording for the target: "${targetWord}" ${targetSentence ? `(within the sentence: "${targetSentence}")` : ""}.
      
      Language: ${language === Language.ENGLISH ? "English" : "Spanish"}
      Difficulty Level: ${difficulty}
      
      Provide a detailed, data-driven assessment:
      1. Overall Score (0-100)
      2. Accuracy (0-100): Phonetic precision.
      3. Fluency (0-100): Rhythm and flow.
      4. Pronunciation (0-100): Clarity of vowels and consonants.
      5. Feedback: Encouraging but technically precise for a child.
      
      ${mouthPosition ? `Mouth Position Tip: ${mouthPosition}` : ""}
      ${tonguePlacement ? `Tongue Placement Tip: ${tonguePlacement}` : ""}
      
      CRITICAL EDGE CASE HANDLING:
      - If the audio is silent or contains only background noise, set all scores to 0 and feedback to "I couldn't hear you! Make sure your mic is close and try again."
      - If the user said something completely different from the target (mismatch), set accuracy to below 20 and feedback to "That sounded like a different word! Let's try to say '${targetWord}' again."
      - If the user only said part of the target (partial transcription), set fluency lower and provide specific feedback on the missing sounds.
      - If the score is below 90, reference the mouth/tongue tips in your feedback.
      
      Return ONLY a JSON object:
      {
        "score": number,
        "accuracy": number,
        "fluency": number,
        "pronunciation": number,
        "feedback": string,
        "isPerfect": boolean
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "audio/wav",
                data: base64Audio
              }
            },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    const parsed = JSON.parse(text || "{}");
    
    return {
      score: parsed.score ?? 0,
      accuracy: parsed.accuracy ?? 0,
      fluency: parsed.fluency ?? 0,
      pronunciation: parsed.pronunciation ?? 0,
      feedback: parsed.feedback ?? "Great effort!",
      isPerfect: (parsed.score ?? 0) >= 95
    };
  } catch (error) {
    handleError(error, ErrorType.AI_API);
    return { 
      score: 0, 
      accuracy: 0, 
      fluency: 0, 
      pronunciation: 0, 
      feedback: "I couldn't hear that clearly. Try again!",
      isPerfect: false
    };
  }
}
