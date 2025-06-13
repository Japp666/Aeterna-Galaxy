export function generateEmblemParams(clubName, division) {
  return { name: clubName, division };
}

export function generateEmblemFromParams(params) {
  return `emblems/${params.name.toLowerCase().replace(/\s/g, '-')}.png`;
}
