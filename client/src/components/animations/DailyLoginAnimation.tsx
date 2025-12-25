import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Calendar, Flame, Star } from 'lucide-react';

interface DailyLoginAnimationProps {
  streak: number;
  points: number;
  onComplete?: () => void;
}

export function DailyLoginAnimation({ streak, points, onComplete }: DailyLoginAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showStreak, setShowStreak] = useState(false);

  useEffect(() => {
    // Mostrar streak após 0.5s
    const streakTimer = setTimeout(() => setShowStreak(true), 500);

    // Fechar após 3.5s
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3500);

    return () => {
      clearTimeout(streakTimer);
      clearTimeout(closeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative"
          >
            {/* Estrelas de fundo */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </motion.div>
            ))}

            {/* Card principal */}
            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl border-4 border-white/30 min-w-[400px]">
              {/* Ícone de calendário */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                  }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
                >
                  <Calendar className="w-16 h-16 text-white" />
                </motion.div>
              </motion.div>

              {/* Título */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white text-center mb-2"
              >
                Login Diário! 🎉
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-center mb-6"
              >
                Você ganhou <span className="font-bold text-yellow-300">+{points} pontos</span>
              </motion.p>

              {/* Streak */}
              <AnimatePresence>
                {showStreak && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 0.5,
                        }}
                      >
                        <Flame className="w-10 h-10 text-orange-400 fill-orange-400" />
                      </motion.div>

                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                          className="text-5xl font-bold text-white"
                        >
                          {streak}
                        </motion.div>
                        <div className="text-sm text-white/80 font-medium">
                          {streak === 1 ? 'dia seguido' : 'dias seguidos'}
                        </div>
                      </div>
                    </div>

                    {/* Mensagem motivacional */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center text-white/70 text-sm mt-3"
                    >
                      {streak === 1 && 'Primeiro dia! Continue assim! 💪'}
                      {streak >= 2 && streak < 7 && 'Ótimo começo! Continue firme! 🔥'}
                      {streak >= 7 && streak < 30 && 'Incrível! Você está no caminho certo! ⭐'}
                      {streak >= 30 && 'Você é uma lenda! 🏆'}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Brilho pulsante */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl -z-10"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
