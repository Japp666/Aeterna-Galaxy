function selectRace(race) {
  // Afișează un mesaj de confirmare
  alert("Ai selectat rasa: " + race);

  // Salvează selecția în localStorage
  localStorage.setItem("selectedRace", race);

  // Redirecționează utilizatorul către pagina următoare (ex: dashboard.html)
  window.location.href = "dashboard.html";
}
