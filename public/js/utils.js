export function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function showMessage(text, type = 'info') {
  const div = document.createElement('div');
  div.className = `game-message ${type}`;
  div.textContent = text;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}
