import Link from "next/link";
import { cn} from "@/lib/utils";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";
import { siteConfig } from "@/config/site";

interface ProjectItemProps {
    title: string;
    description?: string;
    years: string;
    gh?: string;
    posts?: string[]
}


export function ProjectItem({ title, description, years, gh, posts}: ProjectItemProps ) {


    return (
        <article className="border-2 border-border rounded-md w-full p-2 min-h-40 flex flex-col justify-between">
            <div className="flex flex-row justify-between px-1">
                <div className="flex flex-col gap-1">
                    <h1 className="text-accent text-sm">{years}</h1>
                    <h1 className="text-primary">{title}</h1>
                    <p className="prose prose-base dark:prose-invert prose-p:text-primary text-sm">{description}</p>
                </div>
                <div>
                {gh ? (
                    <Link href={gh} target="_blank" rel="noreferrer">
                        <div className="w-8 h-8 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md">
                            <Icons.gitHub className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </div>
                    </Link>
                    ) : (
                        <div className="w-8 h-8 px-0 text-muted inline-flex items-center justify-center rounded-md">
                            <Icons.gitHub className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </div>
                )}
                </div>
            </div>
            <div className="flex gap-2 flex-row">
                {posts?.map((url, index) => (
                    <Link key={index} href={url} target="_blank" rel="noreferrer" className="border-border border rounded-md text-sm px-2">
                        Article
                    </Link>
                ))}
            </div>
        </article>
    )
}

// ghost: "hover:bg-accent hover:text-accent-foreground",