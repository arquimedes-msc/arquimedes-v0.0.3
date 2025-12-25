import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import type { MedalTier } from '../Medal';

interface MedalUnlockAnimationProps {
  tier: MedalTier;
  title: string;
  description: string;
  medalImage: string;
  onComplete?: () => void;
}

const medalColors: Record<MedalTier, string> = {
  bronze: 'from-amber-700 via-orange-600 to-amber-800',
  silver: 'from-gray-300 via-gray-100 to-gray-400',
  gold: 'from-yellow-400 via-yellow-300 to-yellow-600',
  platinum: 'from-slate-200 via-white to-slate-300',
  diamond: 'from-cyan-200 via-blue-100 to-purple-200',
  legendary: 'from-purple-500 via-pink-500 to-orange-500',
};

const tierNames: Record<MedalTier, string> = {
  bronze: 'Bronze',
  silver: 'Prata',
  gold: 'Ouro',
  platinum: 'Platina',
  diamond: 'Diamante',
  legendary: 'Lendária',
};

export function MedalUnlockAnimation({
  tier,
  title,
  description,
  medalImage,
  onComplete,
}: MedalUnlockAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Mostrar detalhes após 1s
    const detailsTimer = setTimeout(() => setShowDetails(true), 1000);

    // Fechar após 4s
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => {
      clearTimeout(detailsTimer);
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
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
        >
          <div className="relative">
            {/* Raios de luz */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scaleY: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
                className={cn(
                  'absolute top-1/2 left-1/2 w-2 h-96 -translate-x-1/2 -translate-y-1/2',
                  `bg-gradient-to-t ${medalColors[tier]} opacity-40`
                )}
                style={{
                  transform: `rotate(${i * 30}deg)`,
                  transformOrigin: 'center',
                }}
              />
            ))}

            {/* Partículas brilhantes */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            ))}

            {/* Card principal */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-white/20 min-w-[500px]"
            >
              {/* Ícone de troféu */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mb-4"
              >
                <div className={cn(
                  'bg-gradient-to-br p-4 rounded-full',
                  medalColors[tier]
                )}>
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {/* Título */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-white text-center mb-2"
              >
                Medalha Desbloqueada!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-gray-400 mb-6"
              >
                Você conquistou uma medalha <span className={cn(
                  'font-bold bg-gradient-to-r bg-clip-text text-transparent',
                  medalColors[tier]
                )}>{tierNames[tier]}</span>
              </motion.p>

              {/* Imagem da medalha */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  delay: 0.6,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="flex justify-center mb-6 relative"
              >
                <div className="relative w-40 h-40">
                  <img
                    src={medalImage}
                    alt={title}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />

                  {/* Brilho rotativo */}
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                    className={cn(
                      'absolute inset-0 rounded-full blur-2xl -z-10',
                      `bg-gradient-to-r ${medalColors[tier]}`
                    )}
                  />
                </div>
              </motion.div>

              {/* Detalhes da medalha */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 text-center">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-300 text-center">
                      {description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Brilho pulsante do card */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={cn(
                  'absolute inset-0 rounded-3xl blur-2xl -z-10',
                  `bg-gradient-to-r ${medalColors[tier]}`
                )}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper function (caso não exista)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
