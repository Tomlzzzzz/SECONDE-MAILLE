/* Itinéraire pas-à-pas : serveur de routage OpenStreetMap (OSRM / FOSSGIS) */
const PROFILES = { foot: 'routed-foot', bike: 'routed-bike', car: 'routed-car' };

const DIR = {
  left: 'à gauche',
  right: 'à droite',
  'slight left': 'légèrement à gauche',
  'slight right': 'légèrement à droite',
  'sharp left': 'franchement à gauche',
  'sharp right': 'franchement à droite',
  straight: 'tout droit',
  uturn: 'demi-tour'
};

function instruction(step, isLast) {
  const m = step.maneuver || {};
  const name = step.name ? ` sur ${step.name}` : '';
  const onto = step.name ? ` dans ${step.name}` : '';
  const mod = DIR[m.modifier] || '';
  switch (m.type) {
    case 'depart':
      return `Partez${name || ' en direction de la box'}`;
    case 'arrive':
      return isLast ? 'Vous êtes arrivé·e : la box est là !' : 'Étape atteinte';
    case 'turn':
    case 'end of road':
      return m.modifier === 'straight' ? `Continuez tout droit${name}` : m.modifier === 'uturn' ? 'Faites demi-tour' : `Tournez ${mod}${onto}`;
    case 'new name':
    case 'continue':
      return `Continuez${mod && m.modifier !== 'straight' ? ' ' + mod : ''}${name}`;
    case 'fork':
      return `À l’embranchement, prenez ${mod || 'la bonne voie'}${onto}`;
    case 'merge':
      return `Rejoignez${name || ' la voie'}`;
    case 'roundabout':
    case 'rotary':
      return `Au rond-point, prenez la ${m.exit || 1}${m.exit === 1 ? 're' : 'e'} sortie${onto}`;
    default:
      return mod ? `Allez ${mod}${onto}` : `Continuez${name}`;
  }
}

export async function fetchRoute(from, to, mode = 'foot') {
  const url = `https://routing.openstreetmap.de/${PROFILES[mode]}/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('route');
  const data = await res.json();
  const r = data.routes?.[0];
  if (!r) throw new Error('route');
  const raw = r.legs.flatMap((l) => l.steps);
  const steps = raw.map((s, i) => ({
    text: instruction(s, i === raw.length - 1),
    distance: s.distance,
    duration: s.duration,
    type: s.maneuver?.type,
    modifier: s.maneuver?.modifier,
    location: { lat: s.maneuver.location[1], lng: s.maneuver.location[0] }
  }));
  return { distance: r.distance, duration: r.duration, coords: r.geometry.coordinates.map(([lng, lat]) => [lat, lng]), steps };
}
