import type { ImprovementPlan } from '../types';

export const IMPROVEMENT_PLANS: ImprovementPlan[] = [
  {
    area: 'Communication Skills',
    impact: 'Poor communication can limit client-facing roles, team leadership, and placement opportunities across marketing, HR, hospitality, and sales functions.',
    activities: [
      'Participate in 5+ classroom presentations per semester',
      'Join college debate/GD club',
      'Attend business communication workshops',
      'Record and review self-presentations weekly',
    ],
    resources: [
      'Toastmasters International',
      'Coursera: Business English Communication',
      'LinkedIn Learning: Communication Foundations',
    ],
    certification: 'Business Communication Certification',
    actions: [
      'Speak in English with peers for 30 min daily',
      'Read one business newspaper aloud daily',
      'Volunteer for college event anchoring',
    ],
  },
  {
    area: 'Decision Making Under Pressure',
    impact: 'Inability to decide with limited data can slow down career growth in operations, finance, and analytics leadership roles.',
    activities: [
      'Solve 2 case studies per week',
      'Participate in B-plan competitions',
      'Lead a small student project with deadlines',
    ],
    resources: [
      'Harvard Business Review case studies',
      'Book: Thinking, Fast and Slow (Kahneman)',
      'Coursera: Strategic Decision Making',
    ],
    certification: 'Strategic Management Certification',
    actions: ['Use pros/cons framework for small daily decisions', 'Reflect weekly on one decision and its outcome'],
  },
  {
    area: 'Time & Priority Management',
    impact: 'Handling multiple priorities is essential in consulting, operations, and fast-paced startups — poor management causes missed targets.',
    activities: [
      'Use Eisenhower Matrix weekly',
      'Set quarterly OKRs for self-development',
      'Practice Pomodoro technique during study hours',
    ],
    resources: [
      'Book: Atomic Habits (James Clear)',
      'Notion / Todoist productivity systems',
      'LinkedIn Learning: Time Management',
    ],
    certification: 'Project Management Foundations',
    actions: ['Maintain a daily planner', 'Batch similar tasks together', 'Review weekly on Sunday night'],
  },
  {
    area: 'Public Speaking Confidence',
    impact: 'Limits senior leadership, consulting, marketing, and hospitality career progression.',
    activities: [
      'Deliver 10+ speeches at Toastmasters',
      'Anchor 2+ college events per semester',
      'Participate in MUN or debate competitions',
    ],
    resources: ['Book: Talk Like TED (Carmine Gallo)', 'YouTube: TED Masterclass', 'Local toastmasters chapter'],
    certification: 'Public Speaking Certification (Coursera)',
    actions: ['Give 2-min impromptu speeches daily with friends', 'Practice breathing exercises before presentations'],
  },
  {
    area: 'Procrastination & Task Initiation',
    impact: 'Delays projects, misses deadlines, and reduces reliability — critical for project-based roles.',
    activities: [
      'Break tasks into 15-min Pomodoro blocks',
      'Use accountability partner',
      'Set micro-deadlines for all assignments',
    ],
    resources: ['Book: Eat That Frog (Brian Tracy)', 'Focusmate virtual coworking', 'Forest / Freedom focus apps'],
    actions: ['Start every task with the smallest step', 'Reward task completion daily'],
  },
];
