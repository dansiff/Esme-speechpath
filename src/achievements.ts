import { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_session',
    title: 'First Step',
    description: 'Complete your first practice session.',
    icon: '🚀',
    requirement: { type: 'sessions', value: 1 }
  },
  {
    id: 'streak_3',
    title: 'Consistency King',
    description: 'Maintain a 3-day practice streak.',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 }
  },
  {
    id: 'points_500',
    title: 'Point Collector',
    description: 'Earn a total of 500 points.',
    icon: '💎',
    requirement: { type: 'points', value: 500 }
  },
  {
    id: 'perfect_score',
    title: 'Speech Assistant',
    description: 'Get a perfect 100 score on any exercise.',
    icon: '🏆',
    requirement: { type: 'score', value: 100 }
  },
  {
    id: 'sessions_10',
    title: 'Dedicated Learner',
    description: 'Complete 10 practice sessions.',
    icon: '📚',
    requirement: { type: 'sessions', value: 10 }
  }
];
