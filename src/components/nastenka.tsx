import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { LANES, SEED, addPin, loadPins, type Lane, type Pin } from "@/lib/board";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/lib/i18n";

const TILT = ["-rotate-[1.6deg]", "rotate-[1.2deg]", "-rotate-[0.8deg]", "rotate-[2deg]"];

function PinCard({ pin, i, featured, en }: { pin: Pin; i: number; featured?: boolean; en: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [wiggle, setWiggle] = useState(false);
  const title = en ? pin.titleEn ?? pin.title : pin.title;
  const body = en ? pin.bodyEn ?? pin.body : pin.body;
  const tag = en ? pin.tagEn ?? pin.tag : pin.tag;
  const when = en ? pin.whenEn ?? pin.when : pin.when;

  useEffect(() => {
    if (pin.id !== "n0") return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setWiggle(true);
        io.disconnect();
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pin.id]);

  return (
    <article
      ref={ref}
      className={
        "paper-note pin-enter relative px-5 py-6 " +
        (featured ? "sm:col-span-2 " : "") +
        (wiggle ? "pin-wiggle " : "") +
        TILT[i % TILT.length]
      }
      style={{ animationDelay: wiggle ? undefined : `${i * 70}ms` }}
    >
      <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-gold shadow-[0_2px_10px_rgba(212,180,131,0.9)] ring-2 ring-bg/40" />
      {tag && (
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">{tag}</p>
      )}
      <h3 className={"mt-1 font-serif leading-[1.05] " + (featured ? "text-4xl" : "text-2xl")}>
        {title}
      </h3>
      <p className={"mt-3 leading-relaxed " + (featured ? "text-lg" : "text-[15px]")}>{body}</p>
      <p className="mt-5 text-[11px] uppercase tracking-[0.18em] opacity-45">
        {pin.author} · {when}
      </p>
    </article>
  );
}

export function Nastenka() {
  const { t, locale } = useI18n();
  const en = locale === "en";
  const [lane, setLane] = useState<Lane>("news");
  const [dir, setDir] = useState<1 | -1>(1);
  const [pins, setPins] = useState<Pin[]>(SEED);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [ink, setInk] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPins(loadPins());
  }, []);

  useLayoutEffect(() => {
    const root = tabsRef.current;
    if (!root) return;
    const btn = root.querySelector<HTMLElement>(`[data-lane="${lane}"]`);
    if (!btn) return;
    const place = () => {
      const a = root.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      setInk({ left: b.left - a.left, width: b.width });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    return () => ro.disconnect();
  }, [lane]);

  const visible = useMemo(() => pins.filter((p) => p.lane === lane), [pins, lane]);
  const canPost = lane === "ads" || lane === "forum";

  const idx = LANES.findIndex((l) => l.id === lane);

  function selectLane(id: Lane) {
    if (id === lane) return;
    const next = LANES.findIndex((l) => l.id === id);
    setDir(next > idx ? 1 : -1);
    setLane(id);
    setOpen(false);
  }

  function onTabsKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = (idx + step + LANES.length) % LANES.length;
    selectLane(LANES[next].id);
  }

  function post(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const pin = addPin({
      lane,
      title: title.trim(),
      body: body.trim().slice(0, 280),
      author: author.trim() || "host",
      tag: lane === "forum" ? "hráč" : "inzerát",
    });
    setPins((prev) => [pin, ...prev]);
    setTitle("");
    setBody("");
    setOpen(false);
  }

  return (
    <section id="nastenka" className="cork relative overflow-hidden px-4 py-14 md:px-10 md:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-bg to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
        <p className="kicker">{t("board.kicker")}</p>
        <h2 key={lane + "-h"} className="headline lane-slide-next mt-2 text-5xl md:text-7xl">
          {t(`board.${lane}`)}
        </h2>
        <p key={lane + "-k"} className="lane-slide-next mt-3 max-w-lg font-serif text-xl italic text-ivory/85">
          {t(`board.${lane}K`)}
        </p>
        <a
          href="/rss.xml"
          className="mt-4 inline-block text-[11px] tracking-[0.16em] text-gold/80 uppercase hover:text-gold"
        >
          {t("board.rss")}
        </a>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label={t("board.tabs")}
            onKeyDown={onTabsKey}
            className="relative flex rounded-full border border-ivory/20 bg-bg/35 p-1"
          >
            <span
              className="tab-ink pointer-events-none absolute top-1 bottom-1 rounded-full bg-gold"
              style={{ left: ink.left, width: ink.width }}
            />
            {LANES.map((l) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                data-lane={l.id}
                aria-selected={lane === l.id}
                tabIndex={lane === l.id ? 0 : -1}
                onClick={() => selectLane(l.id)}
                className={
                  "relative z-10 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200 " +
                  (lane === l.id ? "text-bg" : "text-ivory hover:text-gold")
                }
              >
                {t(`board.${l.id}`)}
              </button>
            ))}
          </div>
          {canPost && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full bg-ivory px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-bg hover:bg-gold"
            >
              {open ? t("board.close") : lane === "forum" ? t("board.postGame") : t("board.postNote")}
            </button>
          )}
        </div>

        {open && canPost && (
          <form onSubmit={post} className="mt-6 grid gap-3 rounded-card bg-bg/75 p-5 backdrop-blur-sm md:grid-cols-2">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lane === "forum" ? t("board.phTitleGame") : t("board.phTitle")}
              className="border-b border-line bg-transparent py-2 text-sm outline-none placeholder:text-muted/40 focus:border-gold md:col-span-2"
            />
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, 280))}
              placeholder={t("board.phBody")}
              rows={3}
              className="border-b border-line bg-transparent py-2 text-sm outline-none placeholder:text-muted/40 focus:border-gold md:col-span-2"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={lane === "forum" ? t("board.phNick") : t("board.phName")}
              className="border-b border-line bg-transparent py-2 text-sm outline-none placeholder:text-muted/40 focus:border-gold"
            />
            <button type="submit" className="rounded-full bg-gold py-2.5 text-sm text-bg hover:bg-ivory">
              {t("board.pin")}
            </button>
          </form>
        )}

        <div
          key={lane}
          role="tabpanel"
          className={"mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 " + (dir > 0 ? "lane-slide-next" : "lane-slide-prev")}
        >
          {visible.map((pin, i) => (
            <PinCard key={pin.id} pin={pin} i={i} featured={i === 0} en={en} />
          ))}
        </div>
        {visible.length === 0 && (
          <p className="mt-10 font-serif text-2xl text-ivory/70">{t("board.empty")}</p>
        )}
      </div>
    </section>
  );
}
