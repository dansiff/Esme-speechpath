import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StoryPage, Language, Difficulty } from "../types";
import { handleError, ErrorType } from "../utils/errorHandler";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateWordAudio(word: string): Promise<string | undefined> {
  // To use your own custom sound samples, place them in /public/sounds/words/
  // and name them exactly as the word (lowercase), e.g., /public/sounds/words/rabbit.mp3
  const localPath = `/sounds/words/${word.toLowerCase()}.mp3`;
  
  try {
    // We can't easily check file existence on the client without a fetch
    // So we'll try to fetch the local file first
    const checkLocal = await fetch(localPath, { method: 'HEAD' });
    if (checkLocal.ok) {
      return localPath;
    }
  } catch (e) {
    // Local file not found, proceed to AI generation
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${word}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      // Check if the response is already encoded (e.g., has a WAV or MP3 header)
      // Gemini TTS usually returns raw PCM, but it's good to be safe.
      const binaryPrefix = atob(base64Audio.slice(0, 32));
      if (binaryPrefix.includes('RIFF') || binaryPrefix.includes('ID3') || binaryPrefix.includes('\xFF\xFB')) {
        return `data:audio/mp3;base64,${base64Audio}`;
      }
      
      // Gemini TTS returns raw PCM (16-bit, mono, 24kHz).
      // We need to wrap it in a WAV header for the browser to play it.
      return pcmToWav(base64Audio, 24000);
    }
  } catch (error) {
    handleError(error, ErrorType.AI_API);
  }
  return undefined;
}

/**
 * Wraps raw PCM data in a WAV header.
 */
function pcmToWav(pcmBase64: string, sampleRate: number = 24000): string {
  const binary = atob(pcmBase64);
  const len = binary.length;
  const buffer = new ArrayBuffer(44 + len);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  // file length
  view.setUint32(4, 36 + len, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (1 is PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sampleRate * numChannels * bitsPerSample/8)
  view.setUint32(28, sampleRate * 2, true);
  // block align (numChannels * bitsPerSample/8)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  // data chunk length
  view.setUint32(40, len, true);

  // write PCM data
  for (let i = 0; i < len; i++) {
    view.setUint8(44 + i, binary.charCodeAt(i));
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

async function generatePageImage(text: string, topic: string): Promise<string> {
  try {
    const prompt = `A child-friendly, colorful, and simple illustration for a story page. 
    Topic: ${topic}
    Scene: ${text}
    Style: Vibrant, clear, and engaging for kids. No text in the image.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "3:2",
        },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    
    // Fallback to picsum if image generation fails
    return `https://picsum.photos/seed/${Math.random()}/600/400`;
  } catch (error) {
    handleError(error, ErrorType.AI_API);
    return `https://picsum.photos/seed/${Math.random()}/600/400`;
  }
}

export async function enrichStoryWithImages(story: StoryPage[], topic: string): Promise<StoryPage[]> {
  return await Promise.all(
    story.map(async (page) => {
      if (page.imageUrl) return page;
      const imageUrl = await generatePageImage(page.text, topic);
      return {
        ...page,
        imageUrl
      };
    })
  );
}

export async function enrichStoryWithAudio(story: StoryPage[]): Promise<StoryPage[]> {
  return await Promise.all(
    story.map(async (page) => {
      if (!page.interactiveWords) return page;
      
      const enrichedWords = await Promise.all(
        page.interactiveWords.map(async (word) => {
          if (word.audioUrl) return word;
          const audioUrl = await generateWordAudio(word.word);
          return { ...word, audioUrl };
        })
      );

      return {
        ...page,
        interactiveWords: enrichedWords
      };
    })
  );
}

export async function generateStory(
  topic: string,
  language: Language,
  difficulty: Difficulty
): Promise<{ title: string; description: string; story: StoryPage[] }> {
  const model = "gemini-3-flash-preview";

  const prompt = `Generate a short story for children for speech therapy.
Topic: ${topic}
Language: ${language === Language.ENGLISH ? "English" : "Spanish"}
Difficulty: ${difficulty}

The story should have 3 to 5 pages. Each page should have:
1. text: A short sentence or two.
2. interactiveWords: A list of 1-3 key words from the text. For each word, provide a simple definition and an animation type ('bounce', 'shake', or 'pulse').

Return the result as a JSON object with:
- title: A catchy title for the story.
- description: A brief summary of the story.
- story: An array of StoryPage objects. Each object should have 'text' and 'interactiveWords'.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            story: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  interactiveWords: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        word: { type: Type.STRING },
                        definition: { type: Type.STRING },
                        animation: { 
                          type: Type.STRING,
                          enum: ['bounce', 'shake', 'pulse']
                        }
                      },
                      required: ["word", "definition"]
                    }
                  }
                },
                required: ["text"]
              }
            }
          },
          required: ["title", "description", "story"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Generate real AI images for each story page in parallel
    const storyWithImages = await enrichStoryWithImages(result.story, topic);
    const storyWithAudio = await enrichStoryWithAudio(storyWithImages);

    return {
      title: result.title,
      description: result.description,
      story: storyWithAudio
    };
  } catch (error) {
    handleError(error, ErrorType.AI_API);
    throw error;
  }
}

export async function translateStoryPage(text: string): Promise<string | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following children's story text into Spanish: "${text}"`,
    });
    return response.text;
  } catch (error) {
    handleError(error, ErrorType.AI_API);
  }
  return undefined;
}
