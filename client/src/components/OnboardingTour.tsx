import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Sparkles, Target, Trophy, BookOpen, Zap } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Bem-vindo ao Arquimedes! 👋",
    description: "Aqui você vai aprender matemática de forma prática, do básico ao avançado. Sem infantilização, com exemplos do dia a dia.",
    icon: <Sparkles className="w-12 h-12 text-blue-500" />,
  },
  {
    title: "Seu Progresso em Tempo Real 📊",
    description: "Acompanhe seu nível, pontos (XP) e sequência de dias estudando. Cada aula completada te dá XP e te leva para o próximo nível!",
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
  },
  {
    title: "Sala de Exercícios Interativos 🎯",
    description: "Pratique com exercícios interativos: preencha lacunas, use sliders para estimativas e conecte conceitos. Ganhe pontos a cada acerto!",
    icon: <Target className="w-12 h-12 text-green-500" />,
  },
  {
    title: "Módulos Organizados 📚",
    description: "Estude por módulos: Adição, Subtração, Multiplicação, Divisão, Frações, Proporção e Porcentagem. Cada módulo tem aulas e exercícios.",
    icon: <BookOpen className="w-12 h-12 text-purple-500" />,
  },
  {
    title: "Conquistas e Recompensas 🏆",
    description: "Desbloqueie conquistas ao completar desafios: primeira aula, sequência de 3 dias, nota perfeita em exercícios e muito mais!",
    icon: <Trophy className="w-12 h-12 text-amber-500" />,
  },
  {
    title: "Dicas Estratégicas 💡",
    description: "Travou em um exercício difícil? Use o botão 'Dica' para ver estratégias de resolução sem perder o desafio!",
    icon: <span className="text-5xl">💡</span>,
  },
  {
    title: "Pronto para Começar! 🚀",
    description: "Você já está inscrito em Matemática Aritmética. Comece pela primeira aula ou vá direto para a Sala de Exercícios!",
    icon: <span className="text-5xl">🚀</span>,
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Passo {currentStep + 1} de {steps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSkip}
              className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-base text-center text-gray-600 dark:text-gray-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-3">
            {/* Previous Button */}
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {/* Next/Finish Button */}
            <Button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Começar
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Button */}
          {currentStep < steps.length - 1 && (
            <button
              onClick={onSkip}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Pular tour
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
