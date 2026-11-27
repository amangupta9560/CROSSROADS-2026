// Event Images
import event1 from '../../assets/coding.jpg';
import event2 from '../../assets/project.jpg';
import event3 from '../../assets/robo.jpg';
import event4 from '../../assets/cultural.jpg';
import event5 from '../../assets/rangoli.jpeg';
import event6 from '../../assets/food.jpg';
import event9 from '../../assets/poster.jpg';
import event10 from '../../assets/rock.jpg';
import event11 from '../../assets/dance.jpg';
import event12 from '../../assets/tresure.jpeg';
import event13 from '../../assets/film.jpeg';

// Winner Images
import w1 from '../../assets/w1.jpg';
import w2 from '../../assets/w2.jpg';
import w3 from '../../assets/w3.jpg';
import w4 from '../../assets/w4.jpg';
import w5 from '../../assets/w5.jpg';
import w6 from '../../assets/w6.jpg';
import w7 from '../../assets/w7.jpg';
import w8 from '../../assets/w8.jpg';
import w9 from '../../assets/w9.jpg';
import w10 from '../../assets/w10.jpg';
import w11 from '../../assets/w11.jpg';
import w12 from '../../assets/w12.jpg';
import w13 from '../../assets/w13.jpg';
import w14 from '../../assets/w14.jpg';

// Rules PDFs
import codeRules from '../../assets/CODE.pdf';
import posterRules from '../../assets/POSTER.pdf';
import roboRules from '../../assets/ROBO.pdf';
import foodRules from '../../assets/FOOD.pdf';
import rangoliRules from '../../assets/RANGOLI.pdf';
import shortFilmRules from '../../assets/SHORT.pdf';
import treasureRules from '../../assets/TREASURE.pdf';

