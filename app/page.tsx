import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn, sortPosts } from "@/lib/utils";
import { posts } from "#site/content";
import Link from "next/link";
import { PostItem } from "@/components/post-item";

export default function Home() {

  const latestPosts = sortPosts(posts).slice(0, 5);

  return (
    <>
      <section className="container max-w-4xl space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-black text-accent">
            ** Welcome.
          </h3>
          <p className="sm:text-lg">
            Hello, I'm Artur, a mathematician / coder. Welcome to my corner of the internet, where I talk about whatever I spend my energy on. If you wish to find out more about me check the <a href="/about" className="link">about me</a> page.
          </p>
        </div>
      </section>
      <section className="container max-w-4xl flex flex-col pt-6">
        <h2 className="text-2xl font-black text-secondary py-2">
          ** Latest Posts.
        </h2>
        <ul className="flex flex-col gap-2">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <PostItem
                slug={post.slug}
                title={post.title}
                description={post.description}
                date={post.date}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
