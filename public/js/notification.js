// public/js/notification.js
export function showToast(msg, type = 'info', dur = 3000) {
  const area = document.getElementById('notification-area');
  if (!area) return console.warn('notification-area missing');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  area.appendChild(t);
  setTimeout(() => t.remove(), dur);
}
export function showSuccess(m) { showToast(m, 'success'); }
export function showError(m)   { showToast(m, 'error'); }
