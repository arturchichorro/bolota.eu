import type { ReactNode } from "react";

type Tone = "theme" | "green" | "orange" | "amber" | "blue" | "rose" | "violet" | "neutral" | "light";
type Side = "top" | "right" | "bottom" | "left";
type Position = { x: number; y: number };

export type StaticFlowNode = {
    id: string;
    title: string;
    detail?: string;
    eyebrow?: string;
    items?: string[];
    itemsLayout?: "list" | "chips";
    image?: string;
    imageAlt?: string;
    icon?: "house" | "reddit" | "spark" | "rank" | "send" | "shield" | "rewrite" | "signal";
    shape?: "card" | "pill" | "database" | "plain";
    tone?: Tone;
    content?: ReactNode;
    render?: ReactNode;
    className?: string;
    align?: "left" | "center";
    verticalAlign?: "top" | "center";
    headerInline?: boolean;
    headerBoxed?: boolean;
    dashed?: boolean;
    width?: number;
    height?: number;
    position?: Position;
};

export type StaticFlowEdge = {
    from: string;
    to: string;
    fromSide?: Side;
    toSide?: Side;
    label?: string;
    dashed?: boolean;
    emphasized?: boolean;
    bidirectional?: boolean;
    tone?: Tone;
    offset?: number;
    labelSide?: "left" | "right";
};

type PositionedNode = StaticFlowNode & Required<Pick<StaticFlowNode, "position" | "width" | "height">>;

const tones: Record<Tone, { color: string; fill: string; foreground: string; muted: string }> = {
    theme: { color: "var(--color-border)", fill: "var(--color-surface)", foreground: "var(--color-foreground)", muted: "var(--color-muted)" },
    green: { color: "#62c98d", fill: "#10241a", foreground: "#f0f5f1", muted: "#8ca194" },
    orange: { color: "#ff8a2b", fill: "#28170d", foreground: "#f0f5f1", muted: "#a99687" },
    amber: { color: "#f5a524", fill: "#251b0d", foreground: "#f0f5f1", muted: "#a99c86" },
    blue: { color: "#60a5fa", fill: "#10202d", foreground: "#f0f5f1", muted: "#8ca0ad" },
    rose: { color: "#fb7185", fill: "#281419", foreground: "#f0f5f1", muted: "#aa9296" },
    violet: { color: "#c4b5fd", fill: "#211a2d", foreground: "#f0f5f1", muted: "#c8c5ce" },
    neutral: { color: "#d8e0da", fill: "#111a15", foreground: "#f0f5f1", muted: "#8ca194" },
    light: { color: "#64746a", fill: "#f2f3f0", foreground: "#172019", muted: "#58615a" },
};

const iconGlyphs = {
    spark: "✦",
    rank: "⇅",
    send: "↗",
    shield: "◇",
    rewrite: "↻",
    signal: "⌁",
} as const;

function NodeIcon({ name, color }: { name: NonNullable<StaticFlowNode["icon"]>; color: string }) {
    if (name === "house") {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m3 11 9-7 9 7" />
                <path d="M5.5 9.5V20h13V9.5" />
                <path d="M9.5 20v-6h5v6" />
            </svg>
        );
    }
    if (name === "reddit") {
        return (
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" role="img" aria-label="Reddit">
                <circle cx="12" cy="12" r="10" fill="#ff4500" />
                <path d="M7 13.1c0-2 2.25-3.6 5-3.6s5 1.6 5 3.6-2.25 3.6-5 3.6-5-1.6-5-3.6Zm2.2-.35a.85.85 0 1 0 0-1.7.85.85 0 0 0 0 1.7Zm5.6 0a.85.85 0 1 0 0-1.7.85.85 0 0 0 0 1.7Zm-4.9 1.4c.55.5 1.25.75 2.1.75s1.55-.25 2.1-.75" fill="none" stroke="white" strokeWidth="1.15" strokeLinecap="round" />
                <path d="m13.1 9.55.65-2.7 2.05.45" fill="none" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
        );
    }
    return <span className="text-base leading-none" style={{ color }}>{iconGlyphs[name]}</span>;
}

function dimensions(node: StaticFlowNode) {
    if (node.width || node.height) return { width: node.width || 190, height: node.height || 124 };
    if (node.shape === "database") return { width: 190, height: 130 };
    if (node.shape === "pill") return { width: 190, height: 100 };
    return { width: 190, height: 124 };
}

