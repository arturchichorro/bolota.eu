import Link from "next/link";
import { Icons } from "./icons";
import { ExternalLinkIcon } from "lucide-react";

interface ProjectItemProps {
    title: string;
    description?: string;
    years: string;
    gh?: string;
    posts?: { post_title: string, external: boolean, url: string }[]
}

export function ProjectItem({ title, description, years, gh, posts}: ProjectItemProps ) {
    return (
        <article className="bg-popover border-2 border-border rounded-md p-4 w-full min-h-44 flex flex-col justify-between">
            <div className="flex flex-row justify-between px-1">
                <div className="flex flex-col gap-2">
                    <h1 className="text-accent text-sm">{years}</h1>
                    <h1 className="text-primary underline underline-offset-[5px] hover:text-accent hover:cursor-default">{title}</h1>
                    <p className="prose prose-base dark:prose-invert prose-p:text-primary text-sm">{description}</p>
                </div>
                <div>
                {gh ? (
                    <Link href={gh} target="_blank" rel="noreferrer">
                        <div className="w-8 h-8 hover:bg-accent text-destructive-foreground hover:text-accent-foreground inline-flex items-center justify-center rounded-md">
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
                {posts?.map((item, index) => (
                    <Link key={index} href={item.url} target="_blank" className="border-border border rounded-md text-sm text-muted-foreground px-2 py-1 hover:bg-input">
                        <div className="flex flex-row gap-1 items-center">
                            {item.post_title}
                            {item.external && <ExternalLinkIcon size="12"/>}
                        </div>
                    </Link>
                ))}
            </div>
        </article>
    )
}
