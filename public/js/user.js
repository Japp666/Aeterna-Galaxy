let player = {
    name: null,
    race: null,
    resources: { metal: 100, crystal: 50, energy: 50, helium: 0 },
    buildings: [],
    queue: []
};

export function getPlayer() {
    return player;
}

export async function setPlayerName(nickname) {
    player.name = nickname;
    console.log(`Player name set to: ${nickname}`);
    try {
        const db = firebase.firestore();
        await db.collection('players').doc(nickname).set({
            name: nickname,
            race: player.race,
            resources: player.resources,
            buildings: player.buildings,
            queue: player.queue,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Datele jucătorului salvate în Firestore.");
    } catch (error) {
        console.error("Eroare la salvarea datelor jucătorului:", error);
        throw error;
    }
}

export async function setPlayerRace(raceId) {
    player.race = raceId;
    if (player.name) {
        try {
            const db = firebase.firestore();
            await db.collection('players').doc(player.name).update({
                race: raceId,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Rasa jucătorului setată la: ${raceId}`);
        } catch (error) {
            console.error("Eroare la setarea rasei:", error);
            throw error;
        }
    }
}

export async function loadPlayerData(nickname) {
    try {
        const db = firebase.firestore();
        const docRef = db.collection('players').doc(nickname);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            player.name = data.name || nickname;
            player.race = data.race || null;
            player.resources = data.resources || { metal: 100, crystal: 50, energy: 50, helium: 0 };
            player.buildings = data.buildings || [];
            player.queue = data.queue || [];
            console.log("Datele jucătorului încărcate:", player);
        } else {
            console.log("Jucătorul nu există în Firestore, folosim date implicite.");
        }
    } catch (error) {
        console.error("Eroare la încărcarea datelor:", error);
        throw error;
    }
}

export async function addBuildingToQueue(buildingId, buildTime) {
    const queueItem = {
        buildingId,
        startTime: Date.now(),
        endTime: Date.now() + buildTime * 1000
    };
    player.queue.push(queueItem);
    if (player.name) {
        try {
            const db = firebase.firestore();
            await db.collection('players').doc(player.name).update({
                queue: player.queue,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Clădire adăugată în coadă: ${buildingId}`);
        } catch (error) {
            console.error("Eroare la actualizarea cozii:", error);
            throw error;
        }
    }
}
