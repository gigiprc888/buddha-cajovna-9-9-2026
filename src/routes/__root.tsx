import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SCHEMA } from "@/lib/schema";
import { I18nProvider } from "@/lib/i18n";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Buddha čajovna Praha | Tea House & Shisha | Myslíkova" },
      { name: "description", content: "Čajovna a shisha v Praze 1. Tea house & hookah from 229 Kč with a drink. Suterén, vchod z ulice přes pasáž Exafin, Myslíkova 174/23." },
      { name: "theme-color", content: "#0c0b0a" },
      { property: "og:site_name", content: "Buddha čajovna" },
      { property: "og:title", content: "Buddha čajovna Praha | Tea House & Shisha" },
      { property: "og:description", content: "Tea house & shisha in Prague. Čaj, dýmka, hry. Myslíkova 174/23, pasáž Exafin." },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "alternate", type: "application/rss+xml", title: "Buddha čajovna — nástěnka", href: "/rss.xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(SCHEMA),
      },
    ],
  }),
  component: () => (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <I18nProvider>
            <Outlet />
          </I18nProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
