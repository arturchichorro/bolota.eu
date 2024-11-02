import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn, sortPosts } from "@/lib/utils";
import { posts } from "#site/content";
import Link from "next/link";
import { PostItem } from "@/components/post-item";
import { ProjectItem } from "@/components/project-item";
import { projects } from "@/lib/projects";

export default function Home() {

  const latestPosts = sortPosts(posts).filter(post => post.published).slice(0, 5);
  const topProjects = projects.slice(0,6);

  return (
    <>
      <section className="container max-w-4xl space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-black text-accent">
            ** Welcome.
          </h3>
          <p className="sm:text-lg">
            Hello, I&apos;m Artur, a mathematician / coder. Welcome to my corner of the internet, where I talk about whatever I spend my energy on. If you wish to find out more about me check the <a href="/about" className="link">about me</a> page.
          </p>
        </div>
      </section>
      <section className="container max-w-4xl flex flex-col py-6 gap-10">
        <div>
          <h2 className="text-2xl font-black text-accent py-2">
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
        </div>
        <div>
          <h2 className="text-2xl font-black text-accent py-2">
            ** Projects.
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topProjects.map((project, index) => (
              <li key={index}>
                <ProjectItem
                  title={project.title} 
                  description={project.description} 
                  years={project.years} 
                  gh={project.gh} 
                  posts={project.posts}  
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
