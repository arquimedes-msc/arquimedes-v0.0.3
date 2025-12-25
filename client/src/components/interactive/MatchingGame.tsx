import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSounds } from "@/lib/sounds";
import { useHaptic } from "@/lib/useHaptic";

export interface MatchPair {
  id: string;
  left: React.ReactNode;
  right: React.ReactNode;
}

interface MatchingGameProps {
  pairs: MatchPair[];
  onComplete?: (correct: boolean) => void;
  showFeedback?: boolean;
  className?: string;
  hint?: string; // Dica contextual para ajudar na resolução
}

export function MatchingGame({
  pairs,
  onComplete,
  showFeedback = false,
  className,
  hint,
}: MatchingGameProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { playSuccess, playError, playClick } = useSounds();
  const haptic = useHaptic();

  // Embaralhar itens da direita
  const [rightItems] = useState(() => {
    const items = [...pairs];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  });

  const handleLeftClick = (id: string) => {
    if (submitted) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft || submitted) return;

    playClick();
    haptic.light();

    // Criar ou atualizar match
    setMatches((prev) => ({
      ...prev,
      [selectedLeft]: rightId,
    }));

    setSelectedLeft(null);
  };

  const handleRemoveMatch = (leftId: string) => {
    if (submitted) return;
    setMatches((prev) => {
      const newMatches = { ...prev };
      delete newMatches[leftId];
      return newMatches;
    });
  };

  const handleSubmit = () => {
    if (Object.keys(matches).length !== pairs.length) {
      return;
    }

    setSubmitted(true);
    const correct = pairs.every((pair) => matches[pair.id] === pair.id);
    
    // Tocar som e vibração de feedback
    if (correct) {
      playSuccess();
      haptic.success();
    } else {
      playError();
      haptic.error();
    }
    
    onComplete?.(correct);
  };

  const handleReset = () => {
    setMatches({});
    setSubmitted(false);
    setSelectedLeft(null);
  };

  const isCorrectMatch = (leftId: string) => {
    if (!submitted) return null;
    return matches[leftId] === leftId;
  };

  const allMatched = Object.keys(matches).length === pairs.length;
  const allCorrect = submitted && pairs.every((pair) => matches[pair.id] === pair.id);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Botão de Dica */}
      {hint && !submitted && (
        <div className="space-y-2">
          <Button
            onClick={() => setShowHint(!showHint)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            {showHint ? "Ocultar Dica" : "💡 Dica"}
          </Button>
          {showHint && (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900 leading-relaxed">{hint}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna esquerda */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase">
            Itens
          </h3>
          {pairs.map((pair) => {
            const isMatched = matches[pair.id] !== undefined;
            const isSelected = selectedLeft === pair.id;
            const matchCorrect = isCorrectMatch(pair.id);

            return (
              <Card
                key={pair.id}
                onClick={() => !isMatched && handleLeftClick(pair.id)}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200",
                  isSelected && "ring-2 ring-primary shadow-lg",
                  isMatched && !submitted && "bg-muted cursor-default",
                  matchCorrect === true && "bg-green-50 border-green-500",
                  matchCorrect === false && "bg-red-50 border-red-500",
                  !isMatched && !isSelected && "hover:shadow-md hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">{pair.left}</div>
                  {isMatched && !submitted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMatch(pair.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {matchCorrect === true && <Check className="h-5 w-5 text-green-600" />}
                  {matchCorrect === false && <X className="h-5 w-5 text-red-600" />}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Coluna direita */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase">
            Correspondências
          </h3>
          {rightItems.map((pair) => {
            const isMatchedTo = Object.entries(matches).find(
              ([_, rightId]) => rightId === pair.id
            )?.[0];
            const isAvailable = !isMatchedTo;

            return (
              <Card
                key={pair.id}
                onClick={() => isAvailable && handleRightClick(pair.id)}
                className={cn(
                  "p-4 transition-all duration-200",
                  isAvailable && selectedLeft && "cursor-pointer hover:shadow-md hover:border-primary/50",
                  isAvailable && !selectedLeft && "cursor-not-allowed opacity-60",
                  !isAvailable && "bg-muted cursor-default",
                  submitted && "cursor-default"
                )}
              >
                {pair.right}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Feedback e ações */}
      <div className="space-y-4">
        {selectedLeft && !submitted && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-blue-700 text-sm">
              👉 Agora clique no item correspondente na coluna da direita
            </p>
          </div>
        )}

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={!allMatched}
            className="w-full"
          >
            {allMatched ? "Verificar Respostas" : `Conecte todos os itens (${Object.keys(matches).length}/${pairs.length})`}
          </Button>
        )}

        {submitted && showFeedback && (
          <>
            <div
              className={cn(
                "p-4 rounded-lg transition-all duration-300",
                allCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              )}
            >
              {allCorrect ? (
                <p className="text-green-700 font-semibold">
                  ✅ Perfeito! Todas as correspondências estão corretas!
                </p>
              ) : (
                <p className="text-red-700 font-semibold">
                  ❌ Algumas correspondências estão incorretas. Revise as marcadas em vermelho.
                </p>
              )}
            </div>

            <Button onClick={handleReset} variant="outline" className="w-full">
              Tentar Novamente
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
