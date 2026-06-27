import SQLite from "better-sqlite3";
import { CreateTableRequest } from "../interfaces/tableTypes";

let db: SQLite.Database;

export const createDb = (dbPath: string) => {
    db = new SQLite(dbPath, {
        verbose: console.log
    });

    db.prepare(`
    CREATE TABLE IF NOT EXISTS user_tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      encrypted_content TEXT NOT NULL  
    )`).run();

    console.log(`[BACKEND] Database connected and located in: ${dbPath}`);
}

export const createTable = (table: CreateTableRequest) => {
    const result = db.prepare(`INSERT INTO user_tables (table_name, password_hash, password_salt, encrypted_content) VALUES (@tableName, @passwordHash, @passwordSalt, @encryptedContent)`)
    .run(table);
    return result.lastInsertRowid;
};

export const countTotalTables = () => {
    const result = db.prepare(`SELECT COUNT(*) AS total FROM user_tables`).get() as {total: number};
    return result ? result.total : 0;
}