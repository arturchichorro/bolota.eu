import { useEffect } from "react";

export function TocScrollSpy() {
  useEffect(() => {
    const entries = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-toc-link]"))
      .map((link) => {
        const id = link.dataset.tocLink;
        return id ? { link, section: document.getElementById(id) } : undefined;
      })
      .filter((entry): entry is { link: HTMLAnchorElement; section: HTMLElement } => Boolean(entry?.section));

    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      const readingLine = Math.min(window.innerHeight * 0.3, 240);
      let activeEntry = entries[0];

      for (const entry of entries) {
        if (entry.section.getBoundingClientRect().top <= readingLine) activeEntry = entry;
        else break;
      }

      for (const entry of entries) {
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

  return null;
}
