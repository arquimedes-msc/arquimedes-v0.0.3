import { useState, useCallback } from 'react';
import { XPGainAnimation } from '@/components/animations/XPGainAnimation';
import { PointsGainAnimation } from '@/components/animations/PointsGainAnimation';
import { DailyLoginAnimation } from '@/components/animations/DailyLoginAnimation';

interface AnimationQueueItem {
  id: string;
  type: 'xp' | 'points' | 'daily-login';
  data: {
    amount?: number;
    streak?: number;
    points?: number;
  };
}

export function useGamificationAnimations() {
  const [queue, setQueue] = useState<AnimationQueueItem[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationQueueItem | null>(null);

  const showXPGain = useCallback((amount: number) => {
    const animation: AnimationQueueItem = {
      id: `xp-${Date.now()}`,
      type: 'xp',
      data: { amount },
    };

    setQueue((prev) => [...prev, animation]);
  }, []);

  const showPointsGain = useCallback((amount: number) => {
    const animation: AnimationQueueItem = {
      id: `points-${Date.now()}`,
      type: 'points',
      data: { amount },
    };

    setQueue((prev) => [...prev, animation]);
  }, []);

  const showDailyLogin = useCallback((streak: number, points: number) => {
    const animation: AnimationQueueItem = {
      id: `daily-${Date.now()}`,
      type: 'daily-login',
      data: { streak, points },
    };

    setQueue((prev) => [...prev, animation]);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setCurrentAnimation(null);
    
    // Processar próxima animação da fila após 300ms
    setTimeout(() => {
      setQueue((prev) => {
        if (prev.length > 0) {
          setCurrentAnimation(prev[0]);
          return prev.slice(1);
        }
        return prev;
      });
    }, 300);
  }, []);

  // Processar fila quando não há animação atual
  if (!currentAnimation && queue.length > 0) {
    setCurrentAnimation(queue[0]);
    setQueue((prev) => prev.slice(1));
  }

  const AnimationRenderer = () => {
    if (!currentAnimation) return null;

    switch (currentAnimation.type) {
      case 'xp':
        return (
          <XPGainAnimation
            amount={currentAnimation.data.amount!}
            onComplete={handleAnimationComplete}
          />
        );
      
      case 'points':
        return (
          <PointsGainAnimation
            amount={currentAnimation.data.amount!}
            onComplete={handleAnimationComplete}
          />
        );
      
      case 'daily-login':
        return (
          <DailyLoginAnimation
            streak={currentAnimation.data.streak!}
            points={currentAnimation.data.points!}
            onComplete={handleAnimationComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return {
    showXPGain,
    showPointsGain,
    showDailyLogin,
    AnimationRenderer,
  };
}
