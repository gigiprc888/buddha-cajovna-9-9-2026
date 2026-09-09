export type RoomId = "C" | "S" | "Z" | "V" | "M" | "D";

export type Table = {
  id: string;
  room: RoomId;
  max: number;
  hint?: string;
};

export const ROOMS: {
  id: RoomId;
  name: string;
  note: string;
  plan: string;
  photo: string;
  bookable?: boolean;
}[] = [
  { id: "V", name: "Přední místnost", note: "Plánek začíná tady. Rádi sem sedají.", plan: "/plans/v.jpg", photo: "/place/hall.jpg" },
  { id: "C", name: "Chodba", note: "U akvária sem může být taky.", plan: "/plans/c.jpg", photo: "/place/corridor.jpg" },
  { id: "M", name: "Malá místnost", note: "M1–M4", plan: "/plans/m.jpg", photo: "/place/teepee.jpg" },
  { id: "S", name: "Střední místnost", note: "S1–S4", plan: "/plans/s.jpg", photo: "/place/library.jpg" },
  { id: "Z", name: "Zadní místnost", note: "Z1–Z7", plan: "/plans/z.jpg", photo: "/place/gallery.jpg" },
  {
    id: "D",
    name: "Dolní místnost · Privátní",
    note: "Záložní. Vstup po domluvě s obsluhou. Klid, deskovky pro čtyři, skupiny když je plno.",
    plan: "/plans/overview.jpg",
    photo: "/place/gallery.jpg",
    bookable: false,
  },
];

export const TABLES: Table[] = [
  { id: "V1", room: "V", max: 2 },
  { id: "V2", room: "V", max: 4 },
  { id: "V3", room: "V", max: 6 },
  { id: "V4", room: "V", max: 2 },
  { id: "V5", room: "V", max: 2 },
  { id: "V6", room: "V", max: 6, hint: "vyvýšené pódium" },
  { id: "V7", room: "V", max: 6 },
  { id: "V8", room: "V", max: 2 },
  { id: "M1", room: "M", max: 8, hint: "společný stůl" },
  { id: "M2", room: "M", max: 3 },
  { id: "M3", room: "M", max: 2 },
  { id: "M4", room: "M", max: 2 },
  { id: "C1", room: "C", max: 3 },
  { id: "C2", room: "C", max: 3 },
  { id: "C3", room: "C", max: 2 },
  { id: "S1", room: "S", max: 3 },
  { id: "S2", room: "S", max: 4 },
  { id: "S3", room: "S", max: 3 },
  { id: "S4", room: "S", max: 4 },
  { id: "Z1", room: "Z", max: 2 },
  { id: "Z2", room: "Z", max: 3 },
  { id: "Z3", room: "Z", max: 4, hint: "sedací polštáře" },
  { id: "Z4", room: "Z", max: 4, hint: "sedací polštáře" },
  { id: "Z5", room: "Z", max: 4, hint: "sedací polštáře" },
  { id: "Z6", room: "Z", max: 4 },
  { id: "Z7", room: "Z", max: 2 },
];

export function tableById(id: string) {
  return TABLES.find((t) => t.id === id);
}

export function tablesFor(room: RoomId, party: number) {
  return TABLES.filter((t) => t.room === room && t.max >= party);
}

export function isBookable(id: RoomId) {
  return ROOMS.find((r) => r.id === id)?.bookable !== false;
}
