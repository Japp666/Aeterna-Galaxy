// Fișier pentru funcții utilitare comune.
// Obiectul `user` este acum exportat din `user.js`

export function showMessage(text) {
  const box = document.getElementById('tutorial-box'); // Reutilizăm tutorial-box pentru mesaje
  if (box) {
    box.textContent = text;
    box.classList.add('visible');
    setTimeout(() => {
      box.classList.remove('visible');
    }, 4000); // Mesajul dispare după 4 secunde
  }
}

// Poți adăuga alte funcții utilitare aici dacă este nevoie
