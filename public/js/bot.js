const bot = {
  name: 'Comandant Zeta',
  resources: {
    metal: 5000,
    crystal: 3000,
    energy: 2000
  },
  buildings: [
    { name: 'Extractor Metal', level: 1 },
    { name: 'Extractor Cristal', level: 1 },
    { name: 'Generator Energie', level: 1 },
    { name: 'Centrul de Comandă', level: 0 },
    { name: 'Laborator Cercetare', level: 0 }
  ],
  coords: [5, 5]
};

function botTick() {
  // generează resurse pasive
  bot.resources.metal += bot.buildings[0].level * 15;
  bot.resources.crystal += bot.buildings[1].level * 10;
  bot.resources.energy += bot.buildings[2].level * 8;

  // șansă 30% să facă un upgrade random
  if (Math.random() < 0.3) {
    const upgradable = bot.buildings.filter(b => b.level < 5);
    const chosen = upgradable[Math.floor(Math.random() * upgradable.length)];

    if (chosen) {
      chosen.level++;
      console.log(`[BOT] ${bot.name} a upgradat ${chosen.name} la nivel ${chosen.level}`);
    }
  }
}

setInterval(botTick, 5000); // bot acționează la fiecare 5 secunde

