import { motion } from "framer-motion";
import { CheckCircle2, Target, Trophy } from "lucide-react";

interface ExerciseProgressBarProps {
  completed: number;
  total: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ExerciseProgressBar({
  completed,
  total,
  showDetails = true,
  size = "md",
  className = "",
}: ExerciseProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = percentage === 100;

  // Size configurations
  const sizeConfig = {
    sm: {
      height: "h-2",
      text: "text-xs",
      icon: "w-3 h-3",
      padding: "p-2",
    },
    md: {
      height: "h-3",
      text: "text-sm",
      icon: "w-4 h-4",
      padding: "p-3",
    },
    lg: {
      height: "h-4",
      text: "text-base",
      icon: "w-5 h-5",
      padding: "p-4",
    },
  };

  const config = sizeConfig[size];

  // Color based on progress
  const getProgressColor = () => {
    if (isComplete) return "bg-green-500";
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-amber-500";
    return "bg-gray-400";
  };

  const getBackgroundColor = () => {
    if (isComplete) return "bg-green-100";
    return "bg-gray-200";
  };

  return (
    <div className={`${className}`}>
      {showDetails && (
        <div className={`flex items-center justify-between mb-2 ${config.text}`}>
          <div className="flex items-center gap-2 text-gray-600">
            <Target className={config.icon} />
            <span>Progresso dos Exercícios</span>
          </div>
          <div className="flex items-center gap-2">
            {isComplete ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <Trophy className={config.icon} />
                Completo!
              </span>
            ) : (
              <span className="text-gray-700 font-medium">
                {completed}/{total} ({percentage}%)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={`relative ${config.height} ${getBackgroundColor()} rounded-full overflow-hidden`}
      >
        {/* Animated progress fill */}
        <motion.div
          className={`absolute inset-y-0 left-0 ${getProgressColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Shimmer effect for complete state */}
        {isComplete && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      {/* Mini progress indicators */}
      {!showDetails && (
        <div className={`flex items-center justify-center gap-1 mt-1 ${config.text}`}>
          <CheckCircle2 className={`${config.icon} ${isComplete ? "text-green-500" : "text-gray-400"}`} />
          <span className={isComplete ? "text-green-600 font-medium" : "text-gray-500"}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}

// Compact version for cards/lists
export function ExerciseProgressBadge({
  completed,
  total,
  className = "",
}: {
  completed: number;
  total: number;
  className?: string;
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = percentage === 100;

  const getBadgeColor = () => {
    if (isComplete) return "bg-green-100 text-green-700 border-green-300";
    if (percentage >= 50) return "bg-blue-100 text-blue-700 border-blue-300";
    if (percentage > 0) return "bg-amber-100 text-amber-700 border-amber-300";
    return "bg-gray-100 text-gray-600 border-gray-300";
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeColor()} ${className}`}
    >
      {isComplete ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completo</span>
        </>
      ) : (
        <>
          <Target className="w-3.5 h-3.5" />
          <span>{completed}/{total}</span>
        </>
      )}
    </div>
  );
}

export default ExerciseProgressBar;
