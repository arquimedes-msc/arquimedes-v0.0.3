# Análise Criteriosa de Arquivos - Arquimedes 0.0.3

## Resumo Executivo

Este documento apresenta uma análise detalhada dos arquivos do projeto Arquimedes, identificando quais são **essenciais** para o funcionamento do sistema e quais podem ser **removidos** ou **arquivados**.

---

## 📊 Estatísticas Atuais

| Categoria | Quantidade | Status |
|-----------|------------|--------|
| Client (Frontend) | 156 arquivos | Essencial |
| Server (Backend) | 41 arquivos | Essencial |
| Drizzle (Database) | 31 arquivos | Essencial |
| Scripts | 62 arquivos | Parcialmente necessário |
| Docs | 30 arquivos | Parcialmente necessário |
| Content | 23 arquivos | Arquivar separadamente |

---

## ✅ ARQUIVOS ESSENCIAIS (MANTER)

### 1. Configuração Raiz
```
package.json              # Dependências e scripts
tsconfig.json             # Configuração TypeScript
vite.config.ts            # Configuração Vite
vitest.config.ts          # Configuração de testes
drizzle.config.ts         # Configuração Drizzle ORM
components.json           # Configuração shadcn/ui
README.md                 # Documentação principal
CHANGELOG.md              # Histórico de versões
```

### 2. Client (Frontend) - 100% Essencial
```
client/
├── index.html            # Entry point HTML
├── public/               # Assets estáticos
│   ├── favicon.ico
│   └── images/           # Imagens e ícones
├── src/
│   ├── main.tsx          # Entry point React
│   ├── App.tsx           # Roteamento principal
│   ├── index.css         # Estilos globais
│   ├── const.ts          # Constantes
│   ├── pages/            # 16 páginas (todas essenciais)
│   │   ├── Dashboard.tsx
│   │   ├── LoginPage.tsx
│   │   ├── LessonPage.tsx
│   │   ├── ModulePage.tsx
│   │   ├── DisciplinePage.tsx
│   │   ├── DisciplinesPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── AchievementsPage.tsx
│   │   ├── StatisticsPage.tsx
│   │   ├── MathLabPage.tsx
│   │   ├── VideoRoomPage.tsx
│   │   ├── UnifiedExerciseRoomPage.tsx
│   │   ├── InteractiveExerciseRoomPage.tsx
│   │   ├── ExercisesCompletedPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── NotFound.tsx
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/           # shadcn/ui (todos essenciais)
│   │   ├── interactive/  # Exercícios interativos
│   │   ├── mathlab/      # Demonstrações matemáticas
│   │   ├── animations/   # Animações de gamificação
│   │   ├── effects/      # Efeitos visuais
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── SEOHead.tsx
│   │   └── ... (outros componentes)
│   ├── contexts/         # Contextos React
│   ├── hooks/            # Hooks customizados
│   └── lib/              # Utilitários
```

### 3. Server (Backend) - 100% Essencial
```
server/
├── _core/                # Infraestrutura (NÃO MODIFICAR)
│   ├── index.ts          # Entry point
│   ├── context.ts        # Contexto tRPC
│   ├── trpc.ts           # Configuração tRPC
│   ├── oauth.ts          # Autenticação
│   ├── env.ts            # Variáveis de ambiente
│   └── ... (outros arquivos core)
├── db.ts                 # Funções de banco de dados (PRINCIPAL)
├── db/                   # Módulos de banco modularizados
│   ├── index.ts
│   ├── connection.ts
│   ├── content.ts
│   └── users.ts
├── routers.ts            # Rotas tRPC (PRINCIPAL)
├── storage.ts            # Upload de arquivos
├── sitemap.ts            # SEO
├── exerciseValidator.ts  # Validação de exercícios
└── *.test.ts             # Testes unitários (10 arquivos)
```

### 4. Drizzle (Database) - 100% Essencial
```
drizzle/
├── schema.ts             # Schema principal (CRÍTICO)
├── relations.ts          # Relações entre tabelas
├── 0000_*.sql até 0023_*.sql  # Migrations (todas)
└── meta/                 # Metadados das migrations
```

### 5. Shared - 100% Essencial
```
shared/
├── const.ts              # Constantes compartilhadas
├── types.ts              # Tipos TypeScript
└── _core/
    └── errors.ts         # Tratamento de erros
```

---

## ⚠️ ARQUIVOS PARCIALMENTE NECESSÁRIOS (AVALIAR)

### 1. Scripts - Manter apenas os ativos
```
scripts/
├── README.md             # ✅ Manter
├── quality-monitor.mjs   # ✅ Manter (monitoramento)
├── test-accessibility.mjs # ✅ Manter (acessibilidade)
├── query-courses.mjs     # ✅ Manter (consultas)
├── parsers/              # ✅ Manter (parsers úteis)
└── archive/              # ❌ REMOVER (47 arquivos obsoletos)
```

