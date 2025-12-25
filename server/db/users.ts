import { getDb, eq, and, sql } from "./connection";
import { 
  InsertUser, users,
  userEnrollments,
  disciplines,
  userPointsLog,
  streaks,
  pageProgress,
  exerciseAttempts
} from "../../drizzle/schema";
import { ENV } from '../_core/env';

// ============= USER OPERATIONS =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserName(userId: number, name: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ name }).where(eq(users.id, userId));
}

export async function completeOnboarding(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ hasCompletedOnboarding: true }).where(eq(users.id, userId));
}

// ============= USER ENROLLMENTS =============

export async function enrollUserInDiscipline(userId: number, disciplineId: number) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db
    .select()
    .from(userEnrollments)
    .where(and(
      eq(userEnrollments.userId, userId),
      eq(userEnrollments.disciplineId, disciplineId)
    ))
    .limit(1);
  
  if (existing.length === 0) {
    await db.insert(userEnrollments).values({ userId, disciplineId });
  }
}

export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const enrollments = await db
    .select({
      id: disciplines.id,
      name: disciplines.name,
      slug: disciplines.slug,
      description: disciplines.description,
      order: disciplines.order,
      enrolledAt: userEnrollments.enrolledAt,
    })
    .from(userEnrollments)
    .innerJoin(disciplines, eq(userEnrollments.disciplineId, disciplines.id))
    .where(eq(userEnrollments.userId, userId))
    .orderBy(disciplines.order);
  
  return enrollments;
}

// ============= USER STATS =============

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const loginResult = await db
    .select({ count: sql<number>`COUNT(DISTINCT DATE(${userPointsLog.createdAt}))` })
    .from(userPointsLog)
    .where(and(
      eq(userPointsLog.userId, userId),
      eq(userPointsLog.action, "daily_login")
    ));
  
  const totalLogins = loginResult[0]?.count || 0;
  
  const streakResult = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1);
  
  const currentStreak = streakResult[0]?.currentStreak || 0;
  
  const lessonsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(pageProgress)
    .where(and(
      eq(pageProgress.userId, userId),
      eq(pageProgress.completed, true)
    ));
  
  const completedLessons = lessonsResult[0]?.count || 0;
  
  const attemptsResult = await db
    .select({
      total: sql<number>`COUNT(*)`,
      correct: sql<number>`SUM(CASE WHEN ${exerciseAttempts.isCorrect} = 1 THEN 1 ELSE 0 END)`,
    })
    .from(exerciseAttempts)
    .where(eq(exerciseAttempts.userId, userId));
  
  const total = attemptsResult[0]?.total || 0;
  const correct = attemptsResult[0]?.correct || 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return {
    totalLogins,
    currentStreak,
    completedLessons,
    exerciseAccuracy: accuracy,
  };
}

// ============= USER PROFILE =============

export async function updateUserAvatar(userId: number, avatarUrl: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ avatar: avatarUrl }).where(eq(users.id, userId));
}

export async function updateUserPreferences(
  userId: number, 
  preferences: { language?: string; themeColor?: string; darkMode?: boolean }
) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(preferences).where(eq(users.id, userId));
}

export async function updateFavoriteAchievements(userId: number, achievementIds: number[]) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ favoriteAchievements: achievementIds }).where(eq(users.id, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users);
}
