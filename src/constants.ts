import { Exercise, Language, ExerciseType, Difficulty } from "./types";

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    title: 'The Letter R / La Letra R',
    description: 'Practice the "R" sound in English and Spanish.',
    language: Language.ENGLISH,
    type: ExerciseType.ARTICULATION,
    difficulty: Difficulty.EASY,
    targetWord: 'Rabbit',
    imageUrl: '/images/exercises/rabbit.png', // Place your image in /public/images/exercises/rabbit.png
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open, lips rounded.',
      tonguePlacement: 'Tip of the tongue curled up towards the roof of the mouth, but not touching.',
      tip: 'Try to make a "growl" sound like a small bear!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-r-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-r-diagram/200/200',
      tipAudioUrl: ''
    },
    isolationActivity: 'Say "rrrrr" like a racing car engine!',
    handCue: 'Move your hand in a circular motion like a wheel.',
    pictureCue: 'https://picsum.photos/seed/racing/400/300?blur=2',
    letterCue: {
      letter: 'R',
      description: 'The "R" is like a curvy road for your tongue!'
    },
    syllables: ['ra', 'bbit'],
    spinningSyllables: [['ra', 'ba', 'ca'], ['bbit', 't', 'p']],
  },
  {
    id: '2',
    title: 'Colors / Colores',
    description: 'Learn basic colors in both languages.',
    language: Language.SPANISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Azul',
    imageUrl: 'https://picsum.photos/seed/blue/400/300',
    category: 'Vocabulary',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Relaxed, slightly open.',
      tonguePlacement: 'For the "Z" sound in Spanish (Castilian), place the tip of your tongue between your teeth.',
      tip: 'Imagine you are saying "th" in English "think".',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-z-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-z-diagram/200/200',
      mouthAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      tongueAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    isolationActivity: 'Practice the "th" sound by blowing air gently.',
    handCue: 'Place your hand flat in front of your mouth to feel the air.',
    pictureCue: 'https://picsum.photos/seed/sky/400/300?blur=2',
    letterCue: {
      letter: 'Z',
      description: 'The "Z" is like a zig-zag path for the air!'
    },
    syllables: ['a', 'zul'],
    spinningSyllables: [['a', 'e', 'i'], ['zul', 'sol', 'cal']],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Complex Sentences',
    description: 'Advanced phrasing for fluent speakers.',
    language: Language.ENGLISH,
    type: ExerciseType.PHRASING,
    difficulty: Difficulty.HARD,
    targetWord: 'The quick brown fox jumps over the lazy dog.',
    imageUrl: 'https://picsum.photos/seed/fox/400/300',
    category: 'Phrasing',
    isPremium: true,
    pronunciationGuide: {
      mouthPosition: 'Varies as you speak the sentence.',
      tonguePlacement: 'Focus on the "th" in "The" - tip of tongue behind upper teeth.',
      tip: 'Keep a steady rhythm and don\'t rush!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-th-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-th-diagram/200/200'
    },
    isolationActivity: 'Practice the "th" sound in "The" repeatedly.',
    handCue: 'Tap your fingers to the rhythm of the sentence.',
    pictureCue: 'https://picsum.photos/seed/forest/400/300?blur=2',
    letterCue: {
      letter: 'Th',
      description: 'The "T" and "H" are best friends that make a new sound!'
    },
    syllables: ['the', 'quick', 'brown', 'fox'],
    spinningSyllables: [['the', 'a', 'this'], ['quick', 'fast', 'slow'], ['brown', 'red', 'blue']],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 'verb-1',
    title: 'Action Verbs: Jumping',
    description: 'Identify and practice the action "Jumping".',
    language: Language.ENGLISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.EASY,
    targetWord: 'Jumping',
    imageUrl: 'https://picsum.photos/seed/jumping/400/300',
    category: 'Verbs',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Start with rounded lips for "J".',
      tonguePlacement: 'Tip of tongue touches the roof of the mouth for "J".',
      tip: 'Say it with a little hop!',
    },
    isolationActivity: 'Jump up and down while saying "Jump!"',
    pictureCue: 'https://picsum.photos/seed/jump-action/400/300',
  },
  {
    id: 'verb-2',
    title: 'Action Verbs: Running',
    description: 'Identify and practice the action "Running".',
    language: Language.ENGLISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.EASY,
    targetWord: 'Running',
    imageUrl: 'https://picsum.photos/seed/running/400/300',
    category: 'Verbs',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Lips slightly rounded for "R".',
      tonguePlacement: 'Tip of tongue curled back for "R".',
      tip: 'Imagine you are racing!',
    },
    isolationActivity: 'Run in place while saying "Run!"',
    pictureCue: 'https://picsum.photos/seed/run-action/400/300',
  },
  {
    id: 'body-1',
    title: 'Body Parts: Head',
    description: 'Identify and label your "Head".',
    language: Language.ENGLISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.EASY,
    targetWord: 'Head',
    imageUrl: 'https://picsum.photos/seed/head/400/300',
    category: 'Body Parts',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Start with mouth open for "H".',
      tonguePlacement: 'Tongue is flat for "H".',
      tip: 'Touch your head when you say it!',
    },
    isolationActivity: 'Point to your head and say "Head".',
    pictureCue: 'https://picsum.photos/seed/human-head/400/300',
  },
  {
    id: 'body-2',
    title: 'Body Parts: Shoulders',
    description: 'Identify and label your "Shoulders".',
    language: Language.ENGLISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.EASY,
    targetWord: 'Shoulders',
    imageUrl: 'https://picsum.photos/seed/shoulders/400/300',
    category: 'Body Parts',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Lips rounded for "Sh".',
      tonguePlacement: 'Sides of tongue touch upper teeth for "Sh".',
      tip: 'Shrug your shoulders!',
    },
    isolationActivity: 'Touch your shoulders and say "Shoulders".',
    pictureCue: 'https://picsum.photos/seed/human-shoulders/400/300',
  },
  {
    id: 'clothing-1',
    title: 'Clothing: Shirt',
    description: 'Identify and label a "Shirt".',
    language: Language.ENGLISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.EASY,
    targetWord: 'Shirt',
    imageUrl: 'https://picsum.photos/seed/shirt/400/300',
    category: 'Clothing',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Lips rounded for "Sh".',
      tonguePlacement: 'Sides of tongue touch upper teeth for "Sh".',
      tip: 'Point to your shirt!',
    },
    isolationActivity: 'Touch your shirt and say "Shirt".',
    pictureCue: 'https://picsum.photos/seed/tshirt/400/300',
  },
  {
    id: 'clothing-2',
    title: 'Clothing: Shoes',
    description: 'Identify and label "Shoes".',
    language: Language.ENGLISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.EASY,
    targetWord: 'Shoes',
    imageUrl: 'https://picsum.photos/seed/shoes/400/300',
    category: 'Clothing',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Lips rounded for "Sh".',
      tonguePlacement: 'Sides of tongue touch upper teeth for "Sh".',
      tip: 'Look at your shoes!',
    },
    isolationActivity: 'Point to your shoes and say "Shoes".',
    pictureCue: 'https://picsum.photos/seed/sneakers/400/300',
  },
  {
    id: 'steps-1',
    title: 'Following Steps: Two-Step',
    description: 'Follow two simple instructions in order.',
    language: Language.ENGLISH,
    type: ExerciseType.FOLLOWING_DIRECTIONS,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Touch your nose, then clap your hands.',
    imageUrl: 'https://picsum.photos/seed/directions/400/300',
    category: 'Instructions',
    isPremium: true,
    isolationActivity: 'Listen carefully and do the actions!',
  },
  {
    id: 'steps-2',
    title: 'Multi-Step: Three-Step',
    description: 'Follow three instructions in order.',
    language: Language.ENGLISH,
    type: ExerciseType.FOLLOWING_DIRECTIONS,
    difficulty: Difficulty.HARD,
    targetWord: 'Stand up, turn around, and sit down.',
    imageUrl: 'https://picsum.photos/seed/steps/400/300',
    category: 'Instructions',
    isPremium: true,
    isolationActivity: 'Can you remember all three steps?',
  },
  {
    id: 'social-1',
    title: 'Teacher Says: Touch Ears',
    description: 'A game of confidence and listening.',
    language: Language.ENGLISH,
    type: ExerciseType.SOCIAL_SKILLS,
    difficulty: Difficulty.EASY,
    targetWord: 'Teacher says: Touch your ears!',
    imageUrl: 'https://picsum.photos/seed/teacher/400/300',
    category: 'Social Skills',
    isPremium: true,
    isolationActivity: 'Only do it if Teacher says so!',
  },
  {
    id: 'social-2',
    title: 'Teacher Says: Jump',
    description: 'Practice listening and following Teacher.',
    language: Language.ENGLISH,
    type: ExerciseType.SOCIAL_SKILLS,
    difficulty: Difficulty.EASY,
    targetWord: 'Teacher says: Jump three times!',
    imageUrl: 'https://picsum.photos/seed/jump/400/300',
    category: 'Social Skills',
    isPremium: true,
    isolationActivity: 'Wait for the command!',
  },
  {
    id: 'impulsivity-1',
    title: 'Impulsivity: Wait for Green',
    description: 'Practice waiting for the right moment.',
    language: Language.ENGLISH,
    type: ExerciseType.IMPULSIVITY_PRACTICE,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Wait for the green light to say "Go!"',
    imageUrl: 'https://picsum.photos/seed/traffic/400/300',
    category: 'Self-Control',
    isPremium: true,
    isolationActivity: 'Take a deep breath and wait...',
  },
  {
    id: 'focus-1',
    title: 'Focus: Star Gaze',
    description: 'Maintain focus on a single object.',
    language: Language.ENGLISH,
    type: ExerciseType.FOCUS_SESSION,
    difficulty: Difficulty.EASY,
    targetWord: 'Look at the star for 10 seconds.',
    imageUrl: 'https://picsum.photos/seed/star/400/300',
    category: 'Focus',
    isPremium: true,
    isolationActivity: 'Keep your eyes on the star!',
  },
  {
    id: 'social-3',
    title: 'Turn-Taking: Roll the Ball',
    description: 'Practice waiting and taking turns with a friend.',
    language: Language.ENGLISH,
    type: ExerciseType.SOCIAL_SKILLS,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Your turn! Roll the ball.',
    imageUrl: 'https://picsum.photos/seed/ball/400/300',
    category: 'Social Skills',
    isPremium: true,
    isolationActivity: 'Wait for your turn!',
  },
  {
    id: 'social-4',
    title: 'Turn-Taking: Sharing Toys',
    description: 'Practice asking and giving toys.',
    language: Language.ENGLISH,
    type: ExerciseType.SOCIAL_SKILLS,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Can I play? Here you go!',
    imageUrl: 'https://picsum.photos/seed/sharing/400/300',
    category: 'Social Skills',
    isPremium: true,
    isolationActivity: 'Sharing is caring!',
  },
  {
    id: 'directions-3',
    title: 'Simon Says: Touch Toes',
    description: 'Listen carefully to Simon!',
    language: Language.ENGLISH,
    type: ExerciseType.FOLLOWING_DIRECTIONS,
    difficulty: Difficulty.EASY,
    targetWord: 'Simon says: Touch your toes!',
    imageUrl: 'https://picsum.photos/seed/toes/400/300',
    category: 'Instructions',
    isPremium: false,
    isolationActivity: 'Did Simon say it?',
  },
  {
    id: 'directions-4',
    title: 'Complex Steps: Kitchen',
    description: 'Follow a sequence of actions in the kitchen.',
    language: Language.ENGLISH,
    type: ExerciseType.FOLLOWING_DIRECTIONS,
    difficulty: Difficulty.HARD,
    targetWord: 'Open the fridge, get the milk, and put it on the table.',
    imageUrl: 'https://picsum.photos/seed/kitchen/400/300',
    category: 'Instructions',
    isPremium: true,
    isolationActivity: 'Remember all three steps!',
  },
  {
    id: '4',
    title: 'Rolling R / La R Fuerte',
    description: 'Assistance for the vibrant rolling "R" in Spanish.',
    language: Language.SPANISH,
    type: ExerciseType.ARTICULATION,
    difficulty: Difficulty.EASY,
    targetWord: 'Perro',
    imageUrl: 'https://picsum.photos/seed/dog/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open.',
      tonguePlacement: 'Tip of the tongue touches the ridge behind the upper teeth and vibrates.',
      tip: 'Think of the sound a motor makes: "trrrrrr".',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-rr/200/200?blur=1',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-rr/200/200?blur=1',
      mouthAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      tongueAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    },
    isolationActivity: 'Try to make your tongue "flutter" like a flag in the wind.',
    handCue: 'Wiggle your fingers quickly to mimic the tongue vibration.',
    pictureCue: 'https://picsum.photos/seed/vibration/400/300?blur=2',
    letterCue: {
      letter: 'RR',
      description: 'Double "R" means double the fun and double the roll!'
    },
    syllables: ['pe', 'rro'],
    spinningSyllables: [['pe', 'te', 'me'], ['rro', 'lo', 'no']],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Animals / Animales',
    description: 'Learn names of common animals.',
    language: Language.ENGLISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Elephant',
    imageUrl: 'https://picsum.photos/seed/elephant/400/300',
    category: 'Vocabulary',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Start with mouth slightly open for "E".',
      tonguePlacement: 'For "L", touch the tip of your tongue to the ridge behind your upper teeth.',
      tip: 'Break it down: E-le-phant.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-l/200/200?blur=1',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-l/200/200?blur=1'
    },
    isolationActivity: 'Say "L-L-L" with your tongue touching the roof of your mouth!',
    handCue: 'Raise your hand high when you say the "L" sound.',
    pictureCue: 'https://picsum.photos/seed/jungle/400/300?blur=2',
    letterCue: {
      letter: 'L',
      description: 'The "L" is tall and straight like an elephant\'s leg!'
    },
    syllables: ['e', 'le', 'phant'],
    spinningSyllables: [['e', 'a', 'i'], ['le', 'me', 'te'], ['phant', 'cant', 'pant']],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '6',
    title: 'Daily Routines / Rutinas Diarias',
    description: 'Practice phrases about everyday activities.',
    language: Language.SPANISH,
    type: ExerciseType.PHRASING,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Me lavo las manos antes de comer.',
    imageUrl: 'https://picsum.photos/seed/wash/400/300',
    category: 'Phrasing',
    isPremium: true,
    pronunciationGuide: {
      mouthPosition: 'Relaxed and moving fluidly.',
      tonguePlacement: 'For "v" in "lavo", it sounds more like a soft "b" - lips touch lightly.',
      tip: 'Focus on the flow of the whole sentence.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-v/200/200?blur=1',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-v/200/200?blur=1'
    },
    isolationActivity: 'Practice the soft "b/v" sound by gently touching your lips.',
    handCue: 'Mimic washing your hands while saying the sentence.',
    pictureCue: 'https://picsum.photos/seed/water/400/300?blur=2',
    letterCue: {
      letter: 'V',
      description: 'The "V" is like a little valley for your breath!'
    },
    syllables: ['me', 'la', 'vo'],
    spinningSyllables: [['me', 'te', 'se'], ['la', 'ma', 'pa'], ['vo', 'bo', 'do']],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    id: '7',
    title: 'The "TH" Sound',
    description: 'Perfect the tricky "TH" sound in English.',
    language: Language.ENGLISH,
    type: ExerciseType.ARTICULATION,
    difficulty: Difficulty.HARD,
    targetWord: 'Thirty-three thirsty thinkers.',
    imageUrl: 'https://picsum.photos/seed/think/400/300',
    category: 'Sounds',
    isPremium: true,
    pronunciationGuide: {
      mouthPosition: 'Slightly open.',
      tonguePlacement: 'Place the tip of your tongue between your upper and lower teeth.',
      tip: 'Blow air out gently over your tongue without making a voice sound.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-th2/200/200?blur=1',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-th2/200/200?blur=1'
    },
    isolationActivity: 'Hold the "th" sound for 3 seconds: "thhhhhhh".',
    handCue: 'Point to your teeth to remember where your tongue goes.',
    pictureCue: 'https://picsum.photos/seed/breeze/400/300?blur=2',
    letterCue: {
      letter: 'TH',
      description: 'T and H are like two friends whispering a secret!'
    },
    syllables: ['thir', 'ty'],
    spinningSyllables: [['thir', 'for', 'fif'], ['ty', 'teen', 'ty']],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    id: '8',
    title: 'Fruits / Frutas',
    description: 'Common fruits in Spanish.',
    language: Language.SPANISH,
    type: ExerciseType.VOCABULARY,
    difficulty: Difficulty.EASY,
    targetWord: 'Manzana',
    imageUrl: 'https://picsum.photos/seed/apple/400/300',
    category: 'Vocabulary',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Open for "a", lips together for "m".',
      tonguePlacement: 'For "n", tip of tongue touches the ridge behind upper teeth.',
      tip: 'The "z" sounds like an "s" in many Spanish dialects.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-m/200/200?blur=1',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-m/200/200?blur=1'
    },
    isolationActivity: 'Practice the "m" sound by humming with your lips closed.',
    handCue: 'Rub your tummy to show something is yummy like a fruit!',
    pictureCue: 'https://picsum.photos/seed/orchard/400/300?blur=2',
    letterCue: {
      letter: 'M',
      description: 'The "M" has two humps like a camel, and it sounds "Mmmm"!'
    },
    syllables: ['man', 'za', 'na'],
    spinningSyllables: [['man', 'pan', 'can'], ['za', 'sa', 'ta'], ['na', 'ma', 'la']],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: '9',
    title: 'The Little Rabbit / El Conejito',
    description: 'A short story about a rabbit in the garden.',
    language: Language.ENGLISH,
    type: ExerciseType.STORY,
    difficulty: Difficulty.EASY,
    category: 'Story Time',
    isPremium: false,
    story: [
      {
        text: 'Once upon a time, there was a little rabbit named Rosie.',
        imageUrl: 'https://picsum.photos/seed/rosie1/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        interactiveWords: [
          { word: 'rabbit', definition: 'A small animal with long ears and a fluffy tail.', animation: 'bounce' },
          { word: 'Rosie', definition: 'The name of our furry friend!', animation: 'pulse' }
        ]
      },
      {
        text: 'Rosie loved to hop around the green garden.',
        imageUrl: 'https://picsum.photos/seed/rosie2/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        interactiveWords: [
          { word: 'hop', definition: 'To jump on one foot or with both feet together.', animation: 'bounce' },
          { word: 'garden', definition: 'A place where plants and flowers grow.', animation: 'pulse' }
        ]
      },
      {
        text: 'One day, she found a big, orange carrot!',
        imageUrl: 'https://picsum.photos/seed/rosie3/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        interactiveWords: [
          { word: 'carrot', definition: 'A long, orange vegetable that grows in the ground.', animation: 'shake' }
        ]
      }
    ]
  },
  {
    id: '10',
    title: 'A Day at the Beach / Un Día en la Playa',
    description: 'Practice beach vocabulary through a story.',
    language: Language.SPANISH,
    type: ExerciseType.STORY,
    difficulty: Difficulty.MEDIUM,
    category: 'Story Time',
    isPremium: true,
    story: [
      {
        text: 'Hoy es un día muy soleado en la playa.',
        imageUrl: 'https://picsum.photos/seed/beach1/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        interactiveWords: [
          { word: 'soleado', definition: 'Cuando el sol brilla mucho.', animation: 'pulse' },
          { word: 'playa', definition: 'Lugar junto al mar con arena.', animation: 'bounce' }
        ]
      },
      {
        text: 'Vemos muchas conchas de colores en la arena.',
        imageUrl: 'https://picsum.photos/seed/beach2/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        interactiveWords: [
          { word: 'conchas', definition: 'Caparazones de animales marinos.', animation: 'shake' },
          { word: 'arena', definition: 'Polvo de rocas en la playa.', animation: 'pulse' }
        ]
      },
      {
        text: '¡El agua del mar está muy fresquita!',
        imageUrl: 'https://picsum.photos/seed/beach3/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        interactiveWords: [
          { word: 'agua', definition: 'Líquido transparente y vital.', animation: 'bounce' },
          { word: 'fresquita', definition: 'Que está un poco fría y es agradable.', animation: 'pulse' }
        ]
      }
    ]
  },
  {
    id: '11',
    title: 'The Busy Bee / La Abeja Ocupada',
    description: 'Follow a bee as it visits different flowers.',
    language: Language.ENGLISH,
    type: ExerciseType.STORY,
    difficulty: Difficulty.EASY,
    category: 'Story Time',
    isPremium: false,
    story: [
      {
        text: 'Buzzy the Bee wakes up early in the morning.',
        imageUrl: 'https://picsum.photos/seed/bee1/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        interactiveWords: [
          { word: 'morning', definition: 'The first part of the day when the sun comes up.', animation: 'bounce' },
          { word: 'early', definition: 'Before the usual time.', animation: 'pulse' }
        ]
      },
      {
        text: 'He flies to a bright yellow sunflower.',
        imageUrl: 'https://picsum.photos/seed/bee2/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        interactiveWords: [
          { word: 'sunflower', definition: 'A tall plant with a large yellow flower head.', animation: 'pulse' },
          { word: 'yellow', definition: 'The color of sunshine or a lemon.', animation: 'bounce' }
        ]
      },
      {
        text: 'Then, he visits a pretty purple lavender plant.',
        imageUrl: 'https://picsum.photos/seed/bee3/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        interactiveWords: [
          { word: 'lavender', definition: 'A plant with small, fragrant purple flowers.', animation: 'shake' },
          { word: 'purple', definition: 'A color made by mixing red and blue.', animation: 'pulse' }
        ]
      },
      {
        text: 'Buzzy is happy because he made lots of honey!',
        imageUrl: 'https://picsum.photos/seed/bee4/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        interactiveWords: [
          { word: 'honey', definition: 'A sweet, sticky yellow liquid made by bees.', animation: 'bounce' },
          { word: 'happy', definition: 'Feeling or showing pleasure or contentment.', animation: 'pulse' }
        ]
      }
    ]
  },
  {
    id: '12',
    title: 'The Curious Cat / El Gato Curioso',
    description: 'A story about a cat exploring a new house.',
    language: Language.SPANISH,
    type: ExerciseType.STORY,
    difficulty: Difficulty.MEDIUM,
    category: 'Story Time',
    isPremium: false,
    story: [
      {
        text: 'Había una vez un gato llamado Bigotes.',
        imageUrl: 'https://picsum.photos/seed/cat1/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        interactiveWords: [
          { word: 'gato', definition: 'Un animal doméstico pequeño con pelaje suave.', animation: 'bounce' },
          { word: 'Bigotes', definition: 'El nombre del gato, se refiere a los pelos largos en su cara.', animation: 'pulse' }
        ]
      },
      {
        text: 'Bigotes encontró una caja misteriosa en el salón.',
        imageUrl: 'https://picsum.photos/seed/cat2/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        interactiveWords: [
          { word: 'misteriosa', definition: 'Algo que es difícil de entender o explicar.', animation: 'shake' },
          { word: 'salón', definition: 'Una habitación grande en una casa para relajarse.', animation: 'pulse' }
        ]
      },
      {
        text: 'Dentro de la caja, ¡había un ratón de juguete!',
        imageUrl: 'https://picsum.photos/seed/cat3/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        interactiveWords: [
          { word: 'ratón', definition: 'Un animal pequeño con una cola larga.', animation: 'bounce' },
          { word: 'juguete', definition: 'Un objeto para que los niños o animales jueguen.', animation: 'pulse' }
        ]
      },
      {
        text: 'Bigotes jugó todo el día con su nuevo amigo.',
        imageUrl: 'https://picsum.photos/seed/cat4/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        interactiveWords: [
          { word: 'amigo', definition: 'Una persona o animal a quien quieres y con quien te gusta estar.', animation: 'pulse' },
          { word: 'día', definition: 'El tiempo cuando hay luz del sol.', animation: 'bounce' }
        ]
      }
    ]
  },
  {
    id: '13',
    title: 'The "S" Sound Drill',
    description: 'Assistance for the "S" sound with words and sentences.',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Snake',
    targetSentence: 'The snake slithers slowly through the sand.',
    imageUrl: 'https://picsum.photos/seed/snake/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Teeth close together, lips slightly open.',
      tonguePlacement: 'Tip of the tongue behind the upper teeth, air flows over the top.',
      tip: 'Make a hissing sound like a snake!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-s-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-s-diagram/200/200',
      tipAudioUrl: ''
    },
    isolationActivity: 'Hiss like a snake: ssssssssss!',
    handCue: 'Move your hand in a wavy motion like a snake.',
    pictureCue: 'https://picsum.photos/seed/snake-cue/400/300',
    letterCue: {
      letter: 'S',
      description: 'The "S" is like a slippery snake!'
    },
  },
  {
    id: '14',
    title: 'The "R" Sound Drill',
    description: 'Assistance for the "R" sound with words and sentences.',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Rocket',
    targetSentence: 'The red rocket roared into the starry sky.',
    imageUrl: 'https://picsum.photos/seed/rocket/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open, lips rounded.',
      tonguePlacement: 'Tip of the tongue curled up towards the roof of the mouth, but not touching.',
      tip: 'Try to make a "growl" sound like a small bear!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-r-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-r-diagram/200/200',
      tipAudioUrl: ''
    },
    isolationActivity: 'Say "rrrrr" like a racing car engine!',
    handCue: 'Move your hand in a circular motion like a wheel.',
    pictureCue: 'https://picsum.photos/seed/rocket-cue/400/300',
    letterCue: {
      letter: 'R',
      description: 'The "R" is like a curvy road for your tongue!'
    },
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '15',
    title: 'The "K" Sound: Kite',
    description: 'Assistance for the "K" sound with the word "Kite".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Kite',
    targetSentence: 'The colorful kite kicks high in the sky.',
    imageUrl: 'https://picsum.photos/seed/kite/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Mouth slightly open.',
      tonguePlacement: 'Back of the tongue touches the roof of the mouth, then releases a puff of air.',
      tip: 'Make a short "coughing" sound at the back of your throat!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-k-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-k-diagram/200/200'
    },
    isolationActivity: 'Practice the "K" sound in isolation: k-k-k-k!',
    handCue: 'Tap the back of your neck gently to feel the sound.',
    pictureCue: 'https://picsum.photos/seed/kite-cue/400/300',
    letterCue: {
      letter: 'K',
      description: 'The "K" is a kicking sound!'
    },
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '16',
    title: 'The "K" Sound: Cat',
    description: 'Assistance for the "K" sound with the word "Cat".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Cat',
    targetSentence: 'The cute cat climbed the kitchen counter.',
    imageUrl: 'https://picsum.photos/seed/cat-k/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Mouth slightly open.',
      tonguePlacement: 'Back of the tongue touches the roof of the mouth, then releases a puff of air.',
      tip: 'It\'s a "quiet" sound, like a tiny secret click!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-k2-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-k2-diagram/200/200'
    },
    isolationActivity: 'Practice the "K" sound in isolation: k-k-k-k!',
    handCue: 'Tap your throat lightly.',
    pictureCue: 'https://picsum.photos/seed/cat-cue/400/300',
    letterCue: {
      letter: 'C',
      description: 'Sometimes "C" makes the "K" sound too!'
    },
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '17',
    title: 'The "K" Sound: Key',
    description: 'Assistance for the "K" sound with the word "Key".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Key',
    targetSentence: 'Keep the silver key in your pocket.',
    imageUrl: 'https://picsum.photos/seed/key/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Mouth slightly open.',
      tonguePlacement: 'Back of the tongue touches the roof of the mouth, then releases a puff of air.',
      tip: 'Feel the air kick out of your mouth!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-k3-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-k3-diagram/200/200'
    },
    isolationActivity: 'Practice the "K" sound in isolation: k-k-k-k!',
    handCue: 'Make a "kicking" motion with your fingers.',
    pictureCue: 'https://picsum.photos/seed/key-cue/400/300',
    letterCue: {
      letter: 'K',
      description: 'The "K" is sharp and quick!'
    },
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '18',
    title: 'The "TH" Sound Drill - Think',
    description: 'Master the "TH" sound with the word "Think".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Think',
    targetSentence: 'I think about the stars at night.',
    imageUrl: 'https://picsum.photos/seed/think/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open, teeth visible.',
      tonguePlacement: 'Tip of the tongue placed between the upper and lower teeth.',
      tip: 'Blow air gently over your tongue. Don\'t bite!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-th1-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-th1-diagram/200/200'
    },
    isolationActivity: 'Blow air with your tongue between your teeth: ththththth!',
    handCue: 'Place your finger in front of your lips to feel the air.',
    pictureCue: 'https://picsum.photos/seed/think-cue/400/300',
    letterCue: {
      letter: 'TH',
      description: 'The "T" and "H" work together to make a soft breeze!'
    },
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '19',
    title: 'The "TH" Sound Drill - Thirty',
    description: 'Master the "TH" sound with the word "Thirty".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Thirty',
    targetSentence: 'There are thirty birds in the tree.',
    imageUrl: 'https://picsum.photos/seed/thirty/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open, teeth visible.',
      tonguePlacement: 'Tip of the tongue placed between the upper and lower teeth.',
      tip: 'Keep the air flowing smoothly.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-th2-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-th2-diagram/200/200'
    },
    isolationActivity: 'Practice saying "th" then "ir" then "ty".',
    handCue: 'Hold up three fingers for "thirty".',
    pictureCue: 'https://picsum.photos/seed/thirty-cue/400/300',
    letterCue: {
      letter: 'TH',
      description: 'The "TH" starts the word with a soft touch!'
    },
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '20',
    title: 'The "TH" Sound Drill - Tooth',
    description: 'Master the "TH" sound with the word "Tooth".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Tooth',
    targetSentence: 'I have a loose tooth in the front.',
    imageUrl: 'https://picsum.photos/seed/tooth/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open, teeth visible.',
      tonguePlacement: 'Tip of the tongue placed between the upper and lower teeth at the end of the word.',
      tip: 'End the word with a soft "th" sound.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-th3-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-th3-diagram/200/200'
    },
    isolationActivity: 'Say "too" then add the "th" at the end.',
    handCue: 'Point to your tooth when you say the word.',
    pictureCue: 'https://picsum.photos/seed/tooth-cue/400/300',
    letterCue: {
      letter: 'TH',
      description: 'The "TH" finishes the word with a gentle puff!'
    },
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '21',
    title: 'The "L" Sound Drill - Lion',
    description: 'Master the "L" sound with the word "Lion".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Lion',
    targetSentence: 'The little lion likes to leap and play.',
    imageUrl: 'https://picsum.photos/seed/lion/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Mouth slightly open, lips relaxed.',
      tonguePlacement: 'Tip of the tongue touches the ridge behind the upper teeth.',
      tip: 'Let the air flow around the sides of your tongue!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-l1-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-l1-diagram/200/200'
    },
    isolationActivity: 'Say "L-L-L" with your tongue touching the roof of your mouth!',
    handCue: 'Raise your hand high when you say the "L" sound.',
    pictureCue: 'https://picsum.photos/seed/lion-cue/400/300',
    letterCue: {
      letter: 'L',
      description: 'The "L" is tall and straight like a lion\'s leg!'
    },
  },
  {
    id: '22',
    title: 'The "L" Sound Drill - Ball',
    description: 'Master the "L" sound with the word "Ball".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Ball',
    targetSentence: 'The big blue ball rolled down the hill.',
    imageUrl: 'https://picsum.photos/seed/ball/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Mouth open, then tongue moves up.',
      tonguePlacement: 'Tip of the tongue touches the ridge behind the upper teeth at the end of the word.',
      tip: 'Hold the "L" sound at the end: "ba-llll".',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-l2-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-l2-diagram/200/200'
    },
    isolationActivity: 'Say "L-L-L" with your tongue touching the roof of your mouth!',
    handCue: 'Raise your hand high when you say the "L" sound.',
    pictureCue: 'https://picsum.photos/seed/ball-cue/400/300',
    letterCue: {
      letter: 'L',
      description: 'The "L" finishes the word with a lift of your tongue!'
    },
  },
  {
    id: '23',
    title: 'The "L" Sound Drill - Leaf',
    description: 'Master the "L" sound with the word "Leaf".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Leaf',
    targetSentence: 'A lonely leaf fell from the tall tree.',
    imageUrl: 'https://picsum.photos/seed/leaf/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Mouth slightly open.',
      tonguePlacement: 'Tip of the tongue touches the ridge behind the upper teeth.',
      tip: 'Keep your tongue steady and let the sound flow!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-l3-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-l3-diagram/200/200'
    },
    isolationActivity: 'Say "L-L-L" with your tongue touching the roof of your mouth!',
    handCue: 'Raise your hand high when you say the "L" sound.',
    pictureCue: 'https://picsum.photos/seed/leaf-cue/400/300',
    letterCue: {
      letter: 'L',
      description: 'The "L" starts the word with a lovely lift!'
    },
  },
  {
    id: '24',
    title: 'The "R" Sound Drill - Rabbit',
    description: 'Master the "R" sound with the word "Rabbit".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Rabbit',
    targetSentence: 'The red rocket roared into the starry sky.',
    imageUrl: 'https://picsum.photos/seed/rabbit-drill/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open, lips rounded.',
      tonguePlacement: 'Tip of the tongue curled up towards the roof of the mouth, but not touching.',
      tip: 'Try to make a "growl" sound like a small bear!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-r-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-r-diagram/200/200',
      tipAudioUrl: ''
    },
    isolationActivity: 'Say "rrrrr" like a racing car engine!',
    handCue: 'Move your hand in a circular motion like a wheel.',
    pictureCue: 'https://picsum.photos/seed/rabbit-cue/400/300',
    letterCue: {
      letter: 'R',
      description: 'The "R" is like a curvy road for your tongue!'
    },
  },
  {
    id: '25',
    title: 'The Spanish "RR" Sound Drill',
    description: 'Master the rolled "RR" sound with the word "Perro".',
    language: Language.SPANISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.HARD,
    targetWord: 'Perro',
    targetSentence: 'El perro corre rápido.',
    imageUrl: 'https://picsum.photos/seed/perro-drill/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Slightly open, lips relaxed.',
      tonguePlacement: 'Tip of the tongue against the roof of the mouth, just behind the upper teeth. Air vibrates the tongue tip.',
      tip: 'Vibrate your tongue tip like a motorboat!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-rr-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-rr-diagram/200/200',
      tipAudioUrl: ''
    },
    isolationActivity: 'Try to make a "trill" sound: rrrrrrrrrr!',
    handCue: 'Vibrate your hand quickly in the air.',
    pictureCue: 'https://picsum.photos/seed/perro-cue/400/300',
    letterCue: {
      letter: 'RR',
      description: 'The "RR" is like a vibrating motor!'
    },
  },
  {
    id: '26',
    title: 'The "SH" Sound Drill - Shoe',
    description: 'Master the "SH" sound with the word "Shoe".',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Shoe',
    targetSentence: 'She showed her shiny new shoe.',
    imageUrl: 'https://picsum.photos/seed/shoe-drill/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Lips rounded and pushed forward.',
      tonguePlacement: 'Sides of the tongue touch the upper teeth, air flows through the middle.',
      tip: 'Make a "shushing" sound like you are telling someone to be quiet!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-sh-diagram/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-sh-diagram/200/200',
      tipAudioUrl: ''
    },
    isolationActivity: 'Say "shhhhhh" like you are being very quiet!',
    handCue: 'Place your finger over your lips in a "shush" motion.',
    pictureCue: 'https://picsum.photos/seed/shoe-cue/400/300',
    letterCue: {
      letter: 'SH',
      description: 'The "SH" is a quiet, shushing sound!'
    },
  },
  {
    id: 'busy-bee-new',
    title: 'The Busy Bee',
    description: 'A story about a hard-working bee visiting colorful flowers.',
    language: Language.ENGLISH,
    type: ExerciseType.STORY,
    difficulty: Difficulty.EASY,
    category: 'Story Time',
    isPremium: false,
    story: [
      {
        text: 'Buzzy is a busy bee. He loves to fly in the sun.',
        imageUrl: 'https://picsum.photos/seed/busy-bee-1/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        interactiveWords: [
          { word: 'bee', definition: 'A small insect that makes honey and goes buzz!', animation: 'bounce' },
          { word: 'busy', definition: 'Having a lot of work to do.', animation: 'pulse' }
        ]
      },
      {
        text: 'He visits a big, yellow sunflower.',
        imageUrl: 'https://picsum.photos/seed/busy-bee-2/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        interactiveWords: [
          { word: 'sunflower', definition: 'A very tall flower with yellow petals.', animation: 'pulse' },
          { word: 'yellow', definition: 'The color of a lemon or the sun.', animation: 'bounce' }
        ]
      },
      {
        text: 'Buzzy collects nectar to make sweet honey.',
        imageUrl: 'https://picsum.photos/seed/busy-bee-3/600/400',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        interactiveWords: [
          { word: 'honey', definition: 'A sweet, sticky food made by bees.', animation: 'bounce' },
          { word: 'sweet', definition: 'Tasting like sugar.', animation: 'shake' }
        ]
      }
    ]
  },
  {
    id: '27',
    title: 'La Letra CH: Chocolate',
    description: 'Practica el sonido "CH" en español.',
    language: Language.SPANISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Chocolate',
    targetSentence: 'Me gusta comer chocolate con leche.',
    imageUrl: 'https://picsum.photos/seed/chocolate/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Labios redondeados y hacia adelante.',
      tonguePlacement: 'La lengua toca el paladar y luego se suelta con un soplo de aire.',
      tip: '¡Haz un sonido como el de un tren: ch-ch-ch!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-ch-es/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-ch-es/200/200'
    },
    isolationActivity: 'Haz el sonido de un estornudo: ¡Atchís!',
    handCue: 'Mueve tu mano hacia adelante como si estuvieras lanzando algo.',
    pictureCue: 'https://picsum.photos/seed/train/400/300',
    letterCue: {
      letter: 'CH',
      description: '¡La "C" y la "H" juntas hacen un sonido muy divertido!'
    }
  },
  {
    id: '28',
    title: 'La Letra L: Luna',
    description: 'Practica el sonido "L" inicial en español.',
    language: Language.SPANISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Luna',
    targetSentence: 'La luna brilla en la noche oscura.',
    imageUrl: 'https://picsum.photos/seed/moon/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Boca abierta, labios relajados.',
      tonguePlacement: 'La punta de la lengua toca la parte de arriba, detrás de los dientes.',
      tip: '¡Mantén la lengua arriba y deja que el sonido salga por los lados!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-l-es-luna/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-l-es-luna/200/200'
    },
    isolationActivity: 'Canta "la-la-la" muy alto.',
    handCue: 'Apunta hacia arriba con tu dedo.',
    pictureCue: 'https://picsum.photos/seed/night/400/300',
    letterCue: {
      letter: 'L',
      description: '¡La "L" es larga y elegante como la luna!'
    }
  },
  {
    id: '29',
    title: 'La Letra R: Rosa',
    description: 'Practica el sonido "R" fuerte al inicio en español.',
    language: Language.SPANISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Rosa',
    targetSentence: 'La rosa roja huele muy bien.',
    imageUrl: 'https://picsum.photos/seed/rose/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Boca entreabierta.',
      tonguePlacement: 'La punta de la lengua vibra contra el paladar superior.',
      tip: '¡Haz que tu lengua baile muy rápido!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-r-es-rosa/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-r-es-rosa/200/200'
    },
    isolationActivity: 'Imita el sonido de un teléfono antiguo: ¡Rring rring!',
    handCue: 'Haz un círculo en el aire con tu dedo índice.',
    pictureCue: 'https://picsum.photos/seed/flower/400/300',
    letterCue: {
      letter: 'R',
      description: '¡La "R" al principio siempre tiene mucha energía!'
    }
  },
  {
    id: '30',
    title: 'La Letra Z: Zapato',
    description: 'Practica el sonido "Z" (como "th") en español.',
    language: Language.SPANISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Zapato',
    targetSentence: 'Me pongo el zapato en el pie derecho.',
    imageUrl: 'https://picsum.photos/seed/shoe-es/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Dientes ligeramente separados.',
      tonguePlacement: 'La punta de la lengua se coloca entre los dientes.',
      tip: 'Sopla aire suavemente, como si estuvieras diciendo "th" en inglés.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-z-es/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-z-es/200/200'
    },
    isolationActivity: 'Sopla aire suavemente: zzzzzzzzz.',
    handCue: 'Pon tu mano frente a tu boca para sentir el aire.',
    pictureCue: 'https://picsum.photos/seed/walking/400/300',
    letterCue: {
      letter: 'Z',
      description: '¡La "Z" es como un caminito de aire entre tus dientes!'
    }
  },
  {
    id: '31',
    title: 'The Voiced "TH" Sound: Feather',
    description: 'Practice the voiced "TH" sound in English.',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.MEDIUM,
    targetWord: 'Feather',
    targetSentence: 'The bird dropped a soft feather.',
    imageUrl: 'https://picsum.photos/seed/feather/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Mouth slightly open, teeth visible.',
      tonguePlacement: 'Tip of the tongue between the teeth, with voice added.',
      tip: 'Feel your tongue vibrate! It should feel like a little buzz.',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-th-voiced/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-th-voiced/200/200'
    },
    isolationActivity: 'Make a buzzing sound with your tongue between your teeth: th-th-th.',
    handCue: 'Touch your throat to feel the vibration.',
    pictureCue: 'https://picsum.photos/seed/soft/400/300',
    letterCue: {
      letter: 'TH',
      description: 'This "TH" has a little motor inside!'
    }
  },
  {
    id: 's-sun',
    title: 'The "S" Sound: Sun',
    description: 'Practice the "S" sound with the word Sun.',
    language: Language.ENGLISH,
    type: ExerciseType.PRONUNCIATION_DRILL,
    difficulty: Difficulty.EASY,
    targetWord: 'Sun',
    targetSentence: 'The bright sun shines in the summer sky.',
    imageUrl: 'https://picsum.photos/seed/sun/400/300',
    category: 'Sounds',
    isPremium: false,
    pronunciationGuide: {
      mouthPosition: 'Teeth close together, lips slightly open.',
      tonguePlacement: 'Tip of the tongue behind the upper teeth, air flows over the top.',
      tip: 'Smile slightly and let the air whistle through your teeth!',
      mouthAnimationUrl: 'https://picsum.photos/seed/mouth-s-sun/200/200',
      tongueAnimationUrl: 'https://picsum.photos/seed/tongue-s-sun/200/200'
    },
    isolationActivity: 'Make a long "sssss" sound like a leaky balloon.',
    handCue: 'Move your hand in a circle like a big round sun.',
    pictureCue: 'https://picsum.photos/seed/sunny-day/400/300',
    letterCue: {
      letter: 'S',
      description: 'The "S" is like a sunny smile!'
    }
  },
  {
    id: 'minimal-pairs-1',
    title: 'Minimal Pairs: Pero vs Perro',
    description: 'Distinguish between the single and double "R" in Spanish.',
    language: Language.SPANISH,
    type: ExerciseType.MINIMAL_PAIRS,
    difficulty: Difficulty.MEDIUM,
    category: 'Minimal Pairs',
    isPremium: true,
    minimalPairs: [
      { 
        word1: 'Pero', 
        word2: 'Perro', 
        imageUrl1: 'https://picsum.photos/seed/but/400/300', 
        imageUrl2: 'https://picsum.photos/seed/dog/400/300',
        audioUrl1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        audioUrl2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      }
    ]
  },
  {
    id: 'syllable-pacing-1',
    title: 'Syllable Pacing: Elephant',
    description: 'Break down the word "Elephant" into clear syllables.',
    language: Language.ENGLISH,
    type: ExerciseType.SYLLABLE_PACING,
    difficulty: Difficulty.EASY,
    category: 'Pacing',
    isPremium: false,
    targetWord: 'Elephant',
    syllables: ['E', 'le', 'phant'],
    imageUrl: 'https://picsum.photos/seed/elephant-pacing/400/300'
  },
  {
    id: 'visual-phonics-1',
    title: 'Visual Phonics: The "B" Sound',
    description: 'Use hand cues to help produce the "B" sound.',
    language: Language.ENGLISH,
    type: ExerciseType.VISUAL_PHONICS,
    difficulty: Difficulty.EASY,
    category: 'Visual Cues',
    isPremium: false,
    targetWord: 'Ball',
    handCue: 'Place your hand in front of your mouth and feel the puff of air!',
    imageUrl: 'https://picsum.photos/seed/ball-visual/400/300'
  },
  {
    id: 'semantic-mapping-1',
    title: 'Semantic Mapping: Farm Animals',
    description: 'Connect farm animals to their category.',
    language: Language.ENGLISH,
    type: ExerciseType.SEMANTIC_MAPPING,
    difficulty: Difficulty.EASY,
    category: 'Language',
    isPremium: true,
    semanticData: {
      category: 'Farm Animals',
      items: [
        { word: 'Cow', imageUrl: 'https://picsum.photos/seed/cow/200/200' },
        { word: 'Pig', imageUrl: 'https://picsum.photos/seed/pig/200/200' },
        { word: 'Chicken', imageUrl: 'https://picsum.photos/seed/chicken/200/200' }
      ]
    }
  },
  {
    id: 'sentence-expansion-1',
    title: 'Sentence Expansion: The Dog',
    description: 'Build a full sentence starting from one word.',
    language: Language.ENGLISH,
    type: ExerciseType.SENTENCE_EXPANSION,
    difficulty: Difficulty.MEDIUM,
    category: 'Language',
    isPremium: true,
    expansionData: {
      base: 'Dog',
      steps: [
        'The dog',
        'The big dog',
        'The big dog is barking.'
      ]
    },
    imageUrl: 'https://picsum.photos/seed/dog-expansion/400/300'
  },
  {
    id: 'roleplay-1',
    title: 'Pragmatic Roleplay: Asking for a Toy',
    description: 'Practice social communication in a play scenario.',
    language: Language.ENGLISH,
    type: ExerciseType.PRAGMATIC_ROLEPLAY,
    difficulty: Difficulty.MEDIUM,
    category: 'Social',
    isPremium: true,
    roleplayData: {
      scenario: 'You want to play with the blocks your friend has. What do you say?',
      options: [
        { text: 'Give me those!', feedback: 'That might sound a bit mean. Try being more polite!', isCorrect: false },
        { text: 'Can I play with the blocks too?', feedback: 'Great job! Asking nicely is the best way.', isCorrect: true },
        { text: 'Wait for them to finish.', feedback: 'Waiting is good, but you can also ask to join in!', isCorrect: true }
      ]
    },
    imageUrl: 'https://picsum.photos/seed/blocks/400/300'
  }
];
