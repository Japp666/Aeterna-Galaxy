import { user } from './user.js';
import { updateResources } from './utils.js';

let tutorialStep = 0;

function checkTutorial(buildings) {
  const metal = buildings.find(b => b.name === 'Extractor Metal');
  const crystal = buildings.find(b => b.name === 'Extractor Cristal');
  const energy = buildings.find(b => b.name === 'Generator Energie');
  const command = buildings.find(b => b.name === 'Centrul de Comandă');

  if (tutorialStep === 0 && metal.level >= 1) {
    user.resources.metal += 1000;
    showMessage("Felicitări! Ai primit +1000 metal");
    tutorialStep++;
  }

  else if (tutorialStep === 1 && crystal.level >= 1) {
    user.resources.crystal += 1000;
    showMessage("Ai primit +1000 cristal");
    tutorialStep++;
  }

  else if (tutorialStep === 2 && energy.level >= 1) {
    user.resources.energy += 1000;
    showMessage("Ai primit +1000 energie");
    tutorialStep++;
  }

  else if (tutorialStep === 3 && metal.level >= 1 && crystal.level >= 1 && energy.level >= 1) {
    user.resources.metal += 500;
    user.resources.crystal += 500;
    user.resources.energy += 500;
    showMessage("Ai primit +500 din fiecare resursă");
    tutorialStep++;
  }

  else if (tutorialStep === 4 && command.level >= 1) {
    user.resources.crystal += 1000;
    user.resources.energy += 1500;
    showMessage("Upgrade reușit! Ai primit +1000 cristal și +1500 energie");
    tutorialStep++;
  }
}

function showMessage(text) {
  const box = document.getElementById('tutorial-box');
  box.textContent = text;
  box.classList.add('visible');

  setTimeout(() => {
    box.classList.remove('visible');
    updateResources();
  }, 4000);
}

export { checkTutorial };

