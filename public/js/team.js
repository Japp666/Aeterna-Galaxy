<!-- public/components/team.html -->
<div id="team-content" class="card team-tab-container">
    <h2>Tactici și Formație</h2>
    <p>Configurați formația echipei și mentalitatea de joc.</p>

    <div class="tactics-section">
        <div class="tactics-group">
            <label>Formație:</label>
            <div id="formation-buttons" class="tactics-buttons-grid">
                <!-- Butoanele de formație vor fi injectate aici de JavaScript -->
            </div>
        </div>
        
        <!-- Grup nou pentru butoanele de mentalitate și auto-aranjare -->
        <div class="tactics-controls-group"> 
            <div class="tactics-group">
                <label>Mentalitate:</label>
                <div id="mentality-buttons" class="tactics-buttons-line">
                    <!-- Butoanele de mentalitate vor fi injectate aici de JavaScript -->
                </div>
            </div>
            <button id="auto-arrange-players-btn" class="btn btn-primary">Aranjează cei mai buni</button>
        </div>
    </div>

    <div id="football-pitch" class="football-pitch-container">
        <!-- Player slots will be injected here by JavaScript -->
    </div>

    <div id="available-players-list" class="available-players-list">
        <h3>Jucători Disponibili</h3>
        <!-- List of available players for drag-and-drop will be rendered here by JavaScript -->
    </div>
</div>