### 2. Docs - Manter documentação relevante
```
docs/
├── README.md             # ✅ Manter
├── ARCHITECTURE.md       # ✅ Manter
├── DATABASE.md           # ✅ Manter
├── CONTRIBUTING.md       # ✅ Manter
├── ROADMAP.md            # ✅ Manter
├── SEO_STRATEGY.md       # ✅ Manter
├── TECHNICAL_GUIDE.md    # ✅ Manter
├── FONTES-DE-XP.md       # ✅ Manter
├── VIDEOS_PTBR_VERIFICADOS.md # ✅ Manter
├── acessibilidade/       # ✅ Manter
├── deploy/               # ✅ Manter
├── images/               # ✅ Manter
├── conteudo/             # ⚠️ Avaliar (pode arquivar)
└── Arquivos temporários  # ❌ REMOVER
```

---

## ❌ ARQUIVOS PARA REMOVER (NÃO NECESSÁRIOS)

### 1. Arquivos Temporários na Raiz
```
❌ apply-mult-all.mjs
❌ insert_aulas.mjs
❌ insert_exercises.sql
❌ insert_exercises_db.mjs
❌ insert_exercises_final.sql
❌ insert_exercises_fixed.sql
❌ insert_exercises_oneline.sql
❌ update-mult-page1.mjs
❌ geometria_content.md
❌ quality-report.json
```

### 2. Scripts Archive (47 arquivos)
```
❌ scripts/archive/       # Todo o diretório
```

### 3. Arquivos de Seed Específicos (já executados)
```
❌ scripts/seed-*.mjs     # Scripts de seed já executados
❌ scripts/bulk_insert_exercises.mjs
```

### 4. Configurações Duplicadas
```
❌ drizzle.config.postgres.ts  # Se não usar PostgreSQL
❌ drizzle/schema-postgres.ts  # Se não usar PostgreSQL
❌ drizzle/migrations-postgres/ # Se não usar PostgreSQL
```

### 5. Content (Arquivar Separadamente)
```
⚠️ content/               # Mover para repositório de conteúdo
```

---

## 📁 ESTRUTURA RECOMENDADA PARA v0.0.3

```
arquimedes-v0.0.3/
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 vite.config.ts
├── 📄 vitest.config.ts
├── 📄 drizzle.config.ts
├── 📄 components.json
├── 📄 README.md
├── 📄 CHANGELOG.md
├── 📄 LICENSE
├── 📄 .gitignore
├── 📄 .env.example
│
├── 📁 client/
│   ├── 📄 index.html
│   ├── 📁 public/
│   └── 📁 src/
│       ├── 📄 main.tsx
│       ├── 📄 App.tsx
│       ├── 📄 index.css
│       ├── 📁 pages/          (16 arquivos)
│       ├── 📁 components/     (~100 arquivos)
│       ├── 📁 contexts/       (1 arquivo)
│       ├── 📁 hooks/          (7 arquivos)
│       └── 📁 lib/            (8 arquivos)
│
├── 📁 server/
│   ├── 📁 _core/              (19 arquivos - NÃO MODIFICAR)
│   ├── 📄 db.ts
│   ├── 📁 db/                 (4 arquivos)
│   ├── 📄 routers.ts
│   ├── 📄 storage.ts
│   ├── 📄 sitemap.ts
│   ├── 📄 exerciseValidator.ts
│   └── 📄 *.test.ts           (10 arquivos)
│
├── 📁 drizzle/
│   ├── 📄 schema.ts
│   ├── 📄 relations.ts
│   ├── 📄 0000_*.sql ... 0023_*.sql
│   └── 📁 meta/
│
├── 📁 shared/
│   ├── 📄 const.ts
│   ├── 📄 types.ts
│   └── 📁 _core/
│
├── 📁 docs/
│   ├── 📄 README.md
│   ├── 📄 ARCHITECTURE.md
│   ├── 📄 DATABASE.md
│   ├── 📄 CONTRIBUTING.md
│   ├── 📄 ROADMAP.md
│   └── 📁 acessibilidade/
│
└── 📁 scripts/
    ├── 📄 README.md
    ├── 📄 quality-monitor.mjs
    └── 📁 parsers/
```

---

## 📊 Comparativo de Tamanho

| Versão | Arquivos | Tamanho Estimado |
|--------|----------|------------------|
| Atual (v0.2.x) | ~343 arquivos | ~294 MB |
| Proposta (v0.0.3) | ~200 arquivos | ~50 MB |
| **Redução** | **~143 arquivos** | **~244 MB** |

---

## ✅ Checklist para Migração

- [ ] Criar novo repositório `arquimedes-v0.0.3`
- [ ] Copiar apenas arquivos essenciais
- [ ] Remover arquivos temporários da raiz
- [ ] Remover scripts/archive/
- [ ] Remover scripts de seed já executados
- [ ] Atualizar .gitignore
- [ ] Criar .env.example
- [ ] Atualizar README.md para v0.0.3
- [ ] Fazer primeiro commit
- [ ] Verificar se aplicação funciona

---

## 🔒 Arquivos Críticos (NUNCA REMOVER)

1. **drizzle/schema.ts** - Define toda a estrutura do banco
2. **server/db.ts** - Todas as funções de acesso ao banco
3. **server/routers.ts** - Todas as APIs do sistema
4. **client/src/App.tsx** - Roteamento principal
5. **server/_core/** - Infraestrutura do Manus (NÃO MODIFICAR)

---

*Documento gerado em: 25/12/2025*
*Versão: Arquimedes 0.0.3*
