import * as SQLite from "expo-sqlite";
import { StudentDetail } from "./student/student.type";
import { TeamDetail } from "./team/team.type";

const db = SQLite.openDatabaseAsync("app.db");

export const initDB = async () => {
  const database = await db;
  await database.execAsync(
    `CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      data TEXT
    );
    CREATE TABLE IF NOT EXISTS team (
      id TEXT PRIMARY KEY,
      data TEXT
    );`,
  );
};

export const saveUser = async (user: StudentDetail | null) => {
  const database = await db;
  await database.runAsync(
    "INSERT OR REPLACE INTO user (id, data) VALUES (?, ?)",
    ["current", JSON.stringify(user)],
  );
};

export const getUser = async (): Promise<StudentDetail | null> => {
  const database = await db;
  const result = await database.getFirstAsync<{ data: string }>(
    "SELECT * FROM user WHERE id = ?",
    ["current"],
  );
  if (result) {
    return JSON.parse(result.data);
  } else {
    return null;
  }
};

export const saveTeam = async (team: TeamDetail | null) => {
  const database = await db;
  await database.runAsync(
    "INSERT OR REPLACE INTO team (id, data) VALUES (?, ?)",
    ["current", JSON.stringify(team)],
  );
};

export const getTeam = async (): Promise<TeamDetail | null> => {
  const database = await db;
  const result = await database.getFirstAsync<{ data: string }>(
    "SELECT * FROM team WHERE id = ?",
    ["current"],
  );
  if (result) {
    return JSON.parse(result.data);
  } else {
    return null;
  }
};
