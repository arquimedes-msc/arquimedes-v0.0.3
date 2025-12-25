import { useEffect, useRef } from "react";
import { Award, Trophy, Zap, BookOpen } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSounds } from "@/lib/sounds";

const achievementIcons: Record<string, typeof Trophy> = {
  module_completed: Trophy,
  perfect_score: Zap,
  streak: Award,
  first_lesson: BookOpen,
  learning_bronze: Trophy,
  learning_silver: Trophy,
  learning_gold: Trophy,
  learning_platinum: Trophy,
  practice_bronze: Zap,
  practice_silver: Zap,
  practice_gold: Zap,
  practice_platinum: Zap,
  mastery_bronze: Award,
  mastery_silver: Award,
  mastery_gold: Award,
  mastery_platinum: Award,
};

const achievementColors: Record<string, string> = {
  module_completed: "from-yellow-400 to-orange-500",
  perfect_score: "from-purple-400 to-pink-500",
  streak: "from-orange-400 to-red-500",
  first_lesson: "from-blue-400 to-cyan-500",
  learning_bronze: "from-amber-600 to-amber-700",
  learning_silver: "from-gray-400 to-gray-500",
  learning_gold: "from-yellow-400 to-yellow-500",
  learning_platinum: "from-cyan-400 to-cyan-500",
  practice_bronze: "from-amber-600 to-amber-700",
  practice_silver: "from-gray-400 to-gray-500",
  practice_gold: "from-yellow-400 to-yellow-500",
  practice_platinum: "from-cyan-400 to-cyan-500",
  mastery_bronze: "from-amber-600 to-amber-700",
  mastery_silver: "from-gray-400 to-gray-500",
  mastery_gold: "from-yellow-400 to-yellow-500",
  mastery_platinum: "from-cyan-400 to-cyan-500",
};

export default function AchievementsDisplay() {
  const { data: achievements, isLoading } = trpc.gamification.achievements.useQuery();
  const { playAchievement } = useSounds();
  const previousCount = useRef<number>(0);

  // Tocar som quando desbloquear nova conquista (DEVE estar antes de qualquer return)
  useEffect(() => {
    if (achievements && achievements.length > previousCount.current && previousCount.current > 0) {
      playAchievement();
    }
    if (achievements) {
      previousCount.current = achievements.length;
    }
  }, [achievements, playAchievement]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (!achievements || achievements.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <div className="text-gray-600 font-medium mb-1">Nenhuma conquista ainda</div>
        <div className="text-sm text-gray-500">Complete aulas para ganhar suas primeiras conquistas!</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Conquistas</h3>
        <Badge variant="secondary">{achievements.length}</Badge>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map((achievement) => {
          const Icon = achievementIcons[achievement.type] || Award;
          const colorClass = achievementColors[achievement.type] || "from-gray-400 to-gray-500";
          
          return (
            <div
              key={achievement.id}
              className="group relative p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-medium text-gray-900 text-center line-clamp-2">
                {achievement.title}
              </div>
              
              {/* Tooltip on hover */}
              {achievement.description && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                    {achievement.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
