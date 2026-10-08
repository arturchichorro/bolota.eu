import type { ReactNode } from "react";

const neutral = "#d8e0da";
const blue = "#60a5fa";
const amber = "#f5a524";
const rose = "#ff8f87";
const green = "#62c98d";

function Diagram({ id, label, description, width, height, children }: {
  id: string;
  label: string;
  description: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <figure className="not-prose my-7 w-full overflow-x-auto overflow-y-hidden bg-transparent pb-2" aria-label={label} tabIndex={0}>
      <svg className="mx-auto block h-auto w-full" style={{ minWidth: width * 0.85 }} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title`} fontFamily="var(--font-sans)">
        <title id={`${id}-title`}>{description}</title>
        <defs>
          <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={neutral} />
          </marker>
          <marker id={`${id}-repeat-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={rose} />
          </marker>
        </defs>
        {children}
      </svg>
    </figure>
  );
}

function TextLines({ x, y, lines, color = neutral, size = 14, bold = false, anchor = "middle" }: {
  x: number;
  y: number;
  lines: string[];
  color?: string;
  size?: number;
  bold?: boolean;
  anchor?: "start" | "middle";
}) {
  return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontWeight={bold ? 700 : 400}>
    {lines.map((line, index) => <tspan key={index} x={x} dy={index === 0 ? 0 : size * 1.4}>{line}</tspan>)}
  </text>;
}

function Arrow({ id, from, to, y }: { id: string; from: number; to: number; y: number }) {
  return <path d={`M ${from} ${y} H ${to}`} fill="none" stroke={neutral} strokeWidth="1.7" markerEnd={`url(#${id}-arrow)`} />;
}

export function PersuasionFlowDiagram() {
  return (
    <Diagram id="persuasion-flow" label="Personalized response generation process" description="A Reddit post about higher pay for teachers passes through a profiler, drafter, and ranker. The chosen response argues that this would make the teacher shortage worse." width={900} height={224}>
      <rect x="16" y="28" width="258" height="168" rx="12" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
      <TextLines x={32} y={51} lines={["r/ChangeMyView"]} color={green} size={12} bold anchor="start" />
      <TextLines x={32} y={77} lines={["CMV: Teachers in subjects that", "are in higher demand should", "receive higher pay"]} color="var(--color-foreground)" bold anchor="start" />
      <TextLines x={32} y={145} lines={["I believe the U.S. education system", "can be improved by paying teachers", "in high-demand subjects more…"]} color="var(--color-muted)" size={12} anchor="start" />

      <Arrow id="persuasion-flow" from={274} to={309} y={112} />
      <Arrow id="persuasion-flow" from={409} to={444} y={112} />
      <Arrow id="persuasion-flow" from={544} to={579} y={112} />
      <Arrow id="persuasion-flow" from={679} to={714} y={112} />

      {[
        { x: 309, label: "Profiler", color: rose, fill: "#2b191a" },
        { x: 444, label: "Drafter", color: amber, fill: "#251b0d" },
        { x: 579, label: "Ranker", color: blue, fill: "#10202d" },
      ].map((step) => <g key={step.label}>
        <rect x={step.x} y="83" width="100" height="58" rx="7" fill={step.fill} stroke={step.color} strokeOpacity=".75" strokeWidth="1.5" />
        <TextLines x={step.x + 50} y={117} lines={[step.label]} color={step.color} size={16} bold />
      </g>)}

      <TextLines x={799} y={48} lines={["Chosen response"]} color="var(--color-foreground)" bold />
      <rect x="714" y="65" width="170" height="131" rx="12" fill="none" stroke={neutral} strokeOpacity=".75" strokeWidth="1.5" strokeDasharray="6 5" />
      <TextLines x={799} y={98} lines={["“This would actually", "make the teacher", "shortage worse,", "not better…”"]} color="var(--color-foreground)" size={15} />
    </Diagram>
  );
}

export function WatermarkFlowDiagram() {
  return (
    <Diagram id="watermark-flow" label="Watermark degradation through repeated paraphrasing" description="Google SynthID produces a watermarked AI response with a 99.3% detection rate. Rewriting it using different words, up to 200 times, weakens watermark signals and reduces detection to 9.7%." width={740} height={240}>
      <TextLines x={68} y={99} lines={["Google"]} color="var(--color-foreground)" size={17} bold />
      <TextLines x={68} y={121} lines={["SynthID"]} color="var(--color-muted)" size={13} />
      <Arrow id="watermark-flow" from={115} to={145} y={108} />

      <rect x="145" y="60" width="160" height="96" rx="10" fill="#10202d" stroke={blue} strokeOpacity=".75" strokeWidth="1.5" />
      <TextLines x={225} y={99} lines={["Watermarked", "AI response"]} color={blue} size={16} bold />
      <TextLines x={225} y={181} lines={["99.3% detection rate"]} color={green} size={13} bold />
      <Arrow id="watermark-flow" from={305} to={335} y={108} />

      <TextLines x={425} y={85} lines={["“Given the following text,", "please rewrite it using", "different words.”"]} color="var(--color-foreground)" size={14} />
      <path d="M 382 60 C 382 13, 468 13, 468 60" fill="none" stroke={rose} strokeWidth="1.5" strokeDasharray="6 5" markerEnd="url(#watermark-flow-repeat-arrow)" />
      <path d="M 468 150 C 468 199, 382 199, 382 150" fill="none" stroke={rose} strokeWidth="1.5" strokeDasharray="6 5" markerEnd="url(#watermark-flow-repeat-arrow)" />
      <TextLines x={425} y={220} lines={["Repeat up to 200×"]} color={rose} size={13} bold />
      <Arrow id="watermark-flow" from={515} to={545} y={108} />

      <rect x="545" y="60" width="178" height="96" rx="10" fill="#251b0d" stroke={amber} strokeOpacity=".75" strokeWidth="1.5" />
      <TextLines x={634} y={89} lines={["AI response with", "weak watermark", "signals"]} color={amber} size={15} bold />
      <TextLines x={634} y={181} lines={["9.7% detection rate"]} color={rose} size={13} bold />
    </Diagram>
  );
}
