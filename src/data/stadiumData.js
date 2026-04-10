// ═══════════════════════════════════════════════════════
// SMART STADIUM — Stadium Data & Simulation Engine
// All crowd/queue data is simulated client-side
// ═══════════════════════════════════════════════════════

// ── Helper: random integer ──
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ── Helper: crowd status from level ──
export const getCrowdStatus = (level) => {
  if (level <= 35) return { label: 'Free', color: 'green', emoji: '✅' };
  if (level <= 65) return { label: 'Moderate', color: 'yellow', emoji: '⚠️' };
  return { label: 'Crowded', color: 'red', emoji: '❌' };
};

// ═══ GATES ═══
export const initialGates = [
  { id: 'A', name: 'Gate A — North', crowdLevel: 72, icon: '🏟️' },
  { id: 'B', name: 'Gate B — East', crowdLevel: 28, icon: '🏟️' },
  { id: 'C', name: 'Gate C — South', crowdLevel: 55, icon: '🏟️' },
  { id: 'D', name: 'Gate D — West', crowdLevel: 41, icon: '🏟️' },
];

// ═══ DESTINATIONS ═══
export const destinations = [
  { id: 'seat', label: 'My Seat', icon: '💺' },
  { id: 'food', label: 'Food Court', icon: '🍔' },
  { id: 'washroom', label: 'Washroom', icon: '🚻' },
  { id: 'merch', label: 'Merchandise', icon: '🛍️' },
];

// ═══ ROUTES ═══
export const initialRoutes = {
  seat: [
    { id: 'seat-a', name: 'Route A — Main Corridor', walkTime: '4 min', crowdLevel: 68 },
    { id: 'seat-b', name: 'Route B — Side Aisle', walkTime: '6 min', crowdLevel: 22 },
    { id: 'seat-c', name: 'Route C — Upper Deck', walkTime: '7 min', crowdLevel: 45 },
  ],
  food: [
    { id: 'food-a', name: 'Route A — Level 1 Direct', walkTime: '3 min', crowdLevel: 75 },
    { id: 'food-b', name: 'Route B — Level 2 Bypass', walkTime: '5 min', crowdLevel: 30 },
  ],
  washroom: [
    { id: 'wc-a', name: 'Route A — Near Gate A', walkTime: '2 min', crowdLevel: 60 },
    { id: 'wc-b', name: 'Route B — Near Gate C', walkTime: '4 min', crowdLevel: 18 },
  ],
  merch: [
    { id: 'merch-a', name: 'Route A — Main Hall', walkTime: '5 min', crowdLevel: 50 },
    { id: 'merch-b', name: 'Route B — Side Entrance', walkTime: '7 min', crowdLevel: 25 },
  ],
};

// ═══ FOOD STALLS ═══
export const initialFoodStalls = [
  { id: 'stall-1', name: 'Burger Barn', cuisine: 'Burgers & Fries', waitTime: 18, queueLength: 12, icon: '🍔' },
  { id: 'stall-2', name: 'Pizza Planet', cuisine: 'Pizzas & Slices', waitTime: 5, queueLength: 3, icon: '🍕' },
  { id: 'stall-3', name: 'Taco Town', cuisine: 'Tacos & Burritos', waitTime: 12, queueLength: 8, icon: '🌮' },
  { id: 'stall-4', name: 'Noodle Nook', cuisine: 'Noodles & Ramen', waitTime: 22, queueLength: 15, icon: '🍜' },
  { id: 'stall-5', name: 'Fresh Juice Bar', cuisine: 'Juices & Smoothies', waitTime: 3, queueLength: 2, icon: '🥤' },
  { id: 'stall-6', name: 'Hot Dog Hub', cuisine: 'Hot Dogs & Snacks', waitTime: 8, queueLength: 5, icon: '🌭' },
];

