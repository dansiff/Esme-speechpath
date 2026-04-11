import { Language, Difficulty, Exercise } from "../types";

export function pseudoAnalyze(
  exercise: Exercise,
  audioBlob: Blob
): { score: number; feedback: string } {
  // In a real local-first app, we might use a small WASM-based phonetic engine.
  // Here, we'll simulate it by checking the audio duration vs expected duration.
  const expectedDuration = (exercise.targetWord?.length || 5) * 0.2; // roughly 0.2s per char
  const actualDuration = audioBlob.size / 32000; // very rough estimate for wav
  
  let score = 70; // base score for trying
  
  // Add some randomness but biased towards "good" if duration is reasonable
  const durationRatio = Math.min(actualDuration / expectedDuration, expectedDuration / actualDuration);
  score += Math.floor(durationRatio * 20);
  score += Math.floor(Math.random() * 10);
  
  score = Math.min(100, Math.max(0, score));
  
  return {
    score,
    feedback: generateLocalFeedback(exercise, score)
  };
}

export function generateLocalFeedback(
  exercise: Exercise,
  score: number
): string {
  const { targetWord, pronunciationGuide, language } = exercise;
  const isEnglish = language === Language.ENGLISH;

  if (score >= 90) {
    const praises = isEnglish 
      ? ["Perfect!", "Outstanding!", "You nailed it!", "Amazing pronunciation!"]
      : ["¡Perfecto!", "¡Excelente!", "¡Lo lograste!", "¡Pronunciación increíble!"];
    return praises[Math.floor(Math.random() * praises.length)];
  }

  if (score >= 70) {
    const encouragements = isEnglish
      ? ["So close! Try one more time.", "Great effort! Almost there.", "You're doing great! Keep practicing."]
      : ["¡Casi lo tienes! Intenta una vez más.", "¡Buen esfuerzo! Ya casi está.", "¡Lo estás haciendo muy bien! Sigue practicando."];
    
    let tip = "";
    if (pronunciationGuide?.tip) {
      tip = ` ${pronunciationGuide.tip}`;
    } else if (pronunciationGuide?.mouthPosition) {
      tip = isEnglish 
        ? ` Remember: ${pronunciationGuide.mouthPosition}`
        : ` Recuerda: ${pronunciationGuide.mouthPosition}`;
    }

    return encouragements[Math.floor(Math.random() * encouragements.length)] + tip;
  }

  const tips = isEnglish
    ? ["Let's try again slowly.", "Listen carefully and try once more.", "You can do it! Focus on the sound."]
    : ["Intentémoslo de nuevo despacio.", "Escucha con atención e inténtalo una vez más.", "¡Tú puedes! Concéntrate en el sonido."];

  let specificTip = "";
  if (pronunciationGuide?.tonguePlacement) {
    specificTip = isEnglish
      ? ` Try to place your tongue: ${pronunciationGuide.tonguePlacement}`
      : ` Intenta colocar tu lengua: ${pronunciationGuide.tonguePlacement}`;
  }

  return tips[Math.floor(Math.random() * tips.length)] + specificTip;
}
