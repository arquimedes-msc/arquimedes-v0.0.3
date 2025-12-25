/**
 * Database Module Index
 * 
 * Re-exports all database functions from the main db.ts file
 * and modular files for organized access.
 * 
 * Estrutura modular:
 * - connection.ts: Conexão com banco de dados
 * - users.ts: Operações de usuários
 * - content.ts: Disciplinas, módulos e páginas
 * - ../db.ts: Funções legadas (exercícios, progresso, gamificação)
 */

// Conexão
export * from "./connection";

// Usuários
export * from "./users";

// Conteúdo (disciplinas, módulos, páginas)
export * from "./content";

// Re-export todas as funções do db.ts principal
// Isso inclui: exercises, progress, gamification, videos, daily challenges, etc.
export {
  // User operations
  upsertUser,
  getUserByOpenId,
  
  // Exercise operations
  getExercisesByPage,
  getExerciseById,
  createExercise,
  getExerciseAttempts,
  createExerciseAttempt,
  createGeneratedExercise,
  getGeneratedExercises,
  
  // Standalone exercises
  getAllStandaloneExercises,
  getStandaloneExercisesByDiscipline,
  getStandaloneExercisesByDifficulty,
  getStandaloneExercisesByModule,
  submitStandaloneExercise,
  getStandaloneExerciseStats,
  
  // Exercise completions
  markExerciseComplete,
  getUserCompletedExercises,
  getUserCompletedExercisesDetailed,
  getUserCompletedInteractiveExercises,
  getModuleCompletionStats,
  checkModuleCompletion,
  
  // Progress operations
  getUserProgress,
  getAllUserProgress,
  upsertPageProgress,
  getModuleProgress,
  getAllModulesProgress,
  
  // Gamification - Streaks
  getUserStreak,
  updateStreak,
  
  // Gamification - XP
  getUserXP,
  awardXP,
  
  // Gamification - Achievements
  getUserAchievements,
  awardAchievement,
  createAchievement,
  getAllAchievementDefinitions,
  getUserUnlockedAchievements,
  checkAndAwardAchievements,
  checkAndUpgradeAchievementLevels,
  
  // Points
  addPoints,
  getPointsSummary,
  hasEarnedPointsToday,
  
  // User onboarding
  updateUserName,
  completeOnboarding,
  
  // User enrollments
  enrollUserInDiscipline,
  getUserEnrollments,
  autoEnrollInAritmetica,
  
  // User stats & profile
  getUserStats,
  updateUserAvatar,
  updateUserPreferences,
  updateUserFavoriteAchievements,
  getUserActivityHistory,
  getUserWeeklyProgress,
  
  // Standalone videos
  getAllStandaloneVideos,
  getStandaloneVideosByDiscipline,
  getStandaloneVideosByModule,
  markVideoAsWatched,
  getWatchedVideos,
  getStandaloneVideoStats,
  
  // Video favorites
  toggleVideoFavorite,
  getUserFavoriteVideos,
  getUserFavoriteVideosWithDetails,
  isVideoFavorited,
  getUserFavoriteVideoIds,
  
  // Daily challenges
  getTodayChallenge,
  generateTodayChallenge,
  getChallengeExercises,
  submitDailyChallengeAnswer,
  hasCompletedTodayChallenge,
  getDailyChallengeStats,
  
  // Admin
  resetUserProgress,
} from "../db";