// ═══ WASHROOMS ═══
export const initialWashrooms = [
  { id: 'wc-north', zone: 'North Wing', distance: '2 min walk', queueLength: 8, waitTime: 6, icon: '🚻' },
  { id: 'wc-south', zone: 'South Wing', distance: '4 min walk', queueLength: 3, waitTime: 2, icon: '🚻' },
  { id: 'wc-east', zone: 'East Wing', distance: '3 min walk', queueLength: 12, waitTime: 10, icon: '🚻' },
  { id: 'wc-west', zone: 'West Wing', distance: '5 min walk', queueLength: 1, waitTime: 1, icon: '🚻' },
];

// ═══ EMERGENCY EXITS ═══
export const initialEmergencyExits = [
  { id: 'exit-a', name: 'Exit A — North Gate', crowdLevel: 70, distance: '2 min', icon: '🚪' },
  { id: 'exit-b', name: 'Exit B — East Gate', crowdLevel: 25, distance: '3 min', icon: '🚪' },
  { id: 'exit-c', name: 'Exit C — South Gate', crowdLevel: 45, distance: '4 min', icon: '🚪' },
  { id: 'exit-d', name: 'Exit D — West Gate', crowdLevel: 15, distance: '5 min', icon: '🚪' },
];

// ═══ GAME DATA ═══
export const wheelPrizes = [
  { label: '🍔 Free Burger', points: 50, color: '#ef4444' },
  { label: '10 Points', points: 10, color: '#3b82f6' },
  { label: '🥤 Free Drink', points: 30, color: '#22c55e' },
  { label: '5 Points', points: 5, color: '#eab308' },
  { label: '🎟️ VIP Pass', points: 100, color: '#7c3aed' },
  { label: '20 Points', points: 20, color: '#06b6d4' },
  { label: '🍕 Free Slice', points: 40, color: '#f97316' },
  { label: '💎 Jackpot!', points: 200, color: '#ec4899' },
];

export const quizQuestions = [
  {
    question: 'Which stadium is the largest in the world by capacity?',
    options: ['Wembley', 'Camp Nou', 'Rungrado May Day', 'Maracanã'],
    correct: 2,
  },
  {
    question: 'How many players are on a football (soccer) team?',
    options: ['9', '10', '11', '12'],
    correct: 2,
  },
  {
    question: 'In which year were the first modern Olympics held?',
    options: ['1896', '1900', '1888', '1912'],
    correct: 0,
  },
  {
    question: 'What does "MVP" stand for in sports?',
    options: ['Most Viable Player', 'Most Valuable Player', 'Most Versatile Player', 'Main Victory Player'],
    correct: 1,
  },
  {
    question: 'Which sport uses a shuttlecock?',
    options: ['Tennis', 'Badminton', 'Cricket', 'Volleyball'],
    correct: 1,
  },
];

// ═══ SIMULATION FUNCTIONS ═══
export function simulateCrowdLevels(items) {
  return items.map(item => ({
    ...item,
    crowdLevel: Math.max(5, Math.min(95, item.crowdLevel + rand(-15, 15))),
  }));
}

export function simulateRoutes(routes) {
  const result = {};
  for (const key in routes) {
    result[key] = routes[key].map(r => ({
      ...r,
      crowdLevel: Math.max(5, Math.min(95, r.crowdLevel + rand(-12, 12))),
    }));
  }
  return result;
}

export function simulateFoodStalls(stalls) {
  return stalls.map(s => {
    const newQueue = Math.max(0, s.queueLength + rand(-3, 3));
    return {
      ...s,
      queueLength: newQueue,
      waitTime: Math.max(1, Math.round(newQueue * 1.5)),
    };
  });
}

export function simulateWashrooms(washrooms) {
  return washrooms.map(w => {
    const newQueue = Math.max(0, w.queueLength + rand(-2, 2));
    return {
      ...w,
      queueLength: newQueue,
      waitTime: Math.max(0, Math.round(newQueue * 0.8)),
    };
  });
}
