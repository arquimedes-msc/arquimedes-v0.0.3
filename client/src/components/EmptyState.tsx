import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface EmptyStateProps {
  /** Ícone a ser exibido */
  icon: LucideIcon;
  /** Título do empty state */
  title: string;
  /** Descrição detalhada */
  description: string;
  /** Ação primária (opcional) */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Ação secundária (opcional) */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Conteúdo customizado adicional */
  children?: ReactNode;
  /** Variante visual */
  variant?: "default" | "success" | "warning" | "info";
}

/**
 * Componente de Empty State reutilizável
 * 
 * Usado para indicar ausência de dados ou conteúdo,
 * com opções de ações para guiar o usuário.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  children,
  variant = "default",
}: EmptyStateProps) {
  const variantStyles = {
    default: {
      iconBg: "bg-gray-100",
      iconColor: "text-gray-400",
      titleColor: "text-gray-900",
    },
    success: {
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
    },
    warning: {
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900",
    },
    info: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`p-4 rounded-full ${styles.iconBg} mb-6`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Icon className={`h-12 w-12 ${styles.iconColor}`} />
      </motion.div>

      <motion.h3
        className={`text-2xl font-semibold ${styles.titleColor} mb-3`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="text-muted-foreground max-w-md mb-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>

      {children && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {children}
        </motion.div>
      )}

      {(action || secondaryAction) && (
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {action && (
            <Button onClick={action.onClick} size="lg">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="lg"
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Empty State para lista vazia com ilustração
 */
export function EmptyListState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg">
      <EmptyState
        icon={Icon}
        title={title}
        description={description}
        action={
          actionLabel && onAction
            ? { label: actionLabel, onClick: onAction }
            : undefined
        }
      />
    </div>
  );
}

/**
 * Empty State para busca sem resultados
 */
export function NoSearchResultsState({
  searchTerm,
  onClearSearch,
}: {
  searchTerm: string;
  onClearSearch: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum resultado encontrado
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Não encontramos resultados para "<strong>{searchTerm}</strong>". Tente
        usar palavras-chave diferentes.
      </p>
      <Button onClick={onClearSearch} variant="outline">
        Limpar busca
      </Button>
    </motion.div>
  );
}

/**
 * Empty State para erro genérico
 */
export function ErrorState({
  title = "Algo deu errado",
  description = "Ocorreu um erro ao carregar os dados. Por favor, tente novamente.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl font-semibold text-red-900 mb-3">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="default">
          Tentar novamente
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Empty State para conteúdo em construção
 */
export function UnderConstructionState({
  featureName,
}: {
  featureName: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-6xl mb-4">🚧</div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        Em Construção
      </h3>
      <p className="text-muted-foreground max-w-md">
        A funcionalidade <strong>{featureName}</strong> está sendo desenvolvida
        e estará disponível em breve. Fique atento às atualizações!
      </p>
    </motion.div>
  );
}
