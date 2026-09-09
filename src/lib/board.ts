export type Lane = "news" | "ads" | "forum";

export type Pin = {
  id: string;
  lane: Lane;
  title: string;
  body: string;
  author: string;
  when: string;
  tag?: string;
  titleEn?: string;
  bodyEn?: string;
  whenEn?: string;
  tagEn?: string;
};

export const LANES: { id: Lane; label: string; kicker: string }[] = [
  { id: "news", label: "Čaj & akce", kicker: "Novinky z konvice" },
  { id: "ads", label: "Inzerce", kicker: "Veřejná nástěnka" },
  { id: "forum", label: "Fórum hráčů", kicker: "Členské · deskovky" },
];

export const SEED: Pin[] = [
  {
    id: "n0",
    lane: "news",
    title: "Happy Hours 1+1 dýmka",
    titleEn: "Happy Hours 1+1 hookah",
    body: "Pondělí–čtvrtek 13:00–15:00. Dvě dýmky za cenu jedné, ve dvou a víc. Platí se ta dražší. Nekombinuje se s 10. dýmkou zdarma.",
    bodyEn: "Monday–Thursday 13:00–15:00. Two pipes for the price of one, two people or more. You pay the dearer one. Doesn’t stack with the 10th-pipe-free card.",
    author: "Buddha",
    when: "teď",
    whenEn: "now",
    tag: "akce",
    tagEn: "deal",
  },
  {
    id: "n0b",
    lane: "news",
    title: "Po Karlově mostě k nám",
    titleEn: "From Charles Bridge to us",
    body: "Praha znovu žije tajemstvím — most, nábřeží, zabočit na Myslíkovu. Suterén, kde se po městě symbolů zastaví čas. Čaj, dýmka, ticho.",
    bodyEn: "Prague is living its secrets again — the bridge, the river, then Myslíkova. A cellar where the city of symbols stops. Tea, hookah, quiet.",
    author: "Buddha",
    when: "teď",
    whenEn: "now",
    tag: "praha",
    tagEn: "prague",
  },
  {
    id: "n0c",
    lane: "news",
    title: "Vchod znají ti, kdo vědí",
    titleEn: "Those who know, know the door",
    body: "Z Myslíkovy nic. Pak pasáž Exafin. Schody dolů. Čajovna je pod městem — proto ji minou ti, kdo jen procházejí.",
    bodyEn: "Nothing from the street. Then the Exafin passage. Stairs down. The tea house sits under the city — which is why passers-by miss it.",
    author: "Buddha",
    when: "teď",
    whenEn: "now",
    tag: "vchod",
    tagEn: "door",
  },
  {
    id: "n1",
    lane: "news",
    title: "Nový oolong z Ali Shan",
    titleEn: "New oolong from Ali Shan",
    body: "První sklizeň, jemná sladkost. Zeptejte se obsluhy na konvici pro dva.",
    bodyEn: "First flush, a gentle sweetness. Ask the staff for a pot for two.",
    author: "Buddha",
    when: "dnes",
    whenEn: "today",
    tag: "čaj",
    tagEn: "tea",
  },
  {
    id: "n2",
    lane: "news",
    title: "Tichá středa",
    titleEn: "Quiet Wednesday",
    body: "Bez akce, bez mikrofonu. Jen čaj, dýmka a volné stoly od 17:30.",
    bodyEn: "No event, no microphone. Just tea, hookah and free tables from 17:30.",
    author: "Buddha",
    when: "st",
    whenEn: "Wed",
    tag: "provoz",
    tagEn: "hours",
  },
  {
    id: "n3",
    lane: "news",
    title: "Krátká degustace v neděli",
    titleEn: "A short tasting on Sunday",
    body: "Tři zelené, 16:00. Bez vstupného — kdo přijde, sedí.",
    bodyEn: "Three greens, 16:00. No ticket — if you come, you sit.",
    author: "Buddha",
    when: "ne 14:00",
    whenEn: "Sun 14:00",
    tag: "akce",
    tagEn: "deal",
  },
  {
    id: "a1",
    lane: "ads",
    title: "Hledám parťáka na večerní čaj",
    titleEn: "Looking for a tea companion",
    body: "Čtvrtek po práci, spíš ticho než party. Napište na nástěnku.",
    bodyEn: "Thursday after work. Quiet, not a party. Leave a note on the board.",
    author: "Míša",
    when: "včera",
    whenEn: "yesterday",
  },
  {
    id: "a2",
    lane: "ads",
    title: "Prodám gaiwan, 120 ml",
    titleEn: "Gaiwan for sale, 120 ml",
    body: "Ruční, šedý kámen. Předání v čajovně, když budu u stolu.",
    bodyEn: "Handmade grey stone. Handover here, when I’m at a table.",
    author: "Ondřej",
    when: "2 dny",
    whenEn: "2 days",
  },
  {
    id: "f1",
    lane: "forum",
    title: "Dnes večer: Brass + čaj",
    titleEn: "Tonight: Brass + tea",
    body: "19:30 vlna, 3 hráči, čtvrtého bereme. Stůl v zadní části.",
    bodyEn: "19:30 wave, 3 players, we take a fourth. Table in the back room.",
    author: "Kuba",
    when: "dnes",
    whenEn: "today",
    tag: "hledáme 4.",
    tagEn: "need a 4th",
  },
  {
    id: "f2",
    lane: "forum",
    title: "Catan v neděli?",
    titleEn: "Catan on Sunday?",
    body: "Klidné odpoledne, 15:00. Kdo má krabici, nese. My dáme konvice.",
    bodyEn: "A quiet afternoon, 15:00. Bring the box if you have it. We’ll bring the pots.",
    author: "Ela",
    when: "pá",
    whenEn: "Fri",
    tag: "deskovka",
    tagEn: "board game",
  },
];

const KEY = "buddha-board-v1";

export function loadPins(): Pin[] {
  if (typeof localStorage === "undefined") return SEED;
  try {
    const extra = JSON.parse(localStorage.getItem(KEY) || "[]") as Pin[];
    return [...extra, ...SEED];
  } catch {
    return SEED;
  }
}

export function addPin(pin: Omit<Pin, "id" | "when">): Pin {
  const row: Pin = { ...pin, id: crypto.randomUUID(), when: "teď" };
  const extra = loadPins().filter((p) => !SEED.some((s) => s.id === p.id));
  extra.unshift(row);
  localStorage.setItem(KEY, JSON.stringify(extra));
  return row;
}
