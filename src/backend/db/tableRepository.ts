/**
 * Database persistence repository managing SQLite connections, schema initialization,
 * and CRUD operations via `better-sqlite3`.
 * 
 * @module TableRepository
 */

import SQLite from "better-sqlite3";
import { CreateTableRequest, TableDTO } from "@backend/interfaces/tableTypes";

let db: SQLite.Database;

/**
 * Connects to the SQLite database file and creates the required `user_tables` table if missing.
 * 
 * @param dbPath - Absolute filesystem path to the SQLite `.db` file.
 */
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

/**
 * Inserts a new table record into the database.
 * 
 * @param table - Object containing table name, credentials, and encrypted payload.
 * @returns The auto-incremented primary key (`id`) of the inserted row.
 */
export const createTable = (table: CreateTableRequest) => {
    const result = db.prepare(`INSERT INTO user_tables (table_name, password_hash, password_salt, encrypted_content) VALUES (@tableName, @passwordHash, @passwordSalt, @encryptedContent)`)
    .run(table);
    return result.lastInsertRowid;
};

/**
 * Retrieves minimal info (ID and name) for all stored tables.
 * 
 * @returns An array of basic table DTO objects.
 */
export const getAllTableInfos = () : TableDTO[] => {
    const rows = db.prepare(`SELECT id AS id, table_name AS tableName FROM user_tables`).all() as TableDTO[];
    return rows;
}

/**
 * Deletes a table record by its database ID.
 * 
 * @param id - The unique database ID of the table to remove.
 * @returns The number of affected rows (1 if successful, 0 if not found).
 */
export const deleteTable = (id: number) : number => {
    const result = db.prepare(`DELETE FROM user_tables WHERE id = ?`).run(id);
    return result.changes;
}

/**
 * Fetches a complete table record including password credentials and encrypted payload.
 * 
 * @param id - The database ID of the requested table.
 * @returns The complete {@link TableDTO} record or `null` if no match was found.
 */
export const getTableById = (id: number) : TableDTO | null => {
    const sql = db.prepare(`SELECT id as id, table_name as tableName, password_hash AS passwordHash, password_salt AS passwordSalt, encrypted_content AS encryptedContent FROM user_tables WHERE id = ?`);
    const result = sql.get(id) as TableDTO;

    if(!result){
        return null;
    }
    return {
        id: result.id,
        tableName: result.tableName,
        passwordHash: result.passwordHash,
        passwordSalt: result.passwordSalt,
        encryptedContent: result.encryptedContent
    }; 
}

/**
 * Updates an existing table record (name, security hashes, and encrypted payload).
 * 
 * @param updatedTable - The updated table DTO containing the table ID and new values.
 * @returns The number of affected database rows (1 if updated successfully).
 */
export const updateTable = (updatedTable: TableDTO) : number => {
    const query = db.prepare(`UPDATE user_tables SET table_name = @tableName, password_hash = @passwordHash, password_salt = @passwordSalt, encrypted_content = @encryptedContent WHERE id = @id`);
    const result = query.run(updatedTable);
    return result.changes;
}