import { useReadingProgress } from "@/hooks/useReadingProgress";

interface ReadingProgressBarProps {
  /**
   * Color of the progress bar
   * @default "bg-primary"
   */
  color?: string;
  /**
   * Height of the progress bar in pixels
   * @default 3
   */
  height?: number;
  /**
   * Whether to show the progress bar
   * @default true
   */
  show?: boolean;
}

/**
 * Reading progress bar component that shows scroll progress
 * Fixed at the top of the viewport
 */
export function ReadingProgressBar({ 
  color = "bg-primary", 
  height = 3,
  show = true 
}: ReadingProgressBarProps) {
  const progress = useReadingProgress();

  if (!show) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-muted/20"
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso de leitura"
    >
      <div
        className={`h-full ${color} transition-all duration-150 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
