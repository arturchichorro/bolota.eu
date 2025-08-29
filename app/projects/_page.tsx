import { Metadata } from "next";
import { ProjectItem } from "@/components/project-item";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
    title: "bolotaeu Projects",
    description: "List of all relevant projects built by arturchichorro.",
}

export default async function AboutPage() {
    return (
        <div className="container max-w-4xl space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">
            <h1 className="text-2xl font-black text-accent">
                Projects
            </h1>
            <div className="prose prose-base dark:prose-invert prose-p:text-primary">
                <p> Here&apos;s all the projects I&apos;ve worked / am working on. </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <li key={index}>
                        <ProjectItem
                            title={project.title} 
                            description={project.description} 
                            years={project.years} 
                            gh={project.gh} 
                            posts={project.posts} 
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}