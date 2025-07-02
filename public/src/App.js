import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, addDoc } from 'firebase/firestore';

// Importă funcțiile de randare a terenului și de plasare a jucătorilor
// NOU: Căile de import sunt acum direct în directorul 'src/'
import { renderPitch, placePlayersInPitchSlots, renderAvailablePlayers } from './pitch-renderer.js';
import { FORMATIONS } from './tactics-data.js';

// Componenta principală a aplicației
const App = () => {
    // Stări pentru a gestiona inițializarea Firebase și datele jocului
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stări pentru datele specifice utilizatorului
    const [myClub, setMyClub] = useState(null);
    const [myPlayers, setMyPlayers] = useState([]);
    const [myTeamFormation, setMyTeamFormation] = useState({}); // Stocăm formația activă a jucătorului

    // Stări pentru formularele de creare
    const [newClubName, setNewClubName] = useState('');
    const [newClubCity, setNewClubCity] = useState('');
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerOverall, setNewPlayerOverall] = useState(70);
    const [newPlayerPosition, setNewPlayerPosition] = useState('CM');

    // Stare pentru navigarea între tab-uri
    const [activeTab, setActiveTab] = useState('myClub'); // 'myClub', 'tactics', 'myPlayers'

    // Stare pentru formația selectată pe teren
    const [selectedFormation, setSelectedFormation] = useState('4-4-2');
    const [selectedMentality, setSelectedMentality] = useState('balanced');

    // Referințe la elementele DOM pentru randarea terenului
    const footballPitchRef = useRef(null);
    const availablePlayersListRef = useRef(null);

    // Efect pentru inițializarea Firebase și autentificare
    useEffect(() => {
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
            const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null; 

            if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
                throw new Error("Firebase config is missing or empty.");
            }

            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);

            setDb(firestoreDb);
            setAuth(firebaseAuth);

            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                    setLoading(false);
                } else {
                    try {
                        if (initialAuthToken) {
                            await signInWithCustomToken(firebaseAuth, initialAuthToken);
                        } else {
                            await signInAnonymously(firebaseAuth);
                        }
                    } catch (authError) {
                        console.error("Eroare la autentificarea Firebase:", authError);
                        setError("Nu s-a putut autentifica la Firebase. Verificați configurația.");
                        setLoading(false);
                    }
                }
            });

            return () => unsubscribe();
        } catch (err) {
            console.error("Eroare la inițializarea Firebase:", err);
            setError(`Eroare la inițializarea Firebase: ${err.message}`);
            setLoading(false);
        }
    }, []);

    // Efect pentru a asculta modificările datelor specifice utilizatorului (clubul și jucătorii)
    useEffect(() => {
        if (db && userId && isAuthReady) {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

            // Listener pentru clubul utilizatorului
            const myClubDocRef = doc(db, `artifacts/${appId}/users/${userId}/myClub/clubData`);
            const unsubscribeMyClub = onSnapshot(myClubDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setMyClub({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setMyClub(null); // Niciun club creat încă
                }
            }, (err) => {
                console.error("Eroare la preluarea clubului utilizatorului:", err);
                setError("Eroare la preluarea datelor clubului tău.");
            });

            // Listener pentru jucătorii utilizatorului
            const myPlayersCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/myPlayers`);
            const unsubscribeMyPlayers = onSnapshot(myPlayersCollectionRef, (snapshot) => {
                const fetchedPlayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMyPlayers(fetchedPlayers);
            }, (err) => {
                console.error("Eroare la preluarea jucătorilor utilizatorului:", err);
                setError("Eroare la preluarea datelor jucătorilor tăi.");
            });

            // Listener pentru formația utilizatorului (dacă există)
            const myFormationDocRef = doc(db, `artifacts/${appId}/users/${userId}/myTeamFormation/formationData`);
            const unsubscribeMyFormation = onSnapshot(myFormationDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setMyTeamFormation(docSnap.data());
                } else {
                    setMyTeamFormation({}); // Nicio formație salvată încă
                }
            }, (err) => {
                console.error("Eroare la preluarea formației utilizatorului:", err);
                setError("Eroare la preluarea formației tale.");
            });


            return () => {
                unsubscribeMyClub();
                unsubscribeMyPlayers();
                unsubscribeMyFormation();
            };
        }
    }, [db, userId, isAuthReady]);

    // Funcție pentru a crea un club nou pentru utilizator
    const handleCreateClub = async (e) => {
        e.preventDefault();
        if (!db || !userId) {
            setError("Firebase nu este gata sau utilizatorul nu este autentificat.");
            return;
        }
        if (!newClubName.trim() || !newClubCity.trim()) {
            setError("Numele clubului și orașul nu pot fi goale.");
            return;
        }

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const myClubDocRef = doc(db, `artifacts/${appId}/users/${userId}/myClub/clubData`);

        const newClubData = {
            id: userId, // Folosim userId ca ID pentru clubul utilizatorului
            name: newClubName.trim(),
            shortName: newClubName.trim().substring(0, 3).toUpperCase(),
            city: newClubCity.trim(),
            country: "România", // Default
            yearFounded: new Date().getFullYear(),
            stadium: { name: `${newClubName.trim()} Stadium`, capacity: 10000, condition: 100 },
            finances: { budget: 500000, revenue: 0, expenses: 0 },
            reputation: 50,
            divisionId: "div_10", // Jucătorul începe în divizia 10
            squad: [], // Va conține ID-uri de jucători
            staff: [],
            trophies: [],
            tactics: { // Tactici implicite
                formation: "4-4-2",
                mentality: "balanced"
            }
        };

        try {
            await setDoc(myClubDocRef, newClubData);
            setNewClubName('');
            setNewClubCity('');
            setError(null);
        } catch (err) {
            console.error("Eroare la crearea clubului:", err);
            setError(`Eroare la crearea clubului: ${err.message}`);
        }
    };

    // Funcție pentru a adăuga un jucător nou la clubul utilizatorului
    const handleAddPlayer = async (e) => {
        e.preventDefault();
        if (!db || !userId || !myClub) {
            setError("Clubul tău nu este creat sau Firebase nu este gata.");
            return;
        }
        if (!newPlayerName.trim()) {
            setError("Numele jucătorului nu poate fi gol.");
            return;
        }

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const myPlayersCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/myPlayers`);

        const newPlayerData = {
            name: newPlayerName.trim(),
            initials: newPlayerName.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
            age: 20, // Default
            nationality: "Română", // Default
            preferredFoot: "Dreptul",
            height: 180,
            weight: 75,
            overallRating: parseInt(newPlayerOverall),
            currentClubId: myClub.id, // Asociază jucătorul cu clubul utilizatorului
            value: 100000 * parseInt(newPlayerOverall), // Exemplu de calcul valoare
            wages: 1000 * parseInt(newPlayerOverall),
            contractExpires: 24,
            moral: 70,
            form: 70,
            fitness: 90,
            isInjured: false,
            daysInjured: 0,
            isSuspended: false,
            matchesSuspended: 0,
            primaryPosition: newPlayerPosition,
            secondaryPositions: [],
            attributes: { /* Atribute simplificate pentru demo */ },
            potentialRating: parseInt(newPlayerOverall) + 10,
            potentialGrowthCurve: "normal",
            trainingProgress: { physicalXP: 0, technicalXP: 0, mentalXP: 0 },
            seasonStats: { matchesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
            careerHistory: [],
            onPitch: false // Starea inițială: nu este pe teren
        };

        try {
            await addDoc(myPlayersCollectionRef, newPlayerData);
            setNewPlayerName('');
            setNewPlayerOverall(70);
            setNewPlayerPosition('CM');
            setError(null);
        } catch (err) {
            console.error("Eroare la adăugarea jucătorului:", err);
            setError(`Eroare la adăugarea jucătorului: ${err.message}`);
        }
    };

    // Funcție pentru a salva formația pe teren în Firestore
    const saveTeamFormation = useCallback(async (formationToSave) => {
        if (!db || !userId) {
            console.error("Nu se poate salva formația: Firebase nu este gata sau utilizatorul nu este autentificat.");
            return;
        }
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const myFormationDocRef = doc(db, `artifacts/${appId}/users/${userId}/myTeamFormation/formationData`);
        try {
            await setDoc(myFormationDocRef, formationToSave);
            console.log("Formația salvată cu succes!");
        } catch (err) {
            console.error("Eroare la salvarea formației:", err);
            setError(`Eroare la salvarea formației: ${err.message}`);
        }
    }, [db, userId]);

    // Efect pentru a randa terenul și a plasa jucătorii când tab-ul "Tactica" este activ
    // și datele sunt gata.
    useEffect(() => {
        if (activeTab === 'tactics' && footballPitchRef.current && isAuthReady && myClub) {
            console.log("App.js: Încerc randarea terenului...");
            
            // Randăm terenul cu formația și mentalitatea selectată
            renderPitch(footballPitchRef.current, selectedFormation, selectedMentality);
            
            // Plasăm jucătorii în sloturile de pe teren
            // Transmitem myPlayers (toți jucătorii utilizatorului) și saveTeamFormation
            placePlayersInPitchSlots(footballPitchRef.current, myTeamFormation, availablePlayersListRef.current, myPlayers, saveTeamFormation); 
            
            console.log("App.js: Teren randat și jucători plasați.");
        }
    }, [activeTab, isAuthReady, myClub, myPlayers, myTeamFormation, selectedFormation, selectedMentality, saveTeamFormation]);

    // Afișează un mesaj de încărcare sau de eroare
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                <p className="text-xl font-semibold">Se încarcă aplicația și se conectează la Firebase...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-900 text-white p-4">
                <p className="text-xl font-semibold">Eroare: {error}</p>
            </div>
        );
    }

    // Aplicația principală odată ce Firebase este gata
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-950 text-white font-inter p-6">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; }

                /* Stiluri pentru terenul de fotbal */
                #football-pitch {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3 / 2; /* Raport de aspect clasic pentru teren */
                    background-image: url('img/teren.png'); /* Asigură-te că imaginea este aici */
                    background-size: 100% 100%;
                    background-position: center;
                    background-repeat: no-repeat;
                    border: 2px solid #4a6a8a;
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 0 auto;
                    box-shadow: 0 0 20px rgba(0, 230, 230, 0.5);
                }

                .player-slot {
                    position: absolute;
                    width: 5%; /* Dimensiunea cercului jucătorului */
                    height: 5%;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.2); /* Fundal semi-transparent pentru slot gol */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7em;
                    color: white;
                    transform: translate(-50%, -50%); /* Centrează slotul pe coordonate */
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    transition: all 0.1s ease-out;
                    cursor: grab;
                }

                .player-slot.empty .player-initials-circle {
                    background-color: rgba(0, 0, 0, 0.4);
                    border: 1px dashed rgba(255, 255, 255, 0.6);
                    color: rgba(255, 255, 255, 0.7);
                }

                .player-slot.empty .player-pos-initial {
                    display: none; /* Ascunde poziția scurtă pentru sloturile goale */
                }

                .player-initials-circle {
                    width: 80%;
                    height: 80%;
                    background-color: #3b82f6; /* Culoare albastru pentru jucători */
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 1.2em;
                    color: white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    cursor: grab;
                }

                .player-initials {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 0.8em; /* Mărime inițiale */
                }

                .player-pos-initial {
                    position: absolute;
                    bottom: -15px; /* Poziționează sub cerc */
                    font-size: 0.6em; /* Mărime poziție */
                    color: #ccc;
                    white-space: nowrap;
                }

                .player-slot-text {
                    position: absolute;
                    bottom: -25px; /* Sub poziția scurtă */
                    font-size: 0.6em;
                    color: #eee;
                    white-space: nowrap;
                }

                .player-slot.drag-over {
                    background-color: rgba(0, 255, 0, 0.3); /* Verde la drag-over */
                    border: 2px dashed rgba(0, 255, 0, 0.8);
                }

                .available-players-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 10px;
                }

                .available-player-item {
                    background-color: #4a5568; /* Gri închis */
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    cursor: grab;
                    transition: transform 0.2s ease-in-out;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8em;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }

                .available-player-item:hover {
                    transform: translateY(-3px);
                }

                .available-player-item .player-initials-circle {
                    width: 40px;
                    height: 40px;
                    font-size: 0.9em;
                    margin-bottom: 5px;
                }
                `}
            </style>
            
            <header className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-blue-400 mb-2">Managerul Meu de Fotbal</h1>
                <p className="text-lg text-gray-400">Bine ai venit, Manager! ID-ul tău de utilizator: <span className="font-mono bg-gray-700 px-2 py-1 rounded-md text-sm">{userId}</span></p>
            </header>

            {/* Navigare pe tab-uri */}
            <nav className="mb-8 max-w-6xl mx-auto">
                <ul className="flex justify-center space-x-4 bg-gray-800 p-3 rounded-xl shadow-lg">
                    <li>
                        <button
                            onClick={() => setActiveTab('myClub')}
                            className={`px-6 py-3 rounded-lg font-semibold text-lg transition duration-300 ease-in-out ${activeTab === 'myClub' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            Clubul Meu
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('tactics')}
                            className={`px-6 py-3 rounded-lg font-semibold text-lg transition duration-300 ease-in-out ${activeTab === 'tactics' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            Tactica
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('myPlayers')}
                            className={`px-6 py-3 rounded-lg font-semibold text-lg transition duration-300 ease-in-out ${activeTab === 'myPlayers' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            Jucători
                        </button>
                    </li>
                </ul>
            </nav>

            <main className="max-w-6xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                {/* Conținutul tab-ului "Clubul Meu" */}
                {activeTab === 'myClub' && (
                    <>
                        <h2 className="text-3xl font-bold text-green-400 mb-6">Clubul Meu</h2>
                        {myClub ? (
                            <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-6">
                                <h3 className="text-2xl font-semibold text-white mb-2">{myClub.name} ({myClub.shortName})</h3>
                                <p className="text-gray-300">Oraș: {myClub.city}, Țară: {myClub.country}</p>
                                <p className="text-gray-300">Reputație: <span className="font-bold text-blue-300">{myClub.reputation}</span></p>
                                <p className="text-gray-300">Buget: <span className="font-bold text-yellow-300">${myClub.finances.budget.toLocaleString()}</span></p>
                                <p className="text-gray-300">Divizie: <span className="font-bold text-white">{myClub.divisionId}</span></p>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateClub} className="space-y-4">
                                <p className="text-gray-400 mb-4">Nu ai încă un club. Creează-ți echipa!</p>
                                <div>
                                    <label htmlFor="clubName" className="block text-gray-300 text-sm font-bold mb-2">Numele Clubului:</label>
                                    <input
                                        type="text"
                                        id="clubName"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                        value={newClubName}
                                        onChange={(e) => setNewClubName(e.target.value)}
                                        placeholder="Ex: Steaua București"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="clubCity" className="block text-gray-300 text-sm font-bold mb-2">Oraș:</label>
                                    <input
                                        type="text"
                                        id="clubCity"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                        value={newClubCity}
                                        onChange={(e) => setNewClubCity(e.target.value)}
                                        placeholder="Ex: București"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Creează Clubul Meu
                                </button>
                            </form>
                        )}
                    </>
                )}

                {/* Conținutul tab-ului "Tactica" */}
                {activeTab === 'tactics' && (
                    <>
                        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Tactica Echipei</h2>
                        {!myClub ? (
                            <p className="text-gray-400">Creează-ți clubul pentru a seta tactica.</p>
                        ) : myPlayers.length < 11 ? (
                            <p className="text-gray-400">Ai nevoie de minim 11 jucători în lot pentru a seta tactica. Adaugă mai mulți jucători!</p>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Controale Tactice */}
                                <div className="lg:w-1/3 bg-gray-700 p-5 rounded-lg shadow-inner space-y-4">
                                    <h3 className="text-xl font-semibold text-white mb-3">Setări Tactice</h3>
                                    <div>
                                        <label htmlFor="formationSelect" className="block text-gray-300 text-sm font-bold mb-2">Formație:</label>
                                        <select
                                            id="formationSelect"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                            value={selectedFormation}
                                            onChange={(e) => setSelectedFormation(e.target.value)}
                                        >
                                            {Object.keys(FORMATIONS).filter(key => key !== 'GK').map(form => (
                                                <option key={form} value={form}>{form}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="mentalitySelect" className="block text-gray-300 text-sm font-bold mb-2">Mentalitate:</label>
                                        <select
                                            id="mentalitySelect"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                            value={selectedMentality}
                                            onChange={(e) => setSelectedMentality(e.target.value)}
                                        >
                                            <option value="defensive">Defensivă</option>
                                            <option value="balanced">Echilibrată</option>
                                            <option value="attacking">Ofensivă</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Vizualizarea Terenului */}
                                <div className="lg:w-2/3">
                                    <div id="football-pitch" ref={footballPitchRef} className="mb-6">
                                        {/* Terenul de fotbal va fi randat aici de pitch-renderer.js */}
                                    </div>
                                    {/* Lista de jucători disponibili pentru drag-and-drop */}
                                    <div className="bg-gray-700 p-5 rounded-lg shadow-inner">
                                        <h3 className="text-xl font-semibold text-white mb-3">Jucători Disponibili</h3>
                                        <div id="available-players-list" ref={availablePlayersListRef} className="available-players-grid">
                                            {/* Jucătorii disponibili vor fi randati aici de pitch-renderer.js */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Conținutul tab-ului "Jucători" */}
                {activeTab === 'myPlayers' && (
                    <>
                        <h2 className="text-3xl font-bold text-purple-400 mb-6">Lotul Meu</h2>
                        {myClub ? (
                            <>
                                <form onSubmit={handleAddPlayer} className="space-y-4 mb-6 p-4 bg-gray-700 rounded-lg shadow-inner">
                                    <h3 className="text-xl font-semibold text-white mb-3">Adaugă Jucător Nou</h3>
                                    <div>
                                        <label htmlFor="playerName" className="block text-gray-300 text-sm font-bold mb-2">Nume Jucător:</label>
                                        <input
                                            type="text"
                                            id="playerName"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                            value={newPlayerName}
                                            onChange={(e) => setNewPlayerName(e.target.value)}
                                            placeholder="Ex: Ion Popescu"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="playerOverall" className="block text-gray-300 text-sm font-bold mb-2">Overall Rating:</label>
                                        <input
                                            type="number"
                                            id="playerOverall"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                            value={newPlayerOverall}
                                            onChange={(e) => setNewPlayerOverall(e.target.value)}
                                            min="1"
                                            max="99"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="playerPosition" className="block text-gray-300 text-sm font-bold mb-2">Poziție Primară:</label>
                                        <select
                                            id="playerPosition"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                                            value={newPlayerPosition}
                                            onChange={(e) => setNewPlayerPosition(e.target.value)}
                                            required
                                    >
                                        <option value="GK">GK</option>
                                        <option value="CB">CB</option>
                                        <option value="LB">LB</option>
                                        <option value="RB">RB</option>
                                        <option value="CDM">CDM</option>
                                        <option value="CM">CM</option>
                                        <option value="CAM">CAM</option>
                                        <option value="LM">LM</option>
                                        <option value="RM">RM</option>
                                        <option value="LW">LW</option>
                                        <option value="RW">RW</option>
                                        <option value="ST">ST</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Adaugă Jucător
                                </button>
                            </form>

                            {myPlayers.length === 0 ? (
                                <p className="text-gray-400">Lotul tău este gol. Adaugă câțiva jucători!</p>
                            ) : (
                                <div className="space-y-4">
                                    {myPlayers.map(player => (
                                        <div key={player.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white">{player.name} ({player.initials})</h3>
                                                <p className="text-gray-300 text-sm">{player.primaryPosition} | {player.age} ani | OVR: {player.overallRating}</p>
                                            </div>
                                            <span className={`font-bold text-lg ${player.isInjured ? 'text-red-400' : 'text-green-400'}`}>
                                                {player.isInjured ? `Accidentat (${player.daysInjured} zile)` : 'Disponibil'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-gray-400">Creează-ți clubul pentru a-ți gestiona lotul.</p>
                    )}
                </>
            )}
            </main>

            <footer className="text-center mt-12 text-gray-500 text-sm">
                <p>&copy; 2025 Managerul Meu de Fotbal. Toate drepturile rezervate.</p>
            </footer>
        </div>
    );
};

export default App;
