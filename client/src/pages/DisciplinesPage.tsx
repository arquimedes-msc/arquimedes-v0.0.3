import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ArrowRight, CheckCircle2, Lock, Sparkles, GraduationCap, Calculator, Shapes, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { toast } from "sonner";

// Ícones e cores por disciplina
const disciplineConfig: Record<string, { icon: typeof BookOpen; color: string; gradient: string }> = {
  aritmetica: { 
    icon: Calculator, 
    color: "#10b981", 
    gradient: "from-emerald-500 to-teal-600" 
  },
  algebra: { 
    icon: Sparkles, 
    color: "#8b5cf6", 
    gradient: "from-violet-500 to-purple-600" 
  },
  geometria: { 
    icon: Shapes, 
    color: "#f59e0b", 
    gradient: "from-amber-500 to-orange-600" 
  },
  calculo: { 
    icon: TrendingUp, 
    color: "#3b82f6", 
    gradient: "from-blue-500 to-indigo-600" 
  },
};

export default function DisciplinesPage() {
  const { data: disciplines, isLoading } = trpc.disciplines.list.useQuery();
  const { data: user } = trpc.auth.me.useQuery();
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  
  // Mutation para inscrição
  const enrollMutation = trpc.enrollments.enroll.useMutation({
    onSuccess: () => {
      toast.success("Inscrição realizada com sucesso! 🎉");
      setEnrollingId(null);
    },
    onError: () => {
      toast.error("Erro ao realizar inscrição. Tente novamente.");
      setEnrollingId(null);
    }
  });

  const handleEnroll = (disciplineId: number) => {
    setEnrollingId(disciplineId);
    enrollMutation.mutate({ disciplineId });
  };

  if (isLoading) {
    return (
      <>
        <MobileNav />
        <Sidebar />
        <div className="lg:ml-72 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container max-w-6xl py-8">
            <Skeleton className="h-16 w-80 mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MobileNav />
      <Sidebar />
      <SEO
        title="Meus Cursos - Arquimedes"
        description="Explore todos os cursos de matemática disponíveis na plataforma Arquimedes"
        keywords="cursos, matemática, aritmética, geometria, álgebra, cálculo"
      />
      <div className="lg:ml-72 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Hero Header Premium */}
        <div className="hero-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="container max-w-6xl py-12 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="h-10 w-10" />
              </div>
              <div>
                <h1 className="heading-hero text-white text-4xl md:text-5xl" style={{ 
                  background: 'linear-gradient(to right, white, rgba(255,255,255,0.8))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Meus Cursos
                </h1>
                <p className="text-white/80 text-lg mt-1">
                  Escolha seu próximo desafio matemático
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-6xl py-10 -mt-6">
          {disciplines && disciplines.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {disciplines.map((discipline) => {
                const config = disciplineConfig[discipline.slug] || { 
                  icon: BookOpen, 
                  color: "#6A0DAD", 
                  gradient: "from-purple-500 to-indigo-600" 
                };
                const Icon = config.icon;
                const isActive = discipline.slug === "aritmetica";
                const isAvailable = discipline.slug === "aritmetica" || discipline.slug === "algebra";
                const isEnrolling = enrollingId === discipline.id;
                
                return (
                  <Card 
                    key={discipline.id} 
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl ${
                      isActive 
                        ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20" 
                        : isAvailable
                          ? "hover:-translate-y-1 border-2 border-transparent hover:border-primary/20"
                          : "opacity-70"
                    }`}
                  >
                    {/* Gradient top bar */}
                    <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
                    
                    {/* Status badge */}
                    {isActive && (
                      <div className="absolute top-6 right-4 flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        Inscrito
                      </div>
                    )}
                    
                    {!isAvailable && (
                      <div className="absolute top-6 right-4 flex items-center gap-1.5 bg-slate-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                        <Lock className="h-4 w-4" />
                        Em breve
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <div 
                          className={`p-4 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}
                          style={{ boxShadow: `0 8px 20px ${config.color}40` }}
                        >
                          <Icon className="h-8 w-8" />
                        </div>
                        <div className="flex-1 pt-1">
                          <CardTitle className="text-2xl font-bold mb-1">
                            {discipline.name}
                          </CardTitle>
                          <CardDescription className="text-base line-clamp-2">
                            {discipline.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      {/* Info chips */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-600">
                          <BookOpen className="h-4 w-4" />
                          {discipline.slug === "aritmetica" ? "10 módulos" : 
                           discipline.slug === "algebra" ? "5 módulos" : "Em desenvolvimento"}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 rounded-full text-sm text-emerald-700">
                            <Sparkles className="h-4 w-4" />
                            Progresso ativo
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      {isActive ? (
                        <Button 
                          asChild 
                          className="btn-cta-primary w-full h-14 text-lg"
                        >
                          <Link href={`/disciplina/${discipline.slug}`}>
                            Continuar Estudando
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </Link>
                        </Button>
                      ) : isAvailable ? (
                        <Button 
                          onClick={() => handleEnroll(discipline.id)}
                          disabled={isEnrolling}
                          className="btn-cta-secondary w-full h-14 text-lg"
                        >
                          {isEnrolling ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Inscrevendo...
                            </>
                          ) : (
                            <>
                              Inscrever-se Gratuitamente
                              <ArrowRight className="h-5 w-5 ml-2" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button 
                          disabled
                          className="w-full h-14 text-lg bg-slate-200 text-slate-500 cursor-not-allowed"
                        >
                          <Lock className="h-5 w-5 mr-2" />
                          Disponível em breve
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 card-featured rounded-2xl">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Nenhum curso disponível</h2>
              <p className="text-muted-foreground mb-6">
                Os cursos estarão disponíveis em breve.
              </p>
              <Button asChild className="btn-cta-primary">
                <Link href="/dashboard">Voltar ao Início</Link>
              </Button>
            </div>
          )}

          {/* Info section */}
          <div className="mt-12 p-8 card-featured rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              Como funciona?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <p className="font-semibold">Inscreva-se</p>
                  <p className="text-muted-foreground">Clique em "Inscrever-se" no curso desejado</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <p className="font-semibold">Estude no seu ritmo</p>
                  <p className="text-muted-foreground">Acesse aulas, vídeos e exercícios quando quiser</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <p className="font-semibold">Ganhe conquistas</p>
                  <p className="text-muted-foreground">Complete módulos e desbloqueie medalhas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
