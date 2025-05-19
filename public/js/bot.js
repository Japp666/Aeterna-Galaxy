export function startBotSimulation() {
  const bot = {
    name: 'Zeta',
    resources: {
      metal: 10000,
      crystal: 8000,
      energy: 6000
    },
    buildings: {
      powerPlant: 1,
      metalMine: 1,
      crystalMine: 1
    },
    research: {
      miningTech: 0,
      crystalTech: 0
    }
  };

  function upgradeRandom() {
    const possible = ['powerPlant', 'metalMine', 'crystalMine'];
    const choice = possible[Math.floor(Math.random() * possible.length)];
    if (!bot.buildings[choice]) bot.buildings[choice] = 1;
    else bot.buildings[choice]++;

    console.log(`[BOT] Comandant Zeta a upgradat ${choice} la nivel ${bot.buildings[choice]}`);
  }

  setInterval(() => {
    bot.resources.metal += 100;
    bot.resources.crystal += 75;
    bot.resources.energy += 60;

    if (Math.random() > 0.7) upgradeRandom();
  }, 5000);
}
