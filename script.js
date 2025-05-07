// Firebase Config (înlocuiește cu configul tău dacă se schimbă)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrzrFx64oOBifzVRlSkplv1mwI3m7pACg",
  authDomain: "galaxiaaeternagame-v1.firebaseapp.com",
  projectId: "galaxiaaeternagame-v1",
  storageBucket: "galaxiaaeternagame-v1.appspot.com",
  messagingSenderId: "884241639596",
  appId: "1:884241639596:web:559b6742c2ea0dda855709"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI Elements
const authSection = document.getElementById("auth-section");
const raceSection = document.getElementById("race-section");
const storySection = document.getElementById("story-section");
const storyText = document.getElementById("story-text");

// Povestea în funcție de rasă
const stories = {
  Syari: "Ca Syari, ai fost ales să păzești echilibrul cosmic. Inteligența ta spirituală este cheia pentru salvarea galaxiilor unite sub simbolul Aeterna.",
  Aethel: "Ca Aethel, curajul și cunoașterea ta îți oferă puterea de a descoperi secretele universului. Te așteaptă o misiune periculoasă în Sectorul Umbrelor."
};

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => showRaceSelection())
    .catch((error) => alert("Login error: " + error.message));
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => showRaceSelection())
    .catch((error) => alert("Register error: " + error.message));
}

function showRaceSelection() {
  authSection.classList.add("hidden");
  raceSection.classList.remove("hidden");
}

function selectRace(race) {
  localStorage.setItem("chosenRace", race);
  raceSection.classList.add("hidden");
  storySection.classList.remove("hidden");
  storyText.textContent = stories[race];
}

function startMission() {
  alert("Misiunea ta începe acum. Revenim cu gameplay în versiunea următoare!");
}

// Dacă utilizatorul e deja logat
onAuthStateChanged(auth, (user) => {
  if (user) {
    const race = localStorage.getItem("chosenRace");
    if (race) {
      showRaceSelection();
      selectRace(race);
    } else {
      showRaceSelection();
    }
  }
});
