// Stub pentru autentificare (Firebase Auth sau alt sistem)
export async function login(email, password) {
  // TODO: Implementare login
  return { userId: '123', email };
}

export async function signup(email, password) {
  // TODO: Implementare signup
  return { userId: '123', email };
}

export function onAuthStateChanged(callback) {
  // Simulare: userul este null la început
  callback(null);
}
