// public/js/setup.js
import {
  updateGameState,
  saveGameState,
  generateLeagueSystem
} from './game-state.js';
import { generateInitialPlayers } from './player-generator.js';

let onComplete = null;
export function initSetupScreen(callback) {
  onComplete = callback;
  const form = document.getElementById('setupForm');
  const cIn  = document.getElementById('coachNickname');
  const clubIn= document.getElementById('clubName');
  const embs = document.getElementById('emblemsContainer');
  const btn  = document.getElementById('startButton');
  embs.innerHTML='';

  for (let i=1;i<=20;i++){
    const code=String(i).padStart(2,'0');
    const img=document.createElement('img');
    img.src=`img/emblems/emblema${code}.png`;
    img.alt=`${code}`;
    img.dataset.url=img.src;
    img.classList.add('emblem-option');
    img.onerror=function(){this.onerror=null;this.src='img/emblems/emblema01.png';};
    img.onclick=()=>{
      embs.querySelectorAll('.emblem-option').forEach(e=>e.classList.remove('selected'));
      img.classList.add('selected'); validate();
    };
    embs.appendChild(img);
  }

  function validate(){
    btn.disabled = !(
      cIn.value.trim() &&
      clubIn.value.trim() &&
      embs.querySelector('.selected')
    );
  }
  cIn.oninput=validate; clubIn.oninput=validate;

  form.onsubmit=e=>{
    e.preventDefault();
    const sel = embs.querySelector('.selected');
    if (!sel) return;
    const divs = generateLeagueSystem();
    updateGameState({
      isGameStarted:true,
      coach:{ nickname:cIn.value.trim(), reputation:50, experience:0 },
      club:{ name:clubIn.value.trim(), emblemUrl:sel.dataset.url, funds:10000000, reputation:50, facilitiesLevel:1 },
      players: generateInitialPlayers(25),
      currentSeason:1, currentDay:1, currentFormation:'4-4-2', currentMentality:'balanced',
      teamFormation:{}, divisions:divs, currentDivision:10
    });
    saveGameState();
    onComplete?.();
  };
}
