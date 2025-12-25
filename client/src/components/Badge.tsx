import { cn } from "@/lib/utils";

export type BadgeLevel = "bronze" | "silver" | "gold" | "platinum";
export type BadgeCategory = "learning" | "practice" | "consistency" | "mastery";

interface BadgeProps {
  level: BadgeLevel;
  category: BadgeCategory;
  unlocked: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LEVEL_COLORS = {
  bronze: {
    primary: "#CD7F32",
    secondary: "#B87333",
    glow: "rgba(205, 127, 50, 0.4)",
  },
  silver: {
    primary: "#C0C0C0",
    secondary: "#A8A8A8",
    glow: "rgba(192, 192, 192, 0.4)",
  },
  gold: {
    primary: "#FFD700",
    secondary: "#FFC700",
    glow: "rgba(255, 215, 0, 0.5)",
  },
  platinum: {
    primary: "#E5E4E2",
    secondary: "#D3D3D3",
    glow: "rgba(229, 228, 226, 0.6)",
  },
};

const CATEGORY_ICONS = {
  learning: (
    <path d="M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12" />
  ),
  practice: (
    <path d="M9 11L12 14L22 4 M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" />
  ),
  consistency: (
    <path d="M8.5 14.5L15.5 7.5 M15.5 14.5L8.5 7.5 M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
  ),
  mastery: (
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  ),
};

const SIZE_CLASSES = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

export function Badge({
  level,
  category,
  unlocked,
  size = "md",
  className,
}: BadgeProps) {
  const colors = LEVEL_COLORS[level];
  const icon = CATEGORY_ICONS[category];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center transition-all duration-300",
        SIZE_CLASSES[size],
        unlocked && "hover:scale-110",
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "w-full h-full transition-all duration-500",
          !unlocked && "grayscale opacity-40"
        )}
      >
        {/* Glow effect for unlocked badges */}
        {unlocked && (
          <defs>
            <filter id={`glow-${level}-${category}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id={`gradient-${level}`}>
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </radialGradient>
          </defs>
        )}

        {/* Outer circle (medal border) */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill={unlocked ? `url(#gradient-${level})` : "#6B7280"}
          stroke={unlocked ? colors.secondary : "#4B5563"}
          strokeWidth="2"
          filter={unlocked ? `url(#glow-${level}-${category})` : undefined}
        />

        {/* Inner circle (background) */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill={unlocked ? "#FFFFFF" : "#374151"}
          opacity={unlocked ? "0.9" : "0.5"}
        />

        {/* Category icon */}
        <g
          transform="translate(50, 50)"
          stroke={unlocked ? colors.primary : "#9CA3AF"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <g transform="translate(-12, -12) scale(1)">{icon}</g>
        </g>

        {/* Lock icon for locked badges */}
        {!unlocked && (
          <g transform="translate(50, 70)">
            <rect
              x="-6"
              y="-4"
              width="12"
              height="10"
              rx="2"
              fill="#9CA3AF"
            />
            <path
              d="M -4,-4 V -7 A 4,4 0 0 1 4,-7 V -4"
              stroke="#9CA3AF"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}

        {/* Level indicator (stars) */}
        {unlocked && (
          <g transform="translate(50, 85)">
            {Array.from({ length: getLevelStars(level) }).map((_, i) => (
              <polygon
                key={i}
                points="0,-3 1,-1 3,-1 1,0 2,2 0,1 -2,2 -1,0 -3,-1 -1,-1"
                fill={colors.primary}
                transform={`translate(${(i - (getLevelStars(level) - 1) / 2) * 8}, 0)`}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Unlock animation */}
      {unlocked && (
        <div className="absolute inset-0 pointer-events-none animate-ping opacity-0">
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: colors.glow }}
          />
        </div>
      )}
    </div>
  );
}

function getLevelStars(level: BadgeLevel): number {
  switch (level) {
    case "bronze":
      return 1;
    case "silver":
      return 2;
    case "gold":
      return 3;
    case "platinum":
      return 4;
  }
}

// Helper to get level name in Portuguese
export function getLevelName(level: BadgeLevel): string {
  switch (level) {
    case "bronze":
      return "Bronze";
    case "silver":
      return "Prata";
    case "gold":
      return "Ouro";
    case "platinum":
      return "Platina";
  }
}

// Helper to get category name in Portuguese
export function getCategoryName(category: BadgeCategory): string {
  switch (category) {
    case "learning":
      return "Aprendizado";
    case "practice":
      return "Prática";
    case "consistency":
      return "Consistência";
    case "mastery":
      return "Maestria";
  }
}
