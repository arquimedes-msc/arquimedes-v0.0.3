import { drizzle } from "drizzle-orm/mysql2";
import { asc, eq, count } from "drizzle-orm";
import { disciplines, modules, pages, standaloneExercises } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function main() {
  // Disciplinas
  const allDisciplines = await db.select().from(disciplines).orderBy(asc(disciplines.order));
  console.log("\n========================================");
  console.log("       CURSOS DISPONÍVEIS NO ARQUIMEDES");
  console.log("========================================\n");
  
  for (const disc of allDisciplines) {
    console.log(`📚 ${disc.name.toUpperCase()} (${disc.slug})`);
    console.log(`   ${disc.description || 'Sem descrição'}`);
    
    // Módulos da disciplina
    const mods = await db.select().from(modules).where(eq(modules.disciplineId, disc.id)).orderBy(asc(modules.order));
    console.log(`   Módulos: ${mods.length}`);
    
    for (const mod of mods) {
      // Páginas (aulas) do módulo
      const pgs = await db.select().from(pages).where(eq(pages.moduleId, mod.id)).orderBy(asc(pages.order));
      
      // Exercícios do módulo
      const exs = await db.select().from(standaloneExercises).where(eq(standaloneExercises.moduleId, mod.id));
      
      console.log(`   └─ ${mod.name}: ${pgs.length} aulas, ${exs.length} exercícios`);
    }
    console.log("");
  }
  
  // Resumo total
  const totalModules = await db.select({ count: count() }).from(modules);
  const totalPages = await db.select({ count: count() }).from(pages);
  const totalExercises = await db.select({ count: count() }).from(standaloneExercises);
  
  console.log("========================================");
  console.log("              RESUMO TOTAL");
  console.log("========================================");
  console.log(`Disciplinas: ${allDisciplines.length}`);
  console.log(`Módulos: ${totalModules[0].count}`);
  console.log(`Aulas: ${totalPages[0].count}`);
  console.log(`Exercícios: ${totalExercises[0].count}`);
  
  process.exit(0);
}

main().catch(console.error);
