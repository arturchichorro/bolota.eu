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
      <section className="space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">
        <div className="container flex flex-col gap-4 text-center">
          <h3 className="text-xl font-black text-secondary">
            ** Welcome.
          </h3>
          <p className="max-w-[60rem] mx-auto sm:text-lg text-balance tracking-wide">
            I'm Artur. I have a bachelor's degree in mathematics and I'm currently taking a gap year to explore my interests. If you wish to find out more about my skills & background check the about me page. You can contact me at arturchichorro [at] gmail [dot] com.
          </p>
        </div>
      </section>
      <section className="container max-w-4xl flex flex-col space-y-2">
        <h2 className="text-xl font-black text-secondary">
          ** Latest Posts.
        </h2>
        <ul className="flex flex-col">
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
