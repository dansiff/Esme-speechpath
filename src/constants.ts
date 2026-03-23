import { Exercise, Language, ExerciseType } from "./types";

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    title: 'The Letter R / La Letra R',
    description: 'Practice the "R" sound in English and Spanish.',
    language: Language.ENGLISH,
    type: ExerciseType.ARTICULATION,
    targetWord: 'Rabbit',
    imageUrl: 'https://picsum.photos/seed/rabbit/400/300',
    isPremium: false,
  },
  {
    id: '2',
    title: 'Colors / Colores',
    description: 'Learn basic colors in both languages.',
    language: Language.SPANISH,
    type: ExerciseType.VOCABULARY,
    targetWord: 'Azul',
    imageUrl: 'https://picsum.photos/seed/blue/400/300',
    isPremium: false,
  },
  {
    id: '3',
    title: 'Complex Sentences',
    description: 'Advanced phrasing for fluent speakers.',
    language: Language.ENGLISH,
    type: ExerciseType.PHRASING,
    targetWord: 'The quick brown fox jumps over the lazy dog.',
    imageUrl: 'https://picsum.photos/seed/fox/400/300',
    isPremium: true,
  },
];
