// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDrzrFx64oOBifzVRlSkplv1mwI3m7pACg",
  authDomain: "galaxiaaeternagame-v1.firebaseapp.com",
  projectId: "galaxiaaeternagame-v1",
  storageBucket: "galaxiaaeternagame-v1.firebasestorage.app",
  messagingSenderId: "884241639596",
  appId: "1:884241639596:web:559b6742c2ea0dda855709"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const authSection = document.getElementById("auth-section");
const raceSection = document.getElementById("race-section");
const storySection = document.getElementById("story-section");
const dashboard = document.getElementById("dashboard");
const storyText = document.getElementById("story-text");
const metalEl = document.getElementById("metal");
const crystalEl = document.getElementById("crystal");
const energyEl = document.getElementById("energy");
const mineLevelEl = document.getElementById("mine-level");
const upgradeCostEl = document.getElementById("upgrade-cost");

let resources = {
  metal: 0,
  crystal: 0,
  energy: 0
};

let mineLevel = 1;

// Povestea fiecărei rase
const stories = {
  Syari: `Syari, descendenți ai Pământului, au supraviețuit unui cataclism cosmic și s-au adaptat în Galaxia Aeterna. Sunt pionieri ai alianțelor și căutători ai adevărului.`,
  Aethel: `Aethel sunt androizi creați de Arhitecți misterioși. După dispariția acestora, ei caută sensul propriei existențe și evoluția supremă.`
};

// -------------------------
// Login / Register
// -------------------------
document.getElementById("loginBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => showRaceOrDashboard())
    .catch(err => alert("Eroare login: " + err.message));
};

document.getElementById("registerBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => showRaceOrDashboard())
    .catch(err => alert("Eroare înregistrare: " + err.message));
};

// -------------------------
// Selectare rasă
// -------------------------
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const race = card.dataset.race;
    localStorage.setItem("race", race);
    storyText.textContent = stories[race] || "Rasă necunoscută.";
    raceSection.classList.add("hidden");
    storySection.classList.remove("hidden");
  });
});

// -------------------------
// Poveste → Dashboard
// -------------------------
document.getElementById("startBtn").onclick = () => {
  storySection.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadDashboard();
};

// -------------------------
// Logica Dashboard
// -------------------------
document.getElementById("mine-btn").onclick = () => {
  const gain = mineLevel * 50;
  resources.metal += gain;
  updateResources();
};

document.getElementById("upgrade-btn").onclick = () => {
  const cost = 200 * mineLevel;
  if (resources.metal >= cost) {
    resources.metal -= cost;
    mineLevel++;
    updateResources();
  } else {
    alert("Nu ai suficient metal!");
  }
};

function updateResources() {
  metalEl.textContent = resources.metal;
  crystalEl.textContent = resources.crystal;
  energyEl.textContent = resources.energy;
  mineLevelEl.textContent = mineLevel;
  upgradeCostEl.textContent = 200 * mineLevel;
}

// -------------------------
// Init pe login activ
// -------------------------
onAuthStateChanged(auth, user => {
  if (user) {
    showRaceOrDashboard();
  }
});

// -------------------------
// Utilitare
// -------------------------
function showRaceOrDashboard() {
  authSection.classList.add("hidden");
  const race = localStorage.getItem("race");
  if (!race) {
    raceSection.classList.remove("hidden");
  } else {
    storyText.textContent = stories[race] || "";
    storySection.classList.remove("hidden");
  }
}

function loadDashboard() {
  updateResources();
}
