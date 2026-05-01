// Destination data for the "Reach Trails of Bheta" interactive map.
// Coordinates (svgX, svgY) are positioned within a 1000x700 viewBox map of
// the Kumaon / Garhwal region. They reflect approximate REAL geographic
// bearings from Bheta (near Kausani) and are calibrated so distances
// scale roughly with km (mountain roads, not straight-line).

export type Mode = "road" | "rail" | "air";

export interface Destination {
  id: string;
  name: string;
  region: string;
  km: number;
  hours: number; // travel time in hours
  hoursLabel: string;
  mode: Mode;
  // Position on the SVG map (viewBox 1000 x 700)
  x: number;
  y: number;
  // Short note shown on the travel ticket
  note: string;
  // Real lat/lng (used for the ticket's coordinate stamp only)
  lat: number;
  lng: number;
}

// Trails of Bheta — anchored near Kausani in the SVG.
export const BHETA = {
  name: "Trails of Bheta",
  region: "Bheta Village · Kumaon",
  x: 555,
  y: 360,
  lat: 29.85,
  lng: 79.6,
};

export const DESTINATIONS: Destination[] = [
  {
    id: "kausani",
    name: "Kausani",
    region: "Bageshwar · UK",
    km: 11,
    hours: 0.33,
    hoursLabel: "20 min",
    mode: "road",
    x: 605,
    y: 312,
    note: "The 'Switzerland of India' — Gandhi's Anasakti Ashram and the panoramic Trishul–Nanda Devi wall.",
    lat: 29.8437,
    lng: 79.6,
  },
  {
    id: "almora",
    name: "Almora",
    region: "Almora · UK",
    km: 63,
    hours: 2,
    hoursLabel: "2 hrs",
    mode: "road",
    x: 660,
    y: 420,
    note: "A 1,000-year-old hill town on a horseshoe ridge, famous for its bal mithai and quiet bazaars.",
    lat: 29.5892,
    lng: 79.6467,
  },
  {
    id: "ranikhet",
    name: "Ranikhet",
    region: "Almora · UK",
    km: 69,
    hours: 2,
    hoursLabel: "2 hrs",
    mode: "road",
    x: 530,
    y: 470,
    note: "Pine-scented cantonment town with golf greens and views of the Garhwal range.",
    lat: 29.6434,
    lng: 79.4322,
  },
  {
    id: "kainchi",
    name: "Kainchi Dham",
    region: "Nainital · UK",
    km: 107,
    hours: 3,
    hoursLabel: "3 hrs",
    mode: "road",
    x: 545,
    y: 540,
    note: "The serene ashram of Neem Karoli Baba, tucked into a riverside bend.",
    lat: 29.4275,
    lng: 79.5269,
  },
  {
    id: "nainital",
    name: "Nainital",
    region: "Nainital · UK",
    km: 127,
    hours: 4,
    hoursLabel: "4 hrs",
    mode: "road",
    x: 580,
    y: 580,
    note: "The emerald lake town in a bowl of seven hills.",
    lat: 29.3919,
    lng: 79.4542,
  },
  {
    id: "corbett",
    name: "Jim Corbett",
    region: "Nainital · UK",
    km: 147,
    hours: 5,
    hoursLabel: "5 hrs",
    mode: "road",
    x: 430,
    y: 600,
    note: "India's oldest national park — tigers, sal forests and the Ramganga.",
    lat: 29.5301,
    lng: 78.7747,
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    region: "Dehradun · UK",
    km: 262,
    hours: 9,
    hoursLabel: "9 hrs",
    mode: "road",
    x: 240,
    y: 400,
    note: "The yoga capital on the Ganga, where the river leaves the mountains.",
    lat: 30.0869,
    lng: 78.2676,
  },
  {
    id: "lansdowne",
    name: "Lansdowne",
    region: "Pauri Garhwal · UK",
    km: 267,
    hours: 9,
    hoursLabel: "9 hrs",
    mode: "road",
    x: 290,
    y: 470,
    note: "A hushed colonial cantonment cradled in deodar and oak.",
    lat: 29.8377,
    lng: 78.6841,
  },
  {
    id: "dehradun",
    name: "Dehradun",
    region: "Dehradun · UK",
    km: 301,
    hours: 10,
    hoursLabel: "10 hrs",
    mode: "road",
    x: 180,
    y: 360,
    note: "Doon valley capital — gateway to Mussoorie and the western hills.",
    lat: 30.3165,
    lng: 78.0322,
  },
  {
    id: "kathgodam",
    name: "Kathgodam",
    region: "Railway Station",
    km: 145,
    hours: 5,
    hoursLabel: "5 hrs drive",
    mode: "rail",
    x: 620,
    y: 615,
    note: "The nearest railhead — overnight trains from Delhi (Ranikhet Exp., Shatabdi).",
    lat: 29.2667,
    lng: 79.5333,
  },
  {
    id: "pantnagar",
    name: "Pantnagar",
    region: "Airport",
    km: 178,
    hours: 6,
    hoursLabel: "6 hrs drive",
    mode: "air",
    x: 700,
    y: 645,
    note: "Closest commercial airport — daily IndiGo flights from Delhi (~45 min).",
    lat: 29.0333,
    lng: 79.4737,
  },
];
