// Trails of Bheta — room definitions sourced from Qord (org: b25d2401)
// Tokens are public booking-page tokens, safe to ship in client code.

export interface Room {
  id: string;
  name: string;
  tagline: string;
  token: string;
  price_per_night: number;
  max_guests: number;
  beds: string;
}

export const BHETA_ROOMS: Room[] = [
  {
    id: "penthouse",
    name: "Penthouse Room",
    tagline: "Panoramic Himalayan views, top floor",
    token: "c8a601c5-9cce-4e32-a154-65d902bf0602",
    price_per_night: 2800,
    max_guests: 2,
    beds: "1 King",
  },
  {
    id: "deluxe-1",
    name: "Deluxe Room 1",
    tagline: "Garden-facing, private sit-out",
    token: "31838a47-0e27-4b65-b5f4-4c9230c40b45",
    price_per_night: 2000,
    max_guests: 2,
    beds: "1 Queen",
  },
  {
    id: "deluxe-2",
    name: "Deluxe Room 2",
    tagline: "Valley-facing, morning light",
    token: "513a672a-cb39-4c31-8615-2d6e35026e44",
    price_per_night: 2000,
    max_guests: 2,
    beds: "1 Queen",
  },
  {
    id: "standard",
    name: "Standard Room",
    tagline: "Cosy and quiet, courtyard view",
    token: "3f64a34b-6670-45ee-8206-38faf2aa1d2a",
    price_per_night: 1500,
    max_guests: 2,
    beds: "1 Double",
  },
];
