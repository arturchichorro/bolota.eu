const foreground = "var(--color-foreground)";
const neutral = "#d8e0da";
const green = "#6ee7a2";
const greenFill = "#10241a";
const amber = "#f5a524";
const amberFill = "#251b0d";
const blue = "#60a5fa";
const blueFill = "#10202d";

const nodeText = {
  fill: foreground,
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  fontWeight: 700,
} as const;

const edgeText = {
  fill: neutral,
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 600,
} as const;

export function TraditionalRequestFlowDiagram() {
  return (
    <figure className="not-prose my-7 w-full overflow-x-auto overflow-y-hidden bg-transparent pb-2" aria-label="Traditional web application request and response flow" tabIndex={0}>
      <div className="flex justify-center" style={{ width: "max(100%, 39rem)" }}>
        <svg className="block h-auto w-full" viewBox="-28 -28 626 120" role="img" aria-labelledby="traditional-request-flow-title">
          <title id="traditional-request-flow-title">A user action sends a request to the server, waits for a response, and then updates the interface.</title>
          <defs>
            <marker id="traditional-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={neutral} />
            </marker>
          </defs>

          <path d="M 135 32 C 182.5 32, 182.5 32, 230 32" fill="none" stroke={neutral} strokeWidth="1.7" markerEnd="url(#traditional-arrow)" />
          <text x="182.5" y="24" textAnchor="middle" stroke="var(--color-background)" strokeWidth="5" paintOrder="stroke" style={edgeText}>request</text>

          <path d="M 330 32 C 380 32, 380 32, 430 32" fill="none" stroke={neutral} strokeWidth="1.7" markerEnd="url(#traditional-arrow)" />
          <text x="380" y="24" textAnchor="middle" stroke="var(--color-background)" strokeWidth="5" paintOrder="stroke" style={edgeText}>response</text>

          <rect x="0" y="0" width="135" height="64" rx="32" fill={greenFill} fillOpacity=".78" stroke={green} strokeOpacity=".75" strokeWidth="1.5" />
          <text x="67.5" y="37" textAnchor="middle" style={nodeText}>User action</text>

          <rect x="230" y="4" width="100" height="56" rx="7" fill={amberFill} fillOpacity=".78" stroke={amber} strokeOpacity=".75" strokeWidth="1.5" />
          <text x="280" y="37" textAnchor="middle" style={nodeText}>Server</text>

          <rect x="430" y="0" width="140" height="64" rx="32" fill={greenFill} fillOpacity=".78" stroke={green} strokeOpacity=".75" strokeWidth="1.5" />
          <text x="500" y="37" textAnchor="middle" style={nodeText}>UI updates</text>
        </svg>
      </div>
    </figure>
  );
}

export function LocalFirstSyncFlowDiagram() {
  return (
    <figure className="not-prose my-7 w-full overflow-x-auto overflow-y-hidden bg-transparent pb-2" aria-label="Local-first user interface update and background synchronization flow" tabIndex={0}>
      <div className="flex justify-center" style={{ width: "max(100%, 38rem)" }}>
        <svg className="block h-auto w-full min-w-152" viewBox="-28 -48 603 287" role="img" aria-labelledby="local-first-sync-flow-title">
          <title id="local-first-sync-flow-title">A user action updates a local datastore and the interface immediately while the datastore synchronizes with the server in the background.</title>
          <defs>
            {["local-horizontal-1", "local-horizontal-2", "local-sync-down", "local-sync-up"].map((id) => (
              <marker key={id} id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={neutral} />
              </marker>
            ))}
          </defs>

          <path d="M 135 32 C 175 32, 175 32, 215 32" fill="none" stroke={neutral} strokeWidth="1.7" markerEnd="url(#local-horizontal-1)" />
          <path d="M 327 32 C 367 32, 367 32, 407 32" fill="none" stroke={neutral} strokeWidth="1.7" markerEnd="url(#local-horizontal-2)" />

          <path d="M 243 84 C 243 119.5, 243 119.5, 243 155" fill="none" stroke={neutral} strokeWidth="1.7" strokeDasharray="7 6" markerEnd="url(#local-sync-down)" />
          <text x="235" y="116" textAnchor="end" stroke="var(--color-background)" strokeWidth="5" paintOrder="stroke" style={edgeText}>
            <tspan x="235">background</tspan>
            <tspan x="235" dy="12">sync</tspan>
          </text>

          <path d="M 299 155 C 299 119.5, 299 119.5, 299 84" fill="none" stroke={neutral} strokeWidth="1.7" strokeDasharray="7 6" markerEnd="url(#local-sync-up)" />
          <text x="307" y="116" textAnchor="start" stroke="var(--color-background)" strokeWidth="5" paintOrder="stroke" style={edgeText}>
            <tspan x="307">confirmed</tspan>
            <tspan x="307" dy="12">changes</tspan>
          </text>

          <rect x="0" y="0" width="135" height="64" rx="32" fill={greenFill} fillOpacity=".78" stroke={green} strokeOpacity=".75" strokeWidth="1.5" />
          <text x="67.5" y="37" textAnchor="middle" style={nodeText}>User action</text>

          <path d="M 216 -12 V 76 C 216 87, 326 87, 326 76 V -12" fill={blueFill} stroke={blue} strokeOpacity=".65" strokeWidth="1.5" />
          <ellipse cx="271" cy="-12" rx="55" ry="8" fill={blueFill} stroke={blue} strokeOpacity=".9" strokeWidth="1.5" />
          <path d="M 216 17.3 C 216 28.1, 326 28.1, 326 17.3" fill="none" stroke={blue} strokeOpacity=".35" strokeWidth="1.5" />
          <path d="M 216 46.7 C 216 57.5, 326 57.5, 326 46.7" fill="none" stroke={blue} strokeOpacity=".35" strokeWidth="1.5" />
          <text x="271" y="28" textAnchor="middle" style={nodeText}>
            <tspan x="271">Local</tspan>
            <tspan x="271" dy="18">datastore</tspan>
          </text>

          <rect x="407" y="0" width="140" height="64" rx="32" fill={greenFill} fillOpacity=".78" stroke={green} strokeOpacity=".75" strokeWidth="1.5" />
          <text x="477" y="37" textAnchor="middle" style={nodeText}>UI updates</text>

          <rect x="221" y="155" width="100" height="56" rx="7" fill={amberFill} fillOpacity=".78" stroke={amber} strokeOpacity=".75" strokeWidth="1.5" />
          <text x="271" y="188" textAnchor="middle" style={nodeText}>Server</text>
        </svg>
      </div>
    </figure>
  );
}
