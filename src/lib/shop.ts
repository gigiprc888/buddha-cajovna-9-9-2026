export type Category = "caj" | "sakurac" | "waysa" | "wookah" | "nustky" | "didge";

export type Product = {
  id: string;
  category: Category;
  name: string;
  blurb: string;
  price: number;
  unit: string;
  image: string;
  fit?: string;
  inquire?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "sakurac",
    category: "sakurac",
    name: "Sakurač",
    blurb: "Sakura Sour. Netopýr, květ, 0,3 l. Kyselé, třešňové, naše.",
    price: 79,
    unit: "0,3 l",
    image: "/shop/sakurac.jpg",
  },
  {
    id: "ali-shan",
    category: "caj",
    name: "Ali Shan oolong",
    blurb: "První sklizeň. Sladký, florální, na konvici pro dva.",
    price: 420,
    unit: "50 g",
    image: "/shop/oolong.jpg",
  },
  {
    id: "waysa-kola",
    category: "waysa",
    name: "Waysa Black Kola",
    blurb: "Přírodní kofein. Tmavá kola, bez chemie.",
    price: 59,
    unit: "0,33 l",
    image: "/shop/waysa-line.png",
    fit: "12% center",
  },
  {
    id: "waysa-green",
    category: "waysa",
    name: "Waysa Green Original",
    blurb: "Zelený originál. Čistý kofein, bylinková linka.",
    price: 59,
    unit: "0,33 l",
    image: "/shop/waysa-line.png",
    fit: "38% center",
  },
  {
    id: "waysa-peach",
    category: "waysa",
    name: "Waysa Pink Peach",
    blurb: "Broskev. Svěží, růžová, na odpoledne.",
    price: 59,
    unit: "0,33 l",
    image: "/shop/waysa-line.png",
    fit: "62% center",
  },
  {
    id: "waysa-apple",
    category: "waysa",
    name: "Waysa White Apple",
    blurb: "Wide Awake. Bílé jablko, když je potřeba zůstat.",
    price: 59,
    unit: "0,33 l",
    image: "/shop/waysa-line.png",
    fit: "88% center",
  },
  {
    id: "wookah-teak",
    category: "wookah",
    name: "Wookah Teak",
    blurb: "Dřevěný stonek, kouřové sklo. Dýmka, která zůstane.",
    price: 8900,
    unit: "1 ks",
    image: "/shop/wookah-teak.jpg",
  },
  {
    id: "wookah-padouk",
    category: "wookah",
    name: "Wookah Padouk",
    blurb: "Tmavý dřevěný stonek, mosaz. Vyzkoušet, koupit, půjčit.",
    price: 9900,
    unit: "1 ks",
    image: "/shop/wookah-padouk.jpg",
  },
  {
    id: "nustky",
    category: "nustky",
    name: "Náustky LV Gravo",
    blurb: "Buddha čajovna. Osobní náustek na dýmku. Gravírované, 320 Kč.",
    price: 320,
    unit: "1 ks",
    image: "/shop/nustky.jpg",
  },
  {
    id: "didgeridoo",
    category: "didge",
    name: "Didgeridoo",
    blurb: "Autentické nástroje od Tomáše Dufka. K vyzkoušení v sále i k zakoupení. Cena u obsluhy.",
    price: 0,
    unit: "na dotaz",
    image: "/shop/didgeridoo.jpg",
    inquire: true,
  },
];

export const CATS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Vše" },
  { id: "sakurac", label: "Sakurač" },
  { id: "waysa", label: "Waysa" },
  { id: "caj", label: "Čaje" },
  { id: "wookah", label: "Wookah" },
  { id: "nustky", label: "Náustky" },
  { id: "didge", label: "Didgeridoo" },
];

type Line = { id: string; qty: number };
const KEY = "buddha-cart-v1";

const listeners = new Set<() => void>();
export function subscribeCart(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
function emit() {
  listeners.forEach((fn) => fn());
}

function load(): Line[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Line[];
  } catch {
    return [];
  }
}
function save(rows: Line[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function cartCount() {
  return load().reduce((s, l) => s + l.qty, 0);
}

export function cartLines() {
  return load()
    .map((l) => {
      const p = PRODUCTS.find((x) => x.id === l.id);
      return p ? { ...l, product: p } : null;
    })
    .filter(Boolean) as { id: string; qty: number; product: Product }[];
}

export function addToCart(id: string) {
  const rows = load();
  const hit = rows.find((r) => r.id === id);
  if (hit) hit.qty += 1;
  else rows.push({ id, qty: 1 });
  save(rows);
  emit();
}

export function setQty(id: string, qty: number) {
  const rows = load().filter((r) => (r.id === id ? qty > 0 : true));
  const hit = rows.find((r) => r.id === id);
  if (hit) hit.qty = qty;
  save(rows);
  emit();
}

export function cartTotal() {
  return cartLines().reduce((s, l) => s + l.qty * l.product.price, 0);
}

export function formatKc(n: number) {
  return n.toLocaleString("cs-CZ") + " Kč";
}
