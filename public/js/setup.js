import { updateGameState } from './game-state.js';
import { generateInitialPlayers } from './player-generator.js';

const emblemUrls = [
  "https://i.postimg.cc/mkB8cRGQ/01.png",
  "https://i.postimg.cc/hjFCBTyZ/02.png",
  "https://i.postimg.cc/QMK6w0bW/03.png",
  "https://i.postimg.cc/TwrtY1Bd/04.png",
  "https://i.postimg.cc/vThXfjQC/05.png",
  "https://i.postimg.cc/bY9m7GQL/06.png",
  "https://i.postimg.cc/jdqMtscT/07.png",
  "https://i.postimg.cc/ncd0L6SD/08.png",
  "https://i.postimg.cc/zGVpH04P/09.png",
  "https://i.postimg.cc/4xqP6pg4/10.png"
];

export function initSetupScreen(onSetupComplete) {
  console.log("setup.js: Inițializare ecran setup");

  const nicknameInput = document.getElementById('coach-nickname');
  const clubNameInput = document.getElementById('club-name');
  const startBtn = document.getElementById('start-game-btn');
  const emblemContainer = document.getElementById('emblems-container');

  let selectedEmblemUrl = null;

  function checkFormValidity() {
    const nickname = nicknameInput.value.trim();
    const clubName = clubNameInput.value.trim();
    startBtn.disabled = !(nickname && clubName && selectedEmblemUrl);
  }

  function renderEmblems() {
    emblemUrls.forEach((url, idx) => {
      const card = document.createElement('div');
      card.classList.add('emblem-card');
      card.dataset.url = url;

      const img = document.createElement('img');
      img.src = url;
      img.alt = `Emblemă ${idx + 1}`;

      card.appendChild(img);
      emblemContainer.appendChild(card);

      card.addEventListener('click', () => {
        document.querySelectorAll('.emblem-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedEmblemUrl = url;
        checkFormValidity();
      });
    });
  }

  nicknameInput.addEventListener('input', checkFormValidity);
  clubNameInput.addEventListener('input', checkFormValidity);

  startBtn.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    const clubName = clubNameInput.value.trim();

    const initialPlayers = generateInitialPlayers(25);

    updateGameState({
      isGameStarted: true,
      coach: { nickname },
      club: {
        name: clubName,
        emblemUrl: selectedEmblemUrl,
        funds: 1000000,
        energy: 100
      },
      players: initialPlayers,
      currentFormation: '4-4-2',
      currentMentality: 'normal'
    });

    onSetupComplete();
  });

  renderEmblems();
}
