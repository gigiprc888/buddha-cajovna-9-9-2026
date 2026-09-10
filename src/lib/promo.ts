export type PromoClip = {
  id: string;
  title: string;
  caption: string;
  src: string;
  poster: string;
  story?: boolean;
};

export const PROMO_WIDE: PromoClip[] = [
  {
    id: "caj",
    title: "Čaj",
    caption: "Konvice. Pára. Touareg. Ostrov klidu na Myslíkově.",
    src: "/promo/s01-caj.mp4",
    poster: "/promo/01-caj.jpg",
  },
  {
    id: "dymka",
    title: "Dýmka",
    caption: "Od 229 Kč k nápoji. Večer, který se nepočítá na minuty.",
    src: "/promo/s02-dymka.mp4",
    poster: "/promo/02-dymka.jpg",
  },
  {
    id: "sal",
    title: "Sál",
    caption: "Ratan, lucerny, Buddha v nice. Suterén, pasáž Exafin.",
    src: "/promo/05-hry.mp4",
    poster: "/promo/03-sal.jpg",
  },
  {
    id: "pasaz",
    title: "Pasáž",
    caption: "Vchod z ulice přes pasáž. Hledejte nápis Exafin.",
    src: "/promo/s03-pasaz.mp4",
    poster: "/promo/04-pasaz.jpg",
  },
  {
    id: "hry",
    title: "Hry",
    caption: "Deskovky na místě. Důvod zůstat o konvici dýl.",
    src: "/promo/05-hry.mp4",
    poster: "/promo/05-hry.jpg",
  },
  {
    id: "drink",
    title: "Drink",
    caption: "Cider, medovina, čajové drinky. K dýmce i bez ní.",
    src: "/promo/s04-drink.mp4",
    poster: "/promo/06-drink.jpg",
  },
  {
    id: "gatcha",
    title: "Gatcha",
    caption: "1 500 Kč na účtence = menší zatočení. 2 000 Kč = velké.",
    src: "/promo/07-gatcha.mp4",
    poster: "/promo/07-gatcha.jpg",
  },
];

export const PROMO_STORY: PromoClip[] = [
  {
    id: "s-caj",
    title: "Čaj",
    caption: "Buddha čajovna · Myslíkova · pasáž Exafin",
    src: "/promo/s01-caj.mp4",
    poster: "/promo/s01-caj.jpg",
    story: true,
  },
  {
    id: "s-dymka",
    title: "Dýmka",
    caption: "Dýmka od 229 Kč k nápoji. Levněji než shisha bar.",
    src: "/promo/s02-dymka.mp4",
    poster: "/promo/s02-dymka.jpg",
    story: true,
  },
  {
    id: "s-pasaz",
    title: "Pasáž",
    caption: "Suterén. Vchod z ulice přes pasáž.",
    src: "/promo/s03-pasaz.mp4",
    poster: "/promo/s03-pasaz.jpg",
    story: true,
  },
  {
    id: "s-drink",
    title: "Drink",
    caption: "Přijďte ve dvou, s přáteli, nebo partou.",
    src: "/promo/s04-drink.mp4",
    poster: "/promo/s04-drink.jpg",
    story: true,
  },
];
