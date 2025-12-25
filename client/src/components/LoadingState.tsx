import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /** Tipo de loading state */
  variant?: "spinner" | "skeleton" | "dots" | "pulse";
  /** Tamanho do loading indicator */
  size?: "sm" | "md" | "lg";
  /** Mensagem de loading (opcional) */
  message?: string;
  /** Mostrar em tela cheia */
  fullScreen?: boolean;
}

/**
 * Componente de Loading State reutilizável
 * 
 * Oferece diferentes variantes de loading indicators para diferentes contextos:
 * - spinner: Loading circular animado (padrão)
 * - skeleton: Placeholder com animação de pulso
 * - dots: Três pontos animados
 * - pulse: Círculo pulsante
 */
export function LoadingState({
  variant = "spinner",
  size = "md",
  message,
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center p-8";

  if (variant === "spinner") {
    return (
      <div className={containerClasses}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={`${sizeClasses[size]} text-primary`} />
        </motion.div>
        {message && (
          <motion.p
            className="mt-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`${
                size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4"
              } rounded-full bg-primary`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={containerClasses}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-primary`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {message && (
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className={containerClasses}>
      <div className="w-full max-w-md space-y-4">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-8 w-5/6" />
      </div>
      {message && (
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

/**
 * Loading State para Cards
 */
export function CardLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-6 space-y-3">
          <div className="skeleton h-6 w-1/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}

/**
 * Loading State para Dashboard Stats
 */
export function StatsLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border p-6 space-y-3">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-16" />
          <div className="skeleton h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

/**
 * Loading State para Lista de Módulos
 */
export function ModuleListLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
          <div className="skeleton h-2 w-full" />
        </div>
      ))}
    </div>
  );
}
