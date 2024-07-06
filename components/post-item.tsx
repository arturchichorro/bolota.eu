import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";

interface PostItemProps {
    slug: string;
    title: string;
    description?: string;
    date: string;
}

export function PostItem({ slug, title, description, date }: PostItemProps) {
    return (
        <article className="flex flex-row justify-between border-border border-b py-1.5">
            <div>
                <h2 className="border-b-2 border-accent/[0.6] text-accent tracking-widest hover:border-transparent text-base font-normal hover:bg-destructive hover:text-accent-foreground">
                    <Link href={slug}># {title}</Link>
                </h2>
            </div>
            <div className="flex justify-between items-center">
                <dl className="flex flex-row">
                    <dt className="sr-only">Published On</dt>
                    <dd className="text-sm flex items-center">
                        <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                </dl>
            </div>
        </article>
    )
}