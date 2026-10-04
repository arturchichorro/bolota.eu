import type { Root } from "hast";
import { fromHtml } from "hast-util-from-html";
import katex from "katex";

// Also traverse MDX JSX containers, which aren't standard HAST elements.
type TreeNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  value?: string;
  children?: TreeNode[];
  position?: { start: { line: number; column: number } };
};

function classes(node: TreeNode): string[] {
  const value = node.properties?.className;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function text(node: TreeNode): string {
  return node.type === "text" ? node.value || "" : (node.children || []).map(text).join("");
}

/** Render remark-math nodes with the same direct KaTeX dependency as our CSS. */
export default function rehypeMath() {
  return (tree: Root, file: { path?: string }) => {
    const visit = (parent: TreeNode) => {
      if (!parent.children) return;
      for (let index = 0; index < parent.children.length;) {
        const node = parent.children[index];
        const code = node.tagName === "pre" && node.children?.length === 1 ? node.children[0] : undefined;
        const fencedMath = code?.tagName === "code" && classes(code).includes("language-math");
        const mathClasses = classes(node);
        const isMath = node.type === "element" && (
          fencedMath || mathClasses.some((name) => ["math-inline", "math-display", "language-math"].includes(name))
        );

        if (!isMath) {
          visit(node);
          index++;
          continue;
        }

        let html: string;
        try {
          html = katex.renderToString(text(fencedMath ? code : node), {
            displayMode: Boolean(fencedMath) || mathClasses.includes("math-display"),
            throwOnError: true,
            strict: "error",
            trust: false,
            output: "htmlAndMathml",
          });
        } catch (cause) {
          const location = node.position?.start;
          const source = `${file.path || "MDX"}${location ? `:${location.line}:${location.column}` : ""}`;
          throw new Error(`Invalid math in ${source}: ${cause instanceof Error ? cause.message : String(cause)}`, { cause });
        }

        const rendered = fromHtml(html, { fragment: true }).children;
        parent.children.splice(index, 1, ...rendered);
        index += rendered.length;
      }
    };
    visit(tree);
  };
}
