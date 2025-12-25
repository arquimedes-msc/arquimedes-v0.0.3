import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';

interface PointsGainAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export function PointsGainAnimation({ amount, onComplete }: PointsGainAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Moedas caindo */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: -100,
                  x: 0,
                  rotate: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [- 100, 0, 100, 200],
                  x: (Math.random() - 0.5) * 200,
                  rotate: Math.random() * 720,
                  scale: [0, 1, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-2 border-yellow-500 flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-yellow-900">P</span>
                </div>
              </motion.div>
            ))}

            {/* Confete */}
            {[...Array(20)].map((_, i) => {
              const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={`confetti-${i}`}
                  initial={{
                    opacity: 0,
                    y: -50,
                    x: 0,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [- 50, 150 + Math.random() * 100],
                    x: (Math.random() - 0.5) * 300,
                    rotate: Math.random() * 720,
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                  className={`absolute top-0 left-1/2 w-2 h-3 ${randomColor} rounded-sm`}
                />
              );
            })}

            {/* Card principal */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl p-8 shadow-2xl border-4 border-amber-300"
              style={{
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Coins className="w-12 h-12 text-white drop-shadow-lg" />
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="text-white text-center"
                >
                  <div className="text-5xl font-bold drop-shadow-lg">
                    +{amount}
                  </div>
                  <div className="text-lg font-semibold opacity-95 mt-1">
                    Pontos Ganhos!
                  </div>
                </motion.div>
              </div>

              {/* Brilho animado */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-2xl blur-xl -z-10"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
