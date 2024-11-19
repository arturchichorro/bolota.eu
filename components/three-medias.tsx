import { cn } from "@/lib/utils";


interface MediaItem {
    type: "image" | "video",
    src: string,
    caption?: string
}

interface ThreeImagesProps {
    mediaItems: MediaItem[];
}

export function ThreeMedias({
    mediaItems,
    ...props
}: ThreeImagesProps) {
    return (
        <div
            className={cn("grid grid-cols-3 gap-1 w-full")}
            {...props}
        >
            {mediaItems.map((item, index) => (
                <div key={index}>
                    {item.type === 'image' ? (
                        <img
                            src={item.src}
                            alt={`Media ${index + 1}`}
                            className="object-cover rounded-md border-2 border-border w-full"
                        />
                    ) : (
                        <video
                            src={item.src}
                            controls
                            className="object-cover rounded-md border-2 border-border"
                        />
                    )}
                    {item.caption && (
                        <p className="text-sm text-muted-foreground text-center">{item.caption}</p>
                    )}
                </div>
            ))}
        </div>
    );
}