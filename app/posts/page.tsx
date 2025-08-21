import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { sortPosts } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Posts",
    description: "List of all posts in bolota.eu.",
}


interface Accumulator {
    posts: JSX.Element[];
    currentYear: number | null;
}

export default async function BlogPage() {

    const sortedPosts = sortPosts(posts.filter(post => post.published));

    return (
        <div className="container max-w-4xl pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">
            {sortedPosts?.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {sortedPosts
                        .reduce<Accumulator>((acc, post) => {
                            const postYear = new Date(post.date).getFullYear();
                            if (!acc.currentYear || acc.currentYear !== postYear) {
                                acc.currentYear = postYear;
                                acc.posts.push(
                                    <li className="text-xl font-black pt-4" key={postYear}>{postYear}</li   >
                                );
                            }
                            acc.posts.push(
                                <li key={post.slug}>
                                    <PostItem slug={post.slug} date={post.date} title={post.title} description={post.description} icon={post.icon}
                                    />
                                </li>
                            );
                            return acc;
                        }, { posts: [], currentYear: null })
                        .posts
                    }
                </ul>
            ) : (
                <p>Nothing to see here yet.</p>
            )}
        </div>
    )
}