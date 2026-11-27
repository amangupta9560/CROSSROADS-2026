import {
  Users,
  Briefcase,
  Trophy,
  Star,
  Code2,
  Flame,
  Cpu,
  Sparkles,
  Music,
  Gamepad2,
} from 'lucide-react';

import chairman from '../../Teams/chairman.jpg';
import segalsir from '../../Teams/segalsir.webp';
import laveen from '../../Teams/laveen.webp';
import director from '../../Teams/director.jpeg';
import hodcs from '../../Teams/hodcs.png';
import hodmca from '../../Teams/hodmca.png';
import hodee from '../../Teams/hodee.png';

export const featuredEvents = [
  {
    title: 'Code Puzzle',
    category: 'Technical',
    chamber: 'Chamber I · Cipher Vault',
    icon: Code2,
    desc: 'Speed syntax and algorithmic debugging battle in 20 minutes.',
    tag: 'Solo Only',
    link: '/event-registration?event=code-puzzle',
    image: '/assets/lost-civilization/arena-code-puzzle.webp',
    glyph: '01',
  },
  {
    title: 'Robo Race',
    category: 'Robotics',
    chamber: 'Chamber II · Gauntlet Bridge',
    icon: Flame,
    desc: 'High-speed bots navigating obstacle ramps, seesaws, and pit traps.',
    tag: '1 - 4 Members',
    link: '/event-registration?event=robo-race',
    image: '/assets/lost-civilization/arena-robo-race.webp',
    glyph: '02',
  },
  {
    title: 'Project Exhibition',
    category: 'Technical',
    chamber: 'Chamber III · Relic Observatory',
    icon: Cpu,
    desc: 'Showcase working prototypes, AI systems, and hardware innovations.',
    tag: '1 - 4 Members',
    link: '/event-registration?event=project-exhibition',
    image: '/assets/lost-civilization/arena-project-exhibition.webp',
    glyph: '03',
  },
  {
    title: 'Dance Competition',
    category: 'Cultural',
    chamber: 'Chamber IV · Fire Amphitheatre',
    icon: Sparkles,
    desc: 'Electrifying solo performances judged on choreography, synchronization & expression.',
    tag: 'Solo Only',
    link: '/event-registration?event=dance-competition',
    image: '/assets/lost-civilization/arena-dance-competition.webp',
    glyph: '04',
  },
  {
    title: 'Rock Band',
    category: 'Cultural',
    chamber: 'Chamber V · Canyon Stage',
    icon: Music,
    desc: 'High-voltage live college band face-off under amphitheatre lights.',
    tag: '1 - 4 Members',
    link: '/event-registration?event=rock-band',
    image: '/assets/lost-civilization/arena-rock-band.webp',
    glyph: '05',
  },
  {
    title: 'Treasure Hunt',
    category: 'Adventure',
    chamber: 'Chamber VI · Compass Crossroads',
    icon: Gamepad2,
    desc: 'Campus-wide cryptic clues and checkpoint missions against the clock.',
    tag: '5 - 8 Squad',
    link: '/event-registration?event=treasure-hunt',
    image: '/assets/lost-civilization/arena-treasure-hunt.webp',
    glyph: '06',
  },
];

export const expeditionStats = [
  {
    icon: Users,
    value: '1,500+',
    numericTarget: 1500,
    suffix: '+',
    formatComma: true,
    label: 'Innovators Expected',
    rune: 'EXPEDITION FORCE',
  },
  {
    icon: Briefcase,
    value: '50+',
    numericTarget: 50,
    suffix: '+',
    formatComma: false,
    label: 'Colleges & Universities',
    rune: 'ALLIED REALMS',
  },
  {
    icon: Trophy,
    value: '11',
    numericTarget: 11,
    suffix: '',
    formatComma: false,
    label: 'Flagship Arenas',
    rune: 'ANCIENT CHAMBERS',
  },
  {
    icon: Star,
    value: '₹1L+',
    numericTarget: 1,
    prefix: '₹',
    suffix: 'L+',
    formatComma: false,
    label: 'Total Prize Pool',
    rune: 'TREASURE VAULT',
  },
];

