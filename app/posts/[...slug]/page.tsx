import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";
import "@/styles/mdx.css"
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Link from "next/link";

interface PostPageProps {
    params: {
        slug: string[];
    };
}

async function getPostFromParams(params: PostPageProps["params"]) {
    const slug = params?.slug.join("/")
    const post = posts.find(post => post.slugAsParams === slug);

    return post;
}

export async function generateMetadata({
    params
}: PostPageProps): Promise<Metadata> {
    const post = await getPostFromParams(params);

    if (!post) {
        return {}
    }

    const ogSearchParams = new URLSearchParams();
    ogSearchParams.set("title", post.title);

    return {
        title: post.title,
        description: post.description,
        authors: { name: siteConfig.author },
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            url: post.slug,
            images: {
                url: `/api/og?${ogSearchParams.toString()}`,
                width: 1200,
                height: 630,
                alt: post.title
            }
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: [`/api/og?${ogSearchParams.toString()}`]
        }
    }
}

export async function generateStaticParams(): Promise<PostPageProps["params"][]> {
    return posts.map(post => ({ slug: post.slugAsParams.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {

    const post = await getPostFromParams(params);

    if (!post || !post.published) {
        notFound();
    }

    return (
        <article className="container py-6 prose prose-headings:text-accent prose-a:text-accent dark:prose-invert max-w-3xl mx-auto">
            
            <div className="grid grid-cols-[2fr_1fr]">
                <div className="flex flex-col justify-between">
                    <h1 className="mb-2 text-3xl">{post.title}</h1>
                    <p className="m-0">Posted on <time dateTime={post.date}>{formatDate(post.date)}</time></p>
                </div>
                {Array.isArray(post.saga) && post.saga.length > 0 ? (
                    <ul className="flex flex-col justify-end list-none m-0">
                        {post.saga.map((item) => (
                        <li className="m-1" key={item.url}>
                            <Link
                            href={item.url}
                            className="block rounded-full border border-border/70 px-2.5 py-1 text-xs no-underline hover:bg-accent/10 hover:border-border text-center whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                {item.title}
                            </Link>
                        </li>
                        ))}
                    </ul>
                ) : null}
            </div>

            
            <hr className="my-4 border-border/[0.50]" />
            <MDXContent code={post.body} />
        </article>
    )
}