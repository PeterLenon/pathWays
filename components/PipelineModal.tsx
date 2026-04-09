"use client";

/**
 * PipelineModal — animated DAG loading screen shown while /api/analyze runs.
 *
 * All nodes are visible immediately. Edges pulse left-to-right continuously
 * until isDone=true, at which point the animation stops and pathway nodes glow.
 *
 * Layout (SVG viewBox 0 0 960 500):
 *   Left   (~x=110)  — User Profile, BLS API, Adzuna API
 *   Center (~x=480)  — AI Engine (LLM)
 *   Right  (~x=700)  — Skill Matching, Income Prediction, Cost-Benefit, Personalized Recs
 *   Far    (~x=880)  — Pathway A, Pathway B
 */

interface PipelineModalProps {
  isOpen: boolean;
  isDone: boolean;
}

// ── Node definitions ──────────────────────────────────────────────────────────

const NODES = {
  // Left column — inputs
  userProfile:          { x: 110, y: 160, label: "User Profile",           sub: "Education · Skills · Income · Constraints" },
  blsApi:               { x: 110, y: 330, label: "BLS API",                sub: "Wage statistics" },
  adzunaApi:            { x: 110, y: 420, label: "Adzuna API",             sub: "Job demand data" },

  // Center — AI engine
  aiEngine:             { x: 480, y: 250, label: "AI Engine",              sub: "LLM · qwen2.5:7b" },

  // Middle-right — model nodes
  skillMatching:        { x: 700, y: 130, label: "Skill Matching",         sub: "Maps user to viable careers" },
  incomePrediction:     { x: 700, y: 240, label: "Income Prediction",      sub: "Estimates future earnings" },
  costBenefit:          { x: 700, y: 350, label: "Cost-Benefit Analysis",  sub: "Tuition vs salary · Time to ROI" },
  personalizedRecs:     { x: 700, y: 460, label: "Personalized Recs",      sub: "Ranks and filters pathways" },

  // Far right — outputs
  pathwayA:             { x: 890, y: 390, label: "Pathway A",              sub: "" },
  pathwayB:             { x: 890, y: 470, label: "Pathway B",              sub: "" },
};

// ── Edge definitions ──────────────────────────────────────────────────────────

const EDGES = [
  // Inputs → AI Engine
  { from: "userProfile",      to: "aiEngine",         delay: "0s" },
  { from: "blsApi",           to: "aiEngine",         delay: "0.3s" },
  { from: "adzunaApi",        to: "aiEngine",         delay: "0.6s" },
  // AI Engine → model nodes
  { from: "aiEngine",         to: "skillMatching",    delay: "0.1s" },
  { from: "aiEngine",         to: "incomePrediction", delay: "0.4s" },
  { from: "aiEngine",         to: "costBenefit",      delay: "0.7s" },
  { from: "aiEngine",         to: "personalizedRecs", delay: "1.0s" },
  // Personalized Recs → Pathways
  { from: "personalizedRecs", to: "pathwayA",         delay: "0.2s" },
  { from: "personalizedRecs", to: "pathwayB",         delay: "0.5s" },
];

// ── Geometry helpers ──────────────────────────────────────────────────────────

/** Returns the (x,y) point on the edge of a rounded-rect node closest to a target. */
function nodeEdgePoint(
  node: { x: number; y: number },
  target: { x: number; y: number },
  isSource: boolean,
  nodeW = 140,
  nodeH = 52
): { x: number; y: number } {
  const hw = nodeW / 2;
  const hh = nodeH / 2;
  const dx = target.x - node.x;
  const dy = target.y - node.y;
  const angle = Math.atan2(dy, dx);
  // Clamp to rectangle boundary
  const absCos = Math.abs(Math.cos(angle));
  const absSin = Math.abs(Math.sin(angle));
  let px: number, py: number;
  if (hw * absSin <= hh * absCos) {
    px = node.x + Math.sign(dx) * hw;
    py = node.y + Math.sign(dx) * hw * Math.tan(angle);
  } else {
    px = node.x + Math.sign(dy) * hh / Math.tan(angle);
    py = node.y + Math.sign(dy) * hh;
  }
  void isSource;
  return { x: px, y: py };
}

