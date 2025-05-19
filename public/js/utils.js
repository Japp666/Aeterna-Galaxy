export const user = {
  name: '',
  race: '',
  resources: {
    metal: 1000,
    crystal: 1000,
    energy: 1000
  },
  score: 0,
  buildings: {},
  research: {},
  lastOnline: Date.now()
};

export function showMessage(text) {
  alert(text); // înlocuiește ulterior cu mesaje stilizate în joc
}
