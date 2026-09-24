import { Children, isValidElement, type ComponentProps, type ReactNode } from "react";
import { headingSlug } from "../lib/heading-slug";

function headingText(value: ReactNode): string {
  return Children.toArray(value).map((child) => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    if (isValidElement<{ children?: ReactNode }>(child)) return headingText(child.props.children);
    return "";
  }).join(" ");
}

const headingStyles = {
  h2: "mt-8 mb-3 scroll-mt-8 text-2xl font-semibold leading-8 text-accent",
  h3: "mt-8 mb-3 scroll-mt-8 text-xl font-semibold leading-8 text-accent",
  h4: "mt-8 mb-3 scroll-mt-8 text-lg font-medium leading-7 text-accent",
  h5: "mt-6 mb-2 scroll-mt-8 text-base font-medium leading-7 text-accent",
  h6: "mt-6 mb-2 scroll-mt-8 text-sm font-semibold leading-6 text-accent",
};

export function MdxHeading({ as: Tag, children, className = "", ...props }: ComponentProps<"h2"> & { as: "h2" | "h3" | "h4" | "h5" | "h6" }) {
  const id = headingSlug(headingText(children));
  return <Tag id={id} className={`${headingStyles[Tag]} ${className}`} {...props}><a className="subheading-anchor" href={`#${id}`}>{children}</a></Tag>;
}

export function Link({ href = "", className = "", ...props }: ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href);
  const resolvedHref = !external && !href.startsWith("/") && /^\d+_[a-z0-9_-]+$/i.test(href) ? `/posts/${href}/` : href;
  return <a className={`link ${className}`} href={resolvedHref} rel={external ? "noreferrer" : undefined} target={external ? "_blank" : undefined} {...props} />;
}

export function MdxImage({ className = "", ...props }: ComponentProps<"img">) {
  return <img className={`mx-auto my-7 block h-auto max-w-full rounded-md border border-border bg-surface ${className}`} loading="lazy" decoding="async" {...props} />;
}

export function MdxVideo({ className = "", ...props }: ComponentProps<"video">) {
  return <video className={`mx-auto my-7 block h-auto max-w-full rounded-md border border-border bg-surface ${className}`} preload="metadata" {...props} />;
}

export const mdxComponents = {
  a: Link,
  img: MdxImage,
  video: MdxVideo,
  h2: (props: ComponentProps<"h2">) => <MdxHeading as="h2" {...props} />,
  h3: (props: ComponentProps<"h3">) => <MdxHeading as="h3" {...props} />,
  h4: (props: ComponentProps<"h4">) => <MdxHeading as="h4" {...props} />,
  h5: (props: ComponentProps<"h5">) => <MdxHeading as="h5" {...props} />,
  h6: (props: ComponentProps<"h6">) => <MdxHeading as="h6" {...props} />,
};
