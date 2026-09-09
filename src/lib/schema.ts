export const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "FoodEstablishment"],
      "@id": "https://www.buddhacajovna.cz/#business",
      name: "Buddha čajovna",
      legalName: "Buddha čajovna",
      alternateName: [
        "Buddha Tea House Prague",
        "Buddha Shisha Prague",
        "Buddha čajovna — Tea House & Shisha",
        "Čajovna Buddha",
        "Buddha Cajovna",
      ],
      description:
        "Tea house & shisha a few steps from the Vltava in Prague New Town. Between Charles Square and the river promenade, Myslíkova 174/23. Hookah from 229 Kč with a drink. Cellar, street entrance through the Exafin passage.",
      slogan: "Čaj spojuje lidi.",
      url: "https://www.buddhacajovna.cz/",
      telephone: "+420222515616",
      email: "buddha.provozni@gmail.com",
      image: "https://www.buddhacajovna.cz/og.jpg",
      logo: "https://www.buddhacajovna.cz/favicon.svg",
      brand: {
        "@type": "Brand",
        name: "Buddha čajovna",
        logo: "https://www.buddhacajovna.cz/favicon.svg",
      },
      priceRange: "$$",
      currenciesAccepted: "CZK",
      paymentAccepted: "Cash, Credit Card",
      servesCuisine: ["Tea", "Hookah", "Shisha"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Myslíkova 174/23",
        addressLocality: "Praha",
        addressRegion: "Praha 1 – Nové Město",
        postalCode: "110 00",
        addressCountry: "CZ",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 50.0780321,
        longitude: 14.41805,
      },
      hasMap: "https://maps.google.com/?q=Mysl%C3%ADkova+174/23,+Praha",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "13:00",
          closes: "22:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Friday",
          opens: "13:00",
          closes: "23:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "14:00",
          closes: "23:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "14:00",
          closes: "22:00",
        },
      ],
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Praha 1 – Nové Město",
      },
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.buddhacajovna.cz/rezervace",
          inLanguage: ["cs", "en"],
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
        },
      },
      sameAs: [
        "https://www.cajovny-praha.cz/",
        "https://www.firmy.cz/detail/13290920-buddha-cajovna-praha-nove-mesto.html",
        "https://www.instagram.com/buddha.cajovna/",
        "https://www.facebook.com/BuddhaCajovna/",
      ],
      knowsAbout: ["čaj", "tea house", "vodní dýmka", "shisha", "hookah", "deskové hry", "gatcha", "didgeridoo"],
      mentions: {
        "@type": "Organization",
        name: "Medovinárna",
        url: "https://www.medovinarna.cz/",
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "entrance",
          value: "Suterén, vchod z ulice přes pasáž, budova Exafin",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.buddhacajovna.cz/#website",
      url: "https://www.buddhacajovna.cz/",
      name: "Buddha čajovna",
      inLanguage: ["cs", "en"],
      publisher: { "@id": "https://www.buddhacajovna.cz/#business" },
    },
  ],
} as const;

export const HOURS_CS = [
  ["Pondělí", "13:00–22:00"],
  ["Úterý", "13:00–22:00"],
  ["Středa", "13:00–22:00"],
  ["Čtvrtek", "13:00–22:00"],
  ["Pátek", "13:00–23:00"],
  ["Sobota", "14:00–23:00"],
  ["Neděle", "14:00–22:00"],
] as const;
