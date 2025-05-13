# 🌌 Galaxia Aeterna

**Galaxia Aeterna** este un joc de strategie SF, în care jucătorul își dezvoltă o bază spațială, extrage resurse, cercetează tehnologii și își extinde influența în galaxie.

---

## 🚀 Funcționalități implementate

- ✅ Sistem de login local (nume jucător)
- ✅ Selectarea rasei (doar Solari activă)
- ✅ HUD cu afișare resurse și producție / minut
- ✅ Taburi funcționale: Clădiri, Cercetare, Harta, Flotă, Șantier Naval
- ✅ Clădiri cu niveluri, costuri și timp de construcție
- ✅ Cercetare cu bonusuri aplicate producției
- ✅ Hartă galactică interactivă (cu coordonate și hover)

---

## ⚙️ Tehnologii folosite

- 🧩 **HTML modular** (componente separate în `/components`)
- 🎨 **CSS modular** (în `/css`, stiluri separate pe funcții)
- 💻 **JavaScript ES Modules** (cod organizat în `/js`)
- 🌐 Fără backend (totul rulează local sau în browser)

---

## ▶️ Cum rulezi jocul local

1. Clonează repository-ul sau descarcă `.zip`
2. Deschide `index.html` într-un browser modern (Chrome, Firefox)
3. **Important:** serverul local e recomandat (ex: Live Server în VS Code), altfel `fetch()` nu va funcționa pentru componente.

> Poți folosi [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) în VSCode pentru rulare locală.

---

## 🧱 Structura proiectului

├── index.html
├── css/
│ ├── main.css
│ ├── hud.css
│ ├── menu.css
│ ├── buildings.css
│ └── map.css
├── js/
│ ├── main.js
│ ├── buildings.js
│ ├── research.js
│ ├── map.js
│ ├── utils.js
│ └── user.js
├── components/
│ ├── login.html
│ ├── race-select.html
│ ├── hud.html
│ ├── menu.html
│ ├── tab-buildings.html
│ ├── tab-research.html
│ ├── tab-map.html
│ ├── tab-fleet.html
│ └── tab-shipyard.html
