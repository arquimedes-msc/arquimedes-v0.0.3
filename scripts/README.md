# 🛠️ Scripts do Arquimedes

Scripts utilitários para popular o banco de dados e outras tarefas de manutenção.

## 📋 Scripts Disponíveis

### Seed do Banco de Dados

- **seed-standalone-content.mjs** - Popular exercícios e vídeos standalone (15 exercícios + 10 vídeos)
- **seed-module-videos.mjs** - Popular vídeos vinculados aos módulos (15 vídeos)
- **seed-massive-videos.mjs** - Popular Sala de Vídeos com 60+ vídeos do YouTube
- **seed-massive-exercises-part1.mjs** - Popular 60 exercícios (Adição, Multiplicação, Divisão)
- **seed-massive-exercises-part2.mjs** - Popular 60 exercícios (Frações, Decimais, Porcentagem, etc)

### Utilitários

- **get-modules.mjs** - Buscar IDs dos módulos no banco de dados
- **update-video-ids.mjs** - Atualizar IDs dos vídeos com vídeos reais do YouTube

## 🚀 Como Executar

Todos os scripts devem ser executados com `npx tsx` da raiz do projeto:

```bash
# Popular banco com exercícios e vídeos standalone
npx tsx scripts/seed-standalone-content.mjs

# Popular Sala de Vídeos massivamente
npx tsx scripts/seed-massive-videos.mjs

# Popular Sala de Exercícios (parte 1)
npx tsx scripts/seed-massive-exercises-part1.mjs

# Popular Sala de Exercícios (parte 2)
npx tsx scripts/seed-massive-exercises-part2.mjs
```

## ⚠️ Importante

- Certifique-se de que o banco de dados está configurado antes de executar os scripts
- Execute `pnpm db:push` antes de rodar os seeds pela primeira vez
- Os scripts usam `import` ES modules, por isso a extensão `.mjs`

## 📊 Conteúdo Atual

- **Sala de Exercícios:** 120 exercícios (3 níveis de dificuldade)
- **Sala de Vídeos:** 61 vídeos do YouTube
- **Vídeos por Módulo:** 15 vídeos vinculados aos módulos de Aritmética
