import { Metadata } from "next";
import { ProjectItem } from "@/components/project-item";

export const metadata: Metadata = {
    title: "My Projects",
    description: "List of all of the relevant projects built by arturchichorro.",
}

const projects = [
    {
        title: "Bolota.eu",
        description: "This website's source code.",
        years: "2023-2024",
        gh: "https://github.com/arturchichorro/bolota-v2",
        posts: [
            {post_title: "Version 2", external: false, url: "posts/6_bolotaeuv2"},
            {post_title: "Version 1", external: false, url: "posts/1_bolotaeuv1"},
        ]
    },
    {
        title: "Basketball Vision",
        description: "Counting attempted/made Basketball shots w/ Python.",
        years: "2024",
        gh: "https://github.com/arturchichorro/bballvision",
        posts: [
            {post_title: "Implementation", external: false, url: "posts/10_bballvision"},
            {post_title: "Idea", external: false, url: "posts/7_sharing_and_buildspace"},
        ]
    },
    {
        title: "Walkie Talkie",
        description: "Simple mobile app to send voice messages.",
        years: "2024",
        gh: "https://github.com/arturchichorro/WalkieTalkie",
        posts: [
            {post_title: "Article", external: false, url: "posts/11_walkietalkie"},
        ]
    },
    {
        title: "Spotify Controller",
        description: "Device to pause/play/skip/like songs on spotify.",
        years: "2024",
        gh: "https://github.com/arturchichorro/Spotify_Controller",
        posts: [
            {post_title: "Article", external: false, url: "posts/8_embedded_programming"},
        ]
    },
    {
        title: "Learn Anything (Lanny)",
        description: "Turn any text document into a Quizz using AI.",
        years: "2024",
        gh: undefined,
        posts: [
            {post_title: "Article", external: false, url:"posts/5_shift_appens"},
            {post_title: "Behance", external: true, url:"https://www.behance.net/gallery/198170575/Lanny"}
        ]
    },
    {
        title: "Rust Chess Engine",
        description: "Work in Progress: Building a Chess Engine with Rust.",
        years: "2024",
        gh: "https://github.com/arturchichorro/chess-engine",
        posts: [
            {post_title: "Version 1", external: false, url:"posts/4_chess_enginev1"},
        ]
    },
    {
        title: "Connect Four Bot + UI",
        description: "Play Connect Four against the computer.",
        years: "2024",
        gh: undefined,
        posts: [
            {post_title: "Play here", external: false, url:"posts/9_connect4"},
        ]
    },
    {
        title: "React Chess Interface",
        description: "Simple local chess implementation using React.",
        years: "2024",
        gh: "https://github.com/arturchichorro/chess-react",
        posts: [
            {post_title: "Play here", external: true, url:"https://chess-react-bolota.netlify.app/"},
            {post_title: "Article", external: false, url:"posts/2_reactchessv1"},
        ]
    },
    {
        title: "Mathematical Animations",
        description: "Source code for the videos I made with Manim.",
        years: "2024",
        gh: "https://github.com/arturchichorro/manim_videos",
        posts: [
            {post_title: "Learning Manim", external: false, url:"posts/3_manim_first_attempt"},
            {post_title: "Instagram", external: true, url:"https://www.instagram.com/p/C3F2XjuN8qU/"},
        ]
    },
]


export default async function AboutPage() {
    return (
        <div className="container max-w-4xl space-y-6 pb-8 pt-6 md:pb-2 md:mt-2 lg:py-2">

            <h1 className="inline-block text-2xl font-black text-accent">
                ** Projects.
            </h1>
            <div className="prose prose-base dark:prose-invert prose-p:text-primary">
                    <p> Here&apos;s all the projects I&apos;ve worked / am working on. </p>
                </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <ProjectItem 
                        key={index}
                        title={project.title} 
                        description={project.description} 
                        years={project.years} 
                        gh={project.gh} 
                        posts={project.posts} 
                    />
                ))}
            </ul>
        </div>
    )
}