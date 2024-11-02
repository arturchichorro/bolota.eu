import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";

interface PostItemProps {
    slug: string;
    title: string;
    description?: string;
    date: string;
    icon: string;
}

export function PostItem({ slug, title, description, date, icon }: PostItemProps) {

    return (
        <article className="grid sm:grid-cols-3 grid-cols-4 border-border border-b py-2">
            <div className="sm:col-span-2 col-span-3">
                {icon === "none" ? (
                    <h2 className="tracking-widest">
                        <Link className="link" href={slug}># {title}</Link>
                    </h2>
                ) : (
                    <h2 className="tracking-widest">
                        <Link className="link" href={slug}>Something else {title}</Link>
                    </h2>
                )}
            </div>
            <div className="col-span-1 text-right">
                <dl>
                    <dt className="sr-only">Published On</dt>
                    <dd className="text-sm">
                        <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                </dl>
            </div>
        </article>
    )
}