function positionNodes(nodes: StaticFlowNode[], direction: "horizontal" | "vertical"): PositionedNode[] {
    return nodes.map((node, index) => ({
        ...node,
        ...dimensions(node),
        position: node.position || (direction === "horizontal" ? { x: index * 250, y: 0 } : { x: 0, y: index * 180 }),
    }));
}

function connectionPoint(node: PositionedNode, side: Side) {
    const { x, y } = node.position;
    if (side === "top") return { x: x + node.width / 2, y };
    if (side === "bottom") return { x: x + node.width / 2, y: y + node.height };
    if (side === "left") return { x, y: y + node.height / 2 };
    return { x: x + node.width, y: y + node.height / 2 };
}

function edgePath(source: Position, target: Position, sourceSide: Side, targetSide: Side) {
    const horizontal = sourceSide === "left" || sourceSide === "right" || targetSide === "left" || targetSide === "right";
    if (horizontal) {
        const middle = (source.x + target.x) / 2;
        return `M ${source.x} ${source.y} C ${middle} ${source.y}, ${middle} ${target.y}, ${target.x} ${target.y}`;
    }
    const middle = (source.y + target.y) / 2;
    return `M ${source.x} ${source.y} C ${source.x} ${middle}, ${target.x} ${middle}, ${target.x} ${target.y}`;
}

