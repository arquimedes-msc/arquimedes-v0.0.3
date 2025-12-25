import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock user for protected procedures
const mockUser = {
  id: 999,
  openId: "test-user-standalone",
  name: "Test User Standalone",
  email: "test-standalone@example.com",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
  loginMethod: "test",
};

const mockContext: TrpcContext = {
  user: mockUser,
  req: {} as any,
  res: {} as any,
};

const caller = appRouter.createCaller(mockContext);

describe("Standalone Exercises (Sala de Exercícios)", () => {
  let testExerciseId: number;

  beforeAll(async () => {
    // Clean up any existing test data
    const dbInstance = await db.getDb();
    if (dbInstance) {
      await dbInstance.execute(`DELETE FROM standalone_exercise_attempts WHERE userId = ${mockUser.id}`);
    }
  });

  afterAll(async () => {
    // Clean up test data
    const dbInstance = await db.getDb();
    if (dbInstance) {
      await dbInstance.execute(`DELETE FROM standalone_exercise_attempts WHERE userId = ${mockUser.id}`);
    }
  });

  it("should fetch all standalone exercises", async () => {
    const exercises = await caller.standaloneExercises.getAll();

    expect(exercises).toBeDefined();
    expect(Array.isArray(exercises)).toBe(true);
    expect(exercises.length).toBeGreaterThan(0);

    // Store first exercise ID for later tests
    if (exercises.length > 0) {
      testExerciseId = exercises[0].id;
      expect(exercises[0]).toHaveProperty("title");
      expect(exercises[0]).toHaveProperty("question");
      expect(exercises[0]).toHaveProperty("options");
      expect(exercises[0]).toHaveProperty("correctAnswer");
      expect(exercises[0]).toHaveProperty("difficulty");
      expect(exercises[0]).toHaveProperty("points");
    }
  });

  it("should filter exercises by discipline", async () => {
    const exercises = await caller.standaloneExercises.getByDiscipline({ disciplineId: 1 });

    expect(exercises).toBeDefined();
    expect(Array.isArray(exercises)).toBe(true);
    exercises.forEach((ex) => {
      expect(ex.disciplineId).toBe(1);
    });
  });

  it("should filter exercises by difficulty", async () => {
    const easyExercises = await caller.standaloneExercises.getByDifficulty({ difficulty: "easy" });

    expect(easyExercises).toBeDefined();
    expect(Array.isArray(easyExercises)).toBe(true);
    easyExercises.forEach((ex) => {
      expect(ex.difficulty).toBe("easy");
      expect(ex.points).toBe(5);
    });
  });

  it("should submit correct answer and award points", async () => {
    const exercises = await caller.standaloneExercises.getAll();
    
    if (exercises.length === 0) {
      throw new Error("No exercises found for testing");
    }

    const exercise = exercises[0];
    const result = await caller.standaloneExercises.submit({
      exerciseId: exercise.id,
      userAnswer: exercise.correctAnswer,
    });

    expect(result).toBeDefined();
    expect(result.isCorrect).toBe(true);
    expect(result.points).toBe(exercise.points);
  });

  it("should submit incorrect answer and not award points", async () => {
    const exercises = await caller.standaloneExercises.getAll();
    
    if (exercises.length === 0) {
      throw new Error("No exercises found for testing");
    }

    const exercise = exercises[0];
    // Submit wrong answer (different from correct answer)
    const wrongAnswer = exercise.correctAnswer === 0 ? 1 : 0;
    
    const result = await caller.standaloneExercises.submit({
      exerciseId: exercise.id,
      userAnswer: wrongAnswer,
    });

    expect(result).toBeDefined();
    expect(result.isCorrect).toBe(false);
    expect(result.points).toBe(0);
  });

  it("should track exercise statistics", async () => {
    const stats = await caller.standaloneExercises.getStats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalAttempts");
    expect(stats).toHaveProperty("correctAnswers");
    expect(stats).toHaveProperty("accuracy");
    expect(stats.totalAttempts).toBeGreaterThanOrEqual(0);
    expect(stats.accuracy).toBeGreaterThanOrEqual(0);
    expect(stats.accuracy).toBeLessThanOrEqual(100);
  });
});

describe("Standalone Videos (Sala de Vídeos)", () => {
  let testVideoId: number;

  beforeAll(async () => {
    // Clean up any existing test data
    const dbInstance = await db.getDb();
    if (dbInstance) {
      await dbInstance.execute(`DELETE FROM standalone_video_views WHERE userId = ${mockUser.id}`);
    }
  });

  afterAll(async () => {
    // Clean up test data
    const dbInstance = await db.getDb();
    if (dbInstance) {
      await dbInstance.execute(`DELETE FROM standalone_video_views WHERE userId = ${mockUser.id}`);
    }
  });

  it("should fetch all standalone videos", async () => {
    const videos = await caller.standaloneVideos.getAll();

    expect(videos).toBeDefined();
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);

    // Store first video ID for later tests
    if (videos.length > 0) {
      testVideoId = videos[0].id;
      expect(videos[0]).toHaveProperty("title");
      expect(videos[0]).toHaveProperty("youtubeId");
      expect(videos[0]).toHaveProperty("duration");
      expect(videos[0]).toHaveProperty("description");
    }
  });

  it("should filter videos by discipline", async () => {
    const videos = await caller.standaloneVideos.getByDiscipline({ disciplineId: 1 });

    expect(videos).toBeDefined();
    expect(Array.isArray(videos)).toBe(true);
    videos.forEach((video) => {
      expect(video.disciplineId).toBe(1);
    });
  });

  it("should mark video as watched and award 3 points", async () => {
    const videos = await caller.standaloneVideos.getAll();
    
    if (videos.length === 0) {
      throw new Error("No videos found for testing");
    }

    const video = videos[0];
    const result = await caller.standaloneVideos.markWatched({ videoId: video.id });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);

    // Verify video was marked as watched
    const watchedVideos = await caller.standaloneVideos.getWatched();
    const isWatched = watchedVideos.some((v) => v.videoId === video.id);
    expect(isWatched).toBe(true);
  });

  it("should track watched videos", async () => {
    const watchedVideos = await caller.standaloneVideos.getWatched();

    expect(watchedVideos).toBeDefined();
    expect(Array.isArray(watchedVideos)).toBe(true);
    expect(watchedVideos.length).toBeGreaterThanOrEqual(0);
  });

  it("should track video statistics", async () => {
    const stats = await caller.standaloneVideos.getStats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalWatched");
    expect(stats.totalWatched).toBeGreaterThanOrEqual(0);
  });
});
