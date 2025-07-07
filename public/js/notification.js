// public/js/notification.js

export function showToast(message, type = 'info', duration = 3000) {
  const area = document.getElementById('notification-area');
  if (!area) {
    console.warn('notification-area missing');
    return;
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  area.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

export function showSuccess(msg) {
  showToast(msg, 'success');
}

export function showError(msg) {
  showToast(msg, 'error');
}
