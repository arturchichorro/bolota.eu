import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { QueryPagination } from "@/components/query-pagination";
import { sortPosts } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Posts",
    description: "List of all posts in bolota.eu.",
}

const POSTS_PER_PAGE = 20;

interface BlogPageProps {
    searchParams: {
        page?: string;
    }
}

interface Accumulator {
    posts: JSX.Element[];
    currentYear: number | null;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {

    const currentPage = Number(searchParams?.page) || 1
    const sortedPosts = sortPosts(posts.filter(post => post.published));
    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

    const displayPosts = sortedPosts.slice(
        POSTS_PER_PAGE * (currentPage - 1),
        POSTS_PER_PAGE * currentPage
    );

    return (
        <div className="container max-w-4xl pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-10">
                    <h1 className="inline-block font-black text-2xl text-accent">** All Posts</h1>
                </div>
            </div>
            {displayPosts?.length > 0 ? (
                <ul className="flex flex-col gap-2">
                    {displayPosts
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
            <QueryPagination totalPages={totalPages} className="justify-end mt-4" />
        </div>
    )
}