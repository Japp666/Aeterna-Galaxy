function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[randomBetween(0, arr.length - 1)];
}

export function generatePlayer({ position, age, potential } = {}) {
  const pos = position || randomChoice(["GK", "DEF", "MID", "FWD"]);
  const a = age || randomBetween(16, 40);
  const p = potential || (a < 20 ? randomBetween(70, 95) : a < 28 ? randomBetween(60, 85) : randomBetween(40, 70));
  const salary = randomBetween(1000, 50000);
  const posCoef = { GK: 12, DEF: 10, MID: 11, FWD: 13 }[pos];
  const marketValue = Math.round(salary * posCoef * (Math.random() * (1.5 - 1) + 1));
  return {
    id: `p_${Date.now()}_${Math.random()}`,
    name: `${randomChoice(["Xyra", "Kael", "Draconis"])} ${randomChoice(["Zen", "Rin", "Qor"])}`,
    age: a,
    position: pos,
    potential: p,
    attributes: {},
    salary,
    marketValue,
    nationality: "Terran",
    jerseyNumber: randomBetween(1, 99)
  };
}

export function generateInitialSquad() {
  const starters = Array.from({ length: 11 }, () => generatePlayer());
  const reserves = Array.from({ length: 5 }, () => generatePlayer());
  return { starters, reserves };
}

export function generateMarketList(count = 50) {
  return Array.from({ length: count }, () => generatePlayer());
}
