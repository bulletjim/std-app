import SQLite from "better-sqlite3";
import { CreateTableRequest, TableDTO } from "@backend/interfaces/tableTypes";

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


export const getAllTableInfos = () : TableDTO[] => {
    const rows = db.prepare(`SELECT id AS id, table_name AS tableName FROM user_tables`).all() as TableDTO[];
    return rows;
}


export const deleteTable = (id: number) => {
    const result = db.prepare(`DELETE FROM user_tables WHERE id = ?`).run(id);
    return result.changes;
}

export const getTableById = (id: number) : TableDTO | null => {
    const sql = db.prepare(`SELECT id as id, table_name as tableName, password_hash AS passwordHash, password_salt AS passwordSalt FROM user_tables WHERE id = ?`);
    const result = sql.get(id) as TableDTO;

    if(!result){
        return null;
    }
    return {
        id: result.id,
        tableName: result.tableName,
        passwordHash: result.passwordHash,
        passwordSalt: result.passwordSalt
    }; 
}