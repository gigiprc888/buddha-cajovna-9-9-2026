import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { MedovinarnaMark } from "@/components/medovinarna-mark";
import { Reveal } from "@/components/reveal";
import { MenuBook } from "@/components/menu-book";

export const Route = createFileRoute("/menu")({ component: MenuPage });

function MenuPage() {
  return (
    <div className="relative min-h-screen font-sans text-fg">
      <div className="pointer-events-none fixed inset-0 -z-[1]">
        <img src="/place/hall.jpg" alt="" className="h-full w-full object-cover opacity-[0.72]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/25 via-bg/38 to-bg/55" />
      </div>
      <SiteHeader />
      <main className="relative mx-auto max-w-5xl px-4 pb-28 pt-32 md:px-8 md:pt-36">
        <Reveal>
          <p className="kicker">Lístek čajovny</p>
          <h1 className="headline mt-2 text-4xl md:text-6xl">Co si dát v Buddhovi.</h1>
          <span className="hairline" />
        </Reveal>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Objednávejte u baru nebo prostřednictvím QR kódu na stole. Ceny v Kč. Dýmku podáváme pouze k nápoji, od 18 let.
        </p>

        <figure className="zen-frame relative mt-8 overflow-hidden rounded-card bg-bg">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.32]"
            style={{ backgroundImage: "url(/ornament.svg?v=alch)", backgroundSize: "240px 240px" }}
            aria-hidden
          />
          <span className="zen-rule zen-rule-t" aria-hidden />
          <span className="zen-rule zen-rule-b" aria-hidden />
          <span className="zen-rail zen-rail-l hidden md:block" aria-hidden />
          <span className="zen-rail zen-rail-r hidden md:block" aria-hidden />
          <img
            src="/place/matcha-menu.jpg"
            alt="Leták Matcha menu v Buddha čajovně"
            width={720}
            height={960}
            decoding="async"
            className="relative z-[1] mx-auto w-full max-w-lg object-contain shadow-[0_0_0_1px_rgb(212_180_131_/_0.4)]"
          />
        </figure>

        <div className="mt-10">
          <MenuBook />
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted">
          Medovina od
          <MedovinarnaMark compact />
        </p>
        <p className="mt-2 text-xs text-muted">
          Původní dokument:{" "}
          <a href="/menu/current.html" className="text-gold underline">
            otevřít celý lístek
          </a>
          .
        </p>
        <Link to="/rezervace" className="mt-6 inline-block text-sm text-gold">
          Rezervovat stůl →
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
