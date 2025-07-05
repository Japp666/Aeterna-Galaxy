
---

## 🚀 Cum editez codul (GitHub Web)

1. Deschide repo-ul pe GitHub.
2. Apasă tasta `.` (punct) — intri în editor online VS Code.
3. Selectează/creează fișiere, copiază-lipește conținut modificat.
4. La fiecare fișier, scrie un mesaj scurt la “Commit changes” și apasă **Commit**.
5. Reîncarcă pagina (Ctrl + F5) și vezi modificările live.

---

## 🌐 Cum rulează proiectul

- Fișierele din `public/` sunt servite de GitHub Pages (sau alt static-hosting).
- Deschide `index.html` în browser pentru a juca.
- Navighează între tab-uri din meniul principal; conținutul se încarcă dinamic.

---

## 🎨 Stiluri comune (components.css)

- Butoane: `.btn, button` au font Segoe UI, cursor pointer, tranziții la hover.  
- Card-uri: `.card` are colțuri rotunjite și box-shadow.  
- Modal-uri: `.modal` are colțuri rotunjite.

**Pentru ajustări:**  
1. Deschide `public/css/components.css`.  
2. Modifică/adauagă reguli CSS și **Commit**.  
3. Reîncarcă pagina.

---

## 🖥️ Cum adaug un tab nou

1. **HTML**  
   - Creează `public/components/<nume-tab>.html`  
   - Pune acolo conținutul (un container `.card` cu un `id` unic, ex. `<div id="mytab-content">…</div>`).

2. **JS**  
   - Creează `public/js/<nume-tab>-renderer.js` cu două funcții:
     ```js
     export async function load<MyTab>Content() { /* fetch… */ }
     export function init<MyTab>Tab() { /* logică, DOM etc. */ }
     ```
   - În `public/js/game-ui.js` la `displayTab()`, adaugă un `case 'mytab':` care:
     1. Fetch‐ează `components/mytab.html`
     2. Inserează în `#game-content`
     3. Apelează `initMyTabTab()`

3. **Meniu**  
   - În `index.html`, în `<nav class="main-menu">`, adaugă:
     ```html
     <button class="menu-button" data-tab="mytab">My Tab</button>
     ```
   - Asigură‐te că numele din `data-tab="mytab"` corespunde cazului din `game-ui.js`.

4. **Commit & Test**  
   - Salvează toate fișierele cu mesaje clare.  
   - Reîncarcă pagina și click pe butonul nou.

---

## 📘 Contribuții & Îmbunătățiri

- Urmează aceeași structură modulară.  
- Folosește `components.css` pentru stiluri comune.  
- JavaScript: keep each tab’s logic în fișiere dedicate.  
- Deschide un Pull Request cu explicații și teste minimale.

---

Cu acest README poți începe de la zero și extinde proiectul fără niciun setup local. Spor la dezvoltare! 🚀
