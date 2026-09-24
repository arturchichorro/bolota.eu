import { useEffect, useState } from "react";

export type GalleryImage = {
  src: string;
  fullSrc?: string;
  alt: string;
  caption?: string;
  expandable?: boolean;
  previewFit?: "cover" | "contain";
};

export function ImageGallery({
  images,
  layout = "scroll",
  wide = false,
  previewAspectRatio = "6 / 5",
  previewMaxWidth,
}: {
  images: GalleryImage[];
  layout?: "scroll" | "inline";
  wide?: boolean;
  previewAspectRatio?: string;
  previewMaxWidth?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const expandableIndices = images.flatMap((image, index) => image.expandable === false ? [] : [index]);
  const activePosition = activeIndex === null ? -1 : expandableIndices.indexOf(activeIndex);
  const selectedImage = activeIndex === null ? undefined : images[activeIndex];

  const move = (direction: -1 | 1) => {
    if (activePosition < 0 || expandableIndices.length < 2) return;
    const next = (activePosition + direction + expandableIndices.length) % expandableIndices.length;
    setActiveIndex(expandableIndices[next]);
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, activePosition]);

  if (images.length === 0) return null;

  const wideStyle = wide ? {
    width: "min(calc(100vw - 4rem), 52rem)",
    marginLeft: "50%",
    transform: "translateX(-50%)",
  } : undefined;

  return (
    <>
      <div className="not-prose my-7" style={wideStyle}>
        <div
          className={layout === "scroll" ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3" : "grid gap-3"}
          style={layout === "inline" ? { gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` } : undefined}
        >
          {images.map((image, index) => {
            const expandable = image.expandable !== false;
            const preview = (
              <img
                className="m-0 block w-full transition-transform duration-200 group-hover:scale-[1.01]"
                style={{ aspectRatio: previewAspectRatio, objectFit: image.previewFit || "cover", objectPosition: "center" }}
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
            );

            return (
              <figure
                className={layout === "scroll" ? "m-0 w-[min(70vw,35rem)] shrink-0 snap-start" : "m-0 min-w-0 justify-self-center"}
                style={layout === "inline" ? { width: "100%", maxWidth: previewMaxWidth } : undefined}
                key={`${image.src}-${index}`}
              >
                {expandable ? (
                  <button
                    className="group block w-full cursor-zoom-in overflow-hidden rounded-md border-2 border-border bg-surface text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => setActiveIndex(index)}
                    type="button"
                    aria-label={`Open ${image.alt} fullscreen`}
                  >
                    {preview}
                  </button>
                ) : <div className="block w-full overflow-hidden rounded-md border-2 border-border bg-surface">{preview}</div>}
                {image.caption && <figcaption className="mt-2 text-center text-sm text-muted">{image.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selectedImage.alt}>
          <button className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveIndex(null)} type="button" aria-label="Close fullscreen image" />
          <img className="relative m-0 max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-md object-contain" src={selectedImage.fullSrc || selectedImage.src} alt={selectedImage.alt} />
          <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/60 text-2xl text-white hover:bg-black/80" onClick={() => setActiveIndex(null)} type="button" aria-label="Close fullscreen image">×</button>
          {expandableIndices.length > 1 && (
            <>
              <button className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-2xl text-white hover:bg-black/80" onClick={() => move(-1)} type="button" aria-label="Show previous image">‹</button>
              <button className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/60 text-2xl text-white hover:bg-black/80" onClick={() => move(1)} type="button" aria-label="Show next image">›</button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{activePosition + 1} / {expandableIndices.length}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
