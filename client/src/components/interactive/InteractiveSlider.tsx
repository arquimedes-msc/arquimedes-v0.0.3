import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSounds } from "@/lib/sounds";
import { useHaptic } from "@/lib/useHaptic";

interface InteractiveSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  correctValue?: number;
  label?: string;
  unit?: string;
  showFeedback?: boolean;
  onValueChange?: (value: number) => void;
  onSubmit?: (value: number, isCorrect: boolean) => void;
  className?: string;
  hint?: string; // Dica contextual para ajudar na resolução
}

export function InteractiveSlider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  correctValue,
  label = "Ajuste o valor",
  unit = "",
  showFeedback = false,
  onValueChange,
  onSubmit,
  className,
  hint,
}: InteractiveSliderProps) {
  const [value, setValue] = useState(defaultValue);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { playSuccess, playError } = useSounds();
  const haptic = useHaptic();

  useEffect(() => {
    onValueChange?.(value);
  }, [value, onValueChange]);

  const handleSubmit = () => {
    if (correctValue !== undefined) {
      const correct = Math.abs(value - correctValue) <= step;
      setIsCorrect(correct);
      setSubmitted(true);
      
      // Tocar som e vibração de feedback
      if (correct) {
        playSuccess();
        haptic.success();
      } else {
        playError();
        haptic.error();
      }
      
      onSubmit?.(value, correct);
    }
  };

  const handleReset = () => {
    setValue(defaultValue);
    setSubmitted(false);
    setIsCorrect(false);
  };

  const tolerance = step * 2;
  const isClose = correctValue !== undefined && Math.abs(value - correctValue) <= tolerance;

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      <div>
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-4xl font-bold transition-colors duration-300",
              submitted && isCorrect && "text-green-600",
              submitted && !isCorrect && "text-red-600",
              !submitted && isClose && "text-amber-500"
            )}
          >
            {value}
          </span>
          {unit && <span className="text-xl text-muted-foreground">{unit}</span>}
        </div>
      </div>

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
        <Slider
          value={[value]}
          onValueChange={(vals) => setValue(vals[0])}
          min={min}
          max={max}
          step={step}
          disabled={submitted && showFeedback}
          className={cn(
            "transition-all duration-300",
            submitted && isCorrect && "[&>span]:bg-green-600",
            submitted && !isCorrect && "[&>span]:bg-red-600"
          )}
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>

      {showFeedback && correctValue !== undefined && (
        <div className="flex gap-2">
          {!submitted ? (
            <Button onClick={handleSubmit} className="flex-1">
              Verificar Resposta
            </Button>
          ) : (
            <>
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Tentar Novamente
              </Button>
              {isCorrect && (
                <Button disabled className="flex-1 bg-green-600 hover:bg-green-600">
                  ✅ Correto!
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {submitted && showFeedback && (
        <div
          className={cn(
            "p-4 rounded-lg transition-all duration-300",
            isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          )}
        >
          {isCorrect ? (
            <p className="text-green-700 font-semibold">
              ✅ Excelente! O valor correto é {correctValue}{unit}.
            </p>
          ) : (
            <p className="text-red-700 font-semibold">
              ❌ Não foi dessa vez. O valor correto é {correctValue}{unit}. Você escolheu {value}
              {unit}.
            </p>
          )}
        </div>
      )}

      {!submitted && isClose && !showFeedback && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-amber-700 text-sm">🔥 Você está próximo!</p>
        </div>
      )}
    </Card>
  );
}
