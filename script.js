// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Configurația ta Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDrzrFx64oOBifzVRlSkplv1mwI3m7pACg",
  authDomain: "galaxiaaeternagame-v1.firebaseapp.com",
  projectId: "galaxiaaeternagame-v1",
  storageBucket: "galaxiaaeternagame-v1.firebasestorage.app",
  messagingSenderId: "884241639596",
  appId: "1:884241639596:web:559b6742c2ea0dda855709"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elemente
const authSection = document.getElementById("auth-section");
const raceSection = document.getElementById("race-section");
const storySection = document.getElementById("story-section");
const storyText = document.getElementById("story-text");

// Poveste în funcție de rasă
const stories = {
  Syari: `Syari, descendenți ai Pământului, au supraviețuit unui cataclism cosmic și s-au adaptat în Galaxia Aeterna. Sunt pionieri ai alianțelor și căutători ai adevărului.`,
  Aethel: `Aethel sunt androizi creați de Arhitecți misterioși. După dispariția acestora, ei caută sensul propriei existențe și evoluția supremă.`
};

// Evenimente

document.getElementById("loginBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => showRaceSection())
    .catch(err => alert("Eroare login: " + err.message));
};

document.getElementById("registerBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => showRaceSection())
    .catch(err => alert("Eroare înregistrare: " + err.message));
};

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const race = card.dataset.race;
    localStorage.setItem("race", race);
    showStory(race);
  });
});

document.getElementById("startBtn").onclick = () => {
  alert("Misiunea ta a început! (aici urmează gameplay-ul)");
};

// Autentificare activă
onAuthStateChanged(auth, user => {
  if (user) {
    showRaceSection();
  }
});

// Afișează secțiunea rasei
function showRaceSection() {
  authSection.classList.add("hidden");
  raceSection.classList.remove("hidden");
}

// Afișează povestea
function showStory(race) {
  raceSection.classList.add("hidden");
  storyText.textContent = stories[race] || "Rasă necunoscută.";
  storySection.classList.remove("hidden");
}
