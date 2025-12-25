import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Medal,
  Star,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseResult {
  id: string;
  type: "fill-in-blanks" | "slider" | "matching";
  isCorrect: boolean;
  points: number;
  module: string;
}

interface ModulePerformanceSummaryProps {
  moduleName: string;
  moduleEmoji: string;
  completedExercises: Set<string>;
  exerciseDefinitions: {
    id: string;
    type: "fill-in-blanks" | "slider" | "matching";
    points: number;
  }[];
  className?: string;
}

export function ModulePerformanceSummary({
  moduleName,
  moduleEmoji,
  completedExercises,
  exerciseDefinitions,
  className,
}: ModulePerformanceSummaryProps) {
  const stats = useMemo(() => {
    const byType = {
      "fill-in-blanks": { total: 0, completed: 0, points: 0, earnedPoints: 0 },
      "slider": { total: 0, completed: 0, points: 0, earnedPoints: 0 },
      "matching": { total: 0, completed: 0, points: 0, earnedPoints: 0 },
    };

    exerciseDefinitions.forEach((ex) => {
      byType[ex.type].total += 1;
      byType[ex.type].points += ex.points;
      if (completedExercises.has(ex.id)) {
        byType[ex.type].completed += 1;
        byType[ex.type].earnedPoints += ex.points;
      }
    });

    const totalExercises = exerciseDefinitions.length;
    const totalCompleted = exerciseDefinitions.filter(ex => completedExercises.has(ex.id)).length;
    const totalPoints = exerciseDefinitions.reduce((sum, ex) => sum + ex.points, 0);
    const earnedPoints = exerciseDefinitions
      .filter(ex => completedExercises.has(ex.id))
      .reduce((sum, ex) => sum + ex.points, 0);

    return {
      byType,
      totalExercises,
      totalCompleted,
      totalPoints,
      earnedPoints,
      completionRate: totalExercises > 0 ? (totalCompleted / totalExercises) * 100 : 0,
    };
  }, [completedExercises, exerciseDefinitions]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "fill-in-blanks":
        return "Preencher Lacunas";
      case "slider":
        return "Estimativa (Slider)";
      case "matching":
        return "Correspondência";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fill-in-blanks":
        return "✏️";
      case "slider":
        return "📊";
      case "matching":
        return "🔗";
      default:
        return "📝";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fill-in-blanks":
        return "from-blue-500 to-blue-600";
      case "slider":
        return "from-purple-500 to-purple-600";
      case "matching":
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getPerformanceLevel = (rate: number) => {
    if (rate >= 100) return { label: "Perfeito!", color: "text-green-600", icon: Trophy, bg: "bg-green-100" };
    if (rate >= 80) return { label: "Excelente!", color: "text-blue-600", icon: Star, bg: "bg-blue-100" };
    if (rate >= 60) return { label: "Bom progresso", color: "text-yellow-600", icon: TrendingUp, bg: "bg-yellow-100" };
    if (rate >= 40) return { label: "Continue praticando", color: "text-orange-600", icon: Target, bg: "bg-orange-100" };
    return { label: "Comece aqui!", color: "text-gray-600", icon: Zap, bg: "bg-gray-100" };
  };

  const performance = getPerformanceLevel(stats.completionRate);
  const PerformanceIcon = performance.icon;

  // Não mostrar se não há exercícios definidos
  if (exerciseDefinitions.length === 0) return null;

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header com gradiente */}
      <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{moduleEmoji}</span>
            <div>
              <CardTitle className="text-xl text-white">Resumo de Desempenho</CardTitle>
              <p className="text-white/80 text-sm mt-1">{moduleName}</p>
            </div>
          </div>
          <div className={cn("p-3 rounded-full", performance.bg)}>
            <PerformanceIcon className={cn("h-6 w-6", performance.color)} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Estatísticas gerais */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.totalCompleted}</p>
            <p className="text-xs text-green-600">Completados</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.totalExercises}</p>
            <p className="text-xs text-blue-600">Total</p>
          </div>
          
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-700">{stats.earnedPoints}</p>
            <p className="text-xs text-amber-600">Pontos</p>
          </div>
        </div>

        {/* Barra de progresso geral */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
            <Badge className={cn("font-semibold", performance.bg, performance.color)}>
              {stats.completionRate.toFixed(0)}%
            </Badge>
          </div>
          <Progress 
            value={stats.completionRate} 
            className="h-3"
          />
          <p className={cn("text-sm font-medium text-center", performance.color)}>
            {performance.label}
          </p>
        </div>

        {/* Desempenho por tipo de exercício */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Medal className="h-5 w-5 text-purple-600" />
            Desempenho por Tipo
          </h4>
          
          <div className="space-y-3">
            {Object.entries(stats.byType).map(([type, data]) => {
              if (data.total === 0) return null;
              const rate = (data.completed / data.total) * 100;
              const typePerf = getPerformanceLevel(rate);
              
              return (
                <div 
                  key={type} 
                  className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(type)}</span>
                      <span className="font-medium text-gray-800">{getTypeLabel(type)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {data.completed}/{data.total}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", typePerf.color, "border-current")}
                      >
                        {rate.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                          getTypeColor(type)
                        )}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>+{data.earnedPoints} pts ganhos</span>
                    <span>{data.points - data.earnedPoints} pts disponíveis</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mensagem motivacional */}
        {stats.completionRate === 100 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500 animate-bounce">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800">🎉 Módulo Completo!</p>
                <p className="text-sm text-green-700">
                  Parabéns! Você dominou todos os exercícios de {moduleName}!
                </p>
              </div>
            </div>
          </div>
        )}

        {stats.completionRate > 0 && stats.completionRate < 100 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Continue assim!</p>
                <p className="text-sm text-blue-600">
                  Faltam {stats.totalExercises - stats.totalCompleted} exercícios para completar este módulo.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
