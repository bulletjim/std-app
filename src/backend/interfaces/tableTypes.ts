/**
 * Data transfer objects (DTOs) and structural types for table domain management.
 * @module TableTypes
 */

/**
 * Represents allowable primitive values for a table cell payload.
 */
export type CellValue = string | number | boolean | null;

/**
 * Internal payload structure required to construct and persist a new encrypted table record.
 */
export interface CreateTableRequest {
    /** Display name of the table */
    tableName: string,
    /** PBKDF2 password hash */
    passwordHash: string,
     /** Salt used for password key derivation */
    passwordSalt: string,
    /** AES-encrypted JSON string representing the initial table content */
    encryptedContent: string
}

/**
 * Encrypted data transfer object representing raw database records.
 */
export interface TableDTO {
    /** Unique database record identifier */
    id: number,
    /** Display name of the table */
    tableName: string,
    /** PBKDF2 password hash */
    passwordHash: string,
    /** Salt used for password key derivation */
    passwordSalt: string,
    /** Optional AES-encrypted raw JSON string */
    encryptedContent?: string
}

/**
 * Decrypted data transfer object returned to the application controller upon authentication.
 */
export interface DecryptedTableDTO {
    /** Unique database record identifier */
    id: number,
    /** Display name of the table */
    tableName: string,
    /** Decrypted and parsed table payload */
    decryptedContent: TableData
}

/**
 * Represents the structured row/column payload of a table when requesting .
 */
export interface TableData{
    /** Column header definitions */
    rows: Record<string, CellValue>[],
    columns: string[]
}