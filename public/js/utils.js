export function generatePlayer(division) {
  const positions = ['Portar', 'Fundaș', 'Mijlocaș', 'Atacant'];
  const positionWeights = [0.2, 0.3, 0.3, 0.2];
  const ratingRanges = [
    [75, 90], [70, 85], [65, 80], [60, 75], [55, 70], [50, 65]
  ];
  const [minRating, maxRating] = ratingRanges[division - 1] || [50, 65];
  const rating = Math.floor(Math.random() * (maxRating - minRating + 1)) + minRating;
  const position = weightedRandom(positions, positionWeights);
  return {
    id: Date.now() + Math.random(),
    name: generatePlayerName(),
    position,
    rating,
    stamina: Math.floor(Math.random() * 21) + 70,
    morale: Math.floor(Math.random() * 21) + 60,
    salary: rating * 500,
    price: rating * 30000,
    contractYears: Math.floor(Math.random() * 3) + 1,
    isGenerated: true
  };
}

function generatePlayerName() {
  const prefixes = ['Zorak', 'Kael', 'Vyn', 'Xara', 'Nero'];
  const suffixes = ['Sol', 'Vex', 'Lyn', 'Zor', 'Rex'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

export function generateTeamName() {
  const prefixes = ['Nebula', 'Stellar', 'Quantum', 'Cosmic', 'Galactic'];
  const suffixes = ['United', 'Astra', 'FC', 'Rovers', 'Core'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

export function generateEmblem(clubName, division) {
  const emblemConfig = {
    shapes: ['circle', 'shield', 'star', 'hexagon'],
    symbols: ['comet', 'star', 'planet', 'spaceship'],
    colors: {
      primary: ['#00BFFF', '#800080', '#32CD32'],
      secondary: ['#B0B0B0', '#FFD700'],
      background: ['#0A0A23', '#1C2526']
    }
  };
  const seed = hashString(clubName + division);
  const rand = seededRandom(seed);
  const shape = emblemConfig.shapes[Math.floor(rand() * emblemConfig.shapes.length)];
  const symbol = emblemConfig.symbols[Math.floor(rand() * emblemConfig.symbols.length)];
  const primaryColor = emblemConfig.colors.primary[Math.floor(rand() * emblemConfig.colors.primary.length)];
  const secondaryColor = emblemConfig.colors.secondary[Math.floor(rand() * emblemConfig.colors.secondary.length)];
  const bgColor = emblemConfig.colors.background[Math.floor(rand() * emblemConfig.colors.background.length)];
  const showText = rand() > 0.3;
  const acronym = clubName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3);

  let svg = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect x="0" y="0" width="100" height="100" fill="${bgColor}" rx="10"/>`;
  if (shape === 'circle') {
    svg += `<circle cx="50" cy="50" r="40" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="3"/>`;
  } else if (shape === 'shield') {
    svg += `<path d="M50 10 L80 40 V80 Q50 90 20 80 V40 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="3"/>`;
  } else if (shape === 'star') {
    svg += `<path d="M50 10 L61 39 L90 39 L66 55 L76 85 L50 65 L24 85 L34 55 L10 39 L39 39 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="3"/>`;
  } else {
    svg += `<polygon points="50,10 86,30 86,70 50,90 14,70 14,30" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="3"/>`;
  }
  if (symbol === 'comet') {
    svg += `<path d="M30 70 Q50 50 70 30" stroke="${secondaryColor}" stroke-width="2" fill="none"/>`;
    svg += `<circle cx="70" cy="30" r="5" fill="${secondaryColor}"/>`;
  } else if (symbol === 'star') {
    svg += `<path d="M50 30 L55 45 L70 45 L58 55 L62 70 L50 60 L38 70 L42 55 L30 45 L45 45 Z" fill="${secondaryColor}"/>`;
  } else if (symbol === 'planet') {
    svg += `<circle cx="50" cy="50" r="15" fill="${secondaryColor}"/>`;
    svg += `<path d="M35 50 Q50 40 65 50" stroke="${primaryColor}" stroke-width="2" fill="none"/>`;
  } else {
    svg += `<path d="M40 60 L50 40 L60 60 L55 70 L45 70 Z" fill="${secondaryColor}"/>`;
  }
  if (showText) {
    svg += `<text x="50" y="${shape === 'shield' ? 85 : 75}" font-family="Orbitron" font-size="12" fill="${secondaryColor}" text-anchor="middle" style="text-shadow: 0 0 5px ${primaryColor}">${acronym}</text>`;
  }
  svg += `</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return () => {
    x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

function weightedRandom(items, weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
