let tickInterval;

export function simulateMatch(callbacks) {
  const totalTicks = 90;
  let tick = 0;
  tickInterval = setInterval(() => {
    tick++;
    if (callbacks && callbacks.onUpdate) {
      callbacks.onUpdate({ minute: tick, events: [] });
    }
    if (tick >= totalTicks) {
      clearInterval(tickInterval);
      if (callbacks && callbacks.onEnd) {
        callbacks.onEnd({ finalScore: { home: 1, away: 2 }, events: [] });
      }
    }
  }, 20 * 1000); // 20 secunde pentru fiecare "tick"
}

export function cancelMatch() {
  clearInterval(tickInterval);
}
