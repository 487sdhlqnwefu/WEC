import { useMemo } from "react";
import type { DecisionOption } from "@/types/decisions";
import { WHEEL_SEGMENT_COLORS } from "@/types/decisions";
import {
  buildSegments,
  describeArc,
  polarToCartesian,
} from "@/lib/decisionMath";

type SpinWheelProps = {
  options: DecisionOption[];
  hideWeights: boolean;
  excludedIds: string[];
  rotation: number;
  spinning: boolean;
  size?: number;
};

export default function SpinWheel({
  options,
  hideWeights,
  excludedIds,
  rotation,
  spinning,
  size = 320,
}: SpinWheelProps) {
  const segments = useMemo(
    () => buildSegments(options, hideWeights),
    [options, hideWeights],
  );

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;

  return (
    <div className="relative mx-auto w-full max-w-[320px] aspect-square">
      {/* Pointer */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20"
        style={{ top: -6 }}
        aria-hidden
      >
        <div
          className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent"
          style={{ borderTopColor: "#C48D49" }}
        />
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 4.5s cubic-bezier(0.12, 0.75, 0.12, 1)"
            : "none",
        }}
        role="img"
        aria-label="Decision spin wheel"
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius + 2}
          fill="#1a1410"
          stroke="#C48D49"
          strokeWidth={3}
        />

        {segments.map((segment, index) => {
          const color =
            WHEEL_SEGMENT_COLORS[index % WHEEL_SEGMENT_COLORS.length];
          const excluded = excludedIds.includes(segment.option.id);
          const mid = (segment.displayStart + segment.displayEnd) / 2;
          const labelPos = polarToCartesian(cx, cy, radius * 0.62, mid);
          const label = segment.option.label.slice(0, 14);

          return (
            <g key={segment.option.id} opacity={excluded ? 0.28 : 1}>
              <path
                d={describeArc(
                  cx,
                  cy,
                  radius,
                  segment.displayStart,
                  segment.displayEnd,
                )}
                fill={color}
                stroke="#1a1410"
                strokeWidth={1.5}
              />
              {segment.displaySweep > 18 && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fill={
                    color === "#DECCA7" || color === "#BDA088"
                      ? "#1a1410"
                      : "#F7F1E5"
                  }
                  fontSize={Math.min(14, Math.max(10, segment.displaySweep / 4))}
                  fontWeight={600}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r={28} fill="#1a1410" stroke="#C48D49" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={10} fill="#994D27" />
      </svg>
    </div>
  );
}
