export function ThreeMedias({ mediaItems }: { mediaItems: { type: "image" | "video"; src: string; caption?: string }[] }) {
  return (
    <div className="my-8 grid w-full grid-cols-3 gap-2 max-sm:grid-cols-1">
      {mediaItems.map((item, index) => (
        <figure className="m-0" key={item.src}>
          {item.type === "image"
            ? <img className="m-0 aspect-4/5 w-full rounded-md border border-border object-cover" src={item.src} alt={item.caption || `Media ${index + 1}`} loading="lazy" decoding="async" />
            : <video className="m-0 aspect-4/5 w-full rounded-md border border-border object-cover" src={item.src} controls preload="metadata" />}
          {item.caption && <figcaption className="pt-2 text-center text-xs leading-snug text-faint">{item.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
