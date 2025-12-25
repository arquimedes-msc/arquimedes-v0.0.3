import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSounds } from "@/lib/sounds";
import { useHaptic } from "@/lib/useHaptic";

export interface BlankItem {
  id: string;
  correctAnswer: string;
  acceptableAnswers?: string[]; // Respostas alternativas aceitas
  caseSensitive?: boolean;
}

interface FillInBlanksProps {
  /**
   * Texto com placeholders no formato {id}
   * Exemplo: "A soma de 2 + 2 é {blank1} e 3 x 3 é {blank2}."
   */
  text: string;
  blanks: BlankItem[];
  onComplete?: (correct: boolean, answers: Record<string, string>) => void;
  showFeedback?: boolean;
  className?: string;
  hint?: string; // Dica contextual para ajudar na resolução
}

export function FillInBlanks({
  text,
  blanks,
  onComplete,
  showFeedback = false,
  className,
  hint,
}: FillInBlanksProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { playSuccess, playError } = useSounds();
  const haptic = useHaptic();

  const handleAnswerChange = (blankId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [blankId]: value,
    }));
  };

  const isCorrectAnswer = (blankId: string, answer: string) => {
    const blank = blanks.find((b) => b.id === blankId);
    if (!blank) return false;

    const userAnswer = blank.caseSensitive ? answer : answer.toLowerCase();
    const correctAnswer = blank.caseSensitive
      ? blank.correctAnswer
      : blank.correctAnswer.toLowerCase();

    if (userAnswer === correctAnswer) return true;

    if (blank.acceptableAnswers) {
      return blank.acceptableAnswers.some((acceptable) => {
        const acceptableNormalized = blank.caseSensitive
          ? acceptable
          : acceptable.toLowerCase();
        return userAnswer === acceptableNormalized;
      });
    }

    return false;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = blanks.every((blank) =>
      isCorrectAnswer(blank.id, answers[blank.id] || "")
    );
    
    // Tocar som e vibração de feedback
    if (allCorrect) {
      playSuccess();
      haptic.success();
    } else {
      playError();
      haptic.error();
    }
    
    onComplete?.(allCorrect, answers);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const allFilled = blanks.every((blank) => answers[blank.id]?.trim());

  // Renderizar texto com inputs
  const renderText = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Encontrar todos os placeholders {blankId}
    const regex = /\{([^}]+)\}/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const blankId = match[1];
      const blank = blanks.find((b) => b.id === blankId);

      if (!blank) continue;

      // Adicionar texto antes do placeholder
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
        );
      }

      // Adicionar input
      const answer = answers[blankId] || "";
      const isCorrect = submitted ? isCorrectAnswer(blankId, answer) : null;

      parts.push(
        <span key={`blank-${blankId}`} className="inline-flex items-center mx-1">
          <Input
            value={answer}
            onChange={(e) => handleAnswerChange(blankId, e.target.value)}
            disabled={submitted}
            className={cn(
              "w-32 h-8 px-2 text-center inline-block transition-all duration-300",
              isCorrect === true && "border-green-500 bg-green-100 text-green-800 font-bold ring-2 ring-green-300 ring-offset-1",
              isCorrect === false && "border-red-500 bg-red-50 text-red-700"
            )}
            placeholder="___"
          />
          {isCorrect === true && (
            <span className="ml-1 flex items-center animate-in zoom-in duration-300">
              <Check className="h-5 w-5 text-green-600" />
            </span>
          )}
          {isCorrect === false && (
            <span className="ml-1 flex items-center animate-in zoom-in duration-300">
              <X className="h-5 w-5 text-red-600" />
            </span>
          )}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Adicionar texto restante
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const correctCount = submitted
    ? blanks.filter((blank) => isCorrectAnswer(blank.id, answers[blank.id] || "")).length
    : 0;

  const allCorrect = correctCount === blanks.length;

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      <div className="text-lg leading-relaxed">{renderText()}</div>

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

      <div className="space-y-4">
        {!submitted && (
          <Button onClick={handleSubmit} disabled={!allFilled} className="w-full">
            {allFilled
              ? "Verificar Respostas"
              : `Preencha todas as lacunas (${Object.keys(answers).filter((k) => answers[k]?.trim()).length}/${blanks.length})`}
          </Button>
        )}

        {submitted && showFeedback && (
          <>
            {/* Feedback de sucesso destacado */}
            {allCorrect ? (
              <div className="p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-800 font-bold text-lg">
                      ✅ Perfeito! Todas as respostas estão corretas!
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Parabéns! Você dominou este exercício! 🎉
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 transition-all duration-300">
                <p className="text-amber-700 font-semibold">
                  📊 Você acertou {correctCount} de {blanks.length} lacunas.
                  {correctCount < blanks.length && " Revise as marcadas em vermelho."}
                </p>
              </div>
            )}

            {/* Mostrar respostas corretas apenas quando errou */}
            {!allCorrect && (
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-semibold mb-2">Respostas corretas:</p>
                <ul className="space-y-1 text-sm">
                  {blanks.map((blank) => (
                    <li key={blank.id} className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground">{blank.id}:</span>
                      <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded">
                        {blank.correctAnswer}
                      </span>
                      {blank.acceptableAnswers && blank.acceptableAnswers.length > 0 && (
                        <span className="text-muted-foreground text-xs">
                          (também aceito: {blank.acceptableAnswers.join(", ")})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={handleReset} variant="outline" className="w-full">
              Tentar Novamente
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
