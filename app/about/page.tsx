import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";

export default async function AboutPage() {
    return (
        <div className="container max-w-6xl py-6 lg:py-10">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-x-4">
                    <h1 className="inline-block font-black text-4xl lg:text-5xl">
                        About me
                    </h1>
                </div>
            </div>
            <hr className="my-8" />
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="min-w-48 max-w-48 flex flex-col gap-2">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src="/avatar.png" alt={siteConfig.author} />
                        <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold text-center break-words">
                        {siteConfig.author}
                    </h2>
                    <p className="text-muted-foreground text-center break-words">
                        Mathematician turned Software Developer
                    </p>
                </div>
                <p className="text-muted-foreground text-lg py-4">
                    I'm a recently graduated math student, without much of an idea of what to do next. Currently, I'm spending my time exploring some of my interests, which involve mathematics, web development, coding, videography, cooking, basketball and chess.
                </p>
            </div>
        </div>
    )
}