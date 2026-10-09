import { useEffect, useId, useRef, useState } from "react";
import { Button } from "./ui/button";
import "./image-gallery.css";

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
  fadeEdges = false,
  preload = false,
  previewAspectRatio = "6 / 5",
  previewMaxWidth,
}: {
  images: GalleryImage[];
  layout?: "scroll" | "inline";
  wide?: boolean;
  fadeEdges?: boolean;
  preload?: boolean;
  previewAspectRatio?: string;
  previewMaxWidth?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (layout !== "scroll") return;
    const scroller = scrollRef.current;
    const middle = scroller?.querySelectorAll("figure")[Math.floor(images.length / 2)];
    if (!scroller || !middle) return;
    const viewport = scroller.getBoundingClientRect();
    const image = middle.getBoundingClientRect();
    scroller.scrollLeft += image.left + image.width / 2 - viewport.left - scroller.clientWidth / 2;
  }, [layout, images.length]);
  const expandableIndices = images.flatMap((image, index) => image.expandable === false ? [] : [index]);
  const activePosition = activeIndex === null ? -1 : expandableIndices.indexOf(activeIndex);
  const selectedImage = activeIndex === null ? undefined : images[activeIndex];

  const move = (direction: -1 | 1) => {
    if (activePosition < 0 || expandableIndices.length < 2) return;
    const next = (activePosition + direction + expandableIndices.length) % expandableIndices.length;
    setActiveIndex(expandableIndices[next]);
  };

  const isOpen = selectedImage !== undefined;
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    popupRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (images.length === 0) return null;

  const wideStyle = wide ? {
    width: "min(calc(100vw - 4rem), 52rem)",
    marginLeft: "50%",
    transform: "translateX(-50%)",
  } : undefined;

  return (
    <>
      <div className="not-prose relative my-7 bg-background" style={wideStyle}>
        <div
          ref={scrollRef}
          className={layout === "scroll" ? `flex max-w-full gap-4 overflow-x-auto overscroll-x-contain px-3 pb-3 focus-visible:outline-2 focus-visible:outline-accent ${fadeEdges ? "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : ""}` : "grid gap-3"}
          style={layout === "inline" ? { gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` } : undefined}
          role={layout === "scroll" ? "region" : undefined}
          aria-label={layout === "scroll" ? "Image gallery — scroll horizontally" : undefined}
          tabIndex={layout === "scroll" ? 0 : undefined}
        >
          {images.map((image, index) => {
            const expandable = image.expandable !== false;
            const preview = (
              <img
                className="m-0 block w-full transition-transform duration-200 group-hover:scale-[1.01]"
                style={{ aspectRatio: previewAspectRatio, objectFit: image.previewFit || "cover", objectPosition: "center" }}
                src={image.src}
                alt={image.alt}
                loading={preload ? "eager" : "lazy"}
                decoding="async"
              />
            );

            return (
              <figure
                className={layout === "scroll" ? "m-0 w-[min(70vw,35rem)] shrink-0" : "m-0 min-w-0 justify-self-center"}
                style={{ ...(layout !== "scroll" ? { width: "100%" } : {}), maxWidth: previewMaxWidth }}
                key={`${image.src}-${index}`}
              >
                {expandable ? (
                  <Button
                    unstyled
                    className="group block w-full cursor-zoom-in overflow-hidden rounded-md border-2 border-border bg-surface text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={(event) => {
                      openerRef.current = event.currentTarget;
                      setActiveIndex(index);
                    }}
                    aria-label={`Open ${image.alt} fullscreen`}
                  >
                    {preview}
                  </Button>
                ) : <div className="block w-full overflow-hidden rounded-md border-2 border-border bg-surface">{preview}</div>}
                {image.caption && <figcaption className="mt-2 text-center text-sm text-muted">{image.caption}</figcaption>}
              </figure>
            );
          })}
        </div>
        {layout === "scroll" && fadeEdges && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-background to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-background to-transparent" />
          </>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="gallery-dialog not-prose cursor-zoom-out"
        onCancel={() => setActiveIndex(null)}
        onClose={() => { if (!dialogRef.current?.open) setActiveIndex(null); }}
        onClick={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
          <div ref={popupRef} tabIndex={-1} className="relative grid max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] cursor-auto place-items-center outline-none">
              <span id={titleId} className="sr-only">{selectedImage?.alt || "Fullscreen image"}</span>
              {selectedImage && <img className="m-0 max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-md object-contain" src={selectedImage.fullSrc || selectedImage.src} alt={selectedImage.alt} />}
              <Button unstyled onClick={() => setActiveIndex(null)} className="fixed right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/60 text-2xl text-white hover:bg-black/80" aria-label="Close fullscreen image">×</Button>
              {expandableIndices.length > 1 && (
                <>
                  <Button unstyled className="fixed left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/60 text-2xl text-white hover:bg-black/80" onClick={() => move(-1)} aria-label="Show previous image">‹</Button>
                  <Button unstyled className="fixed right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/60 text-2xl text-white hover:bg-black/80" onClick={() => move(1)} aria-label="Show next image">›</Button>
                  <span className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{activePosition + 1} / {expandableIndices.length}</span>
                </>
              )}
          </div>
      </dialog>
    </>
  );
}
