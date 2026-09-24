import { useEffect, useRef } from "react";

export function useScroll() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    const article = document.querySelector<HTMLElement>("[data-article]");
    if (!progress || !article) return;

    const tocEntries = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"))
      .map((link) => {
        const id = link.dataset.tocLink;
        return id ? { link, section: document.getElementById(id) } : undefined;
      })
      .filter((entry): entry is { link: HTMLAnchorElement; section: HTMLElement } => Boolean(entry?.section));

    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      const articleStart = article.getBoundingClientRect().top + window.scrollY;
      const articleEnd = articleStart + article.scrollHeight - window.innerHeight;
      const distance = Math.max(1, articleEnd - articleStart);
      const value = Math.min(1, Math.max(0, (window.scrollY - articleStart) / distance));

      progress.style.transform = `scaleX(${value})`;
      progress.setAttribute("aria-valuenow", String(Math.round(value * 100)));

      const readingLine = Math.min(window.innerHeight * 0.3, 240);
      let activeEntry = tocEntries[0];
      for (const entry of tocEntries) {
        if (entry.section.getBoundingClientRect().top <= readingLine) activeEntry = entry;
        else break;
      }

      for (const entry of tocEntries) {
        const isActive = entry === activeEntry;
        entry.link.dataset.active = String(isActive);
        if (isActive) entry.link.setAttribute("aria-current", "location");
        else entry.link.removeAttribute("aria-current");
      }
    };

    const scheduleUpdate = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progressRef;
}

export function ReadingProgress() {
  const progressRef = useScroll();

  return (
    <div
      ref={progressRef}
      data-reading-progress
      className="pointer-events-none fixed top-0 left-0 z-50 h-0.75 w-full origin-left bg-accent will-change-transform"
      style={{ transform: "scaleX(0)" }}
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    />
  );
}
