import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface XPGainAnimationProps {
  amount: number;
  onComplete?: () => void;
}

export function XPGainAnimation({ amount, onComplete }: XPGainAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Partículas de fundo */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 60,
                  y: Math.sin((i * Math.PI * 2) / 8) * 60,
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  boxShadow: '0 0 10px rgba(250, 204, 21, 0.8)',
                }}
              />
            ))}

            {/* Card principal */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 shadow-2xl border-4 border-yellow-300"
              style={{
                boxShadow: '0 0 40px rgba(250, 204, 21, 0.6), 0 20px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <div className="text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="text-4xl font-bold"
                  >
                    +{amount} XP
                  </motion.div>
                  <div className="text-sm font-medium opacity-90">
                    Experiência Ganha!
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Brilho pulsante */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.5, 1.8],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
              className="absolute inset-0 bg-yellow-400 rounded-2xl blur-xl -z-10"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
