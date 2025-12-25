import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MedalTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary';
export type MedalState = 'locked' | 'unlocked' | 'progress';

interface MedalProps {
  tier: MedalTier;
  state: MedalState;
  progress?: number; // 0-100 para estado 'progress'
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const medalImages: Record<MedalTier, string> = {
  bronze: '/medals/bronze-medal.png',
  silver: '/medals/silver-medal.png',
  gold: '/medals/gold-medal.png',
  platinum: '/medals/platinum-medal.png',
  diamond: '/medals/diamond-medal.png',
  legendary: '/medals/legendary-medal.png',
};

const medalColors: Record<MedalTier, string> = {
  bronze: 'from-amber-700 via-orange-600 to-amber-800',
  silver: 'from-gray-300 via-gray-100 to-gray-400',
  gold: 'from-yellow-400 via-yellow-300 to-yellow-600',
  platinum: 'from-slate-200 via-white to-slate-300',
  diamond: 'from-cyan-200 via-blue-100 to-purple-200',
  legendary: 'from-purple-500 via-pink-500 to-orange-500',
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

export function Medal({
  tier,
  state,
  progress = 0,
  title,
  description,
  onClick,
  className,
  size = 'md',
}: MedalProps) {
  const isLocked = state === 'locked';
  const isUnlocked = state === 'unlocked';
  const isProgress = state === 'progress';

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        'relative group cursor-pointer',
        isLocked && 'cursor-not-allowed',
        className
      )}
    >
      {/* Container da medalha */}
      <div className="relative">
        {/* Brilho de fundo (apenas unlocked/legendary) */}
        {isUnlocked && (
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              'absolute inset-0 rounded-full blur-xl -z-10',
              `bg-gradient-to-r ${medalColors[tier]}`
            )}
          />
        )}

        {/* Imagem da medalha */}
        <div className={cn('relative', sizeClasses[size])}>
          <img
            src={medalImages[tier]}
            alt={title}
            className={cn(
              'w-full h-full object-contain transition-all duration-300',
              isLocked && 'grayscale opacity-40',
              isProgress && 'opacity-70'
            )}
          />

          {/* Overlay de bloqueio */}
          {isLocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
            >
              <Lock className="w-1/3 h-1/3 text-white" />
            </motion.div>
          )}

          {/* Barra de progresso */}
          {isProgress && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full px-2">
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full',
                    `bg-gradient-to-r ${medalColors[tier]}`
                  )}
                />
              </div>
              <div className="text-xs text-center text-white/80 mt-1">
                {progress}%
              </div>
            </div>
          )}

          {/* Efeito shimmer (apenas unlocked) */}
          {isUnlocked && (
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                transform: 'skewX(-20deg)',
              }}
            />
          )}
        </div>

        {/* Badge "NEW" para recém desbloqueadas */}
        {isUnlocked && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
          >
            NEW
          </motion.div>
        )}
      </div>

      {/* Tooltip com informações */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-gray-900 text-white rounded-lg p-3 shadow-xl min-w-[200px]">
          <div className="font-bold text-sm mb-1">{title}</div>
          <div className="text-xs text-gray-300">{description}</div>
          
          {isLocked && (
            <div className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Bloqueada</span>
            </div>
          )}
          
          {isProgress && (
            <div className="text-xs text-blue-400 mt-2">
              Progresso: {progress}%
            </div>
          )}
        </div>
        {/* Seta do tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
          <div className="border-8 border-transparent border-t-gray-900" />
        </div>
      </div>
    </motion.div>
  );
}
