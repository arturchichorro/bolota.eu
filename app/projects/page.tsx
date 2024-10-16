import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { ProjectItem } from "@/components/project-item";

export const metadata: Metadata = {
    title: "My Projects",
    description: "List of all of the relevant projects built by arturchichorro.",
}

const projects = [
    {
        title: "Bball Vision",
        description: "Counting attempted/made Basketball shots.",
        years: "2024",
        gh: "https://github.com/arturchichorro/bballvision",
        posts: ["https://bolota.eu/posts/7_sharing_and_buildspace", "https://bolota.eu/posts/10_bballvision"]
    },
    {
        title: "Learn Anything (Lanny)",
        description: "Turn any text document into a Quizz using AI.",
        years: "2024",
        gh: undefined,
        posts: ["http://localhost:3000/posts/5_shift_appens"]
    },
]


export default async function AboutPage() {
    return (
        <div className="container max-w-4xl space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">

            <h1 className="inline-block text-2xl font-black text-accent">
                ** Projects.
            </h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               <ProjectItem title={projects[0].title} description={projects[0].description} years={projects[0].years} gh={projects[0].gh} posts={projects[0].posts} /> 
               <ProjectItem title={projects[1].title} description={projects[1].description} years={projects[1].years} gh={projects[1].gh} posts={projects[1].posts} /> 
            </ul>
        </div>
    )
}