import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";
import "@/styles/mdx.css"
import { formatDate } from "@/lib/utils";

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
            <h1 className="mb-2">{post.title}</h1>
            <p className="text-xl mt-0 text-muted-foreground">Posted on <time dateTime={post.date}>{formatDate(post.date)}</time></p>
            <hr className="my-4" />
            <MDXContent code={post.body} />
        </article>
    )
}