function NodeContent({ node }: { node: PositionedNode }) {
    const tone = tones[node.tone || "green"];
    if (node.render) return node.render;
    const centered = node.align === "center" || node.shape === "pill" || node.shape === "database";
    const titleColor = node.shape === "plain" ? tone.color : tone.foreground;
    const secondaryColor = node.shape === "plain" ? "var(--color-foreground)" : tone.muted;
    const inlineHeader = node.headerInline && (node.image || node.icon);
    const topAligned = node.verticalAlign ? node.verticalAlign === "top" : node.shape === "card";

    return (
        <div className={`flex h-full w-full flex-col ${topAligned ? "justify-start" : "justify-center"} ${centered ? "items-center text-center" : "items-start text-left"} ${node.className || ""}`}>
            {inlineHeader ? (
                <div className={`flex w-full items-center gap-2 ${node.headerBoxed ? "rounded-lg border border-border bg-surface p-3 shadow-sm shadow-black/10" : ""}`}>
                    {node.image && <img className="m-0 h-7 w-7 border-0 object-contain" src={node.image} alt={node.imageAlt || ""} />}
                    {!node.image && node.icon && (
                        node.icon === "house"
                            ? <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-2"><NodeIcon name={node.icon} color="var(--color-accent)" /></span>
                            : <NodeIcon name={node.icon} color={tone.color} />
                    )}
                    <strong className="block whitespace-pre-line text-[15px] leading-tight" style={{ color: titleColor }}>{node.title}</strong>
                </div>
            ) : (node.image || node.icon || node.eyebrow) && (
                <div className="mb-2 flex items-center gap-2">
                    {node.image && <img className="m-0 h-7 w-7 border-0 object-contain" src={node.image} alt={node.imageAlt || ""} />}
                    {!node.image && node.icon && <NodeIcon name={node.icon} color={tone.color} />}
                    {node.eyebrow && <span className="font-mono text-[9px] font-semibold uppercase tracking-[.12em]" style={{ color: tone.color }}>{node.eyebrow}</span>}
                </div>
            )}
            {!inlineHeader && <strong className="block whitespace-pre-line text-[15px] leading-tight" style={{ color: titleColor }}>{node.title}</strong>}
            {node.detail && <span className="mt-1 block max-w-full text-[11px] leading-snug" style={{ color: secondaryColor }}>{node.detail}</span>}
            {node.items?.length && node.itemsLayout === "chips" ? (
                <ul className="my-0 mt-3 flex list-none flex-wrap gap-1.5 p-0 text-left text-xs leading-none" style={{ color: secondaryColor }}>
                    {node.items.map((item) => <li className="m-0 rounded-full border border-border bg-background px-2 py-1.5" key={item}>{item}</li>)}
                </ul>
            ) : node.items?.length ? (
                <ul className="my-0 mt-3 list-disc space-y-1 pl-5 text-left text-[13px] leading-snug opacity-80" style={{ color: secondaryColor }}>
                    {node.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
            ) : null}
            {node.content && <div className="mt-2">{node.content}</div>}
        </div>
    );
}

function StaticNode({ node }: { node: PositionedNode }) {
    const tone = tones[node.tone || "green"];
    const { x, y } = node.position;
    const shape = node.shape || "card";
    const radius = shape === "pill" ? node.height / 2 : 7;
    const databaseRadiusY = 8;
    const databaseTop = y + databaseRadiusY;
    const databaseBottom = y + node.height - databaseRadiusY;
    const databaseLayerHeight = (databaseBottom - databaseTop) / 3;
    const databaseSeparators = [
        databaseTop + databaseLayerHeight,
        databaseTop + databaseLayerHeight * 2,
    ];
    const contentInset = shape === "database"
        ? { x: x + 15, y: y + 23, width: node.width - 30, height: node.height - 33 }
        : { x: x + 13, y: y + 10, width: node.width - 26, height: node.height - 20 };

    return (
        <g>
            {shape === "plain" ? null : shape === "database" ? (
                <>
                    <path d={`M ${x + 1} ${databaseTop} V ${databaseBottom} C ${x + 1} ${databaseBottom + databaseRadiusY * 1.35}, ${x + node.width - 1} ${databaseBottom + databaseRadiusY * 1.35}, ${x + node.width - 1} ${databaseBottom} V ${databaseTop}`} fill={tone.fill} stroke={tone.color} strokeOpacity=".65" strokeWidth="1.5" />
                    <ellipse cx={x + node.width / 2} cy={databaseTop} rx={node.width / 2 - 1} ry={databaseRadiusY} fill={tone.fill} stroke={tone.color} strokeOpacity=".9" strokeWidth="1.5" />
                    {databaseSeparators.map((separator) => (
                        <path
                            key={separator}
                            d={`M ${x + 1} ${separator} C ${x + 1} ${separator + databaseRadiusY * 1.35}, ${x + node.width - 1} ${separator + databaseRadiusY * 1.35}, ${x + node.width - 1} ${separator}`}
                            fill="none"
                            stroke={tone.color}
                            strokeOpacity=".35"
                            strokeWidth="1.5"
                        />
                    ))}
                </>
            ) : (
                <rect x={x} y={y} width={node.width} height={node.height} rx={radius} fill={tone.fill} fillOpacity={node.tone === "light" ? "1" : ".78"} stroke={tone.color} strokeOpacity={node.tone === "light" ? "1" : ".75"} strokeWidth="1.5" strokeDasharray={node.dashed ? "7 6" : undefined} />
            )}
            <foreignObject {...contentInset}>
                <div className="h-full w-full">
                    <NodeContent node={node} />
                </div>
            </foreignObject>
        </g>
    );
}

function DistributedNode({ node }: { node: StaticFlowNode }) {
    const size = dimensions(node);
    const positioned = { ...node, ...size, position: { x: 0, y: 0 } };
    const tone = tones[node.tone || "theme"];
    const shape = node.shape || "card";

    return (
        <div
            className={`box-border justify-self-center ${node.headerBoxed ? "" : `border p-3 shadow-sm shadow-black/10 ${shape === "pill" ? "rounded-full" : "rounded-lg"}`}`}
            style={{
                width: `${size.width}px`,
                height: node.height ? `${node.height}px` : undefined,
                backgroundColor: node.headerBoxed ? undefined : tone.fill,
                borderColor: node.headerBoxed ? undefined : tone.color,
            }}
        >
            <NodeContent node={positioned} />
        </div>
    );
}

export function StaticBlogFlowDiagram({
    nodes,
    edges,
    label,
    direction = "horizontal",
    layout = "flow",
    wide = false,
}: {
    nodes: StaticFlowNode[];
    edges: StaticFlowEdge[];
    label: string;
    direction?: "horizontal" | "vertical";
    layout?: "flow" | "distributed";
    wide?: boolean;
}) {
    const wideStyle = wide ? {
        width: "min(calc(100vw - 4rem), 52rem)",
        marginLeft: "50%",
        transform: "translateX(-50%)",
    } : undefined;

    if (layout === "distributed") {
        const largestNodeWidth = Math.max(...nodes.map((node) => dimensions(node).width));
        const gap = 16;
        const minimumWidth = nodes.length * largestNodeWidth + Math.max(0, nodes.length - 1) * gap;

        return (
            <figure className="not-prose my-7 w-full overflow-x-auto overflow-y-hidden bg-transparent pb-2" style={wideStyle} aria-label={label}>
                <div
                    className="grid items-start gap-4"
                    style={{
                        gridTemplateColumns: `repeat(${nodes.length}, minmax(${largestNodeWidth}px, 1fr))`,
                        minWidth: `${minimumWidth}px`,
                    }}
                >
                    {nodes.map((node) => <DistributedNode key={node.id} node={node} />)}
                </div>
            </figure>
        );
    }

    const positioned = positionNodes(nodes, direction);
    const byId = new Map(positioned.map((node) => [node.id, node]));
    const padding = 28;
    const left = Math.min(...positioned.map((node) => node.position.x)) - padding;
    const top = Math.min(...positioned.map((node) => node.position.y)) - padding;
    const right = Math.max(...positioned.map((node) => node.position.x + node.width)) + padding;
    const bottom = Math.max(...positioned.map((node) => node.position.y + node.height)) + padding;
    const width = right - left;
    const height = bottom - top;
    const idPrefix = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    return (
        <figure className="not-prose my-7 w-full overflow-x-auto overflow-y-hidden bg-transparent pb-2" style={wideStyle} aria-label={label} tabIndex={0}>
            <div className="flex justify-center" style={{ width: `max(100%, ${width}px)` }}>
            <svg className="block h-auto shrink-0" style={{ width: wide ? `max(100%, ${width}px)` : `${width}px` }} viewBox={`${left} ${top} ${width} ${height}`} role="img" aria-labelledby={`${idPrefix}-title`}>
                <title id={`${idPrefix}-title`}>{label}</title>
                <defs>
                    {edges.map((edge, index) => {
                        const color = tones[edge.tone || "green"].color;
                        return (
                            <marker key={index} id={`${idPrefix}-arrow-${index}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                            </marker>
                        );
                    })}
                </defs>
                <g aria-hidden="true">
                    {edges.map((edge, index) => {
                        const sourceNode = byId.get(edge.from);
                        const targetNode = byId.get(edge.to);
                        if (!sourceNode || !targetNode) return null;
                        const fromSide = edge.fromSide || "right";
                        const toSide = edge.toSide || "left";
                        const baseSource = connectionPoint(sourceNode, fromSide);
                        const baseTarget = connectionPoint(targetNode, toSide);
                        const vertical = (fromSide === "top" || fromSide === "bottom") && (toSide === "top" || toSide === "bottom");
                        const offset = edge.offset || 0;
                        const source = vertical ? { ...baseSource, x: baseSource.x + offset } : { ...baseSource, y: baseSource.y + offset };
                        const target = vertical ? { ...baseTarget, x: baseTarget.x + offset } : { ...baseTarget, y: baseTarget.y + offset };
                        const color = tones[edge.tone || "green"].color;
                        const path = edgePath(source, target, fromSide, toSide);
                        const labelOffset = edge.labelSide === "left" ? -8 : edge.labelSide === "right" ? 8 : 0;
                        const labelAnchor = edge.labelSide === "left" ? "end" : edge.labelSide === "right" ? "start" : "middle";
                        const labelLines = edge.label?.split(/\s+/) || [];
                        const labelX = (source.x + target.x) / 2 + labelOffset;
                        const labelY = (source.y + target.y) / 2 + (vertical ? 0 : -8) - (labelLines.length - 1) * 6;
                        return (
                            <g key={`${edge.from}-${edge.to}-${index}`}>
                                <path d={path} fill="none" stroke={color} strokeWidth={edge.emphasized ? 4 : 1.7} strokeDasharray={edge.dashed ? "7 6" : undefined} markerStart={edge.bidirectional ? `url(#${idPrefix}-arrow-${index})` : undefined} markerEnd={`url(#${idPrefix}-arrow-${index})`} />
                                {edge.label && (
                                    <text x={labelX} y={labelY} textAnchor={labelAnchor} dominantBaseline={vertical ? "middle" : undefined} fill={color} stroke="var(--color-background)" strokeWidth="5" paintOrder="stroke" className="font-mono text-[11px] font-semibold">
                                        {labelLines.map((line, lineIndex) => (
                                            <tspan key={`${line}-${lineIndex}`} x={labelX} dy={lineIndex === 0 ? 0 : 12}>{line}</tspan>
                                        ))}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </g>
                {positioned.map((node) => <StaticNode key={node.id} node={node} />)}
            </svg>
            </div>
        </figure>
    );
}