export const eventsList = [
  {
    id: 1,
    imageSrc: event1,
    name: 'Code Puzzle',
    category: 'Technical',
    eventSlug: 'code-puzzle',
    dayBadge: 'Feb 05, 2027',
    rulesPdf: codeRules,
    details: {
      description:
        'A fast-paced solo coding challenge where participants solve puzzles in 20 minutes using any supported language (Python, Java, C++, etc.).',
      timing: 'Feb 05, 2027, 10:00 AM – 2:00 PM (submissions within slot)',
      location: 'Block 1 Computer Lab',
      judgingCriteria: 'Correctness, Efficiency, Code Quality (based on final score)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 2,
    imageSrc: event2,
    name: 'Project Exhibition / Project Evolution',
    category: 'Technical',
    eventSlug: 'project-exhibition',
    dayBadge: 'Feb 05, 2027',
    details: {
      description:
        'Showcase innovative student projects, prototypes, and engineering solutions (1–4 members) to judges and visitors.',
      timing: 'Feb 05, 2027, 10:00 AM – 2:00 PM',
      location: 'Exhibition Ground',
      judgingCriteria: 'Originality, Technical Execution, Impact, Presentation',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 3,
    imageSrc: event3,
    name: 'Robo Race',
    category: 'Technical',
    eventSlug: 'robo-race',
    dayBadge: 'Feb 05, 2027',
    rulesPdf: roboRules,
    details: {
      description:
        'Race custom robots (max 3 kg, 12V, wired/wireless) in squads of 1–4 through an obstacle track featuring ramps, seesaws, slippery paths, and marble pits.',
      timing: 'Feb 05, 2027, 10:00 AM – 2:00 PM',
      location: 'Block 3 Ground',
      judgingCriteria: 'Speed, Obstacle Navigation, Design, Control',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 4,
    imageSrc: event11,
    name: 'Dance Competition',
    category: 'Cultural',
    eventSlug: 'dance-competition',
    dayBadge: 'Feb 05, 2027',
    details: {
      description:
        'High-energy solo (3–5 min) and group (5–8 min) dance performances across classical, Bollywood, hip-hop, and fusion styles.',
      timing: 'Feb 05, 2027, 2:00 PM – 4:00 PM',
      location: 'Amphitheatre',
      judgingCriteria:
        'Choreography (20), Synchronization (20), Expression & Emotion (20), Costume & Props (20), Overall Impact (20)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 5,
    imageSrc: event5,
    name: 'Rangoli Competition',
    category: 'Cultural',
    eventSlug: 'rangoli-competition',
    dayBadge: 'Feb 05, 2027',
    rulesPdf: rangoliRules,
    details: {
      description:
        'Create a 5x5 ft rangoli in teams of 1–3, restricted to the "NATURE" theme. 1.5 hours to complete; no printed references allowed.',
      timing: 'Feb 05, 2027, 10:00 AM onwards (1.5 hr duration)',
      location: 'Amphitheatre',
      judgingCriteria:
        'Relevance to Theme, Creativity, Color Combination, Message through Rangoli, Overall Appearance & Appeal',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 6,
    imageSrc: event6,
    name: 'Food Without Fire',
    category: 'Cultural',
    eventSlug: 'food-without-fire',
    dayBadge: 'Feb 06, 2027',
    rulesPdf: foodRules,
    details: {
      description:
        'Prepare ready-to-eat dishes (sandwiches, salads, juices, shakes, fruits) in teams of 1–4 without any cooking, heating, or flame.',
      timing: 'Feb 06, 2027, 10:00 AM – 2:00 PM',
      location: 'Block 3 Corridor Area',
      judgingCriteria: 'Ingredients (organic/handmade), Taste, Presentation, Hygiene',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 9,
    imageSrc: event9,
    name: 'Technical Poster Competition',
    category: 'Technical',
    eventSlug: 'technical-poster',
    dayBadge: 'Feb 05, 2027',
    rulesPdf: posterRules,
    details: {
      description:
        'Handmade original posters on chart paper (no printouts, 3D objects, or photos) by teams of 1–4. Mention topic/theme clearly at top.',
      timing: 'Feb 05, 2027, 10:00 AM – 2:00 PM',
      location: 'Block 3 304 / Stage',
      judgingCriteria:
        'Content Clarity, Design & Creativity, Relevance, Presentation (explain in English/Hindi)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 10,
    imageSrc: event10,
    name: 'Rock Band / Cultural Performances',
    category: 'Cultural',
    eventSlug: 'rock-band',
    dayBadge: 'Feb 05, 2027',
    details: {
      description:
        'Live rock band performances and cultural acts (1–4 core registered performers) energizing the amphitheatre crowd.',
      timing: 'Feb 05, 2027, 6:00 PM – 8:00 PM',
      location: 'Amphitheatre',
      judgingCriteria: 'Music Quality, Stage Presence, Originality, Coordination',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 11,
    imageSrc: event13,
    name: 'Short Film Making',
    category: 'Cultural',
    eventSlug: 'short-film-maker',
    dayBadge: 'Feb 06, 2027',
    rulesPdf: shortFilmRules,
    details: {
      description:
        'Teams of max 2 create & edit a 30–60 sec original short film shot entirely on campus within a ~1 hour time constraint.',
      timing: 'Feb 06, 2027, 10:00 AM – 2:00 PM',
      location: 'Block 1 Lab F',
      judgingCriteria:
        'Concept & Storytelling (10%), Creativity & Innovation (20%), Technical Execution (20%), Overall Impact (incl. YouTube Likes 30%), Relevance to Theme (10%), Judges (10%)',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 12,
    imageSrc: event12,
    name: 'Treasure Hunt',
    category: 'Adventure',
    eventSlug: 'treasure-hunt',
    dayBadge: 'Feb 06, 2027',
    rulesPdf: treasureRules,
    details: {
      description:
        'Squad adventure (5–8 members) solving cryptic clues across campus. No outside help, no interference, safety first.',
      timing: 'Feb 06, 2027, 11:00 AM – 2:00 PM',
      location: 'Entire Campus / Block 3 Ground',
      judgingCriteria: 'Speed, Teamwork, Problem-Solving, Clue Completion',
      organizer: 'HIET Ghaziabad',
    },
  },
  {
    id: 13,
    imageSrc: event4,
    name: 'Crossroads Award & Closing',
    category: 'Ceremony',
    eventSlug: null,
    dayBadge: 'Feb 06, 2027',
    details: {
      description:
        'Grand closing ceremony recognizing overall fest champions, academic awards, and rolling trophy presentations.',
      timing: 'Feb 06, 2027, 4:00 PM – 6:00 PM',
      location: 'Amphitheatre',
      judgingCriteria: 'Based on cumulative podium finishes across official arenas',
      organizer: 'HIET Ghaziabad',
    },
  },
];

export const winnersList = [
  { id: 1, imageSrc: w1, name: 'Winner 1' },
  { id: 2, imageSrc: w2, name: 'Winner 2' },
  { id: 3, imageSrc: w3, name: 'Winner 3' },
  { id: 4, imageSrc: w4, name: 'Winner 4' },
  { id: 5, imageSrc: w5, name: 'Winner 5' },
  { id: 6, imageSrc: w6, name: 'Winner 6' },
  { id: 7, imageSrc: w7, name: 'Winner 7' },
  { id: 8, imageSrc: w8, name: 'Winner 8' },
  { id: 9, imageSrc: w9, name: 'Winner 9' },
  { id: 10, imageSrc: w10, name: 'Winner 10' },
  { id: 11, imageSrc: w11, name: 'Winner 11' },
  { id: 12, imageSrc: w12, name: 'Winner 12' },
  { id: 13, imageSrc: w13, name: 'Winner 13' },
  { id: 14, imageSrc: w14, name: 'Winner 14' },
];

export const CATEGORY_BADGE_MAP = {
  Technical: 'bg-[#C69B43] text-[#080D0B]',
  Cultural: 'bg-[#B86B35] text-[#FFF7E2]',
  Adventure: 'bg-[#243D2C] text-[#E8C574] border border-[#C69B43]/60',
  Ceremony: 'bg-[#E8C574] text-[#080D0B]',
};
