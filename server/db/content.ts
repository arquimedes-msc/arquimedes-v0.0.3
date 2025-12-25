import { getDb, eq, and, asc } from "./connection";
import { 
  disciplines, Discipline, InsertDiscipline,
  modules, Module, InsertModule,
  pages, Page, InsertPage
} from "../../drizzle/schema";

// ============= DISCIPLINE OPERATIONS =============

export async function getAllDisciplines(): Promise<Discipline[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(disciplines).orderBy(asc(disciplines.order));
}

export async function getDisciplineBySlug(slug: string): Promise<Discipline | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(disciplines).where(eq(disciplines.slug, slug)).limit(1);
  return result[0];
}

export async function createDiscipline(data: InsertDiscipline): Promise<Discipline> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(disciplines).values(data);
  const insertId = Number((result as any).insertId);
  const inserted = await db.select().from(disciplines).where(eq(disciplines.id, insertId)).limit(1);
  return inserted[0]!;
}

// ============= MODULE OPERATIONS =============

export async function getAllModules(): Promise<Module[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(modules).orderBy(asc(modules.order));
}

export async function getModulesByDiscipline(disciplineId: number): Promise<Module[]> {
  const db = await getDb();
  if (!db) return [];
  
  const allModules = await db.select().from(modules).where(eq(modules.disciplineId, disciplineId)).orderBy(asc(modules.order));
  
  // Filter: show only first 5 modules for Aritmética (disciplineId 1)
  if (disciplineId === 1) {
    return allModules.filter(m => m.order <= 5);
  }
  
  return allModules;
}

export async function getModuleBySlug(disciplineId: number, slug: string): Promise<Module | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(modules)
    .where(and(eq(modules.disciplineId, disciplineId), eq(modules.slug, slug)))
    .limit(1);
  return result[0];
}

export async function createModule(data: InsertModule): Promise<Module> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(modules).values(data);
  const insertId = Number((result as any).insertId);
  const inserted = await db.select().from(modules).where(eq(modules.id, insertId)).limit(1);
  return inserted[0]!;
}

// ============= PAGE OPERATIONS =============

export async function getPagesByModule(moduleId: number): Promise<Page[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(pages).where(eq(pages.moduleId, moduleId)).orderBy(asc(pages.order));
}

export async function getPageBySlug(moduleId: number, slug: string): Promise<Page | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(pages)
    .where(and(eq(pages.moduleId, moduleId), eq(pages.slug, slug)))
    .limit(1);
  return result[0];
}

export async function getPageById(pageId: number): Promise<Page | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
  return result[0];
}

export async function createPage(data: InsertPage): Promise<Page> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(pages).values(data);
  const insertId = Number((result as any).insertId);
  const inserted = await db.select().from(pages).where(eq(pages.id, insertId)).limit(1);
  return inserted[0]!;
}
