import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";

export default async function AboutPage() {
    return (
        <div className="container max-w-4xl space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">

            <h1 className="inline-block text-2xl font-black text-accent">
                ** About me.
            </h1>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="min-w-48 max-w-48 flex flex-col gap-2">
                    <Avatar className="h-48 w-48">
                        <AvatarImage src="/avatar.png" alt={siteConfig.author} />
                        <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <h2 className="text-base font-bold text-center break-words">
                        {siteConfig.author}
                    </h2>
                    <p className="text-muted-foreground text-center text-sm break-words">
                        Mathematician turned Software Developer
                    </p>
                </div>
                <div className="prose prose-base dark:prose-invert prose-p:text-primary">
                    <p> Hey, I&apos;m Artur. I&apos;ve been fiddling with mathematics since I can remember. </p>
                    <p>
                        This website exists because I like the idea of having my corner of the internet where I can express myself and talk about what I care about, whatever that may be. Developing it was also my introduction to web development, and the whole world surrounding that.
                    </p>
                    <p>
                        Currently, I&apos;m taking a gap year to spend time exploring my interests, which involve mathematics, coding, videography, cooking, basketball and chess.
                    </p>
                    <p> Feel free to mail me at <a className="link">arturchichorro [at] gmail.com</a> to say hello! </p>
                </div>
            </div>
        </div>
    )
}