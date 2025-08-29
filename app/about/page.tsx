import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import LeetCodeStats from "@/components/stats/leetcode-stats";
import ChessStats from "@/components/stats/chess-stats";
import SubscribeSection from "@/components/mailerlite/subscribe-section";

export const metadata: Metadata = {
    title: "About Me",
    description: "Information about me",
}

export default async function AboutPage() {

    return (
        <div className="container max-w-4xl space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">

            <h1 className="inline-block text-2xl font-black text-accent">
                About me
            </h1>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="min-w-48 max-w-48 flex flex-col gap-2">
                    <Avatar className="h-48 w-48">
                        <AvatarImage src="https://utfs.io/f/If0ZI6Cx8kn0CdQkOi6u5ABixORCQtesJl28mhMDfgYvLrFo" alt={siteConfig.author} />
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
                    <p> Hey, I&apos;m Artur and this is my personal website. </p>
                    <p>
                        My studies were in mathematics, but I like doing all kinds of other things too: coding, cooking, basketball, chess and puzzles in general. This website exists because I want to express myself and talk about what I care about, whatever that may be. Right now, it&apos;s all the things I&apos;ve been learning about.
                    </p>
                    <p> Whether you want to contact me or request my CV, feel free to mail me at <a className="link">arturchichorro [at] bolota.eu</a>!</p>
                </div>
            </div>

            <div className="flex justify-center">
                <SubscribeSection />
            </div>

            <hr></hr>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LeetCodeStats />
                <ChessStats />
            </div>
        </div>
    )
}