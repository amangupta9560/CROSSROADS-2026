import {
  Award,
  Code2,
  Cpu,
  Layers,
  Lightbulb,
  Rocket,
  TrendingUp,
  Trophy,
  Users,
  Users2,
  Zap,
} from 'lucide-react';

export const aboutStats = [
  {
    icon: Users2,
    label: 'Innovators Expected',
    value: '1,500+',
    numericTarget: 1500,
    prefix: '',
    suffix: '+',
    formatComma: true,
    tag: 'FOOTFALL',
  },
  {
    icon: Trophy,
    label: 'Flagship Arenas',
    value: '11',
    numericTarget: 11,
    prefix: '',
    suffix: '',
    formatComma: false,
    tag: 'EVENTS',
  },
  {
    icon: Award,
    label: 'Total Prize Pool',
    value: '₹1L+',
    numericTarget: 1,
    prefix: '₹',
    suffix: 'L+',
    formatComma: false,
    tag: 'REWARDS',
  },
  {
    icon: TrendingUp,
    label: 'Colleges Competing',
    value: '50+',
    numericTarget: 50,
    prefix: '',
    suffix: '+',
    formatComma: false,
    tag: 'CAMPUSES',
  },
];

export const uniqueFeatures = [
  {
    icon: Code2,
    rune: 'CHAMBER I',
    title: 'Engineering & Code First',
    desc: 'From 20-minute algorithmic code sprints to hardware robotics tracks, built for builders and problem solvers.',
  },
  {
    icon: Users,
    rune: 'CHAMBER II',
    title: 'Cross-Campus Collaboration',
    desc: 'Developers, roboticists, designers, performers, and strategists competing across unified arenas.',
  },
  {
    icon: Zap,
    rune: 'CHAMBER III',
    title: 'Applied Problem Solving',
    desc: 'Challenges modeled around live prototyping, debugging under pressure, and rapid system execution.',
  },
  {
    icon: Trophy,
    rune: 'CHAMBER IV',
    title: 'Verified Credentials',
    desc: 'Winners earn cash awards, rolling trophies, and verifiable merit certificates across all 11 events.',
  },
  {
    icon: Rocket,
    rune: 'CHAMBER V',
    title: 'Prototype Launchpad',
    desc: 'Present hardware and AI prototypes directly before academic mentors and technical judging panels.',
  },
  {
    icon: Lightbulb,
    rune: 'CHAMBER VI',
    title: 'Peer & Mentor Network',
    desc: 'Connect directly with faculty heads, Team Tech Fusion organizers, and top student talent from 50+ colleges.',
  },
];

export const eventTypes = [
  {
    category: 'Technical & Engineering',
    badge: '04 ARENAS',
    chamber: 'SANCTUM OF LOGIC & HARDWARE',
    image: '/assets/lost-civilization/arena-code-puzzle.webp',
    events: [
      'Code Puzzle',
      'Project Exhibition / Evolution',
      'Robo Race',
      'Technical Poster Competition',
    ],
  },
  {
    category: 'Cultural & Performing Arts',
    badge: '03 ARENAS',
    chamber: 'AMPHITHEATRE OF RHYTHM',
    image: '/assets/lost-civilization/arena-dance-competition.webp',
    events: [
      'Dance Competition (Solo)',
      'Cultural Events (Group Dance)',
      'Rock Band & Live Music',
    ],
  },
  {
    category: 'Creative & Culinary',
    badge: '03 ARENAS',
    chamber: 'OBSERVATORY OF CRAFT',
    image: '/assets/lost-civilization/arena-project-exhibition.webp',
    events: [
      'Short Film Making',
      'Rangoli Competition',
      'Food Without Fire',
    ],
  },
  {
    category: 'Campus Adventure & Honors',
    badge: '02 HIGHLIGHTS',
    chamber: 'CROSSROADS COMPASS VAULT',
    image: '/assets/lost-civilization/arena-treasure-hunt.webp',
    events: [
      'Campus-Wide Treasure Hunt (5–8 Squad)',
      'Crossroads Grand Closing & Awards',
    ],
  },
];

export const participantCategories = [
  'First-year explorers',
  'Final-year builders',
  'Competitive programmers',
  'Hardware & robotics teams',
  'UI/UX & poster designers',
  'Campus filmmakers',
  'Dancers & live bands',
  'Inter-college squads',
];

export const whyJoin = [
  {
    icon: Trophy,
    glyph: '01',
    title: 'Portfolio & Recognition',
    desc: 'Stand out with competitive wins, project showcases, and official HIET & Tech Fusion merit honors.',
  },
  {
    icon: Cpu,
    glyph: '02',
    title: 'Hands-On Mastery',
    desc: 'Pressure-test your coding speed, circuit design, presentation craft, and stage confidence.',
  },
  {
    icon: Users,
    glyph: '03',
    title: 'High-Signal Network',
    desc: 'Collaborate with ambitious engineering and creative teams across Delhi-NCR and North India.',
  },
  {
    icon: Layers,
    glyph: '04',
    title: 'Zero Entry Fee',
    desc: '100% free online registration for all college students with instant confirmation Team IDs.',
  },
  {
    icon: Rocket,
    glyph: '05',
    title: 'Two Days of Momentum',
    desc: 'Two uninterrupted days of back-to-back technical duels, exhibitions, and live amphitheatre nights.',
  },
  {
    icon: Zap,
    glyph: '06',
    title: 'Push Past Limits',
    desc: 'Step onto the stage, debug against the clock, and leave sharper than you arrived.',
  },
];

export const timelineMilestones = [
  {
    step: '01',
    label: 'Registration Opens',
    date: 'January 10, 2027',
    detail: 'Online squad portal goes live',
  },
  {
    step: '02',
    label: 'Last Date to Register',
    date: 'January 31, 2027',
    detail: 'Portal locks at 11:59 PM IST',
  },
  {
    step: '03',
    label: 'Main Event Dates',
    date: '05 Feb & 06 Feb 2027',
    detail: 'HIET Ghaziabad Campus (NH-9)',
  },
];
