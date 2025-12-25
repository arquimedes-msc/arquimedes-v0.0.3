import { Link, useLocation } from "wouter";
import { Home, User, LogOut, Menu, X, GraduationCap, Dumbbell, Beaker, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPraticaOpen, setIsPraticaOpen] = useState(false);
  const { data: user } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation("/login");
    },
  });

  // Navegação simplificada - apenas 4 itens principais
  const mainNavigation = [
    { name: "Início", href: "/dashboard", icon: Home },
    { name: "Meus Cursos", href: "/disciplinas", icon: GraduationCap },
  ];

  // Submenu de Prática (agrupado)
  const praticaItems = [
    { name: "Exercícios", href: "/exercicios" },
    { name: "Exercícios Interativos", href: "/exercicios-interativos" },
    { name: "Laboratório", href: "/laboratorio" },
    { name: "Vídeos", href: "/videos" },
  ];

  const isActive = (href: string) => location === href;
  const isPraticaActive = praticaItems.some(item => location === item.href);

  const SidebarContent = () => (
    <>
      {/* MSC Consultoria Logo */}
      <div className="p-6 border-b bg-gradient-to-r from-[#6A0DAD]/10 to-[#0052CC]/10">
        <div className="flex items-center gap-3">
          <img 
            src="/msc-logo.webp" 
            alt="MSC Consultoria" 
            className="h-12 w-auto drop-shadow-md"
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{
              background: 'linear-gradient(135deg, #6A0DAD 0%, #0052CC 50%, #6A0DAD 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 2px 4px rgba(106, 13, 173, 0.1)'
            }}>Arquimedes</h1>
            <p className="text-xs text-muted-foreground font-medium">Matemática Descomplicada</p>
          </div>
        </div>
      </div>

      {/* User Profile - Redesenhado */}
      {user && (
        <Link href="/perfil">
          <div className={cn(
            "p-4 mx-4 mt-4 rounded-xl cursor-pointer transition-all duration-300",
            "bg-gradient-to-r from-[#6A0DAD]/5 to-[#0052CC]/5",
            "hover:from-[#6A0DAD]/15 hover:to-[#0052CC]/15",
            "border border-transparent hover:border-[#6A0DAD]/20",
            "shadow-sm hover:shadow-md",
            isActive("/perfil") && "from-[#6A0DAD]/15 to-[#0052CC]/15 border-[#6A0DAD]/30"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6A0DAD] to-[#0052CC] flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || "User"} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name?.[0]?.toUpperCase() || "U"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-foreground">{user.name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Navigation - Simplificada */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Itens principais */}
        {mainNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 text-base font-medium transition-all duration-200",
                  isActive(item.href) 
                    ? "bg-gradient-to-r from-[#6A0DAD] to-[#0052CC] text-white shadow-lg shadow-[#6A0DAD]/25 hover:shadow-xl hover:shadow-[#6A0DAD]/30" 
                    : "hover:bg-[#6A0DAD]/10 hover:text-[#6A0DAD]"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}

        {/* Submenu Prática - Agrupado */}
        <div className="pt-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between gap-3 h-12 text-base font-medium transition-all duration-200",
              isPraticaActive || isPraticaOpen
                ? "bg-[#6A0DAD]/10 text-[#6A0DAD]" 
                : "hover:bg-[#6A0DAD]/10 hover:text-[#6A0DAD]"
            )}
            onClick={() => setIsPraticaOpen(!isPraticaOpen)}
          >
            <div className="flex items-center gap-3">
              <Dumbbell className="h-5 w-5" />
              Praticar
            </div>
            {isPraticaOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          
          {/* Subitens */}
          {isPraticaOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#6A0DAD]/20 pl-4">
              {praticaItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start h-10 text-sm font-medium transition-all duration-200",
                      isActive(item.href) 
                        ? "bg-[#6A0DAD]/15 text-[#6A0DAD] font-semibold" 
                        : "hover:bg-[#6A0DAD]/10 hover:text-[#6A0DAD]"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Laboratório separado com destaque */}
        <Link href="/conquistas">
          <Button
            variant={isActive("/conquistas") ? "default" : "outline"}
            className={cn(
              "w-full justify-start gap-3 h-12 text-base font-medium transition-all duration-200 mt-4",
              isActive("/conquistas") 
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/25" 
                : "border-amber-500/50 text-amber-600 hover:bg-amber-500/10 hover:border-amber-500"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <span className="text-lg">🏆</span>
            Conquistas
          </Button>
        </Link>
      </nav>

      {/* Logout - Redesenhado */}
      <div className="p-4 border-t bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-destructive hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 transition-all duration-300"
          onClick={() => {
            logoutMutation.mutate();
            setIsMobileOpen(false);
          }}
        >
          <LogOut className="h-5 w-5" />
          Sair da Conta
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header - Redesenhado */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img 
              src="/msc-logo.webp" 
              alt="MSC Consultoria" 
              className="h-9 w-auto drop-shadow-sm"
            />
            <h1 className="text-xl font-extrabold" style={{
              background: 'linear-gradient(135deg, #6A0DAD 0%, #0052CC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Arquimedes</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-[#6A0DAD]/30 hover:bg-[#6A0DAD]/10 hover:border-[#6A0DAD]"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-background border-r flex flex-col transition-transform duration-300 shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-72 bg-background border-r flex-col shadow-lg">
        <SidebarContent />
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
}
