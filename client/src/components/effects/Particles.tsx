import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface ParticlesProps {
  trigger?: boolean;
  count?: number;
  colors?: string[];
  duration?: number;
  className?: string;
}

export function Particles({
  trigger = false,
  count = 20,
  colors = ["#00FF00", "#00CC00", "#009900", "#FFFF00"],
  duration = 1000,
  className,
}: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // Criar partículas
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 2 + Math.random() * 3;

      newParticles.push({
        id: Date.now() + i,
        x: 50, // Centro (%)
        y: 50, // Centro (%)
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 4,
      });
    }

    setParticles(newParticles);

    // Animar partículas
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setParticles([]);
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy + 0.1, // Gravidade
          vy: p.vy + 0.1, // Aceleração da gravidade
          life: 1 - progress,
        }))
      );

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [trigger, count, colors, duration]);

  if (particles.length === 0) return null;

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50", className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full transition-opacity"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