export const teamMembers = [
  {
    name: 'Mr. Anand Prakash',
    role: 'Chairman',
    dept: 'HIET Group of Institutions',
    image: chairman,
    category: 'Executive Leadership',
    featured: true,
  },
  {
    name: 'Mr. Sunil Saigal',
    role: 'Advisor',
    dept: 'Advisory Board',
    image: segalsir,
    category: 'Executive Leadership',
    featured: true,
  },
  {
    name: 'Mr. Laveen Gidwani',
    role: 'Executive Director',
    dept: 'Administration & Leadership',
    image: laveen,
    category: 'Executive Leadership',
    featured: true,
  },
  {
    name: 'Dr. Pankaj Kumar Mishra',
    role: 'Director',
    dept: 'HIET Ghaziabad',
    image: director,
    category: 'Executive Leadership',
    featured: true,
  },
  {
    name: 'Dr. Tripti Choudhary',
    role: 'HOD - CSE',
    dept: 'Computer Science & Engineering',
    image: hodcs,
    category: 'Department Heads',
    featured: false,
  },
  {
    name: 'Mr. Bhaskar Sharma',
    role: 'HOD - BCA / MCA',
    dept: 'Computer Applications',
    image: hodmca,
    category: 'Department Heads',
    featured: false,
  },
  {
    name: 'Mr. Aman Srivastava',
    role: 'HOD - EE',
    dept: 'Electrical Engineering',
    image: hodee,
    category: 'Department Heads',
    featured: false,
  },
];

export const institutionalPartners = [
  {
    href: 'https://hiet.org/',
    logo: '/hiet.png',
    alt: 'HIET Ghaziabad',
    eyebrow: 'Host Institution',
    title: 'HIET Ghaziabad',
  },
  {
    href: 'https://sunstone.in/',
    logo: '/sunstone.jpg',
    alt: 'Sunstone',
    eyebrow: 'Academic Partner',
    title: 'Sunstone',
  },
  {
    href: 'https://linkedin.com/company/hiet-techfusion',
    logo: '/techfusion.png',
    alt: 'Team Tech Fusion',
    eyebrow: 'Technical Club',
    title: 'Team Tech Fusion',
  },
];

export const faqs = [
  {
    question: 'What is CROSSROADS 2027?',
    answer:
      'CROSSROADS 2027 is the annual inter-college technical and cultural festival hosted by Hi-Tech Institute of Engineering & Technology (HIET), Ghaziabad. It brings together over 1,500 students from engineering, management, and arts institutions across North India to compete in 11 flagship arenas.',
  },
  {
    question: 'When and where will CROSSROADS 2027 take place?',
    answer:
      'CROSSROADS 2027 will be held on 05 Feb & 06 Feb 2027 (February 5–6, 2027) at the sprawling HIET Ghaziabad campus (NH-9). Day 1 kicks off at 8:50 AM with registrations and inauguration, followed by competitions and cultural nights across both days.',
  },
  {
    question: 'When do registrations start and what is the last date?',
    answer:
      'Online registrations start on January 10, 2027 and officially close on January 31, 2027 at 11:59 PM. To ensure your team pass is generated and logistical arrangements are finalized, all participants must register online before the deadline.',
  },
  {
    question: 'Is there any registration fee?',
    answer:
      'No! Registration for CROSSROADS 2027 is completely free of cost for all student participants. Simply choose your event, submit your squad details, and your official Team Pass will be emailed instantly.',
  },
  {
    question: 'Can I participate in multiple events?',
    answer:
      'Yes! Participants are welcome to register for multiple competitions as long as their schedule slots do not clash. Please review the official schedule before signing up for overlapping tracks.',
  },
  {
    question: 'Will participants receive certificates and prizes?',
    answer:
      'Yes! All registered participants who attend receive an official Certificate of Participation. Winners in each event receive cash prizes, commemorative trophies, merit certificates, and exclusive sponsor gifts from our ₹1,00,000+ prize pool.',
  },
  {
    question: 'What documents should we bring to the fest?',
    answer:
      'Every participant must carry their valid College Identity Card and a copy of the official confirmation email containing their Team ID (e.g., HIET/CR/2027/001). Laptops, robot kits, or project setups should be brought by the respective teams.',
  },
];
