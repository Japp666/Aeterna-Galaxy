// public/js/notification.js

const container = document.getElementById('notification-area');

/**
 * Afișează un toast de succes.
 * @param {string} msg
 */
export function showSuccess(msg) {
  showToast(msg, '#00e6e6');
}

/**
 * Afișează un toast de eroare.
 * @param {string} msg
 */
export function showError(msg) {
  showToast(msg, '#e74c3c');
}

// Helper intern
function showToast(msg, bgColor) {
  if (!container) return console.warn('notification-area missing');
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    backgroundColor: bgColor,
    color: '#1f2d3d',
    padding: '10px 16px',
    marginTop: '8px',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    opacity: '0',
    transform: 'translateY(-10px)',
    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
    fontFamily: 'Segoe UI, sans-serif'
  });
  container.appendChild(toast);

  // Trigger apariție
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  // Îndepărtare automată după 3s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}
