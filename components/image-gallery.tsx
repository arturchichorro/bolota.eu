"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

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
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomedSize, setZoomedSize] = useState({ width: 0, height: 0 });
    const fullscreenViewportRef = useRef<HTMLDivElement>(null);
    const fullscreenImageRef = useRef<HTMLImageElement>(null);
    const zoomFocusRef = useRef({ x: 0.5, y: 0.5 });

    const positionZoomedImage = () => {
        const viewport = fullscreenViewportRef.current;
        const image = fullscreenImageRef.current;
        if (!viewport || !image) return;

        viewport.scrollTo({
            left: image.offsetLeft + image.clientWidth * zoomFocusRef.current.x - viewport.clientWidth / 2,
            top: image.offsetTop + image.clientHeight * zoomFocusRef.current.y - viewport.clientHeight / 2,
        });
    };

    useLayoutEffect(() => {
        if (isZoomed) positionZoomedImage();
    }, [isZoomed, zoomedSize]);

    if (images.length === 0) return null;

    const selectedIndex = activeIndex ?? 0;
    const selectedImage = images[selectedIndex];
    const selectedImageSrc = selectedImage.fullSrc || selectedImage.src;
    const expandableIndices = images.flatMap((image, index) => image.expandable === false ? [] : [index]);
    const selectedExpandableIndex = Math.max(0, expandableIndices.indexOf(selectedIndex));
    const hasMultipleImages = expandableIndices.length > 1;
    const isScrollable = layout === "scroll";
    const resetZoom = () => {
        setIsZoomed(false);
        fullscreenViewportRef.current?.scrollTo({ left: 0, top: 0 });
    };
    const showPrevious = () => {
        resetZoom();
        setActiveIndex(expandableIndices[(selectedExpandableIndex - 1 + expandableIndices.length) % expandableIndices.length]);
    };
    const showNext = () => {
        resetZoom();
        setActiveIndex(expandableIndices[(selectedExpandableIndex + 1) % expandableIndices.length]);
    };
    const zoomAt = (x: number, y: number) => {
        const image = fullscreenImageRef.current;
        if (!image) return;

        zoomFocusRef.current = { x, y };
        const bounds = image.getBoundingClientRect();
        setZoomedSize({
            width: bounds.width * 1.6,
            height: bounds.height * 1.6,
        });
        setIsZoomed(true);
    };
    const handleImageClick = (event: ReactMouseEvent<HTMLImageElement>) => {
        if (isZoomed) {
            resetZoom();
            return;
        }

        const bounds = event.currentTarget.getBoundingClientRect();
        zoomAt(
            (event.clientX - bounds.left) / bounds.width,
            (event.clientY - bounds.top) / bounds.height,
        );
    };

    return (
        <Dialog.Root
            open={activeIndex !== null}
            onOpenChange={(open) => {
                if (!open) {
                    setActiveIndex(null);
                    resetZoom();
                }
            }}
        >
            <div
                className="not-prose my-7"
                style={wide ? {
                    width: "min(calc(100vw - 4rem), 52rem)",
                    marginLeft: "50%",
                    transform: "translateX(-50%)",
                } : undefined}
            >
                <div
                    className={isScrollable ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3" : "grid gap-3"}
                    style={isScrollable ? undefined : { gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
                >
                    {images.map((image, index) => {
                        const expandable = image.expandable !== false;
                        const preview = (
                            <img
                                className="m-0 block w-full transition-transform duration-200 group-hover:scale-[1.01]"
                                style={{
                                    aspectRatio: previewAspectRatio,
                                    objectFit: image.previewFit || "cover",
                                    objectPosition: "center",
                                }}
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                                decoding="async"
                            />
                        );

                        return (
                            <figure
                                className={isScrollable ? "m-0 shrink-0 snap-start" : "m-0 min-w-0 justify-self-center"}
                                style={isScrollable
                                    ? { width: "min(70vw, 35rem)" }
                                    : { width: "100%", maxWidth: previewMaxWidth }}
                                key={`${image.src}-${index}`}
                            >
                                {expandable ? (
                                    <Dialog.Trigger asChild>
                                        <button
                                            className="group block w-full cursor-zoom-in overflow-hidden rounded-md border-2 border-border bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            onClick={() => {
                                                resetZoom();
                                                setActiveIndex(index);
                                            }}
                                            type="button"
                                            aria-label={`Open ${image.alt} fullscreen`}
                                        >
                                            {preview}
                                        </button>
                                    </Dialog.Trigger>
                                ) : (
                                    <div className="block w-full overflow-hidden rounded-md border-2 border-border bg-card">
                                        {preview}
                                    </div>
                                )}
                                {image.caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{image.caption}</figcaption>}
                            </figure>
                        );
                    })}
                </div>
            </div>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" />
                <Dialog.Content
                    className="fixed left-1/2 top-1/2 z-50 h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden focus:outline-none"
                    onKeyDown={(event) => {
                        if (event.key === "ArrowLeft" && hasMultipleImages) showPrevious();
                        if (event.key === "ArrowRight" && hasMultipleImages) showNext();
                    }}
                >
                    <Dialog.Title className="sr-only">{selectedImage.alt}</Dialog.Title>
                    <Dialog.Description className="sr-only">Fullscreen image {selectedExpandableIndex + 1} of {expandableIndices.length}</Dialog.Description>

                    <div ref={fullscreenViewportRef} className={`h-full w-full ${isZoomed ? "overflow-auto" : "flex items-center justify-center overflow-hidden"}`}>
                        {isZoomed ? (
                            <div
                                className="grid min-h-full min-w-full place-items-center"
                                style={{
                                    width: `max(100%, ${zoomedSize.width}px)`,
                                    height: `max(100%, ${zoomedSize.height}px)`,
                                }}
                            >
                                <img
                                    ref={fullscreenImageRef}
                                    className="m-0 block max-h-none max-w-none cursor-zoom-out rounded-md"
                                    style={{ width: `${zoomedSize.width}px`, height: `${zoomedSize.height}px` }}
                                    src={selectedImageSrc}
                                    alt={selectedImage.alt}
                                    onClick={handleImageClick}
                                    onLoad={positionZoomedImage}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            resetZoom();
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Zoom out"
                                    draggable={false}
                                />
                            </div>
                        ) : (
                            <img
                                ref={fullscreenImageRef}
                                className="m-0 block max-h-full max-w-full cursor-zoom-in rounded-md object-contain"
                                style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }}
                                src={selectedImageSrc}
                                alt={selectedImage.alt}
                                onClick={handleImageClick}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        zoomAt(0.5, 0.5);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label="Zoom in"
                                draggable={false}
                            />
                        )}
                    </div>

                    <Dialog.Close asChild>
                        <button className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" aria-label="Close fullscreen image">
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </Dialog.Close>

                    {hasMultipleImages && (
                        <>
                            <button className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" onClick={showPrevious} aria-label="Show previous image">
                                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <button className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" onClick={showNext} aria-label="Show next image">
                                <ChevronRight className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                                {selectedExpandableIndex + 1} / {expandableIndices.length}
                            </span>
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
