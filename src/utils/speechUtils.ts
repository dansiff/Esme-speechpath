import { Language } from '../types';

export const speakText = (text: string, language: Language = Language.ENGLISH) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const langCode = language === Language.SPANISH ? 'es-ES' : 'en-US';
  utterance.lang = langCode;

  // Try to find a female voice
  const voices = window.speechSynthesis.getVoices();
  
  // Common female voice names across different browsers/OS
  const femaleKeywords = ['female', 'samantha', 'victoria', 'monica', 'google us english', 'google español', 'helena', 'zira'];
  
  const femaleVoice = voices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    return lang.startsWith(langCode.split('-')[0]) && 
           femaleKeywords.some(keyword => name.includes(keyword));
  });

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  window.speechSynthesis.speak(utterance);
};
