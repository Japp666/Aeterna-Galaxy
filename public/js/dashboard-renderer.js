export function renderDashboard(players = []) {
  const container = document.createElement("div");
  fetch("public/components/dashboard.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      document.getElementById("game-content").innerHTML = "";
      document.getElementById("game-content").appendChild(container);

      const coach = localStorage.getItem("coachNickname") || "-";
      const club = localStorage.getItem("clubName") || "-";
      const emblem = localStorage.getItem("clubEmblem") || "public/img/emblems/emblema01.png";
      const funds = localStorage.getItem("funds") || "0";

      document.getElementById("coach-name-display").textContent = coach;
      document.getElementById("club-name-display").textContent = club;
      document.getElementById("club-funds-display").textContent = `${funds} €`;

      document.getElementById("dashboard-club-emblem").src = emblem;
      document.getElementById("dashboard-club-name").textContent = club;

      // Update metrics
      document.getElementById("metric-players").textContent = players.length;

      const totalValue = players.reduce((acc, p) => acc + (p.value || 0), 0);
      document.getElementById("metric-value").textContent = `${totalValue.toLocaleString()} €`;

      const averageOVR = players.length ? Math.round(players.reduce((sum, p) => sum + (p.ovr || 0), 0) / players.length) : 0;
      document.getElementById("metric-ovr").textContent = averageOVR;
    });
}
