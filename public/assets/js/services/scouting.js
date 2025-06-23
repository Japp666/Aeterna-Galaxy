export function assignScout(scoutId, region) {
  // TODO: Implementare misiune de scouting
  return { status: "assigned", scoutId, region };
}

export function retrieveScoutReport(scoutId) {
  // TODO: Returnează raportul de scouting
  return { scoutId, report: "Raport de scouting..." };
}

export function getMarketList(filters) {
  // TODO: Filtrare jucători în funcție de filtre
  return [];
}

export function makeTransferOffer(playerId, terms) {
  // TODO: Implementare ofertă de transfer
  return { status: "offer_sent", playerId, terms };
}
