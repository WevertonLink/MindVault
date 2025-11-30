import SQLite from 'react-native-sqlite-storage';
import { Flashcard, Deck, IdeaState, StudySession } from '../types';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DATABASE_NAME = 'mindvault.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAY_NAME = 'MindVault Database';
const DATABASE_SIZE = 200000;

let dbInstance: SQLite.SQLiteDatabase | null = null;

// Initialize database and create tables
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const db = await SQLite.openDatabase(
      DATABASE_NAME,
      DATABASE_VERSION,
      DATABASE_DISPLAY_NAME,
      DATABASE_SIZE
    );

    dbInstance = db;

    // Create tables
    await createTables(db);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const createTables = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY,
      deckId TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      intervalDays REAL NOT NULL,
      easeFactor REAL NOT NULL,
      repetitionCount INTEGER NOT NULL,
      nextReviewAt INTEGER,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      emotionalState TEXT NOT NULL,
      visionPoints TEXT NOT NULL,
      priority TEXT NOT NULL,
      tags TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      lastAccessedAt INTEGER
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      startedAt INTEGER NOT NULL,
      endedAt INTEGER,
      cardsStudied INTEGER NOT NULL,
      mode TEXT NOT NULL,
      energyLevel TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_stats (
      id TEXT PRIMARY KEY DEFAULT 'default',
      totalCards INTEGER DEFAULT 0,
      cardsReviewed INTEGER DEFAULT 0,
      currentStreak INTEGER DEFAULT 0,
      longestStreak INTEGER DEFAULT 0,
      totalIdeas INTEGER DEFAULT 0,
      studyMinutes INTEGER DEFAULT 0,
      lastStudyDate INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_flashcards_deckId ON flashcards(deckId);
    CREATE INDEX IF NOT EXISTS idx_flashcards_nextReviewAt ON flashcards(nextReviewAt);
    CREATE INDEX IF NOT EXISTS idx_ideas_priority ON ideas(priority);
  `;

  try {
    await db.executeSql(createTablesSQL);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
};

export const closeDatabase = async (): Promise<void> => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log('Database closed');
  }
};

// Deck CRUD operations
export const createDeck = async (deck: Deck): Promise<void> => {
  const db = getDatabase();
  const query = `
    INSERT INTO decks (id, name, description, color, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.executeSql(query, [
    deck.id,
    deck.name,
    deck.description || '',
    deck.color,
    deck.createdAt,
    deck.updatedAt,
  ]);
};

export const getAllDecks = async (): Promise<Deck[]> => {
  const db = getDatabase();
  const [results] = await db.executeSql('SELECT * FROM decks ORDER BY createdAt DESC');

  const decks: Deck[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    decks.push(results.rows.item(i));
  }
  return decks;
};

// Flashcard CRUD operations
export const createFlashcard = async (card: Flashcard): Promise<void> => {
  const db = getDatabase();
  const query = `
    INSERT INTO flashcards (id, deckId, front, back, intervalDays, easeFactor, repetitionCount, nextReviewAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await db.executeSql(query, [
    card.id,
    card.deckId,
    card.front,
    card.back,
    card.intervalDays,
    card.easeFactor,
    card.repetitionCount,
    card.nextReviewAt,
    card.createdAt,
    card.updatedAt,
  ]);
};

export const updateFlashcard = async (card: Flashcard): Promise<void> => {
  const db = getDatabase();
  const query = `
    UPDATE flashcards
    SET intervalDays = ?, easeFactor = ?, repetitionCount = ?, nextReviewAt = ?, updatedAt = ?
    WHERE id = ?
  `;
  await db.executeSql(query, [
    card.intervalDays,
    card.easeFactor,
    card.repetitionCount,
    card.nextReviewAt,
    card.updatedAt,
    card.id,
  ]);
};

export const getFlashcardsByDeck = async (deckId: string): Promise<Flashcard[]> => {
  const db = getDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM flashcards WHERE deckId = ? ORDER BY createdAt DESC',
    [deckId]
  );

  const cards: Flashcard[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    cards.push(results.rows.item(i));
  }
  return cards;
};

export const getDueFlashcards = async (): Promise<Flashcard[]> => {
  const db = getDatabase();
  const now = Date.now();
  const [results] = await db.executeSql(
    'SELECT * FROM flashcards WHERE nextReviewAt IS NOT NULL AND nextReviewAt <= ? ORDER BY nextReviewAt ASC',
    [now]
  );

  const cards: Flashcard[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    cards.push(results.rows.item(i));
  }
  return cards;
};

// Idea CRUD operations
export const createIdea = async (idea: IdeaState): Promise<void> => {
  const db = getDatabase();
  const query = `
    INSERT INTO ideas (id, title, emotionalState, visionPoints, priority, tags, createdAt, updatedAt, lastAccessedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await db.executeSql(query, [
    idea.id,
    idea.title,
    idea.emotionalState,
    JSON.stringify(idea.visionPoints),
    idea.priority,
    JSON.stringify(idea.tags || []),
    idea.createdAt,
    idea.updatedAt,
    idea.lastAccessedAt || null,
  ]);
};

export const getAllIdeas = async (): Promise<IdeaState[]> => {
  const db = getDatabase();
  const [results] = await db.executeSql('SELECT * FROM ideas ORDER BY createdAt DESC');

  const ideas: IdeaState[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    ideas.push({
      ...row,
      visionPoints: JSON.parse(row.visionPoints),
      tags: JSON.parse(row.tags),
    });
  }
  return ideas;
};
