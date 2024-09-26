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
        <article className="flex flex-row justify-between border-border border-b py-2">
            <div>
                <h2 className="link tracking-widest">
                    <Link href={slug}># {title}</Link>
                </h2>
            </div>
            <div className="flex justify-between items-center">
                <dl className="flex flex-row">
                    <dt className="sr-only">Published On</dt>
                    <dd className="flex text-sm sm:text-xs">
                        <time className=""dateTime={date}>{formatDate(date)}</time>
                    </dd>
                </dl>
            </div>
        </article>
    )
}