/** Builds a smooth cubic bezier path string between two nodes. */
function edgePath(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  const src = nodeEdgePoint(from, to, true);
  const dst = nodeEdgePoint(to, from, false);
  const cpOffset = (dst.x - src.x) * 0.45;
  return `M ${src.x} ${src.y} C ${src.x + cpOffset} ${src.y}, ${dst.x - cpOffset} ${dst.y}, ${dst.x} ${dst.y}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PipelineModal({ isOpen, isDone }: PipelineModalProps) {
  if (!isOpen) return null;

  const outputNodes = new Set(["pathwayA", "pathwayB"]);
  const aiNode = "aiEngine";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <style>{`
        @keyframes dashFlow {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        .edge-pulse {
          animation: dashFlow 1.4s linear infinite;
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .node-breathe {
          animation: nodePulse 2s ease-in-out infinite;
        }
        @keyframes pathwayGlow {
          0%, 100% { filter: drop-shadow(0 0 6px #a8edca); }
          50%       { filter: drop-shadow(0 0 14px #a8edca); }
        }
        .pathway-glow {
          animation: pathwayGlow 1s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-5xl mx-6">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-white/50 text-sm tracking-widest uppercase font-mono">
            {isDone ? "Analysis complete" : "Analyzing your career pathways…"}
          </p>
          <h2 className="text-white text-2xl font-headline font-bold mt-1">
            {isDone ? "Your pathways are ready" : "Building your personalized plan"}
          </h2>
        </div>

        {/* Graph */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
          <svg
            viewBox="0 0 980 520"
            className="w-full"
            style={{ maxHeight: "460px" }}
          >
            {/* ── Edges ── */}
            <g>
              {EDGES.map((edge, i) => {
                const from = NODES[edge.from as keyof typeof NODES];
                const to   = NODES[edge.to   as keyof typeof NODES];
                const path = edgePath(from, to);
                const isOutputEdge = outputNodes.has(edge.to);
                const color = isOutputEdge ? "#a8edca" : "#6b9fff";

                return (
                  <g key={i}>
                    {/* Base track */}
                    <path
                      d={path}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                      strokeOpacity={0.15}
                    />
                    {/* Animated pulse */}
                    {!isDone && (
                      <path
                        d={path}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        strokeOpacity={0.8}
                        strokeDasharray="8 16"
                        className="edge-pulse"
                        style={{ animationDelay: edge.delay }}
                      />
                    )}
                    {/* Done state — solid bright edge */}
                    {isDone && (
                      <path
                        d={path}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        strokeOpacity={0.6}
                      />
                    )}
                  </g>
                );
              })}
            </g>

            {/* ── Nodes ── */}
            <g>
              {(Object.entries(NODES) as [string, typeof NODES[keyof typeof NODES]][]).map(
                ([id, node]) => {
                  const isAI      = id === aiNode;
                  const isOutput  = outputNodes.has(id);
                  const nodeW     = isAI ? 160 : 150;
                  const nodeH     = isAI ? 64  : 52;

                  const fillColor = isAI
                    ? "#1e3a8a"       // deep blue for AI engine
                    : isOutput
                    ? "#064e3b"       // dark green for pathways
                    : "#1e293b";      // slate for everything else

                  const strokeColor = isAI
                    ? "#6b9fff"
                    : isOutput
                    ? "#a8edca"
                    : "#475569";

                  const strokeWidth = isAI ? 2 : 1.5;

                  return (
                    <g
                      key={id}
                      className={
                        !isDone && !isOutput
                          ? "node-breathe"
                          : isDone && isOutput
                          ? "pathway-glow"
                          : undefined
                      }
                      style={
                        !isDone && !isOutput
                          ? { animationDelay: `${Math.random() * 0.8}s` }
                          : undefined
                      }
                    >
                      {/* Node background */}
                      <rect
                        x={node.x - nodeW / 2}
                        y={node.y - nodeH / 2}
                        width={nodeW}
                        height={nodeH}
                        rx={isAI ? 12 : 8}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                      />

                      {/* Primary label */}
                      <text
                        x={node.x}
                        y={node.sub ? node.y - 7 : node.y + 5}
                        textAnchor="middle"
                        fill={isOutput ? "#a8edca" : isAI ? "#93c5fd" : "#e2e8f0"}
                        fontSize={isAI ? 13 : 11}
                        fontWeight="700"
                        fontFamily="system-ui, sans-serif"
                      >
                        {node.label}
                      </text>

                      {/* Sub-label */}
                      {node.sub && (
                        <text
                          x={node.x}
                          y={node.y + 10}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize={8.5}
                          fontFamily="system-ui, sans-serif"
                        >
                          {node.sub}
                        </text>
                      )}
                    </g>
                  );
                }
              )}
            </g>
          </svg>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          {!isDone ? (
            <p className="text-white/30 text-xs font-mono">
              Fetching live wage + job demand data · Running LLM inference · This may take a few minutes
            </p>
          ) : (
            <p className="text-emerald-400 text-sm font-semibold animate-pulse">
              Redirecting to your results…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
