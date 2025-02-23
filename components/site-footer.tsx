import { siteConfig } from "@/config/site";
import { Mail } from "lucide-react";
import { Icons } from "./icons";

export function SiteFooter() {
    return (
        <footer>
            <div className="md-6 mt-14 flex flex-col items-center">
                <div className="mb-3 flex space-x-4">
                    {/* <a target="_blank" rel="noreferrer" href="mailto:hello@example.com">
                        <span className="sr-only">Mail</span>
                        <Mail className="h-4 w-4" />
                    </a> */}
                    <a target="_blank" rel="noreferrer" href={siteConfig.links.github}>
                        <span className="sr-only">GitHub</span>
                        <Icons.gitHub className="h-4 w-4" />
                    </a>
                </div>
                <div className="mb-2 flex space-x-2 text-sm text-muted-foreground">
                    {siteConfig.author}
                </div>
            </div>
        </footer>
    )
}