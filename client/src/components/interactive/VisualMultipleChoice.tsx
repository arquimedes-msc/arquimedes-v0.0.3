import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSounds } from "@/lib/sounds";
import { useHaptic } from "@/lib/useHaptic";

export interface ChoiceOption {
  id: string;
  content: React.ReactNode;
  image?: string;
  isCorrect: boolean;
}

interface VisualMultipleChoiceProps {
  question: string;
  options: ChoiceOption[];
  onAnswer?: (selectedId: string, isCorrect: boolean) => void;
  showFeedback?: boolean;
  explanation?: string;
  multipleCorrect?: boolean; // Permite múltiplas respostas corretas
  className?: string;
}

export function VisualMultipleChoice({
  question,
  options,
  onAnswer,
  showFeedback = false,
  explanation,
  multipleCorrect = false,
  className,
}: VisualMultipleChoiceProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { playSuccess, playError } = useSounds();
  const haptic = useHaptic();

  const handleSelect = (optionId: string) => {
    if (submitted) return;

    if (multipleCorrect) {
      setSelectedIds((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedIds([optionId]);
    }
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;

    setSubmitted(true);

    let isCorrect = false;

    if (multipleCorrect) {
      const correctIds = options.filter((o) => o.isCorrect).map((o) => o.id);
      const allCorrect =
        selectedIds.length === correctIds.length &&
        selectedIds.every((id) => correctIds.includes(id));
      isCorrect = allCorrect;
      onAnswer?.(selectedIds.join(","), allCorrect);
    } else {
      const selectedOption = options.find((o) => o.id === selectedIds[0]);
      isCorrect = selectedOption?.isCorrect || false;
      onAnswer?.(selectedIds[0], isCorrect);
    }

    // Tocar som e vibração de feedback
    if (isCorrect) {
      playSuccess();
      haptic.success();
    } else {
      playError();
      haptic.error();
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setSubmitted(false);
  };

  const isCorrectSelection = () => {
    if (!submitted) return null;

    if (multipleCorrect) {
      const correctIds = options.filter((o) => o.isCorrect).map((o) => o.id);
      return (
        selectedIds.length === correctIds.length &&
        selectedIds.every((id) => correctIds.includes(id))
      );
    } else {
      const selectedOption = options.find((o) => o.id === selectedIds[0]);
      return selectedOption?.isCorrect || false;
    }
  };

  const getOptionStatus = (option: ChoiceOption) => {
    if (!submitted) return null;

    const isSelected = selectedIds.includes(option.id);

    if (option.isCorrect) {
      return "correct";
    } else if (isSelected && !option.isCorrect) {
      return "incorrect";
    }

    return null;
  };

  const allCorrect = isCorrectSelection();

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      <div>
        <h3 className="text-xl font-semibold mb-2">{question}</h3>
        {multipleCorrect && !submitted && (
          <p className="text-sm text-muted-foreground">
            Selecione todas as opções corretas
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedIds.includes(option.id);
          const status = getOptionStatus(option);

          return (
            <Card
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 relative overflow-hidden",
                !submitted && "hover:shadow-lg hover:scale-105",
                isSelected && !submitted && "ring-2 ring-primary shadow-lg",
                status === "correct" && "bg-green-50 border-green-500 ring-2 ring-green-500",
                status === "incorrect" && "bg-red-50 border-red-500 ring-2 ring-red-500",
                submitted && "cursor-default"
              )}
            >
              {option.image && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <img
                    src={option.image}
                    alt=""
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">{option.content}</div>

                {isSelected && !submitted && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {status === "correct" && (
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}

                {status === "incorrect" && (
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <X className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="w-full"
          >
            {selectedIds.length === 0
              ? "Selecione uma opção"
              : "Verificar Resposta"}
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
                  ✅ Resposta correta! Muito bem!
                </p>
              ) : (
                <p className="text-red-700 font-semibold">
                  ❌ Resposta incorreta. Veja a explicação abaixo.
                </p>
              )}
            </div>

            {explanation && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-semibold text-blue-900 mb-1">💡 Explicação:</p>
                <p className="text-blue-800">{explanation}</p>
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
