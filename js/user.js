// user.js

export const user = {
  name: '',
  race: '',
  resources: {
    metal: 1000,
    crystal: 800,
    energy: 500
  },
  score: 0
};

let isBuildingInProgress = false;

export function getBuildingStatus() {
  return isBuildingInProgress;
}

export function setBuildingStatus(status) {
  isBuildingInProgress = status;
}

