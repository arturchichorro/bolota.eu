import { cn } from "@/lib/utils";


interface MediaItem {
    type: "image" | "video",
    src: "string",
}

interface ThreeImagesProps {
    mediaItems: MediaItem[]; // Array de links para fotos
}

export function ThreeMedias({
    mediaItems,
    ...props
}: ThreeImagesProps) {
    return (
        <div
            className={cn("flex gap-2 justify-between items-center my-6 w-full")}
            {...props}
        >
            {mediaItems.map((item, index) => (
                item.type === 'image' ? (
                    <img
                        key={index}
                        src={item.src}
                        alt={`Media ${index + 1}`}
                        className="w-1/3 object-cover rounded-md border-2 border-border"
                    />
                ) : (
                    <video
                        key={index}
                        src={item.src}
                        controls
                        className="w-1/3 object-cover rounded-md border-2 border-border"
                    />
                )
            ))}
        </div>
    );
}