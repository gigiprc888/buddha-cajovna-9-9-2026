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
