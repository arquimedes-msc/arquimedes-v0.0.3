import { Flame } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export default function StreakDisplay() {
  const { data: streak, isLoading } = trpc.gamification.streak.useQuery();

  if (isLoading) {
    return (
      <Card className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!streak) return null;

  const currentStreak = streak.currentStreak || 0;
  const longestStreak = streak.longestStreak || 0;

  return (
    <Card className="p-4 flex items-center gap-3 hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          currentStreak > 0 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gray-200'
        }`}>
          <Flame className={`w-6 h-6 ${currentStreak > 0 ? 'text-white' : 'text-gray-400'}`} />
        </div>
        {currentStreak > 0 && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-xs font-bold text-gray-900 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {currentStreak}
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-semibold text-gray-900">
          {currentStreak === 0 ? 'Comece sua sequência!' : `${currentStreak} ${currentStreak === 1 ? 'dia' : 'dias'} seguidos`}
        </div>
        <div className="text-sm text-gray-600">
          {longestStreak > 0 && `Recorde: ${longestStreak} ${longestStreak === 1 ? 'dia' : 'dias'}`}
          {longestStreak === 0 && 'Complete uma aula hoje!'}
        </div>
      </div>
    </Card>
  );